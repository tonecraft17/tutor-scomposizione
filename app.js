/* ============================================================
   APP · entry point: joins the modules and starts the app
   ============================================================ */
import { APP, KEYS, supabaseConfigured, PLOTLY_JS } from './config.js';
import { CH, EX, ORDER, TOTAL_EX, ROADMAP, codiceEsercizio } from './data/exercises.js';
import { createDock, isMobile, icon } from './engine/dock.js';
import {
  stateFor, righeUtente, righeUtenteRaw, righeUtenteConCommenti, conRientro, checkStep, assistLabel, assistSummary,
  autonomiaOf, globalStats, nextExercise, verificaOutput
} from './engine/tutor.js';
import {
  runPythonCode, getStatus, onPythonStatus,
  onMatplotlibImage, onPlotlyFigure, onPygameFrame,
  onPythonRunEnd, sendPygameEvent, stopPygameGame
} from './engine/python-runner.js'; // ===== MODIFIED =====
import * as storage from './engine/storage.js';
import * as solDb from './engine/solutions-db.js'; // ===== NEW · local solutions database =====
import { PONTE } from './engine/ponte.js'; // ===== NEW v12.1 · bridge from exercise lines → project =====

/* ---------- UI utilities ---------- */
const $ = s => document.querySelector(s);
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function elHtml(h) { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; }
function toast(msg, type) {
  const t = elHtml(`<div class="toast ${type || ''}">${msg}</div>`);
  $('#toasts').appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 3600);
}
function modal(html, okLabel) {
  return new Promise(res => {
    const bg = elHtml(`<div class="modal-bg"><div class="modal">${html}
      <div class="acts"><button class="btn" data-r="0">Cancel</button>
      <button class="btn primary" data-r="1">${okLabel || 'Confirm'}</button></div></div></div>`);
    $('#modalHost').appendChild(bg);
    bg.addEventListener('click', ev => {
      const b = ev.target.closest('[data-r]'); if (!b) return;
      bg.remove(); res(b.dataset.r === '1');
    });
  });
}

/* ============================================================
   ===== NEW · INPUT MODAL for input() of Python code =====
   When the code executed in the worker calls input(), the worker uses
   js.prompt() — which works, but it's ugly. This would be a more
   integrated version, BUT: prompt() is synchronous, so the modal cannot
   block the worker. For this reason we keep the native prompt(),
   BUT we also intercept an informational event in parallel to show
   a toast with the prompt. (Already active, no further logic needed.)
   ============================================================ */

/* ============================================================
   ===== NEW · CHARTS PANEL (Matplotlib + Plotly) =====
   ------------------------------------------------------------
   FIX v7 · figures are saved as DATA (fig/b64), not as HTML:
   every panel refresh rebuilds the cards and
   RE-DRAWS the Plotly charts (before, the re-render read a
   global registry never populated and the cards came back empty).
   FIX v7 · every card has an ✕ to close that single chart
   (with Plotly.purge to free memory); the panel bar
   has "🧹 clear" to close them all.
   ============================================================ */
const GRAPHS = { items: [], seq: 0 };   // [{id?, kind, fig?, b64?, ts}]
function pushGraph(item) {
  item.ts = Date.now();
  GRAPHS.items.unshift(item);
  if (GRAPHS.items.length > 12) GRAPHS.items.length = 12;   // limit 12
  /* FIX v7 · ALWAYS activates the Charts tab: if the tab already exists in
     a group but is not the visible one, refreshPanels rendered
     nothing and the student didn't see the chart appear after "▶ run". */
  dock.activateOrInsert('grafici');
  /* FIX v7 · if the Charts group has been squeezed by the layout (~90 px
     strip), a 280 px chart can't be seen: widen its slice of the
     split. The student can always shrink it back by dragging. */
  if (dock.ensurePanelSpace) dock.ensurePanelSpace('grafici', 330);
  dock.refreshPanels(['grafici']);
}
onMatplotlibImage(({ b64 }) => pushGraph({ kind: 'matplotlib', b64 }));
onPlotlyFigure(({ json }) => {
  let fig = null;
  try { fig = JSON.parse(json); } catch (e) { console.error('Plotly figure JSON:', e); }
  pushGraph({ kind: 'plotly', id: 'plotly-' + (++GRAPHS.seq) + '-' + Math.random().toString(36).slice(2, 7), fig });
});

/* FIX v7 · plotly.js is loaded with <script defer> in index.html:
   if it hasn't arrived yet (or the CDN was down at startup), load it
   just once on the first chart, instead of leaving the card empty. */
let plotlyJsPromise = null;
function ensurePlotlyJs() {
  if (typeof Plotly !== 'undefined') return Promise.resolve(true);
  if (plotlyJsPromise) return plotlyJsPromise;
  plotlyJsPromise = new Promise(res => {
    const s = document.createElement('script');
    s.src = PLOTLY_JS.url;
    s.onload = () => res(true);
    s.onerror = () => { plotlyJsPromise = null; res(false); };
    document.head.appendChild(s);
  });
  return plotlyJsPromise;
}
function purgeGraph(item) {
  if (item.kind === 'plotly' && item.id && typeof Plotly !== 'undefined') {
    try { Plotly.purge(item.id); } catch (e) { /* the div has already been removed */ }
  }
}
function closeGraph(item) {
  purgeGraph(item);
  const i = GRAPHS.items.indexOf(item);
  if (i >= 0) GRAPHS.items.splice(i, 1);
  dock.refreshPanels(['grafici']);
}

/* ============================================================
   ===== NEW · GAME PANEL (Pygame) — NOW INTERACTIVE =====
   ------------------------------------------------------------
   The canvas captures keyboard and mouse and relays them to the runtime:
   games respond in real time. The game keeps running until
   the student closes it (■ stop / q key) or the
   inactivity watchdog fires (25 s with no frames or input).
   ============================================================ */
const GAME = { lastFrame: null, meta: { w: 0, h: 0, ts: 0 }, active: false, everOpened: false, focused: false };

/** Maps browser keys to pygame constants (K_LEFT, K_SPACE…). */
function gameKeyCode(ev) {
  const k = ev.key;
  if (k === 'ArrowLeft') return 'K_LEFT';
  if (k === 'ArrowRight') return 'K_RIGHT';
  if (k === 'ArrowUp') return 'K_UP';
  if (k === 'ArrowDown') return 'K_DOWN';
  if (k === ' ') return 'K_SPACE';
  if (k === 'Escape') return 'K_ESCAPE';
  if (k === 'Enter') return 'K_RETURN';
  if (k === 'Shift') return 'K_LSHIFT';
  if (k === 'Tab') return 'K_TAB';
  if (k === 'Backspace') return 'K_BACKSPACE';
  if (/^[a-z]$/i.test(k)) return 'K_' + k.toLowerCase();
  if (/^[0-9]$/.test(k)) return 'K_' + k;
  return null;
}
/** Mouse coordinates on the canvas rescaled to the game's real dimensions. */
function gameCanvasPos(canvas, ev) {
  const r = canvas.getBoundingClientRect();
  const gw = +canvas.dataset.gw || canvas.width || 1;
  const gh = +canvas.dataset.gh || canvas.height || 1;
  return [Math.max(0, Math.round((ev.clientX - r.left) * gw / Math.max(1, r.width))),
          Math.max(0, Math.round((ev.clientY - r.top) * gh / Math.max(1, r.height)))];
}
function attachGameInput(canvas) {
  canvas.addEventListener('focus', () => { GAME.focused = true; });
  canvas.addEventListener('blur', () => { GAME.focused = false; });
  canvas.addEventListener('keydown', ev => {
    const k = gameKeyCode(ev);
    if (k) { ev.preventDefault(); sendPygameEvent({ t: 'KEYDOWN', key: k, ch: ev.key && ev.key.length === 1 ? ev.key : '' }); }
  });
  canvas.addEventListener('keyup', ev => {
    const k = gameKeyCode(ev);
    if (k) { ev.preventDefault(); sendPygameEvent({ t: 'KEYUP', key: k }); }
  });
  canvas.addEventListener('mousemove', ev => {
    if (!GAME.active) return;
    const [x, y] = gameCanvasPos(canvas, ev);
    sendPygameEvent({ t: 'MOUSEMOTION', x, y });
  });
  canvas.addEventListener('mousedown', ev => {
    canvas.focus();
    if (!GAME.active) return;
    const [x, y] = gameCanvasPos(canvas, ev);
    sendPygameEvent({ t: 'MOUSEBUTTONDOWN', x, y, button: 1 });
  });
  canvas.addEventListener('mouseup', ev => {
    if (!GAME.active) return;
    const [x, y] = gameCanvasPos(canvas, ev);
    sendPygameEvent({ t: 'MOUSEBUTTONUP', x, y, button: 1 });
  });
  canvas.addEventListener('contextmenu', ev => ev.preventDefault());
  // touch → mouse (games with buttons, e.g. the "Play" of Alien Invasion)
  let lastTouch = [0, 0];
  const touchPos = ev => (ev.touches && ev.touches[0]) ? gameCanvasPos(canvas, ev.touches[0]) : lastTouch;
  canvas.addEventListener('touchstart', ev => {
    ev.preventDefault(); canvas.focus();
    if (!GAME.active) return;
    lastTouch = touchPos(ev);
    sendPygameEvent({ t: 'MOUSEBUTTONDOWN', x: lastTouch[0], y: lastTouch[1], button: 1 });
  }, { passive: false });
  canvas.addEventListener('touchmove', ev => {
    ev.preventDefault();
    if (!GAME.active) return;
    lastTouch = touchPos(ev);
    sendPygameEvent({ t: 'MOUSEMOTION', x: lastTouch[0], y: lastTouch[1] });
  }, { passive: false });
  canvas.addEventListener('touchend', ev => {
    ev.preventDefault();
    if (!GAME.active) return;
    sendPygameEvent({ t: 'MOUSEBUTTONUP', x: lastTouch[0], y: lastTouch[1], button: 1 });
  }, { passive: false });
}
onPygameFrame(({ buf, b64, w, h, gw, gh }) => {
  /* FIX v8 · w/h = dimensions of the frame sent (shrunk to 800 px
     wide by the worker to save bandwidth); gw/gh = NATIVE dimensions
     of the game screen. Mouse coordinates must be mapped to the
     NATIVE ones (gameCanvasPos uses dataset.gw/gh), otherwise in
     1200×800 games every click landed in the wrong spot. */
  GAME.lastFrame = { buf, b64, w, h, gw, gh };
  GAME.meta = { w: gw || w, h: gh || h, ts: Date.now() };
  /* FIX v8 · open the panel on EVERY new game, not just the first
     one of the session: if the student closed the Game panel (× on the
     tab), subsequent games stayed invisible (canvas never recreated).
     "primoFrameRun" is true only on the first frame of a new run:
     during the game the active tab is no longer forced. */
  const primoFrameRun = !GAME.active && getStatus().running;
  if (getStatus().running) GAME.active = true;
  if (primoFrameRun || !GAME.everOpened) {
    GAME.everOpened = true;
    dock.activateOrInsert('gioco');     // activates the tab (or reinserts it if closed)
    dock.refreshPanels(['gioco']);     // creates the canvas
    /* FIX v8 · the Game group used to be left ~100 px tall (strip at
       the bottom of the dock): the 800×533 canvas stayed cut off and the
       student "never saw the game" (e.g. 14-8: the solution ran invisibly
       for 25 s, then the watchdog closed it). Same remedy as the charts:
       the slice of the split is widened; the canvas now also adapts to
       the remaining space (CSS max-height). */
    if (dock.ensurePanelSpace) dock.ensurePanelSpace('gioco', 420);
    dock.refreshPanels(['gioco']);     // after the widening the canvas must be recreated
    toast('🎮 Game started: click the canvas in the <b>Game</b> panel (it captures the keyboard) and play with arrows/space/q. Press <b>■ Stop</b> to close it.', '');
    if (isMobile()) { dock.setMobileTab('gioco'); dock.renderMobilePanel(); dock.renderMobileNav(); }
  }
  // draws without rebuilding the panel (keyboard focus stays on the canvas)
  requestAnimationFrame(() => drawGameFrame());
  updateGameMeta();
});
onPythonRunEnd(() => {
  if (!GAME.everOpened) return;
  GAME.active = false;
  GAME.focused = false;
  updateGameMeta();
});
function updateGameMeta() {
  const el = document.getElementById('gameMeta');
  if (!el) return;
  const st = el.querySelector('.st');
  if (st) st.innerHTML = GAME.active
    ? '🎮 <b>running</b> — click the canvas and play'
    : 'last frame: ' + new Date(GAME.meta.ts).toLocaleTimeString('en-GB');
  const btn = el.querySelector('#gameStopBtn');
  if (btn) btn.style.display = GAME.active ? '' : 'none';
}
function drawGameFrame() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas || !GAME.lastFrame) return;
  const { buf, b64, w, h, gw, gh } = GAME.lastFrame;
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  /* FIX v8 · the canvas shows the shrunk frame (w×h), but the mouse maps
     to the NATIVE dimensions of the game (gw×gh): gameCanvasPos() uses
     exactly these two values. */
  canvas.dataset.gw = gw || w; canvas.dataset.gh = gh || h;
  const ctx = canvas.getContext('2d');
  if (buf) {
    try {
      const u8 = new Uint8Array(buf);
      ctx.putImageData(new ImageData(new Uint8ClampedArray(u8), w, h), 0, 0);
      return;
    } catch (e) { /* fallback below */ }
  }
  if (b64) {
    const bin = atob(b64);
    const imgData = ctx.createImageData(w, h);
    const bpp = 4;
    for (let i = 0, j = 0; i < w * h; i++, j += bpp) {
      imgData.data[i * 4 + 0] = bin.charCodeAt(j);
      imgData.data[i * 4 + 1] = bin.charCodeAt(j + 1);
      imgData.data[i * 4 + 2] = bin.charCodeAt(j + 2);
      imgData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }
}
function renderGrafici(box) {
  box.innerHTML = '';
  const wrap = elHtml(`<div class="graphs-wrap"></div>`);

  /* FIX v7 · panel bar: counter + "clear" (closes all) */
  const bar = elHtml(`<div class="graphs-toolbar"><span class="graphs-count"></span></div>`);
  const btnAll = elHtml(`<button class="btn tiny" title="Closes all charts">🧹 clear</button>`);
  btnAll.addEventListener('click', () => {
    GRAPHS.items.forEach(purgeGraph);
    GRAPHS.items.length = 0;
    dock.refreshPanels(['grafici']);
  });
  bar.appendChild(btnAll);
  wrap.appendChild(bar);

  if (!GRAPHS.items.length) {
    wrap.appendChild(elHtml(`<div class="graphs-empty">No charts yet. Run a program with <code>plt.show()</code> (Matplotlib) or <code>fig.show()</code> (Plotly) to see it here.</div>`));
  } else {
    const n = GRAPHS.items.length;
    bar.querySelector('.graphs-count').textContent = n + (n === 1 ? ' chart' : ' charts');
    GRAPHS.items.forEach(item => {
      const t = new Date(item.ts || Date.now()).toLocaleTimeString('en-GB');
      let titolo = '📊 Plotly';
      if (item.kind === 'matplotlib') titolo = '🖼 Matplotlib';
      else if (item.fig && item.fig.layout && item.fig.layout.title) {
        const tt = typeof item.fig.layout.title === 'string' ? item.fig.layout.title : item.fig.layout.title.text;
        if (tt) titolo = '📊 ' + String(tt).replace(/\s+/g, ' ').trim().slice(0, 46);
      }
      const card = elHtml(`<div class="graph-card">
        <div class="graph-card-head"><b>${esc(titolo)}</b><span class="badge">${t}</span>
          <button class="graph-close" title="Close this chart">✕</button></div>
        <div class="graph-card-body">${item.kind === 'plotly'
          ? `<div id="${item.id}" class="plotly-div"></div>`
          : `<img src="data:image/png;base64,${item.b64}" alt="matplotlib chart">`}</div>
      </div>`);
      /* FIX v7 · closing the SINGLE chart */
      card.querySelector('.graph-close').addEventListener('click', () => closeGraph(item));
      wrap.appendChild(card);
    });
  }
  box.appendChild(wrap);

  /* FIX v7 · SINGLE drawing point: after every panel refresh
     (new figure, tab switch, resize) the Plotly figures are
     re-drawn from the saved DATA, no longer from a registry that
     nobody populated. plotly.js is loaded if missing. */
  requestAnimationFrame(async () => {
    const plotlyItems = GRAPHS.items.filter(it => it.kind === 'plotly' && it.fig);
    if (!plotlyItems.length) return;
    const ok = await ensurePlotlyJs();
    plotlyItems.forEach(it => {
      const el = document.getElementById(it.id);
      if (!el) return;   // the panel was re-rendered in the meantime
      if (!ok) {
        el.innerHTML = '<div class="plotly-err">⚠ Cannot load plotly.js: check your connection and reopen the Charts panel.</div>';
        return;
      }
      try {
        Plotly.newPlot(it.id, it.fig.data || [], it.fig.layout || {}, { responsive: true, displaylogo: false });
        el.dataset.rendered = '1';
      } catch (e) {
        console.error('Plotly render:', e);
        el.innerHTML = '<div class="plotly-err">⚠ Error drawing the chart: ' + esc(String(e && e.message || e)) + '</div>';
      }
    });
  });
}
function renderGioco(box) {
  box.innerHTML = '';
  const wrap = elHtml(`<div class="game-wrap"></div>`);
  if (!GAME.lastFrame) {
    wrap.appendChild(elHtml(`<div class="game-empty">No frames yet. Run a program with <code>pygame.display.flip()</code>: the game appears here — and it's <b>playable</b> (keyboard and mouse pass through to the canvas).</div>`));
  } else {
    wrap.appendChild(elHtml(`<div class="game-meta" id="gameMeta">
      <span class="dim"><b>${GAME.meta.w}×${GAME.meta.h}</b></span>
      <span class="st">${GAME.active ? '🎮 <b>running</b> — click the canvas and play' : 'last frame: ' + new Date(GAME.meta.ts).toLocaleTimeString('en-GB')}</span>
      <button class="btn tiny danger" id="gameStopBtn" title="Closes the running game (even if it stopped responding)">■ Stop</button>
    </div>`));
    /* FIX v8 · the canvas lives in a flexible stage: it fills the
       remaining space and resizes (proportionally) instead of being
       cut off when the group is short. */
    const stage = elHtml(`<div class="game-stage"></div>`);
    const cv = elHtml(`<canvas id="gameCanvas" class="game-canvas" tabindex="0" title="Click here, then use arrows / space / q"></canvas>`);
    stage.appendChild(cv);
    wrap.appendChild(stage);
    wrap.appendChild(elHtml(`<div class="game-help">🖱 Click the canvas to activate the keyboard: <span class="kbd">←</span><span class="kbd">→</span><span class="kbd">↑</span><span class="kbd">↓</span> move, <span class="kbd">space</span> shoots, <span class="kbd">q</span> exits. The mouse passes straight to the game.</div>`));
    const stopBtn = wrap.querySelector('#gameStopBtn');
    stopBtn.style.display = GAME.active ? '' : 'none';
    stopBtn.addEventListener('click', () => { stopPygameGame(); toast('Game close requested…', ''); });
    attachGameInput(cv);
  }
  box.appendChild(wrap);
  requestAnimationFrame(() => { drawGameFrame(); if (GAME.focused) { const c = document.getElementById('gameCanvas'); if (c) c.focus(); } });
}

/* ---------- application state ---------- */
const stored = storage.loadLocal();
const S = {
  current: stored.current || '2-1',
  progress: stored.progress || {},
  drafts: {},
  hintsOpen: {},
  warnedFull: {},
  filter: '',
  mobileTab: 'esercizio',
  codiceFile: {}   // ===== NEW v10 · open file tab in the Code editor, per exercise =====
};
function exState(id) {
  id = id || S.current;
  return stateFor(S.progress, id);
}
function saveProgress() { storage.saveLocal(S.progress, S.current); }
/* ===== NEW v10 · "soft" saving for the Code editor: typing must not
   write to localStorage on every keystroke; at the end of a run (▶ run)
   the save is forced with saveProgressNow(). ===== */
let saveProgTimer = null;
function saveProgressDebounced() { clearTimeout(saveProgTimer); saveProgTimer = setTimeout(() => { saveProgTimer = null; saveProgress(); }, 400); }
function saveProgressNow() { if (saveProgTimer) { clearTimeout(saveProgTimer); saveProgTimer = null; } saveProgress(); }
async function resetAll() {
  try { await storage.azzeraRemoto(); } catch (e) { }
  storage.resetLocal();
  location.reload();
}

/* ---------- Python syntax highlighting ---------- */
function hlLine(l) {
  const re = /(#[^\n]*)|("""[\s\S]*?"""|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(and|as|assert|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|not|or|pass|raise|return|try|while|with|yield|True|False|None)\b|\b(print|input|int|float|str|list|dict|set|tuple|len|range|sorted|sum|min|max|abs|round|open|type|removeprefix|removesuffix)\b|\b(\d[\d_]*(?:\.\d+)?)\b/g;
  let out = '', last = 0, m;
  while ((m = re.exec(l))) {
    out += esc(l.slice(last, m.index));
    const cls = m[1] ? 'py-c' : m[2] ? 'py-s' : m[3] ? 'py-k' : m[4] ? 'py-b' : 'py-n';
    out += `<span class="${cls}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  out += esc(l.slice(last));
  return out || '&nbsp;';
}
function hlInline(code) { return code.split('\n').map(hlLine).join('\n'); }
function hlRows(code, startAt) {
  return code.split('\n').map((l, i) =>
    `<div class="cl"><span class="ln">${i + 1 + (startAt || 0)}</span><span class="cd">${hlLine(l)}</span></div>`
  ).join('');
}

/* ---------- hint phrases ---------- */
function plainFrase(f) { return f.replace(/\{\{|\}\}/g, ''); }
function fraseHtml(e, idx, f) {
  const h = S.hintsOpen[e.id + '::' + idx] || {};
  return esc(f).replace(/\{\{(.+?)\}\}/g, (m, w) =>
    `<span class="kw${h[w] ? ' used' : ''}" data-w="${esc(w)}">${esc(w)}</span>`);
}
function bumpAssist(exId, idx, lvl) {
  const st = exState(exId);
  st.assist[idx] = Math.max(st.assist[idx] || 0, lvl);
  saveProgress();
  const c = document.getElementById('assistChip');
  if (c) c.textContent = assistLabel(st.assist[idx]);
}
function onKwClick(hintBox, e, idx, word, el) {
  const key = e.id + '::' + idx;
  const h = S.hintsOpen[key] || (S.hintsOpen[key] = {});
  const cur = h[word] || 0;
  const lvl = Math.min(cur + 1, 2);
  h[word] = lvl;
  el.classList.add('used');
  bumpAssist(e.id, idx, lvl);
  showHintCard(hintBox, e, idx, word, lvl, el);
}
function showHintCard(hintBox, e, idx, word, lvl, kwEl) {
  const def = e.steps[idx].k[word]; if (!def) return;
  let card = hintBox.querySelector(`[data-hint="${esc(word)}"]`);
  if (!card) {
    card = elHtml(`<div class="hint-card" data-hint="${esc(word)}"></div>`);
    hintBox.appendChild(card);
  }
  card.innerHTML = `
    <div class="hc-top"><span>🪂</span><b>${esc(word)}</b>
      <span class="lv">${lvl >= 2 ? 'level 2 · syntax' : 'level 1 · concept'}</span></div>
    <p>${def[0]}</p>
    ${lvl >= 2 ? `<code class="syn">${hlInline(def[1])}</code>`
      : `<button class="hint-cta">Show the syntax →</button>`}`;
  const cta = card.querySelector('.hint-cta');
  if (cta) cta.addEventListener('click', () => onKwClick(hintBox, e, idx, word, kwEl || card));
}
function restoreHints(hintBox, e, idx) {
  const h = S.hintsOpen[e.id + '::' + idx] || {};
  Object.keys(h).forEach(w => {
    const def = e.steps[idx].k[w]; if (!def) return;
    if (w === '__full__') return;
    showHintCard(hintBox, e, idx, w, h[w], null);
  });
  const st = exState(e.id);
  if ((st.assist[idx] || 0) >= 3) {
    const card = elHtml(`<div class="hint-card" data-hint="__full__">
      <div class="hc-top"><span>🪂</span><b>full line</b><span class="lv">level 3 · hint</span></div>
      <code class="syn">${hlInline(e.steps[idx].c)}</code></div>`);
    hintBox.appendChild(card);
  }
}
function fullParachute(e, idx) {
  const run = async () => {
    const st = exState(e.id);
    if (!S.warnedFull[e.id]) {
      const ok = await modal(`<h3>🪂 Full hint</h3><p>Shows the <b>line already written</b>. Syntactic memory is built by <b>writing</b>: use it after trying on your own. Continue?</p>`, 'Show the line');
      if (!ok) return;
      S.warnedFull[e.id] = true;
    }
    bumpAssist(e.id, idx, 3);
    const box = document.getElementById('hintArea');
    if (box) {
      const s = e.steps[idx];
      const card = elHtml(`<div class="hint-card" data-hint="__full__">
        <div class="hc-top"><span>🪂</span><b>full line</b><span class="lv">level 3 · hint</span></div>
        <code class="syn">${hlInline(s.c)}</code>
        <p class="muted" style="margin-top:7px;font-size:11.5px">Transcribe it yourself in the editor below: the check stays active.</p></div>`);
      const old = box.querySelector('[data-hint="__full__"]');
      if (old) old.remove();
      box.appendChild(card);
    }
  };
  run();
}

/* ---------- step verification ---------- */
function openExercise(id) {
  if (!EX[id]) return;
  S.current = id; saveProgress();
  S.hintsOpen = {};
  if (isMobile()) { dock.setMobileTab('esercizio'); dock.renderMobilePanel(); dock.renderMobileNav(); dock.renderMobileHead(); }
  else dock.refreshPanels(['esercizio', 'traccia', 'console', 'moduli', 'progressi', 'codice', 'righe']);   // ===== MODIFIED v12 · also the lightweight Lines editor =====
  renderStatus();
}
function fileSafe(id) { return 'es_' + id.replace(/[-.]/g, '_'); }
function doVerify(e, idx, ta) {
  const s = e.steps[idx];
  // ===== FIX v5 · steps with option raw: true (e.g. 2-11): the comment IS
  // the object of the step, so it must not be stripped before verification. =====
  const rawLines = (s.raw ? righeUtenteConCommenti : righeUtenteRaw)(ta.value || '');
  // ===== MODIFIED · empty lines and comments don't count as code:
  // before, empty lines inside `c` inflated the count and misaligned
  // the canonical indentation by index (bug on 11-1/11-3: indentation lost). =====
  const userLines = rawLines.map(l => l.trim()).filter(Boolean);
  const res = checkStep(s, userLines);
  const msg = document.getElementById('stepMsg');
  if (!res.ok && userLines.length === 0) {
    msg.className = 'step-msg err';
    msg.textContent = 'Write the code line for this step first ✏️';
    ta.classList.add('err'); setTimeout(() => ta.classList.remove('err'), 350);
    return;
  }
  if (res.ok) {
    ta.classList.add('ok');
    const attese = s.c ? s.c.split('\n').filter(l => l.trim()) : null;
    const nonVuote = rawLines.filter(l => l.trim());
    const allinea = !!attese && attese.length === nonVuote.length;
    const salvate = allinea
      ? nonVuote.map((l, i) => conRientro(attese[i], l))
      : rawLines;
    if (allinea && salvate.some((l, i) => l !== nonVuote[i]))
      toast('ℹ Line saved with the canonical indentation (4 spaces per level).', 'warn');
    advance(e, idx, salvate);
  } else {
    ta.classList.remove('ok'); ta.classList.add('err');
    setTimeout(() => ta.classList.remove('err'), 350);
    msg.className = 'step-msg err';
    msg.textContent = '❌ ' + res.msg;
  }
}
function advance(e, idx, userLines) {
  const st = exState(e.id);
  if (st.solved <= idx) st.solved = idx + 1;
  st.lines[idx] = (userLines || []).join('\n');
  /* ===== NEW v11 · the program of passed steps has changed: update the
     knowledge used by the Code editor (modoCodice). If the program of
     passed steps already contains an output call (print / .show / input)
     we learn it right away (the mode stays 'step'); once the program has
     produced output (learned in the field) the knowledge does NOT go back
     down, otherwise the next run re-decides. ===== */
  try {
    const prog = codiceEsercizio(e, st, { progress: S.progress, includePrereq: st.prereq !== false });
    if (OUT_RE.test(prog)) st.studentOut = true;
    else if (st.studentOut !== true) delete st.studentOut;
  } catch (err) { /* not critical */ }
  const s = e.steps[idx];
  if (s.so && s.so.length) st.outputs = st.outputs.concat(s.so);
  delete S.drafts[e.id + '::' + idx];
  if (st.solved >= e.steps.length) {
    st.done = true;
    toast(`🎉 <b>${esc(e.t)}</b> completed! Press "▶ Run and check the output" to see it actually run.`, 'ok');
  } else {
    const used = st.assist[idx] || 0;
    toast(`✓ Step ${idx + 1} passed${used === 0 ? ' — fully on your own!' : ''}`, 'ok');
  }
  saveProgress();
  dock.refreshPanels(['esercizio', 'console', 'moduli', 'progressi', 'codice', 'righe']);   // ===== MODIFIED v12 · also the lightweight Lines editor =====
  renderStatus(); if (isMobile()) dock.renderMobileHead();
  setTimeout(() => {
    const c = document.getElementById('stepCard');
    if (c) c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (!isMobile()) {
      const ta = document.querySelector('#dockRoot .code-input');
      if (ta) ta.focus();
    }
  }, 40);
}
function confirmText(e, idx) {
  const ta = document.getElementById('refTa');
  const s = e.steps[idx];
  const val = (ta && ta.value || '').trim();
  if (val.length < (s.min || 10)) {
    const msg = document.getElementById('stepMsg');
    if (msg) { msg.className = 'step-msg err'; msg.textContent = `Write at least ${s.min || 10} characters: describe your idea in a sentence.`; }
    if (ta) { ta.classList.add('err'); setTimeout(() => ta.classList.remove('err'), 350); }
    return;
  }
  exState(e.id).notes[idx] = val;
  advance(e, idx, [val]);
}

/* ---------- real execution (Pyodide) ---------- */
function nowT() { return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
function snapMedia() { return { g: GRAPHS.items.length, f: GAME.meta.ts }; }
function mediaNuovi(before) { return GRAPHS.items.length > before.g || GAME.meta.ts > before.f; }
/** Removes runtime "noise" (pygame banner, package loading logs)
 *  to figure out whether the student's program produced REAL output. */
function outputUtile(out) {
  return String(out || '').split('\n').filter(l => {
    const t = l.trim();
    if (!t) return false;
    if (/^loading\s+[\w.-]+$/i.test(t) || /^loaded\s+[\w.-]+$/i.test(t)) return false;  // Pyodide package log
    if (/already loaded/i.test(t)) return false;                                        // "pygame-ce already loaded…"
    if (/^no new packages to load/i.test(t)) return false;
    if (/^installing\b/i.test(t)) return false;                                         // micropip
    if (/^pygame(-ce)?\s+[\d.]+\s*\(SDL/i.test(t)) return false;                        // pygame banner
    if (/^hello from the pygame community/i.test(t)) return false;
    if (/^pygame(-ce)?\s+\d/i.test(t)) return false;
    return true;
  }).join('\n');
}

/** ===== NEW · Multi-file exercises (opts e.files) =====
 *  For exercises that create a module + a main (9-10, 9-11, 9-12, 11-1,
 *  11-3): maps the steps with code to the file names declared in e.files,
 *  in order. Returns { files, mainCode, mainName } — mainCode is the
 *  content of 'main.py' (or of the last non-empty file written so far),
 *  so the runner executes the main WITH the modules written by the
 *  student alongside. */
function codicePerFile(e, st, opts) {
  const progress = opts.progress || {};
  const includePrereq = opts.includePrereq !== false;
  const names = e.files;
  const blocchi = [];            // sequence of {file, righe:[]}
  let fi = 0;
  const aggiungi = (testo) => {
    const nome = names[Math.min(fi, names.length - 1)];
    if (!blocchi.length || blocchi[blocchi.length - 1].file !== nome)
      blocchi.push({ file: nome, righe: [] });
    blocchi[blocchi.length - 1].righe.push(testo);
    fi++;
  };
  if (includePrereq && e.prereq) {
    (Array.isArray(e.prereq) ? e.prereq : [e.prereq]).forEach(pid => {
      const pex = EX[pid]; if (!pex) return;
      const pst = progress[pid] || { solved: 0, lines: {} };
      pex.steps.forEach((s, i) => {
        if (!s.c) return;
        aggiungi((pst.lines && pst.lines[i] && i < pst.solved) ? pst.lines[i] : s.c);
      });
    });
  }
  e.steps.forEach((s, i) => {
    if (!s.c || i >= st.solved) return;
    aggiungi((st.lines && st.lines[i]) ? st.lines[i] : s.c);
  });
  const files = {};
  blocchi.forEach(b => { files[b.file] = b.righe.join('\n'); });
  let mainName = names.includes('main.py') ? 'main.py'
    : (blocchi.length ? blocchi[blocchi.length - 1].file : null);
  let mainCode = mainName ? (files[mainName] || '') : '';
  if (!mainCode.trim()) {          // the main hasn't been written yet: run the last non-empty file
    for (let i = blocchi.length - 1; i >= 0; i--) {
      if ((files[blocchi[i].file] || '').trim()) { mainName = blocchi[i].file; mainCode = files[blocchi[i].file]; break; }
    }
  }
  return { files, mainCode, mainName };
}

async function eseguiEsercizio(e) {
  const st = exState(e.id);
  // ===== NEW · exercises not runnable in the browser (Git shell commands,
  // Django settings): the runner must not try to run them as Python =====
  if (e.noRun) {
    const motivo = e.noRun === 'shell'
      ? 'shell commands (Git / terminal)'
      : (e.noRun === 'django' ? 'files of a Django project' : 'steps not runnable in the browser');
    st.runs.push({ t: nowT(), dur: 0, out: '🖥 ' + motivo.charAt(0).toUpperCase() + motivo.slice(1) + '.\nThese steps must be run in the local terminal (VS Code): the tutor checks the writing, not the execution.', err: null });
    st.runs = st.runs.slice(-12);
    saveProgress(); dock.refreshPanels(['console']); renderStatus();
    toast('🖥 This exercise consists of ' + motivo + ': run them in the local terminal. Step verification stays active here.', 'warn');
    return;
  }
  const includePrereq = (st.prereq !== false);   // default: active
  /* ===== NEW v10 · "Code" editor: if the student has modified the
     program (st.customCode / st.customFiles), "Run and check" executes
     THAT version; otherwise the program assembled from the steps, as
     always. The override is armed only if the editor content differs
     from the original program (see renderCodice).
     ===== NEW v11 · three modes (see modoCodice): for exercises whose steps
     are fragments of a larger program (mode 'sol': Pygame games 12–14,
     class extensions, test programs) "Run and check" always
     refers to the FULL project of the ⌨ editor — original or
     modified as it may be. ===== */
  const mod = codiceArmato(e, st);
  const modo = modoCodice(e, st);
  if (modo === 'sol') { await eseguiProgetto(e, st, mod); return; }
  let mainName = null;
  let code;
  const studentFiles = {};
  if (Array.isArray(e.files) && e.files.length) {
    // ===== multi-file exercises (e.files: 9-10, 9-11, 9-12, 11-1, 11-3) =====
    // The modules written by the student become real runtime files: the import
    // uses THEIR content (not the book version) and pytest tests their code.
    const mf = codicePerFile(e, st, { progress: S.progress, includePrereq });
    const files = Object.assign({}, mf.files);
    // ===== MODIFIED v11 · overrides apply to ALL files (including the
    // project's support modules, not just those declared in e.files) =====
    if (mod) Object.entries(st.customFiles || {}).forEach(([n, c]) => { if (typeof c === 'string') files[n] = c; });
    mainName = mf.mainName;
    let mainCode = mainName ? String(files[mainName] || '') : '';
    if (!mainCode.trim()) {          // the main has no content (yet): run the last non-empty file
      for (let i = e.files.length - 1; i >= 0; i--) {
        if (String(files[e.files[i]] || '').trim()) { mainName = e.files[i]; mainCode = files[e.files[i]]; break; }
      }
    }
    Object.keys(files).forEach(n => {
      const armatoN = mod && typeof st.customFiles[n] === 'string';
      const c = String(files[n] || '');
      if (n !== mainName && (c.trim() || armatoN)) studentFiles[n] = c;   // including files emptied on purpose
    });
    code = mainCode;
  } else {
    // ===== MODIFIED v11 · if the student has only modified a support
    // module (customFiles), the main stays the one from the passed steps =====
    code = (mod && typeof st.customCode === 'string')
      ? st.customCode
      : codiceEsercizio(e, st, { progress: S.progress, includePrereq });
  }
  if (!code.trim()) {
    toast(mod
      ? '⌨ Your program in the Code editor is empty: write some code, or press "⟲ restore original".'
      : 'No lines to run: pass at least one step with code, or write the full program in the ⌨ Code editor.', 'warn');
    return;
  }
  // ===== NEW · support files from the solutions database =====
  // (imported modules, CSV/TXT/JSON data, images of the Pygame projects…)
  const sol = await solDb.getSolution(e.id).catch(() => null);
  const vFiles = Object.assign({}, sol ? sol.files : {}, e.virtualFiles || {}, mod ? (st.customFiles || {}) : {}, studentFiles);
  toast(getStatus().status === 'ready' ? 'Execution started…' : 'First run: downloading the Python runtime (~10 MB), only this time…', '');
  const mediaBefore = snapMedia();
  // ===== NEW · test exercises (sol.mode === 'pytest'): the student's
  // code is run WITH pytest, so they see the results of their own tests
  // (11-1, 11-3, 17-3…). main.py is the student's file: pytest picks it up.
  const runOpts = (sol && sol.mode === 'pytest')
    ? { mode: 'pytest', entry: 'main.py' }
    : {};
  const res = await runPythonCode(code, vFiles, runOpts);
  if (res.busy) { toast(res.error && res.error.hint || 'A run is already in progress.', 'warn'); return; }
  const run = { t: nowT(), dur: res.durataMs, out: res.output || '', err: res.error || null };
  if (mainName) run.entry = mainName;   // ===== NEW v11 · terminal prompt with the real file name =====
  if (mod) run.custom = true;   // ===== NEW v10 · ⌨ marker: modified version in the Code editor =====
  /* FIX v8 · a Pygame game closed NORMALLY (q key, "■ Stop" or
     inactivity watchdog: clean exit, no error) used to be
     labeled as a plain "correct exit" with just the pygame banner
     in the console. Now the console says "🎮 game run" with the
     help for playing, as already happened for games stopped by the timeout. */
  if (res.ok && GAME.meta.ts > mediaBefore.f) run.game = true;
  st.runs.push(run); st.runs = st.runs.slice(-12);
  if (res.ok) {
    const soAll = e.steps.flatMap(s => s.so || []);
    const ver = verificaOutput(soAll, res.output || '');
    if (ver) { st.verificato = ver.ok; }
    else delete st.verificato;
    // ===== NEW · double run =====
    // If the student's code produces no output (and no chart/frame),
    // the official solution is also run to show the correct output.
    // ===== MODIFIED v11 · the double run only applies WITHOUT an override:
    // if the student modified the code in the ⌨ editor the run is a
    // terminal experiment — its result (output, game or error)
    // is what counts and the original solution is NOT run
    // afterwards anymore (bug 14-3: the changes had no effect because the
    // original solution ran anyway, overwriting the result). =====
    const senzaOutput = !outputUtile(res.output).trim() && !mediaNuovi(mediaBefore);
    if (!mod) st.studentOut = !senzaOutput;   // ===== NEW v11 · learned: does the program of steps produce output on its own? =====
    if (senzaOutput && !mod && sol) {
      if (sol.mode === 'none') notaSoluzioneNonEseguibile(st, sol);   // 📦 Django project / archived
      else await eseguiSoluzione(e, sol, st, true);
    } else if (senzaOutput && mod) {
      toast('⌨ Modified program run, no output (no print, no chart or game): this is the result of YOUR code — tweak it and try again.', 'ok');
    } else if (senzaOutput) {
      toast('Program run with no output: so far you have only defined names (classes, functions, imports).', 'warn');
    } else {
      if (ver && ver.ok) toast((mod ? '⌨ modified version — ' : '') + '✓ Output verified: it matches the output expected by the book!', 'ok');
      else if (mod) toast('⌨ Modified program run: output in the Console and in the Code editor.', 'ok');
      else toast('Program run: open the Console for the output.', 'ok');
    }
    if (isMobile()) { dock.setMobileTab('console'); dock.renderMobilePanel(); dock.renderMobileNav(); }
  } else if (res.error && res.error.tipo === 'TimeoutError' && GAME.meta.ts > mediaBefore.f) {
    // ===== MODIFIED · a Pygame game had been running a while without closing:
    // the watchdog stopped it: it's not a student error =====
    run.err = null; run.game = true;
    toast('🎮 The game was closed by the tutor (time limit or inactivity): see the frames in the Game panel.', 'ok');
    if (isMobile()) { dock.setMobileTab('gioco'); dock.renderMobilePanel(); dock.renderMobileNav(); }
  } else {
    toast('Execution error: open the Console for the translated traceback.', 'err');
    // ===== NEW · fragments that modify larger programs =====
    // If the student's code falls on a NameError (a name never defined in
    // this fragment) and the exercise has a runnable solution, the
    // full solution is run right after: the student still sees
    // the finished program in action instead of just a traceback.
    // ===== MODIFIED v11 · this too only WITHOUT an override: with modified
    // code, the error is the true result of YOUR program. =====
    if (!mod) st.studentOut = false;
    const nomeMancante = res.error && res.error.tipo === 'NameError'
      ? (String(res.error.messaggio || '').match(/name '(.+?)' is not defined/) || [])[1] : null;
    if (!mod) {
      if (nomeMancante && sol && sol.mode !== 'none' && sol.entry && sol.files[sol.entry]) {
        await eseguiSoluzione(e, sol, st, true, nomeMancante);
      } else if (sol && sol.mode === 'none') notaSoluzioneNonEseguibile(st, sol);
    }
    if (isMobile()) { dock.setMobileTab('console'); dock.renderMobilePanel(); dock.renderMobileNav(); }
  }
  saveProgress();
  dock.refreshPanels(['console', 'esercizio', 'progressi']);
  updateCodiceOut();          // ===== NEW v10 · Code editor terminal =====
  renderStatus();
}

/** ===== NEW v11 · runs the FULL PROGRAM of the project (mode 'sol') =====
 *  For exercises whose steps are fragments of a larger program
 *  (14-3 "Challenging Target Practice", the games of ch. 12–14, class
 *  extensions like 9-9, test programs like 11-2): "▶ Run and check
 *  the output" ALWAYS refers to the project shown in the ⌨ Code editor —
 *  with the student's changes, if any, otherwise the original
 *  from the local database. What runs is exactly the editor's code
 *  (real terminal): the run is NEVER followed by the original solution. */
async function eseguiProgetto(e, st, mod) {
  const sol = await solDb.getSolution(e.id).catch(() => null);
  if (!sol || !sol.entry || (sol.mode !== 'run' && sol.mode !== 'pytest') || typeof sol.files[sol.entry] !== 'string') {
    toast('Full program not available for this exercise.', 'warn');
    return;
  }
  // the editor's project: original from the database + any per-file overrides
  const files = Object.assign({}, sol.files, mod ? (st.customFiles || {}) : {});
  const entry = sol.entry;
  const code = String(files[entry] || '');
  if (!code.trim()) {
    toast(mod
      ? '⌨ The project\'s entry file in the editor is empty: press "⟲ restore original".'
      : 'The full program of this exercise is empty.', 'warn');
    return;
  }
  const vFiles = Object.assign({}, files); delete vFiles['main.py'];
  toast(getStatus().status === 'ready' ? 'Execution started…' : 'First run: downloading the Python runtime (~10 MB), only this time…', '');
  const mediaBefore = snapMedia();
  const res = await runPythonCode(code, vFiles, { mode: sol.mode, entry });
  if (res.busy) { toast(res.error && res.error.hint || 'A run is already in progress.', 'warn'); return; }
  const nFile = Object.keys(files).filter(n => n !== 'main.py').length;
  const run = { t: nowT(), dur: res.durataMs, out: res.output || '', err: res.error || null, entry, proj: nFile };
  if (mod) run.custom = true;
  if (res.ok && GAME.meta.ts > mediaBefore.f) run.game = true;
  if (!res.ok && res.error && res.error.tipo === 'TimeoutError' && GAME.meta.ts > mediaBefore.f) {
    run.err = null; run.game = true;   // game closed by the watchdog: not an error
  }
  st.runs.push(run); st.runs = st.runs.slice(-12);
  if (run.game) {
    toast((mod ? '⌨ modified version — ' : '') + '🎮 Game started: play it in the <b>Game</b> panel (arrows/space/q), "■ Stop" to close it.', 'ok');
    if (isMobile()) { dock.setMobileTab('gioco'); dock.renderMobilePanel(); dock.renderMobileNav(); }
  } else if (res.ok) {
    const soAll = e.steps.flatMap(s => s.so || []);
    const ver = verificaOutput(soAll, res.output || '');
    if (ver) st.verificato = ver.ok; else delete st.verificato;
    toast((mod ? '⌨ modified version — ' : '') + 'full program run (' + nFile + ' files): output in the Console and in the ⌨ editor.', 'ok');
    if (isMobile()) { dock.setMobileTab('console'); dock.renderMobilePanel(); dock.renderMobileNav(); }
  } else {
    toast((mod ? '⌨ modified version — ' : '') + 'execution error: open the Console for the translated traceback.', 'err');
    if (isMobile()) { dock.setMobileTab('console'); dock.renderMobilePanel(); dock.renderMobileNav(); }
  }
  saveProgress();
  dock.refreshPanels(['console', 'esercizio', 'progressi']);
  updateCodiceOut();
  renderStatus();
}
function notaSoluzioneNonEseguibile(st, sol) {
  const motivo = sol.reason === 'django' ? 'Django project' : 'project not runnable in the browser';
  toast('📦 This exercise modifies a ' + motivo + ': the files are archived in the database, but running it requires Python locally.', 'warn');
  st.runs.push({ t: nowT(), dur: 0, out: '📦 Not runnable in the browser (' + motivo + ').\nThe steps of this exercise are fragments of DIFFERENT files of a complete project (archived in the local database): they do not form a single Python program. To run it, replicate the files locally with Python installed.', err: null, sol: true });
  st.runs = st.runs.slice(-12);
  saveProgress(); dock.refreshPanels(['console']); updateCodiceOut(); renderStatus();
}

/** ===== NEW · Runs the official solution from the local database =====
 *  Provides the correct output for exercises that depend on other files
 *  (multi-file Pygame projects, imported modules, pytest tests, CSV data…).
 *  `nomeMancante` (optional): when the run follows a NameError of the
 *  student's fragment, the message explains that instead of talking
 *  about missing output. */
async function eseguiSoluzione(e, sol, st, automatica, nomeMancante) {
  if (!sol.entry || sol.mode === 'none') { notaSoluzioneNonEseguibile(st, sol); return; }
  const code = sol.files[sol.entry];
  if (typeof code !== 'string') { toast('Solution not available for this exercise.', 'warn'); return; }
  const vFiles = Object.assign({}, sol.files); delete vFiles['main.py'];
  const mediaBefore = snapMedia();
  const res = await runPythonCode(code, vFiles, { mode: sol.mode, entry: sol.entry });
  if (res.busy) { toast(res.error && res.error.hint || 'A run is already in progress.', 'warn'); return; }
  const run = { t: nowT(), dur: res.durataMs, out: res.output || '', err: res.error || null, sol: true };
  if (!res.ok && res.error && res.error.tipo === 'TimeoutError' && GAME.meta.ts > mediaBefore.f) {
    run.err = null; run.game = true;
  }
  /* FIX v8 · a solution that IS a game (e.g. 14-8 "Sideways Shooter, Final
     Version") must be recognized even when it exits cleanly (q, "■ Stop",
     closure due to inactivity): before, the block only said "solution
     output" with the pygame banner, and the student didn't understand
     that the full solution was the playable game in the Game panel. */
  const soluzioneGioco = GAME.meta.ts > mediaBefore.f;
  if (res.ok && soluzioneGioco) run.game = true;
  st.runs.push(run); st.runs = st.runs.slice(-12);
  /* FIX v8 · if the solution is a GAME, the toast says so clearly:
     before it only mentioned the "Console" and the student didn't open the
     Game panel. NB: this toast arrives at the end of the game (the start is
     announced by "🎮 Game started" on the first frame): the text invites
     replaying. */
  const dove = run.game
    ? 'it was the <b>game</b>: review it in the <b>Game</b> panel — to replay, press ▶ run again'
    : 'see the Console';
  toast(automatica
    ? (nomeMancante
      ? `🧩 Your code uses the name "${esc(nomeMancante)}" which is not yet defined: this is a step that modifies a larger program and cannot run on its own. The <b>full solution</b> ${dove}.`
      : `🧰 Your code doesn't produce output yet (it only defines classes/functions): the full solution ${dove}.`)
    : `📚 Solution run: ${run.game ? 'game in the <b>Game</b> panel, output in the Console.' : 'output in the Console.'}`, 'ok');
  if (isMobile()) { dock.setMobileTab(run.game ? 'gioco' : 'console'); dock.renderMobilePanel(); dock.renderMobileNav(); }
  saveProgress(); dock.refreshPanels(['console', 'esercizio', 'progressi']); updateCodiceOut(); renderStatus();
}
/* ---------- EXERCISE panel ---------- */
function stepCard(e, idx) {
  const s = e.steps[idx]; const st = exState(e.id);
  const card = elHtml(`<div class="step-cur" id="stepCard"></div>`);
  card.appendChild(elHtml(`<div class="sc-top">
    <span class="passo">Step ${idx + 1} of ${e.steps.length}</span>
    <span class="chip cy" id="assistChip">${assistLabel(st.assist[idx] || 0)}</span>
  </div>`));
  card.appendChild(elHtml(`<p class="phrase">${fraseHtml(e, idx, s.f)}</p>`));
  if (s.note) card.appendChild(elHtml(`<div class="note">${s.note}</div>`));
  const hints = elHtml(`<div class="hints" id="hintArea"></div>`);
  card.appendChild(hints);

  if (s.c) {
    const prevLines = [];
    for (let i = 0; i < idx; i++) if (e.steps[i].c) prevLines.push(st.lines[i] || e.steps[i].c);
    const prev = prevLines.join('\n');
    const area = elHtml(`<div class="code-area"></div>`);
    if (prev) {
      const sofar = elHtml(`<div class="code-sofar">${hlRows(prev, 0)}</div>`);
      sofar.title = 'The lines already written in previous steps';
      area.appendChild(sofar);
    }
    const nExp = s.c.split('\n').length;
    const row = elHtml(`<div class="code-input-row"><span class="ln">${prevLines.length + 1}</span></div>`);
    const ta = document.createElement('textarea');
    ta.className = 'code-input'; ta.spellcheck = false; ta.autocapitalize = 'off'; ta.autocomplete = 'off';
    ta.rows = Math.max(2, nExp);
    ta.placeholder = nExp > 1 ? `write the ${nExp} Python lines for this step here…` : 'write the Python line for this step here…';
    ta.value = S.drafts[e.id + '::' + idx] || '';
    ta.addEventListener('input', () => { S.drafts[e.id + '::' + idx] = ta.value; });
    ta.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); doVerify(e, idx, ta); }
    });
    row.appendChild(ta); area.appendChild(row);
    card.appendChild(area);
    const acts = elHtml(`<div class="step-actions">
      <button class="btn primary" title="Ctrl/Cmd+Enter">✓ Check</button>
      <button class="btn ghost" title="Show the full line (after an attempt!)">🪂 Full hint</button>
      <span class="assist-line muted" style="font-size:10.5px">Ctrl+Enter to check</span>
    </div>`);
    acts.querySelectorAll('button')[0].addEventListener('click', () => doVerify(e, idx, ta));
    acts.querySelectorAll('button')[1].addEventListener('click', () => fullParachute(e, idx));
    card.appendChild(acts);
    card.appendChild(elHtml(`<div class="step-msg" id="stepMsg"></div>`));
  } else if (s.ta) {
    card.appendChild(elHtml(`<div class="reflect-box"><textarea id="refTa" placeholder="${esc(s.ta)}">${esc(exState(e.id).notes[idx] || '')}</textarea></div>`));
    const acts = elHtml(`<div class="step-actions"><button class="btn primary">✓ Confirm answer</button></div>`);
    acts.querySelector('button').addEventListener('click', () => confirmText(e, idx));
    card.appendChild(acts);
    card.appendChild(elHtml(`<div class="step-msg" id="stepMsg"></div>`));
  } else {
    const acts = elHtml(`<div class="step-actions"><button class="btn primary">${esc(s.btn || '✓ Done')}</button></div>`);
    acts.querySelector('button').addEventListener('click', () => advance(e, idx, []));
    card.appendChild(acts);
  }
  restoreHints(hints, e, idx);
  card.addEventListener('click', ev => {
    const kw = ev.target.closest('.kw');
    if (kw) onKwClick(document.getElementById('hintArea'), e, idx, kw.dataset.w, kw);
  });
  return card;
}
function runRow(e, primary) {
  const st = exState(e.id);
  const armato = codiceArmato(e, st);   // ===== NEW v10 · modified version in the editor? =====
  const row = elHtml(`<div class="ex-actions">
    <button class="btn ${primary ? 'primary' : ''}" data-run="1">${icon('term')} ${primary ? '▶ Run and check the output' : '▶ Run program'}</button>
    ${e.noRun ? '' : `<button class="btn tiny" id="btnCodiceOpen" data-code="1" title="Open the full code this button runs: you can modify it and run it again (editor + terminal)">⌨ code</button>`}
    ${e.noRun ? '' : `<button class="btn tiny" id="btnRigheOpen" data-righe="1" title="Edit ONLY the lines of your exercise (the ones of \"Exercise completed\"), without opening all the code: the values you change flow to the project via the ⚙ bridge — and you see which module they live in">✎ lines</button>`}
    <span class="rt-note" id="runNote">${armato ? '⚠ will run the <b>modified version</b> in the ✎ Lines or ⌨ Code editor' : 'real Python runtime (Pyodide) · support files and solution output from the local database'}</span>
  </div>`);
  row.querySelector('[data-run]').addEventListener('click', () => eseguiEsercizio(e));
  const cb = row.querySelector('[data-code]');
  if (cb) cb.addEventListener('click', () => apriCodice());   // ===== NEW v10 =====
  const rb = row.querySelector('[data-righe]');
  if (rb) rb.addEventListener('click', () => apriRighe());   // ===== NEW v12 =====
  return row;
}
function finalCard(e) {
  const st = exState(e.id);
  const fullCode = e.steps.map((s, i) => s.c ? (st.lines[i] || s.c) : null).filter(Boolean).join('\n');
  const auto = autonomiaOf(S.progress, e.id);
  const nxt = nextExercise(S.progress, e.id);
  const card = elHtml(`<div class="ex-final">
    <h3>🎉 Exercise completed: ${esc(e.t)}${st.verificato ? ' <span class="chip ok">output verified ✓</span>' : ''}</h3>
    <p class="muted">Your complete program:</p>
    <pre>${hlInline(fullCode)}</pre>
    <div class="score">
      <span class="chip ok">Syntactic autonomy: ${auto}%</span>
      <span class="chip">${assistSummary(st)}</span>
      <span class="chip acc">${e.steps.length} steps passed</span>
    </div>
    ${nxt ? `<div class="step-actions"><button class="btn primary">Next exercise: ${esc(EX[nxt].id)} · ${esc(EX[nxt].t)} →</button><button class="btn tiny" id="fcEdit" title="Open the program in the Code editor: you can modify it and run it again">⌨ open in editor</button></div>`
      : `<p class="muted">You have completed all the available exercises. Well done!</p>`}
  </div>`);
  const b = card.querySelector('button');
  if (b) b.addEventListener('click', () => openExercise(nxt));
  const bEd = card.querySelector('#fcEdit');   // ===== NUOVO v10 =====
  if (bEd) bEd.addEventListener('click', () => apriCodice());
  return card;
}
function renderEsercizio(box) {
  const e = EX[S.current] || EX[ORDER[0]];
  const st = exState(e.id);
  const wrap = elHtml('<div class="ex-wrap"></div>');
  box.innerHTML = ''; box.appendChild(wrap);
  // ===== Prerequisite banner =====
  if (e.prereq) {
    const prereqIds = Array.isArray(e.prereq) ? e.prereq : [e.prereq];
    const info = prereqIds.map(pid => {
      const pex = EX[pid];
      const pst = exState(pid);
      const label = pex ? `${pid} · ${esc(pex.t)}` : `${pid} (not found)`;
      const stateIcon = pst.done ? '✓' : (pst.solved > 0 ? '◐' : '○');
      return `<span style="font-family:var(--mono);font-size:11px;color:${pst.done ? 'var(--ok)' : 'var(--acc)'}">${stateIcon} ${label}</span>`;
    }).join(' · ');
    const banner = elHtml(`<div class="note" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;border-left-color:var(--acc);background:var(--acc-soft)">
      <span>📚 <b>Extends the code of:</b> ${info}</span>
      <label style="margin-left:auto;font-size:11.5px;display:flex;gap:5px;align-items:center;cursor:pointer">
        <input type="checkbox" id="chkPrereq" ${st.prereq !== false ? 'checked' : ''}>
        Include base code
      </label>
    </div>`);
    banner.querySelector('#chkPrereq').addEventListener('change', (ev) => {
      const st2 = exState(e.id);
      st2.prereq = ev.target.checked;
      saveProgress();
      toast(ev.target.checked ? '✓ Base code included' : 'ℹ Base code excluded', '');
      dock.refreshPanels(['codice']);   // ===== NEW v10 · the editor snapshot changes =====
    });
    wrap.appendChild(banner);
  }
  // ===== Banner of files already available in the runtime =====
  if (e.virtualFiles && Object.keys(e.virtualFiles).length) {
    const vfItems = Object.entries(e.virtualFiles).map(([name, content]) => `
      <details style="margin-top:6px">
        <summary style="cursor:pointer;font-family:var(--mono);font-size:12px;color:var(--acc)">
          📄 ${esc(name)} <span style="font-size:10.5px;color:var(--faint);font-weight:400">(already available — do NOT rewrite it)</span>
        </summary>
        <pre style="background:#141519;padding:8px;border-radius:6px;margin-top:5px;font-size:11.5px;overflow:auto">${esc(typeof content === 'string' ? content : '(binary file — image already provided to the runtime)')}</pre>
      </details>
    `).join('');
    wrap.appendChild(elHtml(`<div class="note" style="background:rgba(111,211,231,.13);border-left-color:var(--cyan)">
      <b>📚 Files already loaded in the runtime:</b> you can only import them with <code>import</code> or <code>from … import …</code>.
      ${vfItems}
    </div>`));
  }
  // ===== NEW · Solutions database banner (support files / not runnable) =====
  const solIdx = solDb.indexFor(e.id);
  if (solIdx) {
    if (solIdx.mode === 'none') {
      wrap.appendChild(elHtml(`<div class="note" style="background:rgba(250,204,21,.10);border-left-color:var(--warn)">
        <b>📦 ${solIdx.reason === 'django' ? 'Django' : 'not runnable in the browser'} project:</b>
        this exercise modifies ${solIdx.names.length} project files saved in the <b>local solutions database</b>.
        There is no server in the browser: to see it run you need Python and Django installed locally.
      </div>`));
    } else if (solIdx.names.length) {
      const n = solIdx.names.length;
      const shown = solIdx.names.slice(0, 6).map(x => `<code style="font-size:11px">${esc(x)}</code>`).join(' · ');
      wrap.appendChild(elHtml(`<div class="note" style="background:rgba(111,211,231,.13);border-left-color:var(--cyan)">
        <b>🧰 Support files in the runtime (${n}):</b> ${shown}${n > 6 ? ` <span class="muted">…and ${n - 6} more</span>` : ''}<br>
        <span class="muted" style="font-size:11px">From the local solutions database: import them with <code>import</code>/<code>from</code> or read them with <code>Path(...)</code> without recreating them. If your code produces no output, the full solution is run automatically to show you the correct one.</span>
      </div>`));
    }
  }
  const doneCount = st.solved;
  wrap.appendChild(elHtml(`<div class="ex-head">
    <h1>${esc(e.t)}</h1><span class="orig">"${esc(e.orig)}"</span>
    <div class="ex-meta">
      <span class="chip acc">Ch. ${e.ch} · ${esc(CH[e.ch - 1].t)}</span>
      <span class="chip">${esc(e.id)}</span>
      <span class="chip ${e.lvl === 3 ? 'warn' : e.lvl === 2 ? 'purple' : 'ok'}">${'●'.repeat(e.lvl)}${'○'.repeat(3 - e.lvl)} ${e.lvl === 3 ? 'Challenging' : e.lvl === 2 ? 'Medium' : 'Easy'}</span>
      <span class="meter" title="Syntactic autonomy index on solved steps">
        <span class="bar"><i style="width:${autonomiaOf(S.progress, e.id)}%"></i></span>
        <span>${autonomiaOf(S.progress, e.id)}% autonomy</span></span>
    </div>
    <div class="ex-progress">${e.steps.map((s, i) =>
    `<span class="p-dot ${i < doneCount ? 'done' : (i === doneCount && !st.done ? 'cur' : '')}"></span>`).join('')}
      <span class="muted" style="font-size:11px;margin-left:6px">${Math.min(doneCount, e.steps.length)}/${e.steps.length} steps</span></div>
  </div>`));
  wrap.appendChild(elHtml(`<details class="ex-statement" ${doneCount === 0 ? 'open' : ''}>
    <summary>📖 Exercise statement (from the book)</summary><div class="body">${e.tr}</div></details>`));
  for (let i = 0; i < Math.min(doneCount, e.steps.length); i++) {
    const s = e.steps[i];
    const d = elHtml(`<details class="step-done">
      <summary><span class="n">✓</span><span class="ph">${esc(plainFrase(s.f))}</span>
        <span class="muted" style="font-size:10px;flex:none">step ${i + 1}</span></summary>
      <pre>${s.c ? hlInline(st.lines[i] || s.c) : '<span class="muted">— exploratory/reflection step —</span>'}</pre></details>`);
    wrap.appendChild(d);
  }
  if (st.done) {
    wrap.appendChild(finalCard(e));
    wrap.appendChild(runRow(e, true));
  } else if (doneCount < e.steps.length) {
    wrap.appendChild(stepCard(e, doneCount));
    wrap.appendChild(runRow(e, false));
    if (doneCount + 1 < e.steps.length)
      wrap.appendChild(elHtml(`<div class="upcoming"><span class="lock">🔒</span> ${e.steps.length - doneCount - 1} more steps await you: they unlock one at a time.</div>`));
  }
  requestAnimationFrame(() => {
    const c = box.querySelector('#stepCard') || box.querySelector('.ex-final');
    if (c) c.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  });
}

