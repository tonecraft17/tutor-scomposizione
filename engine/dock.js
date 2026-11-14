/* ============================================================
   ENGINE/DOCK · movable VS Code-style panels
   ------------------------------------------------------------
   - split tree (row/column) with groups of tabs
   - tab dragging with ghost and 5 docking zones
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
};
export function icon(n){ return ICONS[n] || ''; }

export function createDock(opts){
  const panels   = opts.panels;          // {pid: {id,title,icon,render(el)}}
  const storageKey = opts.storageKey;   // localStorage key of the layout
  const mobileHead = opts.mobileHead;   // () => html for the mobile header
  const toast     = opts.toast;
  const onLayoutChange = opts.onLayoutChange || (()=>{});
  const defaultLayout  = opts.defaultLayout;

  const ACT = [
    ['moduli',   'files', 'Modules & exercises'],
    ['traccia',  'book',  'Exercise walkthrough'],
    ['esercizio','code',  'Active exercise'],
    ['codice',   'filecode', 'Full code (editor + terminal)'],   // ===== NEW v10 =====
    ['righe',    'rows',    'Exercise lines (light editor)'],    // ===== NEW v12 · only the exercise's lines, with the module reference that holds them =====
    ['console',  'term',  'Output console'],
    ['progressi','chart', 'Progress & autonomy'],
    ['guida',    'help',  'Method guide'],
    ['sandbox',  'flask', 'Python sandbox (real runtime)'],
    ['account',  'user',  'Account & sync'],
  ];
  const MOBILE_NAV = ['moduli','traccia','esercizio','codice','righe','console','progressi','guida'];   // ===== CHANGED v12 · «lines» too =====
  const OPEN_ZONES = { moduli:'left', guida:'left', traccia:'left', esercizio:'right',
                       codice:'bottom',                                                                    // ===== NEW v10 =====
                       righe:'bottom',                                                                     // ===== NEW v12 · the light editor opens in its own split (separate tab) =====
                       console:'bottom', progressi:'bottom', sandbox:'bottom', account:'right' };

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
    layout = simplify(layout) || defaultLayout();
    root.appendChild(renderNode(layout));
    updateActivityBar(); onLayoutChange();
    if(isEmptyTree()) root.appendChild(emptyHint());
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
    g._el=el; g._body=body;
    renderGroupBody(g);
    return el;
  }
  function syncTabs(g){
    g._el.querySelectorAll('.dk-tab').forEach(t=>t.classList.toggle('active', t.dataset.panel===g.active));
  }
  function renderGroupBody(g){
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
        let a=s0[i]+d, b=s0[i+1]-d; const min=6;
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
      const x=(ev.clientX-r.left)/r.width, y=(ev.clientY-r.top)/r.height;
      const dx=Math.min(x,1-x), dy=Math.min(y,1-y);
      let zone;
      if(dx<=0.30 && dx<=dy) zone = x<0.5?'left':'right';
      else if(dy<=0.30) zone = y<0.5?'top':'bottom';
      else zone='center';
      DRAG.zone=zone; setZone(DRAG.overlay, zone);
    } else if(DRAG.target){ DRAG.target.classList.remove('drag-over'); DRAG.target=null; DRAG.zone=null; clearOverlay(); }
  }
  function makeOverlay(gEl){
    const ov=document.createElement('div'); ov.className='dk-drop';
    ov.innerHTML='<div class="z t" data-z="top"></div><div class="z l" data-z="left"></div><div class="z c" data-z="center">add to tab</div><div class="z r" data-z="right"></div><div class="z b" data-z="bottom"></div>';
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
    renderLayout(); saveLayoutSoon();
  }
  function groupInTree(node, g){ return !!walkFind(node, n=>n===g); }
  function nearestGroup(node, zone){
    let n=node;
    while(n.type==='split'){
      const last = (zone==='right'||zone==='bottom');
      const aligned = (n.dir==='row'&&(zone==='left'||zone==='right')) || (n.dir==='col'&&(zone==='top'||zone==='bottom'));
      n = aligned ? (last?n.children[n.children.length-1]:n.children[0]) : n.children[last?n.children.length-1:0];
    }
    return n.type==='group' ? n : null;
  }
  function removePanelFromTree(pid){
    const g=findGroupOf(layout, pid); if(!g) return;
    g.tabs=g.tabs.filter(x=>x!==pid);
    if(g.active===pid) g.active=g.tabs[0]||null;
  }
  function insertSplit(pid, targetGroup, zone){
    const ng={type:'group', tabs:[pid], active:pid};
    const dir=(zone==='left'||zone==='right')?'row':'col';
    const before=(zone==='left'||zone==='top');
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
  function closePanel(pid){
    removePanelFromTree(pid);
    layout=simplify(layout);
    renderLayout(); saveLayoutSoon();
    toast('Panel "'+panels[pid].title+'" closed: reopen it from the activity bar.','');
  }

  /* ---------- activity bar ---------- */
  function renderActivity(){
    const bar=$('#activitybar'); if(!bar) return;
    bar.innerHTML='';
    ACT.forEach(([pid,ic,title],i)=>{
      // ===== CHANGED v10 · the separator follows the panel, not the index =====
      if(pid==='sandbox'){ const sep=document.createElement('div'); sep.className='act-sep'; bar.appendChild(sep); }
      const b=elHtml(`<button class="act-btn" data-panel="${pid}" title="${esc(title)}">${icon(ic)}</button>`);
      b.addEventListener('click', ()=>activateOrInsert(pid));
      bar.appendChild(b);
    });
    const sp=document.createElement('div'); sp.className='act-spacer'; bar.appendChild(sp);
    updateActivityBar();
  }
  function activateOrInsert(pid){
    if(isMobile()){ mobileTab=pid; renderMobilePanel(); renderMobileNav(); return; }
    const g=findGroupOf(layout, pid);
    if(g){ if(g.active!==pid){ g.active=pid; } renderLayout(); saveLayoutSoon(); }
    else{
      const zone=OPEN_ZONES[pid]||'center';
      const anchor=nearestGroup(layout, zone) || layout;
      if(anchor.type==='group'){
        if(zone==='center'||anchor===layout){ anchor.tabs.push(pid); anchor.active=pid; }
        else insertSplit(pid, anchor, zone);
      }
      renderLayout(); saveLayoutSoon();
      toast('Panel "'+panels[pid].title+'" reopened.');
    }
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
    const minFrat = 6, nFrat = parent.children.length-1;
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
    document.querySelectorAll('.act-btn').forEach(b=>b.classList.toggle('active', actives.has(b.dataset.panel)));
  }

  /* ---------- mobile view ---------- */
  function renderMobileHead(){
    const h=$('#mHead'); if(!h) return;
    h.innerHTML = mobileHead ? mobileHead() : '';
  }
  function renderMobileNav(){
    const nav=$('#mNav'); if(!nav) return;
    nav.innerHTML='';
    MOBILE_NAV.forEach(pid=>{
      const p=panels[pid]; if(!p) return;
      const b=elHtml(`<button class="${mobileTab===pid?'active':''}">${icon(p.icon)}<span>${esc(p.title)}</span></button>`);
      b.addEventListener('click', ()=>{ mobileTab=pid; renderMobileNav(); renderMobilePanel(); });
      nav.appendChild(b);
    });
  }
  function renderMobilePanel(){
    const c=$('#mContent'); if(!c) return;
    c.innerHTML='';
    const d=document.createElement('div'); d.className='m-panel';
    c.appendChild(d);
    const p=panels[mobileTab]||panels.esercizio;
    try{ p.render(d); }catch(err){ d.innerHTML='<div class="dk-empty">⚠ Panel error: '+esc(err.message)+'</div>'; }
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
    activateOrInsert, closePanel, updateActivityBar, applyMode, ensurePanelSpace,
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
