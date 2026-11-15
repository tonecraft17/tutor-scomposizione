/* ============================================================
   ENGINE/STORAGE · local persistence + Supabase cloud mirror
   ------------------------------------------------------------
   Strategic assessment applied (see chat):
   we do NOT «replace» localStorage: we run it SIDE BY SIDE.
   - LOCAL-FIRST: every write goes straight to localStorage
     (the app works offline and without an account, zero latency);
   - the cloud is a MIRROR: if the user is logged in, writes are
     replicated to Supabase with debouncing;
   - on login from a new device: pull → last-write-wins
     comparison on «updatedAt» → the most recent one wins;
   - realtime: the user's row is listened to (postgres_changes)
     to keep two devices open at the same time in sync.
   The localStorage keys remain those of the original monolith:
   any progress already present is inherited with no migration.
   ============================================================ */
import { KEYS, SUPABASE, supabaseConfigured } from '../config.js?v=19'; // ===== CHANGED v18 · versioned specifier (stale-ServiceWorker fix, see app.js) =====

const hasLS = typeof localStorage !== 'undefined';
function lsRead(k, d){ if(!hasLS) return d; try{ const v=localStorage.getItem(k); return v===null?d:JSON.parse(v); }catch(e){ return d; } }
function lsWrite(k, v){ if(!hasLS) return; try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }

/* ---------- local state ---------- */
let sb=null;                       // Supabase client (lazy)
let utente=null;                   // current session
let statoSync = supabaseConfigured() ? 'local' : 'disabled';
let ultimoSyncAt = null;
let pushTimer = null;
const syncCbs=new Set(), remoteCbs=new Set(), authCbs=new Set();

export function syncStatus(){ return statoSync; }
export function lastSync(){ return ultimoSyncAt; }
export function currentUser(){ return utente; }
export function onSyncChange(cb){ syncCbs.add(cb); cb(statoSync); return ()=>syncCbs.delete(cb); }
export function onRemoteApply(cb){ remoteCbs.add(cb); return ()=>remoteCbs.delete(cb); }
export function onAuthChange(cb){ authCbs.add(cb); cb(utente); return ()=>authCbs.delete(cb); }
function setSync(s){ statoSync=s; syncCbs.forEach(cb=>{ try{cb(s);}catch(e){} }); }
function notifyRemote(st){ remoteCbs.forEach(cb=>{ try{cb(st);}catch(e){} }); }
function notifyAuth(){ authCbs.forEach(cb=>{ try{cb(utente);}catch(e){} }); }

/* ---------- local layer ---------- */
export function loadLocal(){
  return {
    progress: lsRead(KEYS.progress, {}),
    current:  lsRead(KEYS.current, null),
    seen:     lsRead(KEYS.seen, false),
    updatedAt: lsRead(KEYS.progress+'_meta', {}).updatedAt || null,
  };
}
function persistLocal(progress, current){
  const prevMeta = lsRead(KEYS.progress+'_meta', {});
  const meta = { updatedAt: new Date().toISOString() };
  lsWrite(KEYS.progress, progress);
  lsWrite(KEYS.current, current);
  lsWrite(KEYS.progress+'_meta', meta);
  return meta;
}
/** Immediate local write + (debounced) cloud replication when logged in
    AND the privacy switch is on (v17). */
export function saveLocal(progress, current){
  const meta = persistLocal(progress, current);
  if(sb && utente && syncAttivo) schedulePush({progress, current, updatedAt: meta.updatedAt});
  return meta.updatedAt;
}
export function getSeen(){ return !!lsRead(KEYS.seen, false); }
export function setSeen(){ lsWrite(KEYS.seen, true); }
export function resetLocal(){
  if(!hasLS) return;
  [KEYS.progress, KEYS.current, KEYS.layout, KEYS.seen, KEYS.progress+'_meta']
    .forEach(k=>localStorage.removeItem(k));
}

/* ---------- privacy switch (NEW v17 · Settings overlay) ----------
   The user can turn the cloud mirror OFF from Settings → Privacy: the
   app keeps working 100% locally, nothing leaves the browser while the
   switch is off. Turning it back on re-pulls the remote state and
   re-subscribes the realtime channel. The flag lives in localStorage so
   it survives reloads; the DEFAULT is on (v16 behaviour). */
let syncAttivo = lsRead(KEYS.syncEnabled, true) !== false;
export function isSyncEnabled(){ return syncAttivo; }
export function setSyncEnabled(on){
  syncAttivo = !!on;
  lsWrite(KEYS.syncEnabled, syncAttivo);
  if(!syncAttivo){
    clearTimeout(pushTimer); pushTimer=null;
    if(channel){ try{ sb && sb.removeChannel(channel); }catch(e){} channel=null; }
    if(sb && utente) setSync('local');   // honest chip: nothing is being mirrored
  } else if(sb && utente){
    pull(); ascoltaRealtime();
  }
}

/* ---------- cloud layer ---------- */
function caricaClient(){
  return new Promise((res, rej)=>{
    if(window.supabase && window.supabase.createClient){
      res(window.supabase.createClient(SUPABASE.url, SUPABASE.anonKey)); return;
    }
    const s=document.createElement('script');
    s.src=SUPABASE.umdUrl; s.async=true;
    s.onload = ()=>{ window.supabase && window.supabase.createClient
      ? res(window.supabase.createClient(SUPABASE.url, SUPABASE.anonKey))
      : rej(new Error('Supabase SDK unavailable')); };
    s.onerror = ()=>rej(new Error('Could not download the Supabase SDK (offline?)'));
    document.head.appendChild(s);
  });
}

let channel=null;
export async function init(){
  if(!supabaseConfigured() || sb) return;
  try{
    sb = await caricaClient();
  }catch(e){
    setSync('error'); return;
  }
  /* ===== NEW v18 · HEALTH CHECK — the site is online and the pair
     (url, anonKey) is now real configuration: verify it right away with
     a GET on /auth/v1/health (cheap, CORS-enabled, needs only the anon
     key). Before, a typo in config.js failed SILENTLY: the app looked
     like "local mode" and the first sign of trouble was a sign-in error
     minutes later. On failure the sync state goes to 'error' (status-bar
     chip "sync ✗") and a 'tutor:supabase-unreachable' event is fired —
     app.js turns it into a toast that names the two fields to fix. ===== */
  try{
    const base = SUPABASE.url.replace(/\/+$/, '');
    const h = await fetch(base + (SUPABASE.healthPath || '/auth/v1/health'),
      { headers: { apikey: SUPABASE.anonKey } });
    if(!h.ok) throw new Error('health ' + h.status);
  }catch(e){
    setSync('error');
    try{ window.dispatchEvent(new CustomEvent('tutor:supabase-unreachable', { detail: String(e && e.message || e) })); }catch(_){ }
  }
  sb.auth.onAuthStateChange(async (evt, session)=>{
    utente = session && session.user ? session.user : null;
    notifyAuth();
    if(utente){
      /* v17 · the privacy switch gates the mirror: with sync off the
         session is known (the Account popover shows the email) but no
         data is pulled, pushed or listened to */
      if(syncAttivo){ await pull(); ascoltaRealtime(); }
    } else {
      if(channel){ try{ sb.removeChannel(channel); }catch(e){} channel=null; }
      setSync('local');
    }
  });
  const { data } = await sb.auth.getSession();
  utente = data && data.session ? data.session.user : null;
  notifyAuth();
  if(utente && syncAttivo){ await pull(); ascoltaRealtime(); }
}

function ascoltaRealtime(){
  if(!sb || !utente || channel) return;
  try{
    channel = sb.channel('tutor-progress-'+utente.id)
      .on('postgres_changes',
        { event:'UPDATE', schema:'public', table:'user_progress', filter:`user_id=eq.${utente.id}` },
        (payload) => { const data = payload && payload.new && payload.new.data; if(data) applicaRemoto(data, true); })
      .subscribe();
  }catch(e){ /* realtime is optional */ }
}

/** Applies the remote state ONLY if it is more recent (last-write-wins). */
function applicaRemoto(data, viaRealtime){
  const locale = loadLocal();
  if(!data || typeof data !== 'object' || !data.updatedAt) return;
  if(locale.updatedAt && data.updatedAt <= locale.updatedAt) return; // local is more recent
  lsWrite(KEYS.progress, data.progress || {});
  lsWrite(KEYS.current, data.current || null);
  lsWrite(KEYS.progress+'_meta', { updatedAt: data.updatedAt });
  notifyRemote({ progress: data.progress || {}, current: data.current || null, viaRealtime: !!viaRealtime });
  if(!viaRealtime) setSync('synced');
}

export async function pull(){
  if(!sb || !utente || !syncAttivo) return;   // v17 · privacy switch off → no cloud reads
  setSync('syncing');
  try{
    const { data, error } = await sb.from('user_progress')
      .select('data').eq('user_id', utente.id).maybeSingle();
    if(error) throw error;
    ultimoSyncAt = new Date().toISOString();
    if(data && data.data) applicaRemoto(data.data, false);
    else{
      // first login: no remote row → publish the local state
      const st = loadLocal();
      schedulePush({ progress: st.progress, current: st.current, updatedAt: st.updatedAt || new Date().toISOString() });
      setSync('synced');
    }
  }catch(e){ setSync('error'); }
}

function schedulePush(payload){
  clearTimeout(pushTimer);
  setSync('syncing');
  pushTimer = setTimeout(()=>push(payload), SUPABASE.syncDebounceMs);
}
async function push(payload){
  if(!sb || !utente || !payload || !syncAttivo) return;   // v17 · privacy switch off → no cloud writes
  try{
    const { error } = await sb.from('user_progress')
      .upsert({ user_id: utente.id, data: payload });
    if(error) throw error;
    ultimoSyncAt = new Date().toISOString();
    setSync('synced');
  }catch(e){ setSync('error'); }
}

/* ---------- authentication ---------- */
export async function entra(email, password){
  if(!sb) throw new Error('Supabase not initialized');
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if(error) throw error;
  utente = data.user; notifyAuth();
  return utente;
}
export async function registrati(email, password){
  if(!sb) throw new Error('Supabase not initialized');
  const { data, error } = await sb.auth.signUp({ email, password });
  if(error) throw error;
  return { utente: data.user, confermaEmail: !data.session };
}
export async function esci(){
  if(!sb) return;
  await sb.auth.signOut();
  utente=null; notifyAuth(); setSync('local');
}
export function sincronizzaOra(){ return pull(); }
/** Immediately clears the cloud row (used by «Reset progress»): without waiting for the debounce. */
export async function azzeraRemoto(){
  if(!sb || !utente) return;
  const payload = { progress:{}, current:null, updatedAt: new Date().toISOString() };
  await sb.from('user_progress').upsert({ user_id: utente.id, data: payload });
  ultimoSyncAt = payload.updatedAt;
  setSync('synced');
}

/* ===== NEW v17 · Settings → Access credentials. Supabase auth exposes
   updateUser for both flows; the email change is TWO-STEP (a confirmation
   link arrives at the NEW address: until it is confirmed the old one stays
   active), the password change is immediate. resetPasswordForEmail works
   even without being signed in (used by the “send recovery email” form). ===== */
export async function cambiaPassword(nuova){
  if(!sb || !utente) throw new Error('Sign in first');
  const { error } = await sb.auth.updateUser({ password: nuova });
  if(error) throw error;
}
export async function cambiaEmail(nuova){
  if(!sb || !utente) throw new Error('Sign in first');
  const { error } = await sb.auth.updateUser({ email: nuova });
  if(error) throw error;
}
export async function inviaResetEmail(email){
  if(!sb) throw new Error('Supabase not initialized');
  const { error } = await sb.auth.resetPasswordForEmail(email);
  if(error) throw error;
}