/* ============================================================
   ===== NEW v10 · CODE PANEL (editor + terminal) =====
   ------------------------------------------------------------
   Shows the FULL program that "▶ Run and check the output"
   sends to the runtime (code of the passed steps, with any
   prerequisite base; file by file in multi-file exercises) and
   makes it EDITABLE:
   · every edit saves a per-exercise override (st.customCode
     for single programs, st.customFiles[name] for multi-file)
     and from that moment the Run button — here and in the
     Exercise panel — runs the student's version: the same
     result can be obtained in a way different from the
     predetermined solution;
   · the area below the editor works as a terminal: prompt,
     output, traceback, blinking cursor (history shared with
     the Console, which remains the complete log);
   · "⟲ restore original" discards the edits and goes back to
     the program assembled from the passed steps.
   The override is armed ONLY if the typed content differs from
   the program of the steps: if the student touches nothing,
   the run always stays up to date with the last passed step.
   ============================================================ */
function codiceArmato(e, st) {
  if (typeof st.customCode === 'string') return true;
  return !!(st.customFiles && Object.keys(st.customFiles).length);
}
/* ===== NEW v11 · three MODES of the Code editor =====
   The panel ALWAYS shows the full program that "▶ Run and check
   the output" sends to the runtime — from the initial imports to
   the end:
   · 'step'  → the student's program, assembled from the lines of
               the passed steps (+ any prerequisite base), with the
               imported support modules alongside (e.g. printing_functions.py);
   · 'files' → the multi-file exercises declared in e.files (9-10, 9-11,
               9-12, 11-1, 11-3): YOUR files, one per tab;
   · 'sol'   → the exercises whose steps are FRAGMENTS of a larger
               program (Pygame games of ch. 12–14, class extensions,
               test programs): the full program is the solution's
               project in the local database and the editor shows it
               FILE BY FILE, editable from the imports to the end.
   How it's decided (modoCodice): the exercises whose target program
   (draft of the steps, prerequisites included) produces output ON
   ITS OWN are "step"; the others — fragments that can't run alone —
   are "sol". */
const OUT_RE = /\bprint\s*\(|\.show\s*\(|\binput\s*\(/;
/** Target program of the exercise: the `c` lines of ALL steps,
 *  with those of the prerequisites in front (e.g. 15-2 extends 15-1). */
function bozzaProgramma(e, seen) {
  seen = seen || new Set();
  if (seen.has(e.id)) return '';
  seen.add(e.id);
  const out = [];
  const pre = Array.isArray(e.prereq) ? e.prereq : (e.prereq ? [e.prereq] : []);
  pre.forEach(pid => { if (EX[pid]) out.push(bozzaProgramma(EX[pid], seen)); });
  out.push(e.steps.filter(s => s.c).map(s => s.c).join('\n'));
  return out.filter(Boolean).join('\n');
}
/** Is the exercise's solution a runnable project (mode run/pytest)? */
function solIdxOk(e) {
  const si = solDb.indexFor(e.id);
  return !!si && (si.mode === 'run' || si.mode === 'pytest') && !!si.entry;
}
/** The editor mode for the exercise (see the block above). */
function modoCodice(e, st) {
  if (Array.isArray(e.files) && e.files.length) return 'files';
  if (codiceArmato(e, st)) return st.customMode === 'sol' ? 'sol' : 'step';   // freeze: the override stays in the mode it was armed in
  if (st.studentOut === true) return 'step';   // learned in the field: the student's program produces output on its own
  if (!solIdxOk(e)) return 'step';
  const bozza = bozzaProgramma(e);
  const passato = codiceEsercizio(e, st, { progress: S.progress, includePrereq: st.prereq !== false });
  return (OUT_RE.test(bozza) || OUT_RE.test(passato)) ? 'step' : 'sol';
}
/** Support .py modules of the project (imported by the main program,
 *  e.g. printing_functions.py, settings.py…): they too are part of the
 *  executed program, so they are editable in the editor.
 *  NB: the solution's ENTRY (the exercise's key program, e.g.
 *  simple_message.py for 2-1) is NOT a support file and stays hidden in
 *  'step'/'files' modes: in those modes the main program is YOU. In
 *  'sol' mode (fragments of a larger project) instead the whole project —
 *  entry included — is shown, as requested. */
function fileSupporto(sol, exclude) {
  if (!sol) return [];
  return Object.keys(sol.files)
    .filter(n => n.endsWith('.py') && n !== 'main.py' && n !== sol.entry && !exclude.includes(n) && typeof sol.files[n] === 'string')
    .sort().map(n => ({ n, c: sol.files[n] }));
}
/** DATA files of the project (csv/json/txt/images): they are not code,
 *  they show up in the "other files" list (read-only). */
function dataAssets(sol, exclude) {
  if (!sol) return [];
  return Object.keys(sol.files)
    .filter(n => !n.endsWith('.py') && n !== 'main.py' && !exclude.includes(n))
    .sort().map(n => ({ n, b64: !!(sol.files[n] && typeof sol.files[n] === 'object' && typeof sol.files[n].b64 === 'string') }));
}
/** The FULL program that "▶ Run and check" sends to the runtime right now,
 *  in the editor's files (same source as eseguiEsercizio, so the
 *  editor really shows what runs — v11: including the whole project
 *  of fragment exercises). */
async function snapshotCodice(e) {
  const st = exState(e.id);
  const includePrereq = (st.prereq !== false);
  const sol = await solDb.getSolution(e.id).catch(() => null);
  const modo = modoCodice(e, st);
  if (modo === 'files') {
    const mf = codicePerFile(e, st, { progress: S.progress, includePrereq });
    const files = {};
    e.files.forEach(n => { files[n] = typeof mf.files[n] === 'string' ? mf.files[n] : ''; });
    const supporto = fileSupporto(sol, e.files.slice());
    const assets = dataAssets(sol, e.files.concat(supporto.map(x => x.n)));
    return { modo, files, mainName: mf.mainName || e.files[e.files.length - 1], supporto, assets };
  }
  if (modo === 'sol' && sol && typeof sol.files[sol.entry] === 'string') {
    const files = {};
    files[sol.entry] = String(sol.files[sol.entry]);      // the entry first (▶ executed)
    Object.keys(sol.files).sort().forEach(n => {
      if (n === sol.entry || n === 'main.py') return;
      if (typeof sol.files[n] === 'string') files[n] = String(sol.files[n]);
    });
    const assets = dataAssets(sol, Object.keys(files));
    return { modo, files, mainName: sol.entry, supporto: [], assets };
  }
  // 'step' (or 'sol' without an available project): program of the passed steps
  const code = codiceEsercizio(e, st, { progress: S.progress, includePrereq });
  const supporto = fileSupporto(sol, []);
  const assets = dataAssets(sol, supporto.map(x => x.n));
  return { modo: 'step', code, mainName: null, supporto, assets };
}
function apriCodice() {
  if (isMobile()) { dock.setMobileTab('codice'); dock.renderMobilePanel(); dock.renderMobileNav(); }
  else dock.activateOrInsert('codice');
}

/* ============================================================
   ===== NEW v12 · "LINES" PANEL (lightweight editor) =====
   ------------------------------------------------------------
   "✎ lines" opens the LIGHTWEIGHT editor: ONLY the exercise's
   lines, without the full code around them — but with the
   REFERENCE to the module (or project) that contains them:
   · 'step'  → the lines of the passed steps, WITHOUT the
               prerequisite base: the base is re-added on its
               own when ▶ run is pressed;
   · 'files' → the student's files, one per block;
   · 'sol'   → ONLY the lines of YOUR exercise (the ones of
               "Exercise completed": the saved lines of the
               steps or the trace), one block per step — NOT
               the full code. The project where they live is
               cited as a reference (file + lines) and the
               ⚙ BRIDGE (engine/ponte.js) tells how the lines
               correspond to the module: the values you change
               flow to the project, ▶ run runs with your
               lines (same override as ⌨ Code).
   The edits arm the SAME overrides as the ⌨ Code editor
   (st.customCode / st.customFiles): "▶ Run and check" — here,
   in the Exercise panel and in ⌨ Code — runs the modified
   version; "⟲ restore original" clears them.
   ============================================================ */
function apriRighe() {
  if (isMobile()) { dock.setMobileTab('righe'); dock.renderMobilePanel(); dock.renderMobileNav(); }
  else dock.activateOrInsert('righe');
}
function normLinea(l) { return String(l).replace(/\s+/g, ' ').trim(); }
/** Searches the normalized `block` inside the normalized `lines`:
 *  returns the index of the first line (or -1). With `hint`
 *  (expected position in the original) the closest match wins. */
function trovaBlocco(lines, block, hint) {
  const n = block.length;
  if (!n || lines.length < n) return -1;
  let best = -1, bestD = Infinity;
  for (let i = 0; i + n <= lines.length; i++) {
    let ok = true;
    for (let j = 0; j < n; j++) if (lines[i + j] !== block[j]) { ok = false; break; }
    if (!ok) continue;
    const d = hint >= 0 ? Math.abs(i - hint) : 0;
    if (d < bestD) { best = i; bestD = d; if (d === 0) break; }
  }
  return best;
}
/** Merges line indices into continuous ranges (gap ≤ `gap` lines). */
function mergiRun(idx, gap) {
  const runs = [];
  if (!idx.length) return runs;
  let a = idx[0], b = idx[0];
  for (let k = 1; k < idx.length; k++) {
    if (idx[k] - b - 1 <= gap) b = idx[k];
    else { runs.push([a, b]); a = b = idx[k]; }
  }
  runs.push([a, b]);
  return runs;
}
/** The prerequisite base of the exercise (without the lines of the exercise
 *  itself): same recipe as codiceEsercizio, prerequisites part. */
function basePrereq(e) {
  const out = [];
  const pre = Array.isArray(e.prereq) ? e.prereq : (e.prereq ? [e.prereq] : []);
  pre.forEach(pid => {
    const pex = EX[pid]; if (!pex) return;
    const pst = S.progress[pid] || { solved: 0, lines: {} };
    pex.steps.forEach((s, i) => {
      if (!s.c) return;
      out.push((pst.lines && pst.lines[i] && i < pst.solved) ? pst.lines[i] : s.c);
    });
  });
  return out.join('\n');
}
/** The lines of the exercise's passed steps (without prerequisites). */
function righePassi(e, st) {
  const out = [];
  e.steps.forEach((s, i) => { if (!s.c || i >= st.solved) return; out.push((st.lines && st.lines[i]) ? st.lines[i] : s.c); });
  return out.join('\n');
}
function contaCondivise(a, b) {
  const setB = new Set(String(b).split('\n').map(normLinea).filter(Boolean));
  return String(a).split('\n').filter(l => { const n = normLinea(l); return n && setB.has(n); }).length;
}
/* ---------- slice computation (exercise lines) ----------
   NB · no cache: the 'sol' slice depends on the saved lines of
   the steps (st.lines) and the 'step'/'files' slices follow the
   passed steps — the solDb.getSolution reads are memoized
   inside the local database anyway. ---------- */
async function calcolaSlice(e) {
  const st = exState(e.id);
  const modo = modoCodice(e, st);
  const p = (async () => {
    if (modo === 'files') {
      const mf = codicePerFile(e, st, { progress: S.progress, includePrereq: st.prereq !== false });
      const orig = {};
      e.files.forEach(n => { orig[n] = typeof mf.files[n] === 'string' ? mf.files[n] : ''; });
      const main = mf.mainName || e.files[e.files.length - 1];
      return { modo, entry: main, main, files: e.files.slice(), orig, nuovi: e.files.slice() };
    }
    if (modo === 'sol') {
      const sol = await solDb.getSolution(e.id).catch(() => null);
      if (!sol || !sol.entry || (sol.mode !== 'run' && sol.mode !== 'pytest') || typeof sol.files[sol.entry] !== 'string')
        return { modo: 'sol-mancante' };
      /* the exercise's OWN files (without the chapter's support files):
         these are the lines this exercise writes/modifies */
      const raw = await solDb.getSolutionRaw(e.id).catch(() => null);
      const nomi = (raw && raw.files && Object.keys(raw.files).length ? Object.keys(raw.files) : Object.keys(sol.files))
        .filter(n => n.endsWith('.py') && n !== 'main.py');
      /* --- chain predecessor: same entry, before us in the book
             order, the one sharing the most lines of the entry --- */
      const myPos = ORDER.indexOf(e.id);
      let prev = null;
      if (myPos > 0) {
        for (const id of solDb.indexIds()) {
          if (id === e.id) continue;
          const si = solDb.indexFor(id);
          if (!si || si.entry !== sol.entry || (si.mode !== 'run' && si.mode !== 'pytest')) continue;
          const pos = ORDER.indexOf(id);
          if (pos < 0 || pos >= myPos) continue;
          const s2 = await solDb.getSolution(id).catch(() => null);
          if (!s2 || typeof s2.files[sol.entry] !== 'string') continue;
          const cond = contaCondivise(sol.files[sol.entry], s2.files[sol.entry]);
          if (!prev || cond > prev.cond) prev = { id, cond, sol: s2, t: EX[id] ? EX[id].t : id };
        }
      }
      /* --- (a) changed lines of the OWN files compared to the predecessor --- */
      const regioni = {};   // file -> [{from, to, orig}]
      const addReg = (fn, from, to, text) => { (regioni[fn] = regioni[fn] || []).push({ file: fn, from, to, orig: text }); };
      if (prev) {
        for (const fn of nomi) {
          const cur = sol.files[fn];
          if (typeof cur !== 'string') continue;
          const lines = cur.split('\n');
          if (typeof prev.sol.files[fn] !== 'string') { addReg(fn, 1, lines.length, cur); continue; }   // new file
          const prevSet = new Set(prev.sol.files[fn].split('\n').map(normLinea).filter(Boolean));
          const cambiati = [];
          lines.forEach((l, i) => { const nl = normLinea(l); if (nl && !prevSet.has(nl)) cambiati.push(i); });
          if (!cambiati.length) continue;
          /* regions with a growing gap while there are too many (≤ 6 per file);
             if that's not enough, the whole file: the exercise rewrote it */
          let runs = mergiRun(cambiati, 4);
          for (const gap of [10, 20, 40]) { if (runs.length <= 6) break; runs = mergiRun(cambiati, gap); }
          const tot = lines.filter(l => normLinea(l)).length;
          const coperte = runs.reduce((a, [x, y]) => a + (y - x + 1), 0);
          if (runs.length > 6 || coperte >= tot * 0.85) runs = [[0, lines.length - 1]];
          runs.forEach(([a, b]) => addReg(fn, a + 1, b + 1, lines.slice(a, b + 1).join('\n')));
        }
      }
      const nRegioni = () => Object.values(regioni).reduce((a, r) => a + r.length, 0);
      /* --- (b) without predecessor (or no difference): OWN files never seen
             in any previous solution + step fragments searched verbatim in
             the project files (chapter modules too) --- */
      if (!prev || !nRegioni()) {
        const visti = new Set();
        for (const id of solDb.indexIds()) {
          if (ORDER.indexOf(id) >= 0 && ORDER.indexOf(id) >= myPos) continue;
          const s2 = await solDb.getSolution(id).catch(() => null);
          if (s2) Object.keys(s2.files).forEach(n => visti.add(n));
        }
        for (const fn of nomi) {
          if (visti.has(fn) || typeof sol.files[fn] !== 'string') continue;
          const lines = String(sol.files[fn]).split('\n');
          addReg(fn, 1, lines.length, String(sol.files[fn]));   // new module: it all belongs to the exercise
        }
        /* step fragments (the `c` block verbatim) in the files still without regions */
        for (const s of e.steps) {
          if (!s.c) continue;
          const rawBlk = s.c.replace(/\t/g, '    ').split('\n');
          let a = 0, b = rawBlk.length - 1;
          while (a <= b && !normLinea(rawBlk[a])) a++;
          while (b >= a && !normLinea(rawBlk[b])) b--;
          if (a > b) continue;
          const block = rawBlk.slice(a, b + 1).map(normLinea);
          for (const fn of Object.keys(sol.files).sort()) {
            if (!fn.endsWith('.py') || fn === 'main.py' || regioni[fn]) continue;
            if (typeof sol.files[fn] !== 'string') continue;
            const lines = String(sol.files[fn]).split('\n');
            const pos = trovaBlocco(lines.map(normLinea), block, -1);
            if (pos >= 0) { addReg(fn, pos + 1, pos + block.length, lines.slice(pos, pos + block.length).join('\n')); break; }
          }
        }
        /* --- last resort: no region found → the exercise IS its
               program (the entry file in full) --- */
        if (!nRegioni()) {
          const cur = String(sol.files[sol.entry]);
          addReg(sol.entry, 1, cur.split('\n').length, cur);
        }
      }
      const supporti = Object.keys(sol.files).filter(n => n.endsWith('.py') && n !== 'main.py' && !regioni[n]).sort();
      /* ===== v12.1 · the exercise's lines: ONE BLOCK PER STEP, exactly
         like in "Exercise completed" (the student's saved lines or the
         step's trace) — NOT the project's code ===== */
      const passi = [];
      e.steps.forEach((s, i) => {
        if (!s.c) return;
        passi.push({ passo: i, originale: s.c, attuale: (st.lines && st.lines[i]) ? st.lines[i] : s.c });
      });
      return { modo, entry: sol.entry, main: sol.entry, passi, regioni, supporti,
        prev: prev ? { id: prev.id, t: prev.t } : null,
        nPy: Object.keys(sol.files).filter(n => n.endsWith('.py')).length, orig: sol.files,
        regole: Array.isArray(PONTE[e.id]) ? PONTE[e.id] : [] };
    }
    /* --- 'step' --- */
    const sol = await solDb.getSolution(e.id).catch(() => null);
    const base = basePrereq(e);
    const righe = righePassi(e, st);
    const supporto = sol ? fileSupporto(sol, []).map(x => x.n) : [];
    return { modo: 'step', base, righe, supporto, main: fileSafe(e.id) + '.py' };
  })();
  return p;
}
/** ===== v12.1 · BRIDGE: carries the edits to the exercise's lines
 *  inside the full project. `passi` = [{passo, originale}] from the
 *  slice, `testi` = the current text of every step (from the ✎ editors,
 *  in the same order), `origFiles` = the project's ORIGINAL files
 *  (we always restart from those: every edit is stable and repeatable).
 *  Returns { files, applicate, nonPassate, struttura }:
 *  · files       → only the files to replace, already patched;
 *  · applicate   → [{regola, riga?, da?, a?}] what came through;
 *  · nonPassate  → [{regola, perche}] rules with an unfindable target;
 *  · struttura  → true if an edited step has a number of lines
 *                  different from the original (slot/scale rules are skipped).
 *  Rules: slot (value → value), scale (value = factor: the value
 *  in the project becomes original × factor, e.g. 14-3 speed_scale = 10
 *  → the starting speeds ×10), block, program. ===== */
function applicaPonte(e, passi, testi, origFiles) {
  const regole = Array.isArray(PONTE[e.id]) ? PONTE[e.id] : [];
  const out = { files: {}, applicate: [], nonPassate: [], struttura: false };
  const baseDi = fn => out.files[fn] != null ? out.files[fn]
    : String(origFiles[fn] != null ? origFiles[fn] : '');
  const righeDi = k => ({   // original and current lines of step k
    orig: String(passi[k].originale).split('\n'),
    cur: String(testi[k]).replace(/\r/g, '').split('\n')
  });
  for (const reg of regole) {
    if (reg.tipo === 'programma') {
      const mio = testi.map(t => String(t).replace(/\r/g, '')).join('\n');
      const traccia = passi.map(p => String(p.originale)).join('\n');
      if (mio === traccia) continue;   // unchanged: nothing to pass through
      out.files[reg.file] = mio;
      out.applicate.push({ reg });
      continue;
    }
    if (reg.tipo === 'blocco') {
      const k = passi.findIndex(p => p.passo === reg.passo);
      if (k < 0) continue;
      const { orig, cur } = righeDi(k);
      if (orig.join('\n') === cur.join('\n')) continue;   // unchanged
      const base = baseDi(reg.file);
      const m = new RegExp(reg.cerca).exec(base);
      if (!m) { out.nonPassate.push({ reg, perche: 'block not found in ' + reg.file + ' (modified in ⌨?)' }); continue; }
      out.files[reg.file] = base.slice(0, m.index) + rientraBlocco(cur.join('\n'), reg.rientro || 0) + base.slice(m.index + m[0].length);
      out.applicate.push({ reg });
      continue;
    }
    /* scale: like slot, but the trace value is a FACTOR — the value
       in the project becomes original × factor (e.g. 14-3: speed_scale = 10
       multiplies the starting speeds). If the line appears more than once
       (start and reset), the first occurrence whose value changed leads */
    if (reg.tipo === 'scala') {
      const righe = Array.isArray(reg.riga) ? reg.riga : [reg.riga];
      for (const riga of righe) {
        for (let k = 0; k < passi.length; k++) {
          const { orig, cur } = righeDi(k);
          if (cur.length !== orig.length) { out.struttura = true; continue; }   // lines added/removed
          let j = -1, mo = null, mu = null;
          for (let x = 0; x < orig.length; x++) {
            if (normLinea(orig[x]) !== normLinea(riga)) continue;
            const o = new RegExp(reg.da).exec(orig[x]);
            const u = new RegExp(reg.da).exec(cur[x]);
            if (!o || o[1] == null || !u || u[1] == null) continue;
            if (o[1] !== u[1]) { j = x; mo = o; mu = u; break; }   // first changed occurrence
          }
          if (j < 0) continue;   // no occurrence with a different value
          const fattore = parseFloat(mu[1]);
          if (!isFinite(fattore)) continue;
          const base = baseDi(reg.file);
          const ms = new RegExp(reg.slot, 'd').exec(base);
          if (!ms || !ms.indices || !ms.indices[1]) { out.nonPassate.push({ reg, perche: 'value not found in ' + reg.file + ' (modified in ⌨?)' }); continue; }
          const baseVal = parseFloat(ms[1]);
          if (!isFinite(baseVal)) continue;
          const nuovo = Math.round(baseVal * fattore * 100) / 100;
          const [da, a] = ms.indices[1];
          out.files[reg.file] = base.slice(0, da) + nuovo + base.slice(a);
          out.applicate.push({ reg, riga: String(orig[j]).trim(), da: '×' + mu[1], a: String(nuovo) });
        }
      }
      continue;
    }
    /* slot: the trace line (normalized comparison, indentation
       doesn't count) → the value captured by `da` replaces the group
       captured by `slot` in the project file */
    const righe = Array.isArray(reg.riga) ? reg.riga : [reg.riga];
    for (const riga of righe) {
      for (let k = 0; k < passi.length; k++) {
        const { orig, cur } = righeDi(k);
        const j = orig.findIndex(l => normLinea(l) === normLinea(riga));
        if (j < 0) continue;
        if (cur.length !== orig.length) { out.struttura = true; continue; }   // lines added/removed: indices unreliable
        const mo = new RegExp(reg.da).exec(orig[j]);
        const mu = new RegExp(reg.da).exec(cur[j]);
        if (!mo || mo[1] == null || !mu || mu[1] == null) continue;
        if (mo[1] === mu[1]) continue;   // value unchanged
        const base = baseDi(reg.file);
        const ms = new RegExp(reg.slot, 'd').exec(base);
        if (!ms || !ms.indices || !ms.indices[1]) { out.nonPassate.push({ reg, perche: 'valore non trovato in ' + reg.file + ' (modificato in ⌨?)' }); continue; }
        const [da, a] = ms.indices[1];
        out.files[reg.file] = base.slice(0, da) + mu[1] + base.slice(a);
        out.applicate.push({ reg, riga: String(orig[j]).trim(), da: mo[1], a: mu[1] });
      }
    }
  }
  return out;
}
/** Indents a block by `n` spaces (the step traces are at column 0,
 *  in the project the methods live inside classes). */
function rientraBlocco(testo, n) {
  if (!n) return testo;
  return String(testo).split('\n').map(l => l.trim() ? ' '.repeat(n) + l : l).join('\n');
}
/** ===== render of the Lines panel (lightweight editor) ===== */
function renderRighe(box) {
  box.innerHTML = '';
  const e = EX[S.current] || EX[ORDER[0]];
  if (e.noRun) {
    box.appendChild(elHtml(`<div class="dk-empty"><span class="big">🖥</span>
      <span><b>${esc(e.id)}</b> consists of shell commands or project files: this exercise has no Python program runnable in the browser.</span></div>`));
    return;
  }
  const st = exState(e.id);
  if (!S.codiceFile) S.codiceFile = {};
  const wrap = elHtml(`<div class="righe-wrap"></div>`);
  wrap.appendChild(elHtml(`<div>
    <h2 class="pan-title">${icon('rows')} Exercise lines · ${esc(e.id)} ${esc(e.t)}</h2>
    <p class="pan-sub righe-sub" style="margin-bottom:8px">Here you edit <b>only the lines of this exercise</b>, without the full code around them. Each block tells you <b>which module contains it</b> (file and lines): "▶ run" sends the full program to the runtime <b>with your edits</b>.</p>
    <div class="codice-headrow">
      <span class="chip ok" id="righeBadge"></span>
      <button class="btn tiny" id="rgOpen" title="Open the ⌨ full Code editor: the whole program that 'run' sends to the runtime">⌨ full module</button>
    </div>
  </div>`));
  const loading = elHtml(`<div class="codice-loading">… preparing the exercise lines (local database)…</div>`);
  wrap.appendChild(loading);
  box.appendChild(wrap);
  const myId = e.id;
  (async () => {
    const slice = await calcolaSlice(e);
    if (S.current !== myId || !wrap.isConnected) return;   // cancelled
    loading.remove();
    if (slice.modo === 'sol-mancante') {
      wrap.querySelector('.righe-sub').innerHTML = 'The full project of this exercise is not available in the local database: use the <b>⌨ full Code</b> editor.';
      wrap.appendChild(elHtml(`<div class="dk-empty"><span class="big">📦</span><span>Project not available.</span></div>`));
      return;
    }
    /* --- context note per mode --- */
    const sub = wrap.querySelector('.righe-sub');
    const rgOpen = wrap.querySelector('#rgOpen');
    const apriModulo = (fn) => { S.codiceFile[e.id] = fn; apriCodice(); };
    if (slice.modo === 'sol') {
      const fileReg = Object.keys(slice.regioni);
      const rif = fileReg.slice(0, 5).map(fn => {
        const tot = String(slice.orig[fn]).split('\n').length;
        const rr = slice.regioni[fn];
        const intero = rr.some(r => r.from === 1 && r.to === tot);
        const dove = intero ? `new file of the exercise · ${tot} lines` : rr.map(r => r.from === r.to ? 'line ' + r.from : 'lines ' + r.from + '–' + r.to).join(' · ') + ' of ' + tot;
        return `<button class="btn-cl rg-rif" data-open="${esc(fn)}" title="Open ${esc(fn)} in ⌨ Code (the full module containing the exercise)">📄 ${esc(fn)} <span class="rg-of">${dove}</span></button>`;
      }).join(' ') + (fileReg.length > 5 ? ` <span class="rg-of">+ ${fileReg.length - 5} more modules</span>` : '');
      sub.innerHTML = `The steps of this exercise are <b>fragments of a larger project</b>: below are <b>only the lines of your exercise</b> — the ones of "Exercise completed", nothing else. The project implements them in: ${rif}. With the <b>⚙ bridge</b> (below the lines) your edits flow to the module: "▶ run" runs the program <b>with your lines</b>. The whole project (${slice.nPy} files · ▶ <code>${esc(slice.entry)}</code>) lives in ⌨ Code.` +
        (slice.prev ? ` <span class="muted">Extends ${esc(slice.prev.id)} "${esc(slice.prev.t)}".</span>` : '');
      sub.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => apriModulo(b.dataset.open)));
    } else if (slice.modo === 'files') {
      sub.innerHTML = `<b>Multi-file</b> exercise: below are <b>your files</b>, one per block, without the support modules around them. "▶ run" launches <b>▶ ${esc(slice.main)}</b> with the latest content of every block.`;
    } else {
      const nBase = slice.base ? slice.base.split('\n').filter(l => l.trim()).length : 0;
      const nRighe = slice.righe ? slice.righe.split('\n').filter(l => l.trim()).length : 0;
      sub.innerHTML = `Below are <b>only the exercise lines</b> (the passed steps: ${nRighe} lines)${nBase ? `, without the <b>prerequisite base</b> (${nBase} lines, hidden: it is re-added on its own when you press ▶ run)` : ''}${slice.supporto.length ? ` and without the <b>support modules</b> (${slice.supporto.length}: ${esc(slice.supporto.join(', '))})` : ''}. The full program that "▶ run" sends to the runtime is in ⌨ Code.`;
    }
    rgOpen.addEventListener('click', () => apriModulo(slice.main));
    /* --- blocks (step by step in 'sol' · file per files · lines per step) --- */
    const blocchi = elHtml(`<div class="righe-blocchi"></div>`);
    wrap.appendChild(blocchi);
    const tas = [];          // [{ ta, reg }] · reg = block data (step for 'sol')
    let aggiornaPonte = null;   // ===== v12.1 · live update of the bridge (mode 'sol') =====
    const mkBloco = (head, ta, fn, reg) => {
      const b = elHtml(`<div class="righe-blocco"></div>`);
      b.appendChild(head);
      b.appendChild(ta);
      tas.push({ fn, ta, reg });
      return b;
    };
    if (slice.modo === 'sol') {
      /* ===== v12.1 · one block PER STEP of the exercise: the lines of
         "Exercise completed" (saved or trace), NOT the project's
         code — which stays cited as a reference ===== */
      const salvate = st.customRighe || {};
      slice.passi.forEach((p, k) => {
        const val = typeof salvate[p.passo] === 'string' ? salvate[p.passo] : p.attuale;
        const n = val.split('\n').length;
        const head = elHtml(`<div class="rg-head">
          <span class="rg-file">✎ ${slice.passi.length > 1 ? 'step ' + (k + 1) + ' of ' + slice.passi.length : 'exercise lines'}</span>
          <span class="rg-range">${n} line${n === 1 ? '' : 's'} · as in "Exercise completed"</span>
        </div>`);
        const ta = document.createElement('textarea');
        ta.className = 'codice-ta rg-ta'; ta.spellcheck = false; ta.autocapitalize = 'off'; ta.autocomplete = 'off';
        ta.rows = Math.min(22, Math.max(3, n + 1));
        ta.value = val;
        ta.placeholder = 'your exercise lines…';
        const blocco = mkBloco(head, ta, null, { passo: p.passo });
        if (k > 0) blocco.classList.add('extra');
        blocchi.appendChild(blocco);
      });
      /* ===== ⚙ BRIDGE · the mappings between your lines and the project,
         updated live while you edit ===== */
      const baseAttuale = fn => (st.customFiles && typeof st.customFiles[fn] === 'string') ? st.customFiles[fn] : String(slice.orig[fn] != null ? slice.orig[fn] : '');
      const rigaDelSlot = (reg, base) => {
        const m = new RegExp(reg.slot).exec(String(base ?? ''));
        if (!m) return null;
        const s = m.index, fine = s + m[0].length;
        const a = String(base).lastIndexOf('\n', s - 1) + 1;
        let b = String(base).indexOf('\n', fine); if (b < 0) b = String(base).length;
        return String(base).slice(a, b).replace(/^\s+/, '');
      };
      const ponteBox = elHtml(`<div class="rg-ponte"></div>`);
      aggiornaPonte = (esiti) => {
        if (!slice.regole.length) {
          ponteBox.innerHTML = `<div class="rg-ponte-t">⚙ bridge to the project</div>
            <div class="rg-ponte-r muted">This trace is conceptual: the project implements it in its own way (see the modules cited above) and no line flows through on its own. To change the effect, open the module in ⌨ Code and edit the project's lines.</div>`;
          return;
        }
        const rigaDi = (reg) => {
          const base = esiti && esiti.files[reg.file] != null ? esiti.files[reg.file] : baseAttuale(reg.file);
          if (reg.tipo === 'slot' || reg.tipo === 'scala') {
            const riga = rigaDelSlot(reg, base);
            return riga ? `<code>${esc(riga)}</code>` : '<i>value not found</i>';
          }
          if (reg.tipo === 'programma') return 'your program replaces the whole file';
          const m = new RegExp(reg.cerca).exec(String(base ?? ''));
          if (!m) return '<i>block not found</i>';
          const prima = String(base).slice(m.index, String(base).indexOf('\n', m.index));
          return `replaces: <code>${esc(prima.replace(/^\s+/, ''))}…</code>`;
        };
        const statoDi = (reg) => {
          if (!esiti) return '';
          const a = esiti.applicate.filter(x => x.reg === reg)[0];
          if (a) return a.da != null ? `<span class="rg-ponte-ok">✓ ${esc(a.da)} → ${esc(a.a)}</span>` : '<span class="rg-ponte-ok">✓ passed</span>';
          const np = esiti.nonPassate.filter(x => x.reg === reg)[0];
          if (np) return `<span class="rg-ponte-warn">⚠ ${esc(np.perche)}</span>`;
          return '';
        };
        ponteBox.innerHTML = `<div class="rg-ponte-t">⚙ bridge to the project — what maps to what${esiti && esiti.struttura ? ' <span class="rg-ponte-warn">⚠ you changed the number of lines of a step: single values don\'t flow through</span>' : ''}</div>` +
          slice.regole.map(reg => {
            const sorgente = (reg.tipo === 'slot' || reg.tipo === 'scala')
              ? `"${esc((Array.isArray(reg.riga) ? reg.riga[0] : reg.riga))}"`
              : (reg.tipo === 'programma' ? 'all steps' : `step ${reg.passo + 1}`);
            return `<div class="rg-ponte-r"><span class="rg-ponte-da">${sorgente}</span> →
              <button class="btn-cl" data-open="${esc(reg.file)}" title="Open ${esc(reg.file)} in ⌨ Code">📄 ${esc(reg.file)}</button>
              ${rigaDi(reg)} ${statoDi(reg)}${reg.nota ? ` <span class="rg-of">· ${esc(reg.nota)}</span>` : ''}</div>`;
          }).join('');
        ponteBox.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => apriModulo(b.dataset.open)));
      };
      aggiornaPonte(null);
      blocchi.appendChild(ponteBox);
    } else if (slice.modo === 'files') {
      for (const fn of slice.files) {
        const main = fn === slice.main;
        const orig = slice.orig[fn] || '';
        const cur = (st.customFiles && typeof st.customFiles[fn] === 'string') ? st.customFiles[fn] : orig;
        const head = elHtml(`<div class="rg-head">
          <span class="rg-file">📄 ${esc(fn)}</span>
          <span class="rg-range">${main ? '▶ file executed' : 'exercise module'}</span>
          <button class="btn-cl" data-open="${esc(fn)}" title="Open the file in ⌨ Code (with the support modules)">⌨ open module</button>
        </div>`);
        const ta = document.createElement('textarea');
        ta.className = 'codice-ta rg-ta'; ta.spellcheck = false; ta.autocapitalize = 'off'; ta.autocomplete = 'off';
        ta.rows = Math.min(22, Math.max(3, (cur || orig).split('\n').length + 1));
        ta.value = cur;
        ta.placeholder = `content of ${fn}…`;
        head.querySelector('[data-open]').addEventListener('click', () => apriModulo(fn));
        blocchi.appendChild(mkBloco(head, ta, fn, { orig }));
      }
    } else {
      /* 'step': a single block — the lines of the steps (without prerequisite base) */
      const base = slice.base || '';
      const righe = slice.righe || '';
      const custom = typeof st.customCode === 'string' ? st.customCode : null;
      let divergente = false, val;
      if (custom !== null) {
        if (base && custom.startsWith(base + '\n')) val = custom.slice(base.length + 1);
        else if (!base) val = custom;
        else { val = custom; divergente = true; }   // the ⌨ program no longer follows the base: it is edited in full
      } else val = righe;
      const nBase = base ? base.split('\n').filter(l => l.trim()).length : 0;
      const head = elHtml(`<div class="rg-head">
        <span class="rg-file">📄 ${esc(slice.main)}</span>
        <span class="rg-range">exercise lines${nBase ? ` + ${nBase} of prerequisite base (hidden)` : ''}</span>
        <button class="btn-cl" data-open="${esc(slice.main)}" title="Open the full program in ⌨ Code">⌨ open module</button>
      </div>`);
      const ta = document.createElement('textarea');
      ta.className = 'codice-ta rg-ta'; ta.spellcheck = false; ta.autocapitalize = 'off'; ta.autocomplete = 'off';
      ta.rows = Math.max(5, Math.min(22, (val || righe).split('\n').length + 2));
      ta.value = val;
      ta.placeholder = 'Pass the first step in the Exercise panel, or write the lines of your program here directly…';
      head.querySelector('[data-open]').addEventListener('click', () => apriModulo(slice.main));
      const blocco = mkBloco(head, ta, null, { orig: righe, divergente, base });
      if (divergente) blocco.classList.add('extra');
      blocchi.appendChild(blocco);
    }
    /* --- actions + terminal --- */
    const acts = elHtml(`<div class="ex-actions" style="margin-top:0">
      <button class="btn primary" id="rgRun">▶ run</button>
      <button class="btn" id="rgReset" title="Discard the edits: go back to the exercise's original lines (they apply to the ⌨ Code editor too)">⟲ restore original</button>
      <span class="rt-note" id="rgStatus">Ctrl+Enter to run · edits are saved with your progress</span>
    </div>`);
    wrap.appendChild(acts);
    const out = elHtml(`<div class="console-out codice-out" id="codiceOut"></div>`);
    wrap.appendChild(out);
    /* --- input → arms/disarms the overrides (the same ones as ⌨ Code) --- */
    const aggiornaStato = (avviso) => {
      document.querySelectorAll('#rgStatus').forEach(el => {
        el.textContent = 'Ctrl+Enter to run · ' +
          (codiceArmato(e, st) ? 'edits saved ✓' : 'no edits: runs the original program') +
          (avviso ? ' · ' + avviso : '');
      });
      aggiornaBadgeCodice(e);
    };
    tas.forEach(({ fn, ta, reg }) => {
      ta.addEventListener('input', () => {
        if (slice.modo === 'sol') {
          /* ===== sol: the edited lines flow to the project through the BRIDGE
             (the bridge files are always regenerated from the ORIGINAL
             project: every edit is stable, even after multiple passes) ===== */
          const esiti = applicaPonte(e, slice.passi, tas.map(t => t.ta.value), slice.orig);
          /* remembers the edited lines: the editor reopens as you left it */
          if (!st.customRighe) st.customRighe = {};
          for (let k = 0; k < tas.length; k++) {
            const p = slice.passi[k];
            if (tas[k].ta.value === p.attuale) delete st.customRighe[p.passo];
            else st.customRighe[p.passo] = tas[k].ta.value;
          }
          if (!Object.keys(st.customRighe).length) delete st.customRighe;
          /* file overrides (the same ones as ⌨ Code) */
          if (!st.customFiles) st.customFiles = {};
          for (const regola of slice.regole) {
            const patch = esiti.files[regola.file];
            if (typeof patch === 'string' && patch !== String(slice.orig[regola.file])) st.customFiles[regola.file] = patch;
            else delete st.customFiles[regola.file];
          }
          if (!Object.keys(st.customFiles).length) delete st.customFiles;
          if (st.customFiles) st.customMode = 'sol';
          /* status note: what flows through and what doesn't */
          const cambiati = slice.passi.filter((p, k) => tas[k].ta.value !== p.attuale).length;
          const note = [];
          if (esiti.applicate.length) note.push(esiti.applicate.map(a => a.a != null ? esc(a.riga) + ': ' + esc(a.da) + ' → ' + esc(a.a) : esc(a.reg.tipo === 'programma' ? 'program → ' + a.reg.file : 'step → ' + a.reg.file)).join(' · '));
          if (esiti.struttura) note.push('⚠ number of lines changed: single values don\'t flow through');
          if (esiti.nonPassate.length) note.push('⚠ ' + esiti.nonPassate.length + ' target(s) not found in the project (modified in ⌨?)');
          if (cambiati && !esiti.applicate.length && !slice.regole.length) note.push('conceptual trace: to change the output, edit the module in ⌨ Code');
          if (cambiati && !esiti.applicate.length && slice.regole.length && !esiti.struttura && !esiti.nonPassate.length) note.push('the edited lines have no values in the ⚙ bridge');
          aggiornaStato(note.join(' · ') || null);
          if (aggiornaPonte) aggiornaPonte(esiti);
          saveProgressDebounced();
          return;
        }
        if (fn === null) {
          /* step: customCode = base + edited lines */
          if (reg.divergente) {
            const assemblato = codiceEsercizio(e, st, { progress: S.progress, includePrereq: st.prereq !== false });
            if (ta.value === assemblato) delete st.customCode;
            else { st.customCode = ta.value; st.customMode = 'step'; }
          } else {
            if (ta.value === reg.orig) delete st.customCode;
            else { st.customCode = reg.base ? reg.base + '\n' + ta.value : ta.value; st.customMode = 'step'; }
          }
        } else {
          /* files: customFiles[fn] = edited content */
          if (!st.customFiles) st.customFiles = {};
          if (ta.value === reg.orig) delete st.customFiles[fn];
          else { st.customFiles[fn] = ta.value; st.customMode = 'files'; }
          if (st.customFiles && !Object.keys(st.customFiles).length) delete st.customFiles;
        }
        saveProgressDebounced();
        aggiornaStato();
      });
      ta.addEventListener('keydown', ev => {
        if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); avvia(); }
      });
    });
    async function avvia() {
      saveProgressNow();
      await eseguiEsercizio(e);   // runs the editor's version (modified or original)
    }
    acts.querySelector('#rgRun').addEventListener('click', avvia);
    acts.querySelector('#rgReset').addEventListener('click', async () => {
      if (!codiceArmato(e, st) && !st.customRighe) { toast('No edits to discard: the lines are already the original ones.', ''); return; }
      const ok = await modal('<h3>⟲ Restore the original lines?</h3><p>The edits to the exercise lines — and to the values passed to the project via the ⚙ bridge — will be discarded: they apply to both ✎ Lines and ⌨ Code, and "Run and check" will go back to using the original program (the passed steps, or the full project from the local database).</p>', 'Restore');
      if (!ok) return;
      delete st.customCode; delete st.customFiles; delete st.customMode; delete st.customRighe;
      saveProgress();
      toast('⟲ Original lines restored.', 'ok');
      dock.refreshPanels(['righe', 'codice', 'esercizio']);
    });
    requestAnimationFrame(() => { aggiornaBadgeCodice(e); out.scrollTop = out.scrollHeight; });
    renderCodiceOut(out, e);
  })();
}
/** Live-updates the "modified version" markers: the editor badge,
 *  the note next to "Run and check", the ⌨ button label, the dot on
 *  the file tabs. No re-render: typing doesn't lose focus.
 *  FIX v10 · on mobile the panel exists in TWO copies (hidden desktop
 *  dock + mobile view): getElementById always grabs the first one, so
 *  ALL instances are updated with querySelectorAll. */
function aggiornaBadgeCodice(e) {
  e = e || (EX[S.current] || EX[ORDER[0]]);
  const st = exState(e.id);
  const armato = codiceArmato(e, st);
  const modo = modoCodice(e, st);
  document.querySelectorAll('#codiceBadge').forEach(badge => {
    badge.className = 'chip ' + (armato ? 'warn' : 'ok');
    badge.textContent = armato
      ? '⚠ modified — "Run and check" uses THIS version'
      : (modo === 'sol'
        ? '📚 the project\'s full program — edit it here, from the imports to the end'
        : (modo === 'files'
          ? '⚡ your exercise files — one per tab'
          : '⚡ program assembled from the passed steps'));
  });
  document.querySelectorAll('#cdReset').forEach(btn => btn.classList.toggle('armed', armato));
  /* ===== NEW v12 · also the elements of the "Lines" panel ===== */
  document.querySelectorAll('#rgReset').forEach(btn => btn.classList.toggle('armed', armato));
  document.querySelectorAll('#righeBadge').forEach(badge => {
    badge.className = 'chip ' + (armato ? 'warn' : 'ok');
    badge.textContent = armato
      ? '⚠ modified — "Run and check" uses THIS version'
      : (modo === 'sol'
        ? '✎ only the lines of your exercise ("Exercise completed") — the values you change flow to the project via the ⚙ bridge'
        : (modo === 'files'
          ? '✎ only your exercise files — without the support modules'
          : '✎ only the lines of the passed steps — the prerequisite base is added by ▶ run'));
  });
  document.querySelectorAll('#btnRigheOpen').forEach(b => { b.textContent = '✎ lines' + (armato ? ' ⚠' : ''); });
  document.querySelectorAll('#runNote').forEach(note => {
    note.innerHTML = armato
      ? '⚠ will run the <b>modified version</b> in the ✎ Lines or ⌨ Code editor'
      : (modo === 'sol'
        ? 'real Python runtime (Pyodide) · runs the project\'s <b>full program</b> (file by file in the ⌨ editor)'
        : 'real Python runtime (Pyodide) · support files and solution output from the local database');
  });
  document.querySelectorAll('#btnCodiceOpen').forEach(openBtn => {
    openBtn.textContent = '⌨ code' + (armato ? ' ⚠' : '');
  });
  document.querySelectorAll('.codice-tabs [data-file]').forEach(b => {
    const n = b.dataset.file;
    b.classList.toggle('mod', !!(st.customFiles && typeof st.customFiles[n] === 'string'));
  });
}
/** Block of ONE run (shared by the Console and the editor's terminal):
 *  identical markup for the two panels; ⌨ marker for modified versions. */
