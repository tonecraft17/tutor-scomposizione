/* ============================================================
   ENGINE/PYTHON-RUNNER · orchestrator (main thread)
   ============================================================ */
import { PYODIDE } from '../config.js?v=16.2'; // ===== CHANGED v16.1 · versioned specifier (stale-ServiceWorker fix, see app.js) =====

let worker=null, running=false, runSeq=0;
let gameActive=false;   // ===== NEW v12.1 · a Pygame game sends frames during the ongoing run =====
let status='idle', detail='', pyVersion='';
let currentRun=null;
let readyWaiters=[];
const statusCbs=new Set();
const matplotlibCbs=new Set();
const plotlyCbs=new Set();
const pygameCbs=new Set();
const runEndCbs=new Set();

export function getStatus(){ return {status, detail, version: pyVersion, running}; }
export function onPythonStatus(cb){ statusCbs.add(cb); cb(getStatus()); return ()=>statusCbs.delete(cb); }

// ===== NEW EXPORTS — if these are missing you get the error you saw =====
export function onMatplotlibImage(cb){ matplotlibCbs.add(cb); return ()=>matplotlibCbs.delete(cb); }
export function onPlotlyFigure(cb){ plotlyCbs.add(cb); return ()=>plotlyCbs.delete(cb); }
export function onPygameFrame(cb){ pygameCbs.add(cb); return ()=>pygameCbs.delete(cb); }
// ===== NEW · notifies the end of every run (ok or error) =====
export function onPythonRunEnd(cb){ runEndCbs.add(cb); return ()=>runEndCbs.delete(cb); }
// ===== NEW · input for Pygame games (Game panel → worker) =====
export function sendPygameEvent(e){ if(worker) worker.postMessage({ type:'pg-event', e }); }
export function stopPygameGame(){ if(worker) worker.postMessage({ type:'pg-quit' }); }
// ==========================================================

function setStatus(s, d){ if(s) status=s; if(d!==undefined) detail=d; statusCbs.forEach(cb=>{ try{ cb(getStatus()); }catch(e){} }); }
function risolviWaiters(err){
  const ws=readyWaiters; readyWaiters=[];
  ws.forEach(w => err ? w.rej(err) : w.res());
}

function spawnWorker(){
  /* ===== CHANGED v16.1 · the worker script carries the version too, so a
     stale ServiceWorker can never pair a fresh runner with an old worker ===== */
  const w = new Worker(new URL('./python-worker.js?v=16.2', import.meta.url), { type:'module' });
  w.addEventListener('message', ev=>{
    const m = ev.data;
    if(!m) return;
    if(m.type==='status'){
      pyVersion = m.version || pyVersion;
      setStatus(m.status, m.detail || '');
      if(m.status==='ready') risolviWaiters();
      if(m.status==='error') risolviWaiters(new Error(m.detail || 'runtime unavailable'));
    } else if(m.type==='execstart' && currentRun && m.id===currentRun.id){
      // ===== NEW · the actual execution starts now (packages are loaded):
      // only now does the hard timeout start, so downloading pygame/pytest/… doesn't trigger it.
      // The EFFECTIVE timeout comes from the worker: for interactive Pygame games it is
      // much longer (10 min) than the normal anti-infinite-loop limit.
      startHardTimerFor(m.id, m.timeoutS);
    } else if(m.type==='matplotlib-image'){
      matplotlibCbs.forEach(cb => { try{ cb(m); }catch(e){} });
    } else if(m.type==='plotly-figure'){
      plotlyCbs.forEach(cb => { try{ cb(m); }catch(e){} });
    } else if(m.type==='pygame-frame'){
      gameActive=true;
      pygameCbs.forEach(cb => { try{ cb(m); }catch(e){} });
    } else if(m.type==='result' && currentRun && m.id===currentRun.id){
      clearTimeout(currentRun.timer);
      clearTimeout(currentRun.safety);
      gameActive=false;
      const res = m.ok
        ? { ok:true, output:m.output, durataMs:m.durataMs }
        : { ok:false, output:m.output, durataMs:m.durataMs, error:m.error };
      const resolve=currentRun.resolve; currentRun=null; running=false;
      setStatus('ready', 'Ready');
      runEndCbs.forEach(cb => { try{ cb(res); }catch(e){} });
      resolve(res);
    }
  });
  w.addEventListener('error', e=>{
    setStatus('error', 'Worker: '+(e.message||'internal error'));
    risolviWaiters(new Error(e.message||'worker error'));
    if(currentRun){
      clearTimeout(currentRun.timer);
      gameActive=false;
      const resolve=currentRun.resolve; currentRun=null; running=false;
      resolve({ ok:false, output:'', error:{tipo:'RuntimeError', messaggio:'Internal runtime error.', hint:'', traceback:''} });
    }
  });
  return w;
}

export function ensurePyodide(){
  if(!worker) worker = spawnWorker();
  if(status==='ready') return Promise.resolve(worker);
  worker.postMessage({type:'load'});
  return new Promise((res, rej)=>{ readyWaiters.push({res, rej}); });
}

/* ===== NEW · module-level hard-timeout handling =====
   The timer starts only when the worker signals execstart (packages ready);
   a long safety fallback covers workers stuck while loading. */
function killCurrentRun(durataMs){
  if(!currentRun) return;
  const resolve = currentRun.resolve;
  if(currentRun.timer) clearTimeout(currentRun.timer);
  if(currentRun.safety) clearTimeout(currentRun.safety);
  if(worker){ worker.terminate(); worker=null; }
  gameActive=false;
  risolviWaiters(new Error('timeout'));
  running=false; currentRun=null;
  setStatus('idle', 'Runtime restarted after a timeout');
  resolve({
    ok:false, durataMs, output:'',
    error:{
      tipo:'TimeoutError',
      messaggio:'time limit exceeded (likely an infinite loop)',
      hint:'⏱ Time limit exceeded: probably a loop that never terminates. The runtime was restarted: press Run again.',
      traceback:'', file:null, riga:null,
    },
  });
}
function startHardTimerFor(id, timeoutS){
  if(!currentRun || currentRun.id!==id || currentRun.timer) return;
  const hardMs = ((timeoutS || PYODIDE.timeoutS) + 4) * 1000;
  clearTimeout(currentRun.safety);
  currentRun.timer = setTimeout(()=>killCurrentRun(hardMs), hardMs);
}

/* ===== NEW v12.1 · waits for the run in progress to finish (max `timeoutMs`):
   used to close an active Pygame game before running again, so editor edits
   take effect at the next «▶ run» without having to press «■ stop»
   by hand (otherwise the old game would keep running with the old
   settings). ===== */
function waitForRunEnd(timeoutMs){
  return new Promise(res=>{
    let done=false;
    const finish=ok=>{ if(done) return; done=true; clearTimeout(t); un(); res(ok); };
    const un=onPythonRunEnd(()=>finish(true));
    const t=setTimeout(()=>finish(false), timeoutMs);
    if(!running) finish(true);   // already finished (or finished while waiting)
  });
}

export async function runPythonCode(code, virtualFiles={}, opts={}){
  if(running){
    /* ===== NEW v12.1 · if what is running is a Pygame GAME, close it and wait:
       the new run starts with the just-edited lines. ===== */
    if(gameActive && worker){
      worker.postMessage({ type:'pg-quit' });
      const chiuso = await waitForRunEnd(15000);
      if(!chiuso || running) return { ok:false, busy:true, error:{tipo:'Busy', messaggio:'A run is already in progress.', hint:'The previous game has not finished closing yet: try again in a moment.', traceback:''} };
    } else {
      return { ok:false, busy:true, error:{tipo:'Busy', messaggio:'A run is already in progress.', hint:'If a Pygame game is active, press «■ stop» in the Game panel to close it, then try again.', traceback:''} };
    }
  }
  const main=(code||'').trim();
  if(!main) return { ok:false, error:{tipo:'Empty', messaggio:'No code to run.', hint:'', traceback:''} };
  running=true;
  if(!worker) worker = spawnWorker();
  if(status!=='ready') setStatus('loading', status==='loading'?detail:'Downloading Python runtime (~10 MB)…');
  try{
    if(status!=='ready') await ensurePyodide();
  }catch(e){
    running=false;
    return { ok:false, error:{tipo:'Runtime', messaggio:'Python runtime unavailable (are you offline?)', hint:String(e.message||''), traceback:''} };
  }
  const id = ++runSeq;
  return new Promise(resolve=>{
    // ===== CHANGED · the hard timeout starts on execstart (packages ready);
    // long 120 s fallback for workers stuck while loading. See killCurrentRun.
    currentRun={id, resolve, timer:null, safety:null};
    currentRun.safety = setTimeout(()=>killCurrentRun(120000), 120000);
    // mode: 'main' (default) | 'pytest' — see engine/python-worker.js
    worker.postMessage({ type:'run', id, code:main, virtualFiles, stdin:opts.stdin||[], timeoutS:PYODIDE.timeoutS,
                         mode: opts.mode || 'main', entry: opts.entry || null });
  });
}