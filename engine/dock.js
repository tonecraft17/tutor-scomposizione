/* ============================================================
   ENGINE/DOCK · movable VS Code-style panels
   ------------------------------------------------------------
   - split tree with groups of tabs (v20 · ROW splits only: a tab
     can never land above or below another one, and legacy column
     layouts are flattened into ONE tab bar on load)
   - tab dragging with ghost and 3 docking zones (left / center /
     right — side by side ONLY)
   - v20 · single-bar-by-default: reopening a panel from the
     activity bar JOINS the existing tab bar; a side-by-side split
     is an explicit drag onto a group that is wide enough
   - v20 · right-edge limit: MIN_PANEL_PX — no split, no gutter
     drag and no redistribution may squeeze a column below it
   - resize gutters
   - layout persistence on localStorage
   - activity bar, mobile view with single tabs
   Ported from the monolith as a factory independent of the global
   DOM: it receives the panel registry and returns the layout API.
   ============================================================ */

const $ = s => document.querySelector(s);
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function elHtml(h){ const t=document.createElement('template'); t.innerHTML=h.trim(); return t.content.firstElementChild; }
function saveLS(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function loadLS(k,d){ try{ const v=localStorage.getItem(k); return v===null?d:JSON.parse(v); }catch(e){ return d; } }
function debounce(fn,ms){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; }
export function isMobile(){ return window.matchMedia('(max-width: 768px)').matches; }

const ICONS = {
  files:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
  book:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6c-2-1.6-5-1.6-8 0v12c3-1.6 6-1.6 8 0 2-1.6 5-1.6 8 0V6c-3-1.6-6-1.6-8 0z"/><path d="M12 6v12"/></svg>`,
  code:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m9 7-5 5 5 5"/><path d="m15 7 5 5-5 5"/></svg>`,
  term:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m7 9 3 3-3 3"/><path d="M12.5 15H17"/></svg>`,
  chart:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16h16"/><path d="M8 16v-5"/><path d="M13 16V8"/><path d="M18 16v-8"/></svg>`,
  help:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.4 9a2.6 2.6 0 1 1 4 2.2c-.9.6-1.4 1.1-1.4 2.1"/><path d="M12 17h.01"/></svg>`,
  par:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3"/><path d="M4 8a8 8 0 0 1 16 0"/><path d="M3.5 8.5c2.5 1 4.5 1 6 0 1 2 3 2 5 0 1.5 1 3.5 1 6 0"/><path d="M12 12v6a2.2 2.2 0 0 0 4.4 0"/></svg>`,
  flask:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M10 3v6L4.5 18a2.4 2.4 0 0 0 2.1 3.5h10.8A2.4 2.4 0 0 0 19.5 18L14 9V3"/><path d="M7 15h10"/></svg>`,
  user:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M5 20a7.2 7.2 0 0 1 14 0"/></svg>`,
  /* NEW v10 · «Code» panel (full-program editor) */
  filecode:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z"/><path d="M14.5 3v5.5H19"/><path d="m10 12.5 2 2-2 2"/><path d="M13.5 16.5h2.5"/></svg>`,
  /* NEW v12 · «Lines» panel (light editor: only the exercise's lines) */
  rows:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5h14"/><path d="M5 9h9"/><path d="M5 13h14"/><path d="M5 17h9"/><path d="M19 15.5v4"/><path d="m16.8 17.5 2.2-2 2.2 2"/></svg>`,
  /* NEW v17 · Settings (bottom of the activity bar, opens the overlay) */
  gear:`<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.87z"/></svg>`,
};
export function icon(n){ return ICONS[n] || ''; }

export function createDock(opts){
  const panels   = opts.panels;          // {pid: {id,title,icon,render(el)}}
  const storageKey = opts.storageKey;   // localStorage key of the layout
  const mobileHead = opts.mobileHead;   // () => html for the mobile header
  const toast     = opts.toast;
  const onLayoutChange = opts.onLayoutChange || (()=>{});
  const defaultLayout  = opts.defaultLayout;
  /* ===== NEW v16 · special panels (Modules drawer, Guide overlay) =====
     They are NOT dock tabs: their activity-bar icon does not insert a
     panel into the split tree, it calls back the app (onSpecial), which
     owns the drawer/overlay UI. This keeps engine/dock.js free of any
     drawer/overlay knowledge. */
  const specialPanels = opts.specialPanels || {};
  const onSpecial = opts.onSpecial || (()=>{});

  /* ===== CHANGED v18 · ONE name per button, no parentheses, and each
     name is EXACTLY the title of the tab/overlay it opens — what you
     read on the expanded sidebar is what lands in the tab bar:
       Modules → drawer "Modules" · Exercise/Code/Lines/Console/Charts/
       Game/Progress → the dock tab of the same name ·
       Guide → the guide overlay · Settings → the settings overlay.
     (The aria-label keeps a longer explanation for screen readers.)
     ===== REMOVED v19 · the Sandbox tab is GONE: the ⌨ Code editor is
     already a free-program editor (same runtime, same charts/games),
     so the Sandbox was a duplicate writing surface. The two exercise
     hints that pointed at it now point at ⌨ Code. ===== */
  const ACT = [
    ['moduli',   'files', 'Modules'],     // v18 · opens the side drawer
    // ===== REMOVED v16.2 · the 'traccia' (Exercise walkthrough) panel is gone:
    //     its content already lives inside the Exercise panel (the "Exercise
    //     statement" details + the chapter-concept chips), so the tab was a
    //     duplicate. The activity bar and the mobile bar get one icon less. =====
    ['esercizio','code',  'Exercise'],
    ['codice',   'filecode', 'Code'],
    ['righe',    'rows',    'Lines'],
    ['console',  'term',  'Console'],
    /* ===== NEW v16 · the Charts and Game panels had NO icon in the
       activity bar: once their tab was closed there was no way back
       (except running a new program). Now they are first-class citizens
       of the left navigation bar, like every other panel. ===== */
    ['grafici',  'chart', 'Charts'],
    ['gioco',    'flask', 'Game'],
    ['progressi','chart', 'Progress'],
    ['guida',    'help',  'Guide'],               // v16 · opens the overlay
    /* ===== REMOVED v19 · 'sandbox' panel (see the note above) ===== */
    /* ===== REMOVED v17 · 'account' moved OUT of the activity bar: the
       account now lives in the TOP-RIGHT button of the titlebar (popover
       with info + synthetic progress, "Edit" → Settings). The Account
       PANEL survives (status-bar chip, mobile ⋯ More menu, the popover's
       "open full panel"). ===== */
    ['impostazioni', 'gear', 'Settings'],         // v17 · bottom icon, opens the settings overlay
  ];
  /* ===== CHANGED v16 · mobile tab management: the bottom bar keeps the
     tabs a phone actually uses between two taps (the exercise, the console
     and the two media panels, which previously were MISSING from the bar —
     a chart switched the tab and the student had no button to come back or
     to see the charts again; the walkthrough tab was dropped in v16.2:
     the statement is in the Exercise panel itself). Everything else
     (editors, progress, account) moves into the "⋯ More"
     drop-up menu; Modules is the ☰ drawer and Guide the ? overlay, both
     opened from the mobile header. (v19 · sandbox removed from More.) ===== */
  const MOBILE_MAIN = ['esercizio','console','grafici','gioco'];
  const MOBILE_MORE = ['codice','righe','progressi','account'];
  /* ===== CHANGED v20 · ONE TAB BAR BY DEFAULT (single view privileged):
     a closed panel reopened from a button (activity bar, status chips,
     the Charts/Game switch of a run) is ADDED TO THE EXISTING TAB BAR —
     'center' for everyone, no exceptions. Putting a panel BESIDE another
     one stays possible, but only as the explicit gesture of dragging its
     tab onto the left/right zone of a group wide enough to be split. ===== */
  /* ===== NEW v20 · RIGHT-EDGE LIMIT: a column of a side-by-side split can
     never be narrower than this. It gates (1) the creation of a new split
     (the target group must be at least twice as wide), (2) the resize
     gutters and (3) ensurePanelSpace's redistribution — so however many
     panels are opened, tabs never get squashed against the right margin
     of the screen. ===== */
  const MIN_PANEL_PX = 320;

  let GIDSEQ=0, layout=null, DRAG=null, mobileTab='esercizio';

  /* ---------- tree: persistence and paths ---------- */
  function serializeLayout(n){
    if(!n) return null;
    if(n.type==='group') return {type:'group', tabs:n.tabs.slice(), active:n.active};
    return {type:'split', dir:n.dir, sizes:n.sizes.slice(), children:n.children.map(serializeLayout)};
  }
  const saveLayoutSoon = debounce(()=>{ if(!isMobile() && layout) saveLS(storageKey, serializeLayout(layout)); }, 250);
  function walkGroups(node, fn){ if(!node) return; if(node.type==='group') fn(node); else node.children.forEach(c=>walkGroups(c, fn)); }
  function walkFind(node, fn){
    if(!node) return null;
    if(fn(node)) return node;
    if(node.type==='split') for(const c of node.children){ const r=walkFind(c, fn); if(r) return r; }
    return null;
  }
  function findGroupOf(node, pid){ return walkFind(node, n=>n.type==='group' && n.tabs.includes(pid)); }
  function findParentOf(node, target, parent){
    if(node===target) return {found:true, parent};
    if(node.type==='split') for(const c of node.children){ const r=findParentOf(c, target, node); if(r.found) return r; }
    return {found:false};
  }
  function simplify(node){
    if(!node) return null;
    if(node.type==='split'){
      node.children = node.children.map(simplify).filter(Boolean);
      if(node.children.length===0) return null;
      if(node.children.length===1) return node.children[0];
      node.sizes = node.sizes.slice(0, node.children.length);
      const sum = node.sizes.reduce((a,b)=>a+b,0) || 1;
      node.sizes = node.sizes.map(v=>v/sum*100);
    }
    if(node.type==='group' && node.tabs.length===0) return null;
    return node;
  }

  /* ---------- rendering ---------- */
  function renderLayout(){
    const root = $('#dockRoot');
    if(!root) return;
    root.innerHTML = '';
    if(!layout) layout = loadLS(storageKey, null) || defaultLayout();
    /* ===== NEW v16 · sanitize layouts saved by older versions: panels
       that are no longer dock tabs (v15 saved 'moduli'/'guida' in the
       left column) are stripped from the tree, so an upgrading user
       keeps every other panel exactly where they had it. ===== */
    walkGroups(layout, g=>{
      g.tabs = g.tabs.filter(pid => panels[pid]);
      if(!g.tabs.includes(g.active)) g.active = g.tabs[0] || null;
    });
    /* ===== NEW v20 · NO VERTICAL STACKS ON LOAD: a layout saved by an
       older version could still contain a column split (a group living
       BELOW another one). Any such tree is migrated to ONE tab bar with
       all the panels in reading order — tabs never appear under other
       tabs again, and the saved layout is rewritten the new shape. ===== */
    if(treeHasCol(layout)){
      const flat = { type:'group', tabs:[], active:null };
      flattenInto(layout, flat);
      flat.tabs = flat.tabs.filter(pid => panels[pid]);
      if(!flat.active || !flat.tabs.includes(flat.active))
        flat.active = flat.tabs.includes('esercizio') ? 'esercizio' : (flat.tabs[0] || null);
      layout = flat;
      saveLayoutSoon();
    }
    layout = simplify(layout) || defaultLayout();
    root.appendChild(renderNode(layout));
    /* ===== CHANGED v15 · PERFORMANCE: panel bodies render PROGRESSIVELY.
         Before, renderLayout() synchronously rendered the body of every
         open panel (the 199-exercise Modules tree, the Walkthrough, the
         Exercise, the Console and the Code editor) in ONE long main-thread
         task: the LCP element could not paint until all of them were done
         (83% of the LCP was render delay, 156 ms of Layout). Now the dock
         skeleton + the LCP-likeliest panel render in the first frame and
         the remaining bodies follow one frame at a time (~8 ms budget per
         frame), so the browser paints in between: the largest element
         shows up first, TBT drops because no long task blocks input. ===== */
    queueBodies();
    updateActivityBar(); onLayoutChange();
    if(isEmptyTree()) root.appendChild(emptyHint());
  }

  /* ---------- v15 · progressive body scheduler ---------- */
  /* Render order: the Exercise panel is the likeliest LCP element (the
     largest text block of the default layout, on desktop AND mobile), so
     it renders first, together with the skeleton; the heavy Modules tree
     follows in the next frame instead of delaying everything. */
  const BODY_PRIO = { esercizio:0, moduli:1, console:2, codice:3,
                      righe:4, progressi:5, grafici:6, gioco:7,
                      account:10, guida:11 };   // v19 · sandbox gone
  let bodyQueue=[], bodyTick=0;
  function queueBodies(){
    if(bodyTick) cancelAnimationFrame(bodyTick);
    bodyTick=0;
    bodyQueue=[];
    walkGroups(layout, g=>bodyQueue.push(g));
    bodyQueue.sort((a,b)=>(BODY_PRIO[a.active]??99)-(BODY_PRIO[b.active]??99));
    /* first body in the same frame as the skeleton: something meaningful
       paints immediately, without waiting for the rAF chain */
    const g0=bodyQueue.shift();
    if(g0 && g0._el && !g0._bodyReady) renderGroupBody(g0);
    if(!bodyQueue.length) return;
    const step=()=>{
      const t0=performance.now();
      while(bodyQueue.length && performance.now()-t0<8){
        const g=bodyQueue.shift();
        if(g._el && !g._bodyReady) renderGroupBody(g);
      }
      bodyTick = bodyQueue.length ? requestAnimationFrame(step) : 0;
    };
    bodyTick=requestAnimationFrame(step);
  }
  function isEmptyTree(){ return layout.type==='group' && layout.tabs.length===0; }
  function emptyHint(){
    const d=elHtml(`<div class="dk-empty" style="position:absolute;inset:0"><span class="big">🪂</span>
      <span>All panels are closed.</span>
      <button class="btn primary" id="btnRestoreEmpty">Reopen the default layout</button></div>`);
    d.querySelector('#btnRestoreEmpty').addEventListener('click', ()=>{ layout=defaultLayout(); renderLayout(); saveLayoutSoon(); });
    return d;
  }
  function renderNode(node){
    if(node.type==='split'){
      const sp=document.createElement('div');
      sp.className='dk-split '+(node.dir==='row'?'row':'col');
      node._el=sp;   // NEW v7 · needed by ensurePanelSpace to measure the split
      node.children.forEach((child,i)=>{
        const ch=document.createElement('div'); ch.className='dk-child';
        ch.style.flex='0 0 '+node.sizes[i]+'%';
        ch.appendChild(renderNode(child));
        sp.appendChild(ch);
        if(i<node.children.length-1) sp.appendChild(makeGutter(node,i,sp));
      });
      return sp;
    }
    return renderGroup(node);
  }
  function renderGroup(g){
    if(!g.gid) g.gid='g'+(++GIDSEQ);
    if(!g.active || !g.tabs.includes(g.active)) g.active = g.tabs[0] || null;
    const el=document.createElement('section');
    el.className='dk-group'; el.dataset.gid=g.gid; el.__node=g;
    const tabs=document.createElement('div'); tabs.className='dk-tabs';
    g.tabs.forEach(pid=>{
      const p=panels[pid]; if(!p) return;
      const b=elHtml(`<div class="dk-tab${g.active===pid?' active':''}" data-panel="${pid}">
        <span class="t-ic">${icon(p.icon)}</span><span class="t-label">${esc(p.title)}</span>
        <span class="t-close" title="Close panel">×</span></div>`);
      b.addEventListener('click', ev=>{
        if(ev.target.closest('.t-close')){ closePanel(pid); return; }
        if(g.active!==pid){ g.active=pid; refreshBody(g); syncTabs(g); saveLayoutSoon(); updateActivityBar(); }
      });
      attachTabDrag(b, pid, g);
      tabs.appendChild(b);
    });
    el.appendChild(tabs);
    const body=document.createElement('div'); body.className='dk-body';
    el.appendChild(body);
    g._el=el; g._body=body; g._bodyReady=false;   // CHANGED v15 · the body is filled by the progressive scheduler (queueBodies), no longer inline
    return el;
  }
  function syncTabs(g){
    g._el.querySelectorAll('.dk-tab').forEach(t=>t.classList.toggle('active', t.dataset.panel===g.active));
  }
  function renderGroupBody(g){
    g._bodyReady=true;   // v15 · tells the progressive scheduler this body is done (also when rendered synchronously by a user action)
    const prev=g._body ? g._body.firstElementChild : null;
    const st=prev ? prev.scrollTop : 0;
    g._body.innerHTML='';
    const p=panels[g.active];
    if(!p){
      g._body.innerHTML='<div class="dk-empty"><span class="big">🪂</span><span>Drag a tab here, or reopen it from the activity bar on the left.</span></div>';
      return;
    }
    const d=document.createElement('div'); d.className='dk-panel';
    g._body.appendChild(d);
    try{ p.render(d); }catch(err){ d.innerHTML='<div class="dk-empty">⚠ Panel error: '+esc(err.message)+'</div>'; }
    if(st) d.scrollTop=st;
  }
  function refreshBody(g){ renderGroupBody(g); }
  function refreshPanels(list){
    if(isMobile()){ renderMobilePanel(); renderMobileHead(); return; }
    walkGroups(layout, g=>{ if(list.includes(g.active)) renderGroupBody(g); });
    updateActivityBar(); onLayoutChange();
  }
  function refreshAll(){
    if(isMobile()){ renderMobilePanel(); renderMobileHead(); renderMobileNav(); return; }
    renderLayout(); saveLayoutSoon();
  }

  /* ---------- resize gutters ---------- */
  function makeGutter(split, i, spEl){
    const g=document.createElement('div'); g.className='dk-gutter';
    g.title='Drag to resize';
    g.addEventListener('pointerdown', e=>{
      if(isMobile()) return;
      e.preventDefault(); g.classList.add('active'); g.setPointerCapture(e.pointerId);
      const horiz = split.dir==='row';
      const rect = spEl.getBoundingClientRect();
      const total = horiz ? rect.width : rect.height;
      const s0 = split.sizes.slice();
      const start = horiz ? e.clientX : e.clientY;
      const move = ev=>{
        const cur = horiz ? ev.clientX : ev.clientY;
        const d = (cur-start)/total*100;
        /* ===== CHANGED v20 · the resize floor is PIXEL-based on horizontal
           splits: a column can never be dragged below MIN_PANEL_PX, so the
           side-by-side areas stay readable however many are open. (Column
           splits no longer exist; the vertical case keeps a small floor
           just for safety.) ===== */
        const min = horiz ? Math.max(6, MIN_PANEL_PX/total*100) : Math.max(6, 110/total*100);
        let a=s0[i]+d, b=s0[i+1]-d;
        if(a<min){ a=min; b=s0[i]+s0[i+1]-min; }
        if(b<min){ b=min; a=s0[i]+s0[i+1]-min; }
        split.sizes[i]=a; split.sizes[i+1]=b;
        spEl.querySelectorAll(':scope > .dk-child').forEach((k,j)=>k.style.flex='0 0 '+split.sizes[j]+'%');
      };
      const up=()=>{ g.removeEventListener('pointermove',move); g.removeEventListener('pointerup',up); g.classList.remove('active'); saveLayoutSoon(); };
      g.addEventListener('pointermove',move); g.addEventListener('pointerup',up);
    });
    return g;
  }

  /* ---------- tab dragging ---------- */
  function attachTabDrag(tabEl, pid, g){
    tabEl.addEventListener('pointerdown', e=>{
      if(e.button!==0 || isMobile() || e.target.closest('.t-close')) return;
      const sx=e.clientX, sy=e.clientY; let started=false;
      const move=ev=>{
        if(!started && Math.hypot(ev.clientX-sx, ev.clientY-sy)>6){ started=true; startDrag(pid,ev); }
        if(started){ moveDrag(ev); ev.preventDefault(); }
      };
      const up=()=>{ window.removeEventListener('pointermove',move); window.removeEventListener('pointerup',up); if(started) endDrag(); };
      window.addEventListener('pointermove',move,{passive:false}); window.addEventListener('pointerup',up);
    });
  }
  function startDrag(pid, ev){
    document.body.classList.add('dragging-tab');
    const ghost=elHtml(`<div class="dk-ghost">${icon(panels[pid].icon)}<span>${esc(panels[pid].title)}</span></div>`);
    document.body.appendChild(ghost);
    DRAG={pid, ghost, target:null, zone:null, overlay:null};
    moveDrag(ev);
  }
  function moveDrag(ev){
    if(!DRAG) return;
    DRAG.ghost.style.left=(ev.clientX+14)+'px';
    DRAG.ghost.style.top=(ev.clientY+12)+'px';
    const under=document.elementFromPoint(ev.clientX, ev.clientY);
    const gEl=under ? under.closest('.dk-group') : null;
    if(gEl && gEl.__node){
      if(DRAG.target!==gEl){ clearOverlay(); DRAG.target=gEl; DRAG.overlay=makeOverlay(gEl); gEl.classList.add('drag-over'); }
      const r=gEl.getBoundingClientRect();
      /* ===== CHANGED v19 · SIDE-BY-SIDE ONLY: the zone is decided by the
         HORIZONTAL position of the pointer alone — left / center / right.
         The old vertical zones (top/bottom) are gone: a tab can only be
         moved NEXT TO another one, never above or below it, so dragging
         can no longer build the column splits the user did not want. ===== */
      const x=(ev.clientX-r.left)/r.width;
      let zone;
      if(x<0.30) zone='left';
      else if(x>0.70) zone='right';
      else zone='center';
      DRAG.zone=zone; setZone(DRAG.overlay, zone);
    } else if(DRAG.target){ DRAG.target.classList.remove('drag-over'); DRAG.target=null; DRAG.zone=null; clearOverlay(); }
  }
  function makeOverlay(gEl){
    /* ===== CHANGED v19 · three zones only (left / center / right), all
       in one horizontal band: the visual promise matches the new drag
       rule — side by side, never stacked. ===== */
    const ov=document.createElement('div'); ov.className='dk-drop';
    ov.innerHTML='<div class="z l" data-z="left"></div><div class="z c" data-z="center">add to tab</div><div class="z r" data-z="right"></div>';
    gEl.appendChild(ov); return ov;
  }
  function setZone(ov, zone){ if(!ov) return; ov.querySelectorAll('.z').forEach(z=>z.classList.toggle('on', z.dataset.z===zone)); }
  function clearOverlay(){ document.querySelectorAll('.dk-drop').forEach(o=>o.remove()); document.querySelectorAll('.dk-group.drag-over').forEach(g=>g.classList.remove('drag-over')); }
  function endDrag(){
    if(!DRAG) return;
    const {pid, target, zone}=DRAG;
    clearOverlay(); DRAG.ghost.remove(); DRAG=null;
    document.body.classList.remove('dragging-tab');
    if(!target || !zone) return;
    const targetNode=target.__node;
    const src=findGroupOf(layout, pid);
    if(src===targetNode && src.tabs.length===1) return;   // no real change
    movePanel(pid, targetNode, zone);
  }
  function movePanel(pid, targetGroup, zone){
    /* ===== NEW v20 · RIGHT-EDGE LIMIT: a side-by-side split is created
       only when the target group is at least TWICE the minimum column
       width; anything narrower gets the tab ADDED to the same bar (which
       scrolls horizontally) instead of a squashed extra column. ===== */
    if(zone!=='center' && targetGroup && targetGroup._el){
      const w = targetGroup._el.getBoundingClientRect().width;
      if(w < MIN_PANEL_PX*2){
        zone='center';
        toast('Not enough room for another column — "'+panels[pid].title+'" joined this tab bar.', '');
      }
    }
    removePanelFromTree(pid);
    layout = simplify(layout);
    if(!layout){ layout={type:'group', tabs:[pid], active:pid}; }
    else{
      if(targetGroup && groupInTree(layout, targetGroup)){
        if(zone==='center'){ targetGroup.tabs.push(pid); targetGroup.active=pid; }
        else insertSplit(pid, targetGroup, zone);
      } else {
        // the target group disappeared (it was the emptied source group)
        const anchor = nearestGroup(layout, zone);
        if(anchor){ if(zone==='center'){ anchor.tabs.push(pid); anchor.active=pid; } else insertSplit(pid, anchor, zone); }
      }
    }
    renderLayout();
    const drop=findGroupOf(layout, pid); if(drop) refreshBody(drop);   // v15 · the panel the user just dropped shows immediately, not at its scheduler turn
    saveLayoutSoon();
  }
  function groupInTree(node, g){ return !!walkFind(node, n=>n===g); }
  /* ===== CHANGED v20 · 'top'/'bottom' zones are gone (side-by-side
     only), so the walk is a plain left/right descent of row splits. ===== */
  function nearestGroup(node, zone){
    let n=node;
    while(n.type==='split'){
      const last = zone==='right';
      const aligned = n.dir==='row';
      n = aligned ? (last?n.children[n.children.length-1]:n.children[0]) : n.children[last?n.children.length-1:0];
    }
    return n.type==='group' ? n : null;
  }
  /* v20 · helpers of the no-vertical-stacks migration (see renderLayout) */
  function treeHasCol(n){ if(!n) return false; if(n.type==='split') return n.dir==='col' || n.children.some(treeHasCol); return false; }
  function flattenInto(n, acc){
    if(!n) return;
    if(n.type==='group'){ n.tabs.forEach(pid=>{ if(!acc.tabs.includes(pid)) acc.tabs.push(pid); }); if(!acc.active) acc.active=n.active; return; }
    n.children.forEach(c=>flattenInto(c, acc));
  }
  function removePanelFromTree(pid){
    const g=findGroupOf(layout, pid); if(!g) return;
    g.tabs=g.tabs.filter(x=>x!==pid);
    if(g.active===pid) g.active=g.tabs[0]||null;
  }
  function insertSplit(pid, targetGroup, zone){
    /* ===== CHANGED v20 · the direction is ALWAYS 'row': the only zones
       left are left/right, so a column split — a tab landing above or
       below another one — can no longer be built, by drag or by code. ===== */
    const ng={type:'group', tabs:[pid], active:pid};
    const dir='row';
    const before=(zone==='left');
    const r=findParentOf(layout, targetGroup, null);
    const parent=r.found?r.parent:null;
    if(!parent){
      const other=layout;
      layout={type:'split', dir, sizes:[50,50], children: before?[ng,other]:[other,ng]};
    } else if(parent.dir===dir){
      const i=parent.children.indexOf(targetGroup);
      const half=parent.sizes[i]/2;
      parent.sizes[i]=half;
      parent.sizes.splice(before?i:i+1, 0, half);
      parent.children.splice(before?i:i+1, 0, ng);
    } else {
      const i=parent.children.indexOf(targetGroup);
      parent.children[i]={type:'split', dir, sizes:[50,50], children: before?[ng,targetGroup]:[targetGroup,ng]};
    }
  }
  function closePanel(pid, silent){
    removePanelFromTree(pid);
    layout=simplify(layout);
    renderLayout(); saveLayoutSoon();
    /* ===== CHANGED v21 · no toast on close: opening/closing a tab is a
       quiet, self-evident action (the tab is right there) — the popup
       on every × was noise, not information. ===== */
  }

  /* ===== NEW v16 · toggle from the activity bar =====
     Clicking the icon of a panel that is ALREADY the visible tab of its
     group closes it (second click = first click's undo); clicking the
     icon of a visible-but-background tab activates it; a closed panel
     opens as always. The × on the tab keeps its own (non-silent)
     close + toast. ===== */
  function togglePanel(pid){
    if(isMobile()){ activateOrInsert(pid); return; }
    const g=findGroupOf(layout, pid);
    if(g && g.active===pid){ closePanel(pid, true); return; }
    activateOrInsert(pid);
  }

  /* ---------- activity bar ---------- */
  function renderActivity(){
    const bar=$('#activitybar'); if(!bar) return;
    bar.innerHTML='';
    ACT.forEach(([pid,ic,title],i)=>{
      // ===== CHANGED v10 · the separator follows the panel, not the index
      //     (v19 · it now sits above Settings, the bottom icon, since the
      //     Sandbox entry that used to carry it is gone) =====
      if(pid==='impostazioni'){ const sep=document.createElement('div'); sep.className='act-sep'; bar.appendChild(sep); }
      const special = specialPanels[pid];   // ===== NEW v16 · drawer / overlay triggers =====
      const extra = special
        ? (pid === 'guida' ? ' (opens the guide overlay, not a dock tab)'
            : pid === 'impostazioni' ? ' (opens the settings overlay, not a dock tab)'   // ===== NEW v17 =====
              : ' (opens the slide-out Modules menu, not a dock tab)')
        : '';
      /* ===== CHANGED v17 · every button carries its LABEL: the bar is a
         slim icon strip at rest and EXPANDS on hover/:focus-within to show
         the full names (CSS only — see .activitybar in styles.css). The
         label is always in the DOM (visibility, not presence) so screen
         readers get the same text as sighted users on hover. ===== */
      const b=elHtml(`<button class="act-btn" data-panel="${pid}"${special?' data-special="1"':''} title="${esc(title)}" aria-label="${esc(title)}${extra}">${icon(ic)}<span class="act-label">${esc(title)}</span></button>`);
      b.addEventListener('click', ()=>{ if(special){ onSpecial(pid); return; } togglePanel(pid); });   // ===== CHANGED v16 · toggle close + special panels =====
      bar.appendChild(b);
    });
    /* ===== NEW v21 · THE BAR RETRACTS WHEN THE MOUSE LEAVES IT. The CSS
       opens the bar on :hover OR :focus-within — but a mouse CLICK also
       focuses the button, so :focus-within kept the bar expanded forever
       after every click ("the menu never retracts"). On any pointer
       release inside the bar the (pointer-given) focus is released:
       keyboard focus is untouched (:focus-visible users keep the bar
       open — pointerup never fires for them). ===== */
    bar.addEventListener('pointerup', () => setTimeout(() => {
      const ae = document.activeElement;
      if (ae && bar.contains(ae) && !ae.matches(':focus-visible')) ae.blur();
    }, 0));
    const sp=document.createElement('div'); sp.className='act-spacer'; bar.appendChild(sp);
    updateActivityBar();
  }
  function activateOrInsert(pid){
    if(isMobile()){ mobileTab=pid; renderMobilePanel(); renderMobileNav(); return; }
    const g=findGroupOf(layout, pid);
    if(g){ if(g.active!==pid){ g.active=pid; } renderLayout(); saveLayoutSoon(); }
    else{
      /* ===== CHANGED v20 · ADD TO THE EXISTING TAB BAR: no panel ever
         splits the work area when it is (re)opened from a button — the
         single-bar view is the privileged layout, and side-by-side is
         the explicit drag gesture. ===== */
      let bar = (layout.type==='group' && layout) || nearestGroup(layout, 'center');
      if(!bar || bar.type!=='group') bar = layout = { type:'group', tabs:[], active:null };
      bar.tabs.push(pid); bar.active=pid;
      renderLayout(); saveLayoutSoon();
      /* ===== CHANGED v21 · no "added to the tab bar" toast: the user
         asked for the panel, the panel appears — a popup on every open
         was noise ("don't show a popup for every action performed"). ===== */
    }
    /* v15 · the panel the user asked for is rendered right away: the
       progressive scheduler would otherwise give it its LCP-priority turn */
    const tgt=findGroupOf(layout, pid); if(tgt) refreshBody(tgt);
  }
  /* ===== NEW v7 · minimum space for a panel =====
     If the panel's group is too short (column split) or too narrow
     (row split) — e.g. a layout squeezed by opening other panels —
     its slice of the split gets widened to minPx, taking space from
     the siblings (never below 6% each). Needed because a 280 px chart
     in a 90 px strip is invisible. Returns true if it adjusted. */
  function ensurePanelSpace(pid, minPx){
    if(isMobile()) return false;
    const g=findGroupOf(layout, pid);
    if(!g || !g._el) return false;
    const {found, parent}=findParentOf(layout, g);
    if(!found || !parent || parent.type!=='split') return false;
    const i=parent.children.indexOf(g);
    if(i<0 || !parent._el) return false;
    const gr=g._el.getBoundingClientRect(), pr=parent._el.getBoundingClientRect();
    const verticale = parent.dir==='col';
    const size = verticale ? gr.height : gr.width;
    const total = verticale ? pr.height : pr.width;
    if(size>=minPx || !total) return false;
    const wantPct = Math.min(90, (minPx/total)*100);
    if(wantPct <= parent.sizes[i]) return false;
    const delta = wantPct - parent.sizes[i];
    const otherSum = parent.sizes.reduce((a,v,j)=> j===i ? a : a+v, 0);
    /* ===== CHANGED v20 · the siblings' floor is the SAME pixel-based
       minimum the gutters enforce (MIN_PANEL_PX on row splits): a
       redistribution can no longer squeeze a neighbouring column into
       an unreadable strip. ===== */
    const minFrat = Math.max(6, (verticale ? 110 : MIN_PANEL_PX) / total * 100), nFrat = parent.children.length-1;
    if(otherSum - delta < minFrat*nFrat) return false;   // not enough space: don't force
    parent.sizes = parent.sizes.map((v,j)=>{
      if(j===i) return wantPct;
      const quota = delta * (v/otherSum);
      return Math.max(minFrat, v-quota);
    });
    const sum=parent.sizes.reduce((a,b)=>a+b,0)||1;
    parent.sizes=parent.sizes.map(v=>v/sum*100);
    renderLayout(); saveLayoutSoon();
    return true;
  }
  function updateActivityBar(){
    const actives=new Set(); walkGroups(layout, g=>{ if(g.active) actives.add(g.active); });
    if(mobileTab) actives.add(mobileTab);
    document.querySelectorAll('.act-btn').forEach(b=>{
      /* ===== CHANGED v16 · special buttons (drawer/overlay triggers) are
         driven by the app that owns them, not by the dock tree — skip
         them here or this pass would clear their active state right
         after the app sets it. ===== */
      if(b.dataset.special) return;
      b.classList.toggle('active', actives.has(b.dataset.panel));
    });
  }

  /* ---------- mobile view ---------- */
  function renderMobileHead(){
    const h=$('#mHead'); if(!h) return;
    h.innerHTML = mobileHead ? mobileHead() : '';
  }
  /* ===== CHANGED v16 · the bottom bar shows the five primary tabs and
     a "⋯ More" drop-up menu with the secondary ones; opening an item
     switches to it, and the menu closes. Replaces the old flat list of
     eight buttons that overflowed on small phones and lacked the
     Charts/Game tabs entirely. ===== */
  let moreOpen=false;
  function closeMoreMenu(){
    moreOpen=false;
    const m=document.querySelector('#mNav .m-more-menu');
    if(m) m.hidden=true;
    const b=document.querySelector('#mNav .m-more-btn');
    if(b) b.setAttribute('aria-expanded','false');
  }
  function renderMobileNav(){
    const nav=$('#mNav'); if(!nav) return;
    nav.innerHTML='';
    moreOpen=false;
    const btn=(pid)=>{
      const p=panels[pid]; if(!p) return null;
      const b=elHtml(`<button class="${mobileTab===pid?'active':''}" aria-current="${mobileTab===pid?'true':'false'}">${icon(p.icon)}<span>${esc(p.title)}</span></button>`);
      b.addEventListener('click', ()=>{ mobileTab=pid; renderMobileNav(); renderMobilePanel(); });
      return b;
    };
    MOBILE_MAIN.forEach(pid=>{ const b=btn(pid); if(b) nav.appendChild(b); });
    /* --- ⋯ More drop-up menu --- */
    const more=document.createElement('div'); more.className='m-more-wrap';
    const moreBtn=elHtml(`<button class="m-more-btn${MOBILE_MORE.includes(mobileTab)?' active':''}" aria-haspopup="menu" aria-expanded="false" aria-label="More tabs">
      <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg><span>More</span></button>`);
    const menu=elHtml(`<div class="m-more-menu" role="menu" hidden></div>`);
    MOBILE_MORE.forEach(pid=>{
      const p=panels[pid]; if(!p) return;
      const it=elHtml(`<button role="menuitem" class="${mobileTab===pid?'active':''}">${icon(p.icon)}<span>${esc(p.title)}</span></button>`);
      it.addEventListener('click', ()=>{ mobileTab=pid; closeMoreMenu(); renderMobileNav(); renderMobilePanel(); });
      menu.appendChild(it);
    });
    moreBtn.addEventListener('click', ev=>{
      ev.stopPropagation();
      moreOpen=!moreOpen;
      menu.hidden=!moreOpen;
      moreBtn.setAttribute('aria-expanded', String(moreOpen));
    });
    more.appendChild(moreBtn); more.appendChild(menu); nav.appendChild(more);
    /* outside tap closes the drop-up */
    document.addEventListener('click', function onDoc(){ closeMoreMenu(); document.removeEventListener('click', onDoc); });
  }
  function renderMobilePanel(){
    const c=$('#mContent'); if(!c) return;
    c.innerHTML='';
    const d=document.createElement('div'); d.className='m-panel';
    c.appendChild(d);
    const p=panels[mobileTab]||panels.esercizio;
    try{ p.render(d); }catch(err){ d.innerHTML='<div class="dk-empty">⚠ Panel error: '+esc(err.message)+'</div>'; }
    onLayoutChange();   // ===== NEW v16.1 · a tab switch is a layout change too (the app uses it to restore the auto-hidden header) =====
  }
  function renderMobile(){ renderMobileHead(); renderMobileNav(); renderMobilePanel(); }
  let curMode=null;
  function applyMode(force){
    const m=isMobile()?'mobile':'desktop';
    if(m===curMode && !force) return;
    curMode=m;
    document.body.classList.toggle('mobile', m==='mobile');
    if(m==='mobile') renderMobile(); else renderLayout();
  }

  /* ---------- public API ---------- */
  return {
    renderLayout, refreshPanels, refreshAll, renderActivity,
    activateOrInsert, closePanel, togglePanel, updateActivityBar, applyMode, ensurePanelSpace,
    renderMobile, renderMobileHead, renderMobileNav, renderMobilePanel,
    serializeLayout, saveLayoutSoon,
    findGroupOf: pid => findGroupOf(layout, pid),
    layoutRoot: () => layout,
    getMobileTab: () => mobileTab,
    setMobileTab: t => { mobileTab=t; },
    resetLayout: () => { layout=defaultLayout(); renderLayout(); saveLayoutSoon(); },
    isPanelOpen: pid => !!findGroupOf(layout, pid),
  };
}