function runBlockEl(r, e) {
  const b = elHtml(`<div class="run-block${r.sol ? ' sol' : ''}"></div>`);
  if (r.sol) {
    // ===== block of the official solution (double run) =====
    b.appendChild(elHtml(`<span class="run-cmd sol">📚 official solution · ${esc(solDb.indexFor(e.id) ? (solDb.indexFor(e.id).entry || 'local database') : 'local database')}</span>`));
    b.appendChild(elHtml(`<span class="run-meta">${esc(r.t)} · ${r.dur} ms · ${r.game ? '🎮 game run' : 'solution output'}</span>`));
    if (r.out) b.appendChild(elHtml(`<div class="run-out">${esc(r.out)}</div>`));
    if (r.game) b.appendChild(elHtml(`<span class="run-hint">🎮 The game (full solution) has been run in the Game panel: it's interactive — click the canvas and play.</span>`));
    if (r.err) {
      b.appendChild(elHtml(`<div class="run-err">${esc(r.err.tipo)}: ${esc(r.err.messaggio || '')}</div>`));
      if (r.err.hint) b.appendChild(elHtml(`<span class="run-hint">${esc(r.err.hint)}</span>`));
    }
  } else {
    b.appendChild(elHtml(`<span class="run-cmd">student@tutor:~$ python ${esc(r.entry || fileSafe(e.id) + '.py')}</span>`));
    b.appendChild(elHtml(`<span class="run-meta">${esc(r.t)} · ${r.dur} ms · ${r.game ? '🎮 game run' : (r.err ? 'exit with error' : 'clean exit')}${r.proj ? ' · full program (' + r.proj + ' files)' : ''}${r.custom ? ' · ⌨ modified version' : ''}</span>`));
    if (r.out) b.appendChild(elHtml(`<div class="run-out">${esc(r.out)}</div>`));
    if (!r.out && !r.err && !r.game) b.appendChild(elHtml(`<div class="run-out muted" style="opacity:.55">(no output: so far your code only defines names)</div>`));
    if (r.game) b.appendChild(elHtml(`<span class="run-hint">🎮 Game run in the Game panel: click the canvas to play (arrows/space/q) and "■ Stop" to close it.</span>`));
    if (r.err) {
      b.appendChild(elHtml(`<div class="run-err">${esc(r.err.tipo)}: ${esc(r.err.messaggio || '')}</div>`));
      if (r.err.riga) b.appendChild(elHtml(`<span class="run-meta">↳ ${esc(r.err.file || 'main.py')}, line ${esc(r.err.riga)}</span>`));
      if (r.err.hint) b.appendChild(elHtml(`<span class="run-hint">${esc(r.err.hint)}</span>`));
      if (r.err.traceback) b.appendChild(elHtml(`<details class="run-tb"><summary>full traceback</summary><pre>${esc(r.err.traceback)}</pre></details>`));
    }
  }
  return b;
}
/** History of the editor's terminal (same source as the Console:
 *  st.runs) + final prompt with blinking cursor. */
function renderCodiceOut(outEl, e) {
  const st = exState(e.id);
  outEl.innerHTML = '';
  if (st.runs.length) {
    st.runs.forEach(r => outEl.appendChild(runBlockEl(r, e)));
    if (st.verificato) outEl.appendChild(elHtml(`<span class="run-ok">✓ Output verified: it matches the one expected by the book.</span>`));
  } else if (st.outputs.length) {
    outEl.appendChild(elHtml(`<span class="sim-tag">expected output (simulated) · press "run" for the real one</span>`));
    st.outputs.forEach(l => outEl.appendChild(elHtml(`<div class="sim-out">${esc(l)}</div>`)));
  } else {
    outEl.appendChild(elHtml(`<span class="console-empty">Exercise terminal: press "▶ run" and the output will appear below (full history also in the Console panel).</span>`));
  }
  outEl.appendChild(elHtml(`<span class="line-cmd">student@tutor:~$&nbsp;<span class="cursor"></span></span>`));
}
/** Updates only the output area of the Code editor (if open): the
 *  textarea is not touched, so typing loses neither focus nor position.
 *  FIX v10 · updates ALL instances (desktop dock + mobile view). */
function updateCodiceOut() {
  const els = document.querySelectorAll('#codiceOut');
  if (!els.length) return;
  const e = EX[S.current] || EX[ORDER[0]];
  els.forEach(el => { renderCodiceOut(el, e); el.scrollTop = el.scrollHeight; });
}
function renderCodice(box) {
  box.innerHTML = '';
  const e = EX[S.current] || EX[ORDER[0]];
  if (e.noRun) {
    box.appendChild(elHtml(`<div class="dk-empty"><span class="big">🖥</span>
      <span><b>${esc(e.id)}</b> consists of shell commands or project files: this exercise has no Python program runnable in the browser.</span></div>`));
    return;
  }
  const st = exState(e.id);
  if (!S.codiceFile) S.codiceFile = {};
  const wrap = elHtml(`<div class="codice-wrap"></div>`);
  wrap.appendChild(elHtml(`<div>
    <h2 class="pan-title">${icon('filecode')} Full code · ${esc(e.id)} ${esc(e.t)}</h2>
    <p class="pan-sub codice-sub" style="margin-bottom:8px">This is <b>the program that "▶ Run and check the output" actually runs</b>. Feel free to modify it: from that moment the Run button — here and in the Exercise panel — will run <b>your version</b>, to reach the same result in a different way. Terminal: <span class="kbd">Ctrl</span>+<span class="kbd">Enter</span> runs and the output appears below.</p>
    <div class="codice-headrow"><span class="chip ok" id="codiceBadge"></span>
      <button class="btn tiny" id="cdToRighe" title="Lightweight editor: only the lines of your exercise (\"Exercise completed\"), with the ⚙ bridge to the project's modules">✎ only the exercise lines</button></div>
  </div>`));
  const loading = elHtml(`<div class="codice-loading">… preparing the full program (local database)…</div>`);
  wrap.appendChild(loading);
  box.appendChild(wrap);
  /* FIX v11 · the full program comes from the local solutions database
     (async): the panel renders right away with the placeholder and fills
     in as soon as the files are ready. If the exercise changes (or the
     panel is re-rendered) in the meantime, this fill cancels itself. */
  const myId = e.id;
  (async () => {
    const snap = await snapshotCodice(e);
    if (S.current !== myId || !wrap.isConnected) return;   // cancelled
    loading.remove();
    if (snap.modo === 'sol') {
      wrap.querySelector('.codice-sub').innerHTML =
        `The steps of this exercise are <b>fragments of a larger program</b>: what "▶ Run and check the output" actually runs is the <b>full program below</b> — all the project's files, <b>from the initial imports to the end</b>. Modify any file (e.g. a speed in <code>settings.py</code>) and press ▶ run: the game/program will start <b>with your edits</b>. Terminal: <span class="kbd">Ctrl</span>+<span class="kbd">Enter</span>.`;
    } else if (snap.modo === 'files') {
      wrap.querySelector('.codice-sub').innerHTML =
        `This exercise is <b>multi-file</b>: "▶ Run and check the output" runs <b>your files</b> (one per tab, from the main to the last module). Feel free to modify them: from that moment the Run button will run <b>your versions</b>. Terminal: <span class="kbd">Ctrl</span>+<span class="kbd">Enter</span> runs and the output appears below.`;
    } else if (snap.supporto.length) {
      wrap.querySelector('.codice-sub').innerHTML =
        `This is <b>the program that "▶ Run and check the output" actually runs</b>: the lines of the passed steps (with the prerequisite base), plus the imported <b>support modules</b> (last tabs). Modify whatever you want: the Run button will run <b>your version</b>. Terminal: <span class="kbd">Ctrl</span>+<span class="kbd">Enter</span> runs and the output appears below.`;
    }
    const multi = snap.modo === 'sol' || snap.modo === 'files' || !!snap.supporto.length;
    /* --- file tabs: main (▶) + project files / support modules --- */
    const mainLabel = snap.modo === 'step' ? (fileSafe(e.id) + '.py') : snap.mainName;
    const tabs = elHtml(`<div class="codice-tabs"></div>`);
    const allTabs = [];   // { name, storage: 'code'|'files', original }
    if (snap.modo === 'step') {
      allTabs.push({ name: mainLabel, storage: 'code', original: snap.code, main: true });
      snap.supporto.forEach(x => allTabs.push({ name: x.n, storage: 'files', original: x.c, support: true }));
    } else {
      Object.keys(snap.files).forEach(n => {
        allTabs.push({ name: n, storage: 'files', original: snap.files[n], main: n === snap.mainName });
      });
      snap.supporto.forEach(x => allTabs.push({ name: x.n, storage: 'files', original: x.c, support: true }));
    }
    let cur = multi ? S.codiceFile[e.id] : null;
    if (multi && (!cur || !allTabs.some(t => t.name === cur))) cur = mainLabel;
    if (multi) {
      allTabs.forEach(t => {
        const mod = t.storage === 'files' && !!(st.customFiles && typeof st.customFiles[t.name] === 'string');
        const tb = elHtml(`<button data-file="${esc(t.name)}" class="${t.name === cur ? 'active' : ''}${mod ? ' mod' : ''}${t.support ? ' support' : ''}">${t.main ? '<span class="tab-run" title="file executed by ▶ run">▶</span> ' : ''}${esc(t.name)}${mod ? ' <b title="modified file">•</b>' : ''}</button>`);
        tb.addEventListener('click', () => { S.codiceFile[e.id] = t.name; dock.refreshPanels(['codice']); });
        tabs.appendChild(tb);
      });
      wrap.appendChild(tabs);
    }
    const curTab = multi ? allTabs.find(t => t.name === cur) : allTabs[0];
    /* --- project data files (csv/json/txt/images): read-only --- */
    if (snap.assets && snap.assets.length) {
      const ast = elHtml(`<details class="codice-assets"><summary>📁 Other project files (${snap.assets.length}) — data and images, read-only</summary>
        <div class="codice-asset-list">${snap.assets.map(a => `
          <span class="codice-asset">${a.b64 ? '🖼' : '📄'} ${esc(a.n)} <span class="muted">(${a.b64 ? 'binary image' : 'data'})</span></span>`).join('')}
        </div></details>`);
      wrap.appendChild(ast);
    }
    const ta = document.createElement('textarea');
    ta.id = 'codiceTa'; ta.className = 'codice-ta'; ta.spellcheck = false; ta.autocapitalize = 'off'; ta.autocomplete = 'off';
    ta.placeholder = multi
      ? `content of ${cur}…`
      : 'The program appears here as you pass the steps — or write a program of your own directly and press ▶ run.';
    ta.value = curTab.storage === 'code'
      ? (typeof st.customCode === 'string' ? st.customCode : curTab.original)
      : ((st.customFiles && typeof st.customFiles[curTab.name] === 'string') ? st.customFiles[curTab.name] : curTab.original);
    wrap.appendChild(ta);
    const acts = elHtml(`<div class="ex-actions" style="margin-top:0">
      <button class="btn primary" id="cdRun">▶ run</button>
      <button class="btn" id="cdReset" title="Discard the edits: go back to the original program (passed steps or database project)">⟲ restore original</button>
      <button class="btn tiny" id="cdCopy" title="Copy the code to the clipboard">copy</button>
      <button class="btn tiny" id="cdClear" title="Clear the run history (also in the Console panel)">🧹 clear</button>
      <span class="rt-note" id="cdStatus">Ctrl+Enter to run · edits are saved with your progress</span>
    </div>`);
    wrap.appendChild(acts);
    const out = elHtml(`<div class="console-out codice-out" id="codiceOut"></div>`);
    wrap.appendChild(out);

    /* input → arms/disarms the override for this exercise:
       if the text goes back to being IDENTICAL to the original, the override
       turns itself off and "Run" resumes following the updated program. */
    ta.addEventListener('input', () => {
      if (curTab.storage === 'code') {
        if (ta.value === curTab.original) delete st.customCode;
        else { st.customCode = ta.value; st.customMode = 'step'; }
      } else {
        if (!st.customFiles) st.customFiles = {};
        if (ta.value === curTab.original) delete st.customFiles[curTab.name];
        else { st.customFiles[curTab.name] = ta.value; st.customMode = snap.modo === 'sol' ? 'sol' : (snap.modo === 'files' ? 'files' : 'step'); }
        if (!Object.keys(st.customFiles).length) delete st.customFiles;
      }
      saveProgressDebounced();
      aggiornaBadgeCodice(e);
      document.querySelectorAll('#cdStatus').forEach(statusEl => {
        statusEl.textContent = 'Ctrl+Enter to run · ' +
          (codiceArmato(e, st) ? 'edits saved ✓' : 'no edits: runs the original program');
      });
    });
    async function avvia() {
      saveProgressNow();
      await eseguiEsercizio(e);   // runs the editor's version (modified or original)
    }
    ta.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); avvia(); }
    });
    acts.querySelector('#cdRun').addEventListener('click', avvia);
    acts.querySelector('#cdReset').addEventListener('click', async () => {
      if (!codiceArmato(e, st)) { toast('No edits to discard: the code is already the original one.', ''); return; }
      const ok = await modal('<h3>⟲ Restore the original code?</h3><p>Your edits will be discarded (including the exercise lines in the ✎ Lines editor): "Run and check" will go back to using the original program (the passed steps, or the full project from the local database).</p>', 'Restore');
      if (!ok) return;
      delete st.customCode; delete st.customFiles; delete st.customMode; delete st.customRighe;
      saveProgress();
      toast('⟲ Original code restored.', 'ok');
      dock.refreshPanels(['codice', 'esercizio']);
    });
    acts.querySelector('#cdCopy').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(ta.value); toast('Code copied to the clipboard.', 'ok'); }
      catch (err) { toast('Copy not available in this browser.', 'warn'); }
    });
    acts.querySelector('#cdClear').addEventListener('click', () => {
      st.runs = []; st.outputs = []; delete st.verificato;
      saveProgress(); updateCodiceOut(); dock.refreshPanels(['console']);
    });
    /* FIX v10 · during renderLayout() the panel is still DETACHED from
       the document (the dock mounts it only at the end): getElementById
       in here finds null. The badge updates in the next frame, when
       the tree is already attached. */
    requestAnimationFrame(() => { aggiornaBadgeCodice(e); out.scrollTop = out.scrollHeight; });
    renderCodiceOut(out, e);
  })();
  const cdToRighe = wrap.querySelector('#cdToRighe');   // ===== NEW v12 · link to the lightweight editor =====
  if (cdToRighe) cdToRighe.addEventListener('click', () => apriRighe());
}

/* ---------- MODULES panel ---------- */
function renderModuli(box) {
  const wrap = elHtml(`<div><h2 class="pan-title">${icon('files')} Modules · Python Crash Course</h2>
    <p class="pan-sub">Exercises from Chapters 1–20 + Appendices D–E. Click an exercise to open it.</p></div>`);
  const tree = elHtml(`<div class="tree"></div>`);
  CH.forEach(c => {
    const doneN = c.ex.filter(x => exState(x.id).done).length;
    const open = S.filter ? true : (S.current && EX[S.current] && EX[S.current].ch === c.n) ? true : c.n <= 2;
    const chEl = elHtml(`<div class="tree-ch ${open ? 'open' : ''}">
      <button class="tree-ch-head"><span class="chev">▶</span><span>Ch. ${c.n} · ${esc(c.t)}</span>
        <span class="cnt">${doneN}/${c.ex.length}</span></button>
      <div class="tree-ch-bar"><i style="width:${Math.round(doneN / c.ex.length * 100)}%"></i></div>
    </div>`);
    const list = document.createElement('div');
    if (!open) list.style.display = 'none';
    chEl.querySelector('.tree-ch-head').addEventListener('click', () => {
      chEl.classList.toggle('open'); list.style.display = chEl.classList.contains('open') ? '' : 'none';
    });
    c.ex.forEach(x => {
      const st = exState(x.id);
      const cls = st.done ? 'done' : st.solved > 0 ? 'prog' : 'todo';
      const sym = st.done ? '✓' : st.solved > 0 ? '◐' : '○';
      const cur = S.current === x.id;
      if (S.filter) {
        const hay = (x.id + ' ' + x.t + ' ' + x.orig).toLowerCase();
        if (!hay.includes(S.filter.toLowerCase())) return;
      }
      const row = elHtml(`<button class="tree-ex ${cur ? 'current' : ''}" data-ex="${x.id}">
        <span class="st ${cls}">${sym}</span><span class="id">${esc(x.id)}</span>
        <span class="tt">${esc(x.t)}</span><span class="dots">${'●'.repeat(x.lvl)}</span></button>`);
      row.addEventListener('click', () => openExercise(x.id));
      list.appendChild(row);
    });
    chEl.appendChild(list);
    tree.appendChild(chEl);
  });
  wrap.appendChild(tree);
  if (ROADMAP.length) {
    const road = elHtml(`<div class="tree-roadmap"><h4>Roadmap · later modules of the book</h4></div>`);
    ROADMAP.forEach(r => {
      const b = elHtml(`<button class="road-item" data-n="${r.n}"><span class="lock">🔒</span>
        <span>${r.proj ? '' : 'Ch. '}${r.n}${r.proj ? '' : ' · '}${esc(r.t)}</span><span class="cnt">${esc(r.cnt)}</span></button>`);
      b.addEventListener('click', () => toast('Content not included in the loaded files.', 'warn'));
      road.appendChild(b);
    });
    wrap.appendChild(road);
  }
  box.innerHTML = ''; box.appendChild(wrap);
}

/* ---------- WALKTHROUGH panel ---------- */
function renderTraccia(box) {
  const e = EX[S.current] || EX[ORDER[0]];
  const c = CH[e.ch - 1];
  const wrap = elHtml(`<div>
    <h2 class="pan-title">${icon('book')} Walkthrough · ${esc(e.id)} ${esc(e.t)}</h2>
    <p class="pan-sub">"${esc(e.orig)}" — Python Crash Course, 3rd ed.</p>
    <div class="tr-body">${e.tr}</div>
    <hr class="hr">
    <h2 class="pan-title" style="font-size:13px">${icon('files')} Chapter ${c.n} concepts</h2>
    <div class="concepts">${c.concepts.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div>
    <p class="pan-sub" style="margin-top:12px">${esc(c.sub)}</p>
  </div>`);
  box.innerHTML = ''; box.appendChild(wrap);
}

/* ---------- CONSOLE panel ---------- */
function renderConsole(box) {
  const e = EX[S.current] || EX[ORDER[0]];
  const st = exState(e.id);
  box.innerHTML = '';
  /* ===== NEW v11 · the prompt shows the file that will REALLY be executed:
     the project's entry (mode 'sol'), the student's main (mode 'files')
     or the program of the steps (mode 'step'). ===== */
  let cmdFile = fileSafe(e.id) + '.py';
  const modo = modoCodice(e, st);
  if (modo === 'sol') {
    const si = solDb.indexFor(e.id);
    if (si && si.entry) cmdFile = si.entry;
  } else if (modo === 'files') {
    try {
      const mf = codicePerFile(e, st, { progress: S.progress, includePrereq: st.prereq !== false });
      if (mf.mainName) cmdFile = mf.mainName;
    } catch (err) { /* not critical */ }
  }
  const wrap = elHtml(`<div class="console-box">
    <div class="console-head"><span>${icon('term')}</span>
      <span class="t">student@tutor:~$ python ${esc(cmdFile)}</span>
      ${e.noRun ? '' : `<button class="btn-cl" data-act="codice" title="Open the full code that 'run' sends to the runtime: you can modify it and run it again">⌨ code</button>`}
      ${e.noRun ? '' : `<button class="btn-cl" data-act="righe" title="Edit only the lines of this exercise, without opening all the code">✎ lines</button>`}
      <button class="btn-cl" data-act="run" title="Run the exercise's program">▶ run</button>
      <button class="btn-cl" title="Clear the console">clear</button></div>
    <div class="console-out"></div></div>`);
  const out = wrap.querySelector('.console-out');
  if (st.runs.length) {
    st.runs.forEach(r => out.appendChild(runBlockEl(r, e)));   // ===== MODIFIED v10 · block shared with the Code editor =====
    if (st.verificato) out.appendChild(elHtml(`<span class="run-ok">✓ Output verified: it matches the one expected by the book.</span>`));
  } else if (st.outputs.length) {
    out.appendChild(elHtml(`<span class="sim-tag">expected output (simulated) · press "run" for the real one</span>`));
    st.outputs.forEach(l => out.appendChild(elHtml(`<div class="sim-out">${esc(l)}</div>`)));
  } else {
    out.innerHTML = '<span class="console-empty">No output yet.\nPass the steps and press "▶ run": the code really runs in the browser.</span>';
  }
  out.appendChild(elHtml('<span class="cursor"></span>'));
  wrap.querySelector('[title="Clear the console"]').addEventListener('click', () => { st.runs = []; st.outputs = []; delete st.verificato; saveProgress(); dock.refreshPanels(['console']); updateCodiceOut(); });
  wrap.querySelector('[data-act="run"]').addEventListener('click', () => eseguiEsercizio(e));
  const btnCd = wrap.querySelector('[data-act="codice"]');   // ===== NEW v10 =====
  if (btnCd) btnCd.addEventListener('click', () => apriCodice());
  const btnRg = wrap.querySelector('[data-act="righe"]');    // ===== NEW v12 =====
  if (btnRg) btnRg.addEventListener('click', () => apriRighe());
  box.appendChild(wrap);
  setTimeout(() => { out.scrollTop = out.scrollHeight; }, 25);
}

/* ---------- PROGRESS panel ---------- */
function renderProgressi(box) {
  const g = globalStats(S.progress);
  const sync = storage.syncStatus();
  const utente = storage.currentUser();
  const wrap = elHtml(`<div>
    <h2 class="pan-title">${icon('chart')} Progress and autonomy</h2>
    <p class="pan-sub">Session report over ${TOTAL_EX} exercises.</p>
    <div class="stat-grid">
      <div class="stat-card"><div class="v">${g.done}<span class="muted" style="font-size:13px">/${g.total}</span></div><div class="l">exercises completed</div></div>
      <div class="stat-card"><div class="v">${g.solved}</div><div class="l">steps passed</div></div>
      <div class="stat-card"><div class="v">${Math.max(0, Math.round((1 - g.avgAssist / 3) * 100))}%</div><div class="l">average autonomy</div></div>
      <div class="stat-card"><div class="v" style="color:${g.l3 > 3 ? 'var(--warn)' : 'var(--text)'}">${g.l3}</div><div class="l">full hints used</div></div>
    </div>
    ${utente ? `<div class="sync-banner on">${icon('user')} <span>Progress synced to the cloud (${esc(utente.email)})</span></div>` : ''}
    <div class="ass-legend" style="margin-bottom:14px">
      <span>🪂 <b>level 1</b> · concept</span>
      <span class="l2"><b>level 2</b> · syntax pattern</span>
      <span class="l3"><b>level 3</b> · full line</span>
    </div>
    ${CH.map(c => {
    const doneN = c.ex.filter(x => exState(x.id).done).length;
    return `<div class="ch-prog"><div class="row"><span>Ch. ${c.n} · ${esc(c.t)}</span><span class="muted">${doneN}/${c.ex.length}</span></div>
        <div class="bar"><i style="width:${Math.round(doneN / c.ex.length * 100)}%"></i></div></div>`;
  }).join('')}
    <hr class="hr">
    <div class="step-actions" style="margin-top:14px">
      <button class="btn danger" id="btnResetProg">⟲ Reset all progress</button>
    </div>
  </div>`);
  wrap.querySelector('#btnResetProg').addEventListener('click', async () => {
    const ok = await modal('<h3>Reset all progress?</h3><p>The progress of all exercises will be deleted and the layout will go back to the default.</p>', 'Yes, reset');
    if (ok) resetAll();
  });
  box.innerHTML = ''; box.appendChild(wrap);
}

/* ---------- GUIDE panel ---------- */
function renderGuida(box) {
  box.innerHTML = '';
  box.appendChild(elHtml(`<div>
    <h2 class="pan-title">${icon('help')} How the Tutor works</h2>
    <p class="pan-sub">The progressive breakdown method, in three rules.</p>
    <div class="guide-sec">
      <h3>🧩 1 · Logical breakdown</h3>
      <p>Every exercise is split into <b>sequential micro-phrases</b> (the steps). Each phrase states the logic in natural language.</p>
    </div>
    <div class="guide-sec">
      <h3>✏️ 2 · Active writing</h3>
      <p>For every phrase <b>you write</b> the Python line and press <span class="kbd">Check</span> (or <span class="kbd">Ctrl</span>+<span class="kbd">Enter</span>).</p>
    </div>
    <div class="guide-sec">
      <h3>🪂 3 · The hint</h3>
      <p>The blue <b>keywords</b> are clickable: <b>first click</b> = concept, <b>second click</b> = syntax, <b>full hint</b> = the whole line.</p>
    </div>
    <div class="guide-sec">
      <h3>🖼 Charts and games (new)</h3>
      <p>When you run a program with <code>plt.show()</code> (Matplotlib) or <code>fig.show()</code> (Plotly), the chart appears in the <b>Charts</b> panel. When you use <code>pygame.display.flip()</code>, the frame appears in the <b>Game</b> panel.</p>
      <p><b>Note</b>: the first use of Matplotlib or Pygame downloads the package (~10-30 MB), then it stays in the browser cache.</p>
      <p><b>How Pygame runs in the browser — now it's playable</b>: games run on software surfaces in the runtime and the frames appear in the <b>Game</b> panel. <b>Click the canvas</b> (it captures the keyboard) and use <b>arrows</b>, <b>space</b>, <b>q</b>; the mouse passes to the game too. The game keeps running until you press <b>■ Stop</b> or quit with <code>q</code>; after 25 s of complete inactivity the tutor closes it on its own, and there is an absolute limit of 10 minutes. For full performance run locally with <code>pip install pygame-ce</code>.</p>
    </div>
    <div class="guide-sec">
      <h3>🧰 Solutions database (new)</h3>
      <p>The official book solution files are archived in a <b>database in the browser</b> (IndexedDB), seeded on first launch. They are used in two ways:</p>
      <p>· <b>Support files</b>: imported modules (<code>restaurant.py</code>…), data (<code>learning_python.txt</code>, weather CSVs…), images of the Pygame projects. Listed in the exercise banner, you use them with <code>import</code> or <code>Path(...)</code> without rewriting them.</p>
      <p>· <b>Double run</b>: if your code produces no output (because it only defines classes/functions or depends on other files), the <b>full solution</b> is run automatically and its output appears in the Console marked with <b>📚</b>. The solution's code is never shown: only its output.</p>
      <p>· <b>pytest tests</b>: the solutions of the testing chapters run with integrated pytest (output "1 passed"…).</p>
      <p>· <b>Django and Git projects</b> (Ch. 18–22): the files are archived but not runnable in the browser — you need Python and Django locally.</p>
    </div>
    <div class="guide-sec">
      <h3>⌨ Full code editor (new)</h3>
      <p>The <b>⌨ code</b> button next to "▶ Run" opens the exercise's <b>full program</b> — exactly the code the Run button sends to the runtime: the lines of the passed steps (with any prerequisite base), file by file in multi-file exercises.</p>
      <p>· You can <b>modify it</b> freely: from that moment "Run and check the output" runs <b>your version</b> (marked ⚠, saved with your progress) — so you can reach the same result <b>in a different way</b> than the predetermined solution. The soft output check stays active: if your program prints the expected lines, the "✓" arrives.</p>
      <p>· The panel works as a <b>terminal</b>: <span class="kbd">Ctrl</span>+<span class="kbd">Enter</span> runs, the output appears below with the <code>student@tutor:~$</code> prompt and the blinking cursor; the full history stays in the Console panel.</p>
      <p>· <b>⟲ restore original</b> discards the edits and goes back to the program of the passed steps. If you don't touch anything, the run always follows the last passed step.</p>
    </div>
    <div class="guide-sec">
      <h3>📊 Syntactic autonomy</h3>
      <p>Every solved step is worth 3 points: <b>3</b> with no help, <b>2</b> with the concept, <b>1</b> with the syntax, <b>0</b> with the full line.</p>
    </div>
  </div>`));
}

/* ---------- SANDBOX panel ---------- */
const SANDBOX_SAMPLES = {
  'Welcome': `import sys\nprint("Hello from the real runtime:", sys.version)\n`,
  'f-strings and loops': `name = "Ada"\nprint(f"Hello {name}!")\nfor i in range(1, 5):\n    print(f"square of {i} = {i**2}")\n`,
  'Matplotlib': `import matplotlib.pyplot as plt\nplt.plot([1, 4, 9, 16, 25])\nplt.title("Squares")\nplt.show()\n`,
  'Plotly': `import plotly.express as px\nfig = px.bar(x=["A","B","C"], y=[3, 7, 2], title="Example")\nfig.show()\n`,
  'Pygame (blue sky)': `import pygame\npygame.init()\nscreen = pygame.display.set_mode((400, 300))\nscreen.fill((0, 0, 255))\npygame.display.flip()\n`,
  'Playable Pygame 🎮': `import sys\nimport pygame\n\npygame.init()\nscreen = pygame.display.set_mode((480, 320))\npygame.display.set_caption("Move with the arrows!")\nclock = pygame.time.Clock()\nx, y = 220, 140\ndx = dy = 0\n\nwhile True:\n    for event in pygame.event.get():\n        if event.type == pygame.QUIT:\n            sys.exit()\n        elif event.type == pygame.KEYDOWN:\n            if event.key == pygame.K_LEFT:\n                dx = -6\n            elif event.key == pygame.K_RIGHT:\n                dx = 6\n            elif event.key == pygame.K_UP:\n                dy = -6\n            elif event.key == pygame.K_DOWN:\n                dy = 6\n        elif event.type == pygame.KEYUP:\n            if event.key in (pygame.K_LEFT, pygame.K_RIGHT):\n                dx = 0\n            elif event.key in (pygame.K_UP, pygame.K_DOWN):\n                dy = 0\n    x, y = x + dx, y + dy\n    screen.fill((24, 26, 32))\n    pygame.draw.circle(screen, (120, 220, 130), (x, y), 18)\n    pygame.display.flip()\n    clock.tick(60)\n`,
  'sqlite3 in memory': `import sqlite3\nconn = sqlite3.connect(":memory:")\ncur = conn.cursor()\ncur.execute("CREATE TABLE grades (name TEXT, grade INT)")\ncur.executemany("INSERT INTO grades VALUES (?, ?)", [("Ada", 9), ("Alan", 7)])\nfor name, grade in cur.execute("SELECT name, grade FROM grades ORDER BY grade DESC"):\n    print(name, "-", grade)\n`,
};
function renderSandbox(box) {
  box.innerHTML = '';
  const wrap = elHtml(`<div class="sandbox-wrap">
    <div>
      <h2 class="pan-title">${icon('flask')} Sandbox Python</h2>
      <p class="pan-sub" style="margin-bottom:9px">Free code on a real CPython 3.14 interpreter (Pyodide). Supports Matplotlib, Plotly and <b>playable</b> Pygame (sample "Playable Pygame 🎮").</p>
      <div class="sandbox-samples"></div>
    </div>
    <textarea class="sandbox-ta" id="sandboxTa" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
    <div class="ex-actions" style="margin-top:0">
      <button class="btn primary" id="sbRun">▶ Run</button>
      <span class="rt-note" id="sbStatus">Ctrl+Enter to run</span>
    </div>
    <div class="console-out" id="sbOut" style="min-height:110px;background:#101216;border:1px solid var(--border);border-radius:9px;padding:9px 11px"><span class="console-empty">The output will appear here.</span></div>
  </div>`);
  const ta = wrap.querySelector('#sandboxTa');
  ta.value = S.drafts['sandbox'] || SANDBOX_SAMPLES['Welcome'];
  ta.addEventListener('input', () => { S.drafts['sandbox'] = ta.value; });
  const out = wrap.querySelector('#sbOut');
  const campionamenti = wrap.querySelector('.sandbox-samples');
  Object.keys(SANDBOX_SAMPLES).forEach(nome => {
    const b = elHtml(`<button>${esc(nome)}</button>`);
    b.addEventListener('click', () => { ta.value = SANDBOX_SAMPLES[nome]; S.drafts['sandbox'] = ta.value; ta.focus(); });
    campionamenti.appendChild(b);
  });
  const runBt = wrap.querySelector('#sbRun');
  const statusEl = wrap.querySelector('#sbStatus');
  async function run() {
    if (getStatus().running) return;
    runBt.disabled = true;
    statusEl.textContent = getStatus().status === 'ready' ? 'running…' : 'first run: downloading the runtime (~10 MB)…';
    out.innerHTML = '<span class="line-dim">…</span>';
    const res = await runPythonCode(ta.value, {}, {});
    // the panel may have been re-rendered (e.g. the Game panel opened
    // during the run): write to the current element, not the captured one
    const outNow = document.getElementById('sbOut') || out;
    outNow.innerHTML = '';
    if (res.ok) {
      outNow.appendChild(elHtml(`<span class="run-meta">ok · ${res.durataMs} ms</span>`));
      outNow.appendChild(elHtml(`<div class="run-out">${esc(res.output || '(no output)')}</div>`));
    } else {
      const err = res.error;
      outNow.appendChild(elHtml(`<span class="run-meta">error · ${res.durataMs} ms</span>`));
      if (res.output) outNow.appendChild(elHtml(`<div class="run-out">${esc(res.output)}</div>`));
      outNow.appendChild(elHtml(`<div class="run-err">${esc(err.tipo)}: ${esc(err.messaggio || '')}</div>`));
      if (err.hint) outNow.appendChild(elHtml(`<span class="run-hint">${esc(err.hint)}</span>`));
      if (err.traceback) outNow.appendChild(elHtml(`<details class="run-tb"><summary>full traceback</summary><pre>${esc(err.traceback)}</pre></details>`));
    }
    runBt.disabled = false;
    statusEl.textContent = 'Ctrl+Enter to run';
  }
  runBt.addEventListener('click', run);
  ta.addEventListener('keydown', ev => {
    if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); run(); }
  });
  box.appendChild(wrap);
}

/* ---------- ACCOUNT panel ---------- */
function renderAccount(box) {
  box.innerHTML = '';
  const configured = supabaseConfigured();
  const stato = storage.syncStatus();
  const utente = storage.currentUser();
  const wrap = elHtml(`<div>
    <h2 class="pan-title">${icon('user')} Account and sync</h2>
    <p class="pan-sub">Your progress is <b>always</b> safe in the browser. The account is only to find it again on another device.</p>
    ${!configured
      ? `<div class="sync-banner off">⚠ Supabase not configured: the app is in <b>local mode</b>.</div>`
      : stato === 'error'
        ? `<div class="sync-banner off">⚠ Last sync failed.</div>`
        : !utente
          ? `<div class="sync-banner local">☁ Cloud ready: sign in to sync.</div>`
          : `<div class="user-chip">${icon('user')}<div><b>${esc(utente.email || 'user')}</b></div></div>`
    }
    ${configured && !utente ? `
      <div class="auth-card">
        <h3>Sign in or sign up</h3>
        <div class="auth-grid">
          <div class="field"><label for="authEmail">Email</label><input id="authEmail" type="email" placeholder="student@school.edu"></div>
          <div class="field"><label for="authPass">Password (min 6 characters)</label><input id="authPass" type="password" placeholder="••••••••"></div>
        </div>
        <div class="step-actions">
          <button class="btn primary" id="btnLogin">Sign in</button>
          <button class="btn" id="btnSignup">Create account</button>
        </div>
        <div class="auth-msg" id="authMsg"></div>
      </div>`: ''}
    ${configured && utente ? `
      <div class="step-actions">
        <button class="btn" id="btnSyncNow">⟳ Sync now</button>
        <button class="btn danger" id="btnLogout">Sign out</button>
      </div>`: ''}
  </div>`);
  const msg = wrap.querySelector('#authMsg');
  const btLogin = wrap.querySelector('#btnLogin');
  if (btLogin) btLogin.addEventListener('click', async () => {
    const email = wrap.querySelector('#authEmail').value.trim();
    const pass = wrap.querySelector('#authPass').value;
    if (!email || pass.length < 6) { msg.className = 'auth-msg err'; msg.textContent = 'Valid email and a password of at least 6 characters.'; return; }
    msg.className = 'auth-msg'; msg.textContent = 'Signing in…';
    try { await storage.entra(email, pass); toast('Signed in.', 'ok'); dock.refreshPanels(['account', 'progressi']); renderStatus(); }
    catch (er) { msg.className = 'auth-msg err'; msg.textContent = String(er.error_description || er.message || 'Invalid credentials.'); }
  });
  const btSignup = wrap.querySelector('#btnSignup');
  if (btSignup) btSignup.addEventListener('click', async () => {
    const email = wrap.querySelector('#authEmail').value.trim();
    const pass = wrap.querySelector('#authPass').value;
    if (!email || pass.length < 6) { msg.className = 'auth-msg err'; msg.textContent = 'Valid email and a password of at least 6 characters.'; return; }
    msg.className = 'auth-msg'; msg.textContent = 'Signing up…';
    try {
      const r = await storage.registrati(email, pass);
      if (r.confermaEmail) { msg.className = 'auth-msg ok'; msg.textContent = 'Check your email to confirm the registration.'; }
      else { toast('Welcome!', 'ok'); dock.refreshPanels(['account', 'progressi']); renderStatus(); }
    } catch (er) { msg.className = 'auth-msg err'; msg.textContent = String(er.error_description || er.message || 'Sign-up failed.'); }
  });
  const btSync = wrap.querySelector('#btnSyncNow');
  if (btSync) btSync.addEventListener('click', async () => { await storage.sincronizzaOra(); dock.refreshPanels(['account', 'progressi']); renderStatus(); });
  const btOut = wrap.querySelector('#btnLogout');
  if (btOut) btOut.addEventListener('click', async () => { await storage.esci(); toast('Signed out.', ''); dock.refreshPanels(['account', 'progressi']); renderStatus(); });
  box.appendChild(wrap);
}

/* ---------- status bar ---------- */
function renderStatus() {
  const sb = $('#statusbar'); if (!sb) return;
  const e = EX[S.current] || EX[ORDER[0]];
  const st = exState(e.id);
  const doneAll = ORDER.filter(id => exState(id).done).length;
  const py = getStatus();
  const sync = storage.syncStatus();
  const pyChip =
    py.status === 'ready' ? `<span class="sb-chip ok" data-act="sandbox" title="Python runtime active">Python ${esc(py.version || '3.14')} ✓</span>` :
      py.status === 'loading' ? `<span class="sb-chip busy"><span class="spin"></span> runtime…</span>` :
        py.status === 'error' ? `<span class="sb-chip err" data-act="sandbox">runtime ✗</span>` :
          `<span class="sb-chip" data-act="sandbox">Python (Pyodide) not loaded</span>`;
  const syncChip =
    sync === 'synced' ? `<span class="sb-chip ok" data-act="account">☁ synced</span>` :
      sync === 'syncing' ? `<span class="sb-chip busy"><span class="spin"></span> sync…</span>` :
        sync === 'error' ? `<span class="sb-chip err" data-act="account">sync ✗</span>` :
          sync === 'local' ? `<span class="sb-chip acc" data-act="account">☁ local mode</span>` :
            `<span class="sb-chip" data-act="account">☁ local only</span>`;
  sb.innerHTML = `
    <span class="sb-item"><b style="color:var(--text)">${py.status === 'ready' ? 'Python ' + esc(py.version || '3.14') : 'Python (Pyodide)'}</b></span>
    <span class="sb-item">📂 Ch. ${e.ch} · ${esc(CH[e.ch - 1].t)}</span>
    <span class="sb-item">${esc(e.id)} ${esc(e.t)} — ${st.done ? 'completed ✓' : 'step ' + Math.min(st.solved + 1, e.steps.length) + '/' + e.steps.length}</span>
    <span class="sb-right">
      <span class="sb-item"><span class="sb-chip acc" title="Solution files archived in the local database">📚 ${solDb.indexCount()} solutions</span></span>
      ${syncChip}
      ${pyChip}
      <span class="sb-item"><span class="sb-chip acc">🪂 autonomy ${autonomiaOf(S.progress, e.id)}%</span></span>
      <span class="sb-item"><span class="sb-chip ok">✓ ${doneAll}/${TOTAL_EX} exercises</span></span>
    </span>`;
}

/* ---------- mobile header ---------- */
function mobileHeadHtml() {
  const e = EX[S.current] || EX[ORDER[0]];
  const st = exState(e.id);
  const sync = storage.syncStatus();
  return `
    <span class="m-brand">
      <svg viewBox="0 0 24 24" fill="none" stroke="#4f9cf7" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3"/><path d="M4 8a8 8 0 0 1 16 0"/><path d="M3.5 8.5c2.5 1 4.5 1 6 0 1 2 3 2 5 0 1.5 1 3.5 1 6 0"/><path d="M12 12v6a2.2 2.2 0 0 0 4.4 0"/></svg>
      <span>Tutor</span></span>
    <div class="m-ex">
      <div class="t">${esc(e.id)} · ${esc(e.t)}</div>
      <div class="s">${st.done ? 'completed ✓' : 'step ' + Math.min(st.solved + 1, e.steps.length) + ' of ' + e.steps.length}</div>
    </div>
    <button class="tl-btn" data-mact="account" title="Account and sync" style="padding:5px 9px">${sync === 'synced' ? '☁ ✓' : '☁'}</button>`;
}

/* ---------- default layout and panel registry ---------- */
function defaultLayout() {
  const sb = window.innerWidth < 1200 ? 26 : 19;
  return {
    type: 'split', dir: 'row', sizes: [sb, 100 - sb], children: [
      { type: 'group', tabs: ['moduli', 'guida'], active: 'moduli' },
      {
        type: 'split', dir: 'col', sizes: [70, 30], children: [
          {
            type: 'split', dir: 'row', sizes: [33, 67], children: [
              { type: 'group', tabs: ['traccia'], active: 'traccia' },
              { type: 'group', tabs: ['esercizio'], active: 'esercizio' }
            ]
          },
          {   // ===== MODIFIED v12 · the editors (⌨ full Code + ✎ Lines) in a
              // separate tab, split from the Console/Charts/Game: they open and
              // close on their own (activity bar) without covering the output =====
            type: 'split', dir: 'row', sizes: [55, 45], children: [
              { type: 'group', tabs: ['console', 'grafici', 'gioco', 'progressi'], active: 'console' },
              { type: 'group', tabs: ['codice', 'righe'], active: 'codice' }
            ]
          }
        ]
      }
    ]
  };
}
const Panels = {
  moduli: { id: 'moduli', title: 'Modules', icon: 'files', render: renderModuli },
  traccia: { id: 'traccia', title: 'Walkthrough', icon: 'book', render: renderTraccia },
  esercizio: { id: 'esercizio', title: 'Exercise', icon: 'code', render: renderEsercizio },
  codice: { id: 'codice', title: 'Code', icon: 'filecode', render: renderCodice },   // ===== NEW v10 · full program editor + terminal =====
  righe:  { id: 'righe',  title: 'Lines',  icon: 'rows',    render: renderRighe },    // ===== NEW v12 · lightweight editor: only the exercise lines =====
  console: { id: 'console', title: 'Console', icon: 'term', render: renderConsole },
  grafici: { id: 'grafici', title: 'Charts', icon: 'chart', render: renderGrafici },   // ===== NEW =====
  gioco: { id: 'gioco', title: 'Game', icon: 'flask', render: renderGioco },     // ===== NEW =====
  progressi: { id: 'progressi', title: 'Progress', icon: 'chart', render: renderProgressi },
  guida: { id: 'guida', title: 'Guide', icon: 'help', render: renderGuida },
  sandbox: { id: 'sandbox', title: 'Sandbox', icon: 'flask', render: renderSandbox },
  account: { id: 'account', title: 'Account', icon: 'user', render: renderAccount },
};

const dock = createDock({
  panels: Panels,
  defaultLayout,
  storageKey: KEYS.layout,
  toast,
  mobileHead: mobileHeadHtml,
  onLayoutChange: () => { renderStatus(); },
});

/* ---------- startup ---------- */
function init() {
  dock.renderActivity();
  dock.applyMode(true);
  storage.init();
  // ===== NEW · seeds the local solutions database (IndexedDB) =====
  solDb.init().then(info => {
    if (info && info.done) {
      toast(info.reseeded
        ? `🔄 Solutions database updated: ${info.count} exercises.`
        : `📚 Solutions database ready: ${info.count} exercises with support files and output.`, 'ok');
    }
  }).catch(() => { toast('⚠ Solutions database unavailable: running without support files.', 'warn'); });
  onPythonStatus(() => { renderStatus(); });
  storage.onSyncChange(() => { renderStatus(); });
  storage.onAuthChange(() => { renderStatus(); dock.refreshPanels(['account', 'progressi']); });
  storage.onRemoteApply((st) => {
    S.progress = st.progress || {};
    if (st.current) S.current = st.current;
    S.hintsOpen = {};
    dock.refreshAll();
    renderStatus();
    toast('☁ Progress updated ' + (st.viaRealtime ? 'in real time' : 'from the cloud') + '.', 'ok');
  });
  const gs = $('#globalSearch');
  if (gs) gs.addEventListener('input', ev => { S.filter = ev.target.value.trim(); dock.refreshPanels(['moduli']); });
  $('#btnReset').addEventListener('click', async () => {
    const ok = await modal('<h3>Restore the prototype?</h3><p>Panel layout and progress will go back to the initial state.</p>', 'Restore');
    if (ok) resetAll();
  });
  $('#btnGuida').addEventListener('click', () => dock.activateOrInsert('guida'));
  $('#statusbar').addEventListener('click', ev => {
    const t = ev.target.closest('[data-act]'); if (!t) return;
    if (isMobile()) { dock.setMobileTab(t.dataset.act); dock.renderMobilePanel(); dock.renderMobileNav(); }
    else dock.activateOrInsert(t.dataset.act);
  });
  $('#mHead').addEventListener('click', ev => {
    const t = ev.target.closest('[data-mact]'); if (!t) return;
    if (t.dataset.mact === 'account') { dock.setMobileTab('account'); dock.renderMobilePanel(); dock.renderMobileNav(); }
  });
  let rzT = null;
  window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => dock.applyMode(false), 160); });
  if (!storage.getSeen()) {
    setTimeout(() => toast('👋 Welcome! Open an exercise from the <b>Modules</b> panel.', ''), 800);
    setTimeout(() => toast('The <b style="color:var(--acc)">blue words</b> in the phrases are clickable: they are your hints 🪂'), 5200);
    setTimeout(() => toast('▶ The <b>Run</b> button runs the code with a real Python in the browser.', ''), 9600);
    setTimeout(() => toast('🖼 Matplotlib/Plotly charts and 🎮 Pygame games appear in their dedicated panels!', ''), 14000);
    setTimeout(() => toast('⌨ The <b>code</b> button next to Run shows the full program: you can modify it and run your version again.', ''), 18400);
    setTimeout(() => toast('✎ The <b>lines</b> button opens the lightweight editor: only the exercise lines, with the reference to the module that contains them.', ''), 23000);
    storage.setSeen();
  }
}
if (typeof document !== 'undefined' && document.readyState !== 'loading') init();
else if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', init);