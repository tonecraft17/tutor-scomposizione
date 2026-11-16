/* ============================================================
   APP · entry point: joins the modules and starts the app
   ============================================================ */
/* ===== NEW v16.1 · every ES-module import now carries the same ?v=21
   query as the <script>/<link> tags in index.html. WHY: the service worker
   caches same-origin GETs by their FULL URL (query included), and the
   module files used to have NO version in their URL. On the first visit
   after a deploy the old worker was still in control and served the OLD
   engine/*.js from its cache while app.js arrived fresh (its ?v= had
   changed): a mixed app where the activity-bar buttons called a dock that
   no longer knew the 'moduli' panel — “the tab does not open”. With the
   version on every specifier a release changes ALL module URLs, so even a
   stale worker cache-misses and fetches the fresh, consistent set. The
   specifiers must stay character-for-character identical to the
   modulepreload hrefs in index.html, or each file would be fetched twice. ===== */
import { APP, KEYS, supabaseConfigured, PLOTLY_JS } from './config.js?v=21';
import { CH, EX, ORDER, TOTAL_EX, ROADMAP, codiceEsercizio } from './data/exercises.js?v=21';
import { createDock, isMobile, icon } from './engine/dock.js?v=21';
import {
  stateFor, righeUtente, righeUtenteRaw, righeUtenteConCommenti, conRientro, checkStep, assistLabel, assistSummary,
  autonomiaOf, globalStats, nextExercise, verificaOutput
} from './engine/tutor.js?v=21';
import {
  runPythonCode, getStatus, onPythonStatus,
  onMatplotlibImage, onPlotlyFigure, onPygameFrame,
  onPythonRunEnd, sendPygameEvent, stopPygameGame
} from './engine/python-runner.js?v=21'; // ===== MODIFIED =====
import * as storage from './engine/storage.js?v=21';
import * as solDb from './engine/solutions-db.js?v=21'; // ===== NEW · local solutions database =====
import { PONTE } from './engine/ponte.js?v=21'; // ===== NEW v12.1 · bridge from exercise lines → project =====

/* ---------- UI utilities ---------- */
const $ = s => document.querySelector(s);
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function elHtml(h) { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstElementChild; }
/* ===== NEW v17 · AUTO-GROW for the code textareas =====
   The writing zones (⌨ full Code, ✎ Lines, Sandbox) are now as TALL
   as their content: the textarea grows with every line, and when the
   program is longer than the panel the PANEL itself scrolls with its
   own scrollbar (before, long programs lived in a small box with an
   internal scroll). fit() retries while the textarea is still
   DETACHED from the document (the progressive scheduler renders
   panel bodies before mounting them: scrollHeight would be 0). */
function armAutogrow(ta, minH) {
  const min = minH || 240;
  let tentativi = 0;
  const fit = () => {
    if (!ta.isConnected) { if (++tentativi < 60) setTimeout(fit, 60); return; }
    ta.style.height = 'auto';
    ta.style.height = Math.max(min, ta.scrollHeight + 3) + 'px';
  };
  ta.addEventListener('input', fit);
  ta.addEventListener('focus', fit);
  fit();
}
/* ===== NEW v20 · toast queue while the homepage is up: informational
   toasts fired during load (solutions database, sync notices) wait in
   line instead of covering the presentation — enterApp() flushes them
   once the visitor is inside the app. The DOM check (not the HOME
   flag) keeps this safe at any evaluation order. ===== */
const toastQueue = [];
function toast(msg, type) {
  /* ===== CHANGED v21 · the homepage node now STAYS in the DOM (hidden)
     so the ⌂ Home button can bring it back: the queue check is its
     VISIBILITY, not its existence. ===== */
  const hp = document.getElementById('homePage');
  if (hp && !hp.hidden) { toastQueue.push([msg, type]); return; }
  const t = elHtml(`<div class="toast ${type || ''}">${msg}</div>`);
  $('#toasts').appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 3600);
}
function modal(html, okLabel) {
  return new Promise(res => {
    /* ===== a11y (checklist M4) ===== the dialog remembers the invoker and
       returns the focus to it on close; Tab is trapped inside the dialog
       and Esc closes it (SC 2.1.1 + 2.4.3); role="dialog" + aria-modal
       + aria-labelledby on the first heading give it its accessible name. */
    const invoker = document.activeElement;
    const bg = elHtml(`<div class="modal-bg"><div class="modal" role="dialog" aria-modal="true">${html}
      <div class="acts"><button class="btn" data-r="0">Cancel</button>
      <button class="btn primary" data-r="1">${okLabel || 'Confirm'}</button></div></div></div>`);
    const h = bg.querySelector('h1,h2,h3,h4,h5,h6');
    if (h && !h.id) h.id = 'modalTitle';
    if (h) bg.querySelector('.modal').setAttribute('aria-labelledby', h.id);
    $('#modalHost').appendChild(bg);
    const focusables = () => [...bg.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')]
      .filter(el => !el.disabled && el.offsetParent !== null);
    const chiudi = ok => {
      bg.remove();
      document.removeEventListener('keydown', onKey, true);
      if (invoker && invoker.isConnected) { try { invoker.focus(); } catch (err) { } }
      res(ok);
    };
    const onKey = ev => {
      if (ev.key === 'Escape') { ev.stopPropagation(); chiudi(false); return; }
      if (ev.key === 'Tab') {
        const f = focusables(); if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
        else if (!bg.contains(document.activeElement)) { ev.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey, true);
    bg.addEventListener('click', ev => {
      const b = ev.target.closest('[data-r]'); if (!b) return;
      chiudi(b.dataset.r === '1');
    });
    requestAnimationFrame(() => { const f = focusables(); if (f.length) f[0].focus(); });
  });
}

/* ============================================================
   ===== NEW v16 · MODULES DRAWER + GUIDE OVERLAY =====
   ------------------------------------------------------------
   Two pieces of app chrome replace the old dock tabs:
   · the Modules tree lives in a DRAWER that slides in from the
     left (activity-bar icon on desktop, ☰ in the mobile header):
     the 199-exercise tree no longer eats a permanent slice of
     the work area, and on the phone it is a real slide-out menu;
   · the Guide opens as a floating OVERLAY (activity-bar icon,
     "? Guide" in the titlebar, ? in the mobile header): it is
     reference material you read occasionally, not a panel to
     keep docked.
   Both close with Esc, with the backdrop or with their ✕, and
   return the focus to the invoker (same a11y pattern as modal()).
   ============================================================ */
const DRAWER = { open: false, invoker: null };
function drawerEls() {
  let host = document.getElementById('drawerHost');
  if (!host) { host = document.createElement('div'); host.id = 'drawerHost'; document.body.appendChild(host); }
  if (!host.firstChild) {
    host.innerHTML =
      `<div class="drawer-bg" hidden></div>
       <aside class="drawer" role="complementary" aria-label="Modules drawer" hidden>
         <div class="drawer-head">
           <!-- ===== CHANGED v18 · the drawer title is just "Modules" — the
                same single name as the sidebar button that opens it (the
                book reference stays in the chapter list below). ===== -->
           <span class="drawer-title">${icon('files')} Modules</span>
           <button class="drawer-x" aria-label="Close the modules menu">✕</button>
         </div>
         <div class="drawer-search">
           <input type="search" id="drawerSearch" placeholder="Filter exercises… (e.g. «3-4» or «guests»)"
             aria-label="Filter exercises" autocomplete="off">
         </div>
         <div class="drawer-body"></div>
         <div class="drawer-foot">Click an exercise to open it — the drawer closes by itself.</div>
       </aside>`;
    host.querySelector('.drawer-x').addEventListener('click', () => toggleDrawer(false));
    host.querySelector('.drawer-bg').addEventListener('click', () => toggleDrawer(false));
    /* the drawer has its OWN search box: on mobile there is no titlebar
       search at all, so the filter finally works on phones too */
    host.querySelector('#drawerSearch').addEventListener('input', ev => {
      S.filter = ev.target.value.trim();
      renderDrawerBody();
      const gs = document.getElementById('globalSearch');
      if (gs && document.activeElement !== gs) gs.value = ev.target.value;
    });
  }
  return { host, drawer: host.querySelector('.drawer'), bg: host.querySelector('.drawer-bg'), body: host.querySelector('.drawer-body'), search: host.querySelector('#drawerSearch') };
}
function drawerKey(ev) { if (ev.key === 'Escape') { ev.stopPropagation(); toggleDrawer(false); } }
function toggleDrawer(open) {
  const { host, drawer, bg, search } = drawerEls();
  const want = open === undefined ? !DRAWER.open : !!open;
  if (want === DRAWER.open) return;
  DRAWER.open = want;
  /* ===== NEW v20 · the header is always visible while (and right
     after) using a menu/overlay: scrolling inside these surfaces used
     to slide the titlebar away with no way back once closed. ===== */
  document.body.classList.remove('head-off');
  /* ===== NEW v19 · while the drawer is open the activity bar must NOT
     expand on hover: the two menus used to fight for the same pixels
     (labels sliding under the drawer, mid-animation). styles.css reads
     body.drawer-open and keeps the bar collapsed until the drawer is
     closed — the overlap is gone. ===== */
  document.body.classList.toggle('drawer-open', want);
  const ab = document.querySelector('.act-btn[data-panel="moduli"]');
  if (want) {
    DRAWER.invoker = document.activeElement;
    bg.hidden = false; drawer.hidden = false;
    if (search) search.value = S.filter || '';
    renderDrawerBody();
    requestAnimationFrame(() => host.classList.add('open'));
    document.addEventListener('keydown', drawerKey, true);
    if (ab) ab.classList.add('active');
    const x = drawer.querySelector('.drawer-x'); if (x) x.focus();
  } else {
    host.classList.remove('open');
    document.removeEventListener('keydown', drawerKey, true);
    if (DRAWER.invoker && DRAWER.invoker.isConnected) { try { DRAWER.invoker.focus(); } catch (e) { } }
    if (ab) ab.classList.remove('active');
    /* v16.2 · 360 ms: covers the closing slide of the bubble animation
       (.3s) before the [hidden] attribute takes the drawer out of the a11y
       tree — re-opening within the window is still safe (the guard above) */
    setTimeout(() => { if (!DRAWER.open) { bg.hidden = true; drawer.hidden = true; } }, 360);
  }
}
function renderDrawerBody() {
  const { body } = drawerEls(); if (!body) return;
  renderModuli(body, true);   // v16 · same renderer as the old panel, without the duplicated header
  decorateA11y(body);
}

const OVL = { open: false, invoker: null };
function overlayEls() {
  let host = document.getElementById('overlayHost');
  if (!host) { host = document.createElement('div'); host.id = 'overlayHost'; document.body.appendChild(host); }
  if (!host.firstChild) {
    host.innerHTML =
      `<div class="ovl-bg" hidden></div>
       <div class="ovl" role="dialog" aria-modal="true" aria-labelledby="ovlTitle" hidden>
         <div class="ovl-head">
           <!-- ===== CHANGED v18 · overlay title = the sidebar button name
                ("Guide"), one word like every other panel. ===== -->
           <span class="ovl-title" id="ovlTitle">${icon('help')} Guide</span>
           <button class="ovl-x" aria-label="Close the guide">✕</button>
         </div>
         <div class="ovl-body"></div>
       </div>`;
    host.querySelector('.ovl-x').addEventListener('click', () => toggleGuida(false));
    host.querySelector('.ovl-bg').addEventListener('click', () => toggleGuida(false));
  }
  return { host, ovl: host.querySelector('.ovl'), bg: host.querySelector('.ovl-bg'), body: host.querySelector('.ovl-body') };
}
function ovlKey(ev) {
  if (ev.key === 'Escape') { ev.stopPropagation(); toggleGuida(false); return; }
  /* a11y (same pattern as modal()): Tab stays trapped inside the overlay */
  if (ev.key === 'Tab') {
    const { ovl } = overlayEls();
    const f = [...ovl.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  }
}
function toggleGuida(open) {
  const { host, ovl, bg, body } = overlayEls();
  const want = open === undefined ? !OVL.open : !!open;
  if (want === OVL.open) return;
  OVL.open = want;
  /* ===== NEW v20 · same as the drawer: opening/closing the Guide
     always brings the header back (it never hides while it is open —
     see the scroll watcher in init()). ===== */
  document.body.classList.remove('head-off');
  const ab = document.querySelector('.act-btn[data-panel="guida"]');
  if (want) {
    OVL.invoker = document.activeElement;
    bg.hidden = false; ovl.hidden = false;
    renderGuida(body);
    decorateA11y(body);
    requestAnimationFrame(() => host.classList.add('open'));
    document.addEventListener('keydown', ovlKey, true);
    if (ab) ab.classList.add('active');
    const x = ovl.querySelector('.ovl-x'); if (x) x.focus();
  } else {
    host.classList.remove('open');
    document.removeEventListener('keydown', ovlKey, true);
    if (OVL.invoker && OVL.invoker.isConnected) { try { OVL.invoker.focus(); } catch (e) { } }
    if (ab) ab.classList.remove('active');
    setTimeout(() => { if (!OVL.open) { bg.hidden = true; ovl.hidden = true; } }, 240);
  }
}

/* ============================================================
   ===== NEW v20 · HOMEPAGE (presentation of the site) =====
   ------------------------------------------------------------
   index.html ships a static #homePage section (hero, feature cards,
   CTAs): it is the first thing a visitor sees, it doubles as real
   crawlable content for search engines, and it costs the first paint
   nothing (plain HTML + CSS — no JS needed to show it). enterApp()
   dismisses it with a fade, marks the session so a reload in the same
   tab goes straight to the workbench (the skip flag is set on <html>
   by the bootstrap script in <head>, BEFORE the CSS parses — no
   flash of homepage), and fires the welcome tour on the very first
   visit — now that the workbench is actually visible.
   ============================================================ */
const HOME = { entered: false };
function enterApp(action) {
  if (HOME.entered) return;
  HOME.entered = true;
  try { sessionStorage.setItem('tutorHomeDone', '1'); } catch (e) { }
  document.body.classList.add('in-app');
  const hp = document.getElementById('homePage');
  /* ===== CHANGED v21 · the node is HIDDEN, not removed: the ⌂ Home
     button in the titlebar can bring the presentation back at any time
     (goHome()). The workbench stays mounted underneath — no state is
     lost, the panels keep their content. ===== */
  const flushToasts = () => toastQueue.splice(0).forEach(([m, t]) => toast(m, t));
  if (hp && !hp.hidden) {
    hp.classList.add('away');
    setTimeout(() => {
      hp.classList.remove('away');
      hp.hidden = true;
      flushToasts();
    }, 540);
  } else flushToasts();
  welcomeTour();
  if (action === 'browse') setTimeout(() => toggleDrawer(true), 580);   /* just after the homepage node is gone: the drawer slides over the workbench alone */
  const gs = $('#globalSearch');
  if (gs && !isMobile()) { try { gs.focus({ preventScroll: true }); } catch (e) { } }
}
/* ===== NEW v21 · ⌂ HOME: bring the presentation page back. The app
   stays mounted (the homepage is a full-viewport cover): coming back
   to the workbench is one “Start learning” away, and the session flag
   is cleared so even a reload from here shows the presentation. ===== */
function goHome() {
  if (DRAWER.open) toggleDrawer(false);
  if (OVL.open) toggleGuida(false);
  if (STG.open) toggleImpostazioni(false);
  if (ACCT.open) closeAccountPop();
  const hp = document.getElementById('homePage');
  if (!hp) return;
  HOME.entered = false;
  document.body.classList.remove('in-app', 'head-off');
  try { sessionStorage.removeItem('tutorHomeDone'); } catch (e) { }
  hp.hidden = false;
  hp.scrollTop = 0;
  /* restart the entrance cascade + re-arm the decorative FX */
  armHomeFx(hp);
  const first = hp.querySelector('.hp-btn');
  if (first) { try { first.focus({ preventScroll: true }); } catch (e) { } }
}
/* ============================================================
   ===== NEW v21 · armHomeFx() — the homepage motion layer =====
   ------------------------------------------------------------
   The presentation page ships as STATIC markup (crawlable, instant
   first paint, fully readable with JS off). This function adds the
   kinetic layer, and only when the page is actually on screen:
   1. .hp-live on the section starts every CSS animation (entrance
      cascade, floating letters, blobs, tokens, illustrations);
   2. the hero word "apart" is split into per-letter spans — each one
      keeps its own scatter rotation/offset and floats on its own
      phase (the word literally never settles: it stays "taken
      apart"); hovering it spreads the letters further apart;
   3. an IntersectionObserver reveals the feature cards with a
      stagger when they enter the viewport;
   4. a light pointer parallax moves the background layers at two
      different depths (desktop pointers only).
   Everything is idempotent (it runs on first load and again every
   time the ⌂ Home button comes back here) and respects
   prefers-reduced-motion (the CSS switch kills the animations; the
   parallax is skipped entirely).
   ============================================================ */
function armHomeFx(hp) {
  if (!hp || hp.hidden) return;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* -- 2 · split "apart" into floating letter tiles ------------------ */
  const letters = hp.querySelector('.hp-letters');
  if (letters && !letters.dataset.split) {
    letters.dataset.split = '1';
    const txt = letters.textContent;
    letters.textContent = '';
    [...txt].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'lt';
      s.textContent = ch;
      s.style.setProperty('--i', i);
      letters.appendChild(s);
    });
  }
  /* -- 3 · cards: staggered reveal when they cross the viewport ------- */
  if (!hp.dataset.io) {
    hp.dataset.io = '1';
    const cards = hp.querySelectorAll('.hp-card');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(ents => {
        ents.forEach(en => {
          if (!en.isIntersecting) return;
          const el = en.target;
          io.unobserve(el);
          /* small per-card stagger, in DOM order */
          const idx = [...cards].indexOf(el);
          setTimeout(() => el.classList.add('in'), Math.max(0, idx) * 90);
        });
      }, { root: hp, threshold: .18 });
      cards.forEach(c => io.observe(c));
    } else cards.forEach(c => c.classList.add('in'));
  }
  /* -- 4 · pointer parallax (two depths), desktop pointers only ------ */
  if (!REDUCED && !hp.dataset.px && window.matchMedia('(pointer: fine)').matches) {
    hp.dataset.px = '1';
    let raf = 0;
    hp.addEventListener('pointermove', ev => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = hp.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - .5;    /* -0.5 … 0.5 */
        const y = (ev.clientY - r.top) / r.height - .5;
        hp.style.setProperty('--px', x.toFixed(3));
        hp.style.setProperty('--py', y.toFixed(3));
      });
    });
    hp.addEventListener('pointerleave', () => {
      hp.style.setProperty('--px', '0');
      hp.style.setProperty('--py', '0');
    });
  }
  /* -- 1 · .hp-live restarts every animation from a clean slate ------- */
  hp.classList.remove('hp-live');
  void hp.offsetWidth;                    /* reflow: the cascade replays */
  hp.classList.add('hp-live');
}
/* ===== CHANGED v20 · the welcome tour moved out of init(): the toasts
   must wait until the visitor ENTERS the app, not fire behind the
   homepage that still covers the workbench.
   ===== CHANGED v21 · ONE toast, not six: the tour was a popup every
   few seconds (welcome, hints, run, charts, code, lines…) — noise for
   a visitor who just wants to start. The single welcome line points
   at the two things a newcomer really needs (where the exercises are,
   where the help is); the rest is discovered by using the app, and
   the Guide overlay explains everything on demand. ===== */
function welcomeTour() {
  if (storage.getSeen()) return;
  setTimeout(() => toast(isMobile()
    ? '👋 Welcome! Tap <b>☰</b> to pick an exercise, <b>?</b> if you get lost.'
    : '👋 Welcome! Open an exercise from the <b>☰ Modules</b> menu on the left — <b>? Guide</b> if you get lost.', ''), 800);
  storage.setSeen();
}

/* ============================================================
   ===== NEW v17 · THEME (dark / light) =====
   ------------------------------------------------------------
   Two real themes, two CSS files: styles.css (dark, the default,
   untouched) and styles-light.css (playful light surfaces, EVERY
   rule scoped under [data-theme="light"]). applyTheme() only
   flips the attribute on <html>: the switch is instantaneous,
   needs no reload and — thanks to the bootstrap <script> in
   index.html <head> — never flashes the wrong theme on load.
   In BOTH themes the terminals and every code-writing area stay
   BLACK (a terminal is dark in any theme).
   ============================================================ */
function currentTheme() { return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'; }
function applyTheme(name, opts = {}) {
  const t = name === 'light' ? 'light' : 'dark';
  if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else document.documentElement.removeAttribute('data-theme');
  try { localStorage.setItem(KEYS.theme, JSON.stringify(t)); } catch (e) { }
  /* the browser chrome (address bar on phones) follows the theme */
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t === 'light' ? '#f7f1e8' : '#17181c');
  /* if the Settings overlay is open, refresh its Appearance cards */
  const shost = document.getElementById('settingsHost');
  if (shost && shost.classList.contains('open')) {
    const b = shost.querySelector('.ovl-body');
    if (b) { renderImpostazioni(b); const x = shost.querySelector('.ovl-x'); if (x) x.focus(); }
  }
  /* ===== CHANGED v21 · NO theme toast: the whole interface flips in
     front of the user's eyes — a popup on top of it is noise. ===== */
  if (!opts.silent) { /* silent by design */ }
}

/* ============================================================
   ===== NEW v17 · ACCOUNT POPOVER (top-right button) =====
   ------------------------------------------------------------
   The titlebar button shows the avatar initial and the synthetic
   progress (done/total); a click opens a small popover with the
   account info, the progress bar and the autonomy, plus the
   "⚙ edit" entry that opens the Settings overlay. It closes on
   outside click, on Esc and whenever the auto-hide header goes
   away (body.head-off), so it can never float orphaned.
   ============================================================ */
const ACCT = { open: false };
function renderAccountChrome() {
  const b = document.getElementById('btnAccount');
  if (!b) return;
  const utente = storage.currentUser();
  const g = globalStats(S.progress);
  const ini = utente && utente.email ? utente.email.trim()[0].toUpperCase() : '?';
  b.innerHTML = `<span class="apa" aria-hidden="true">${esc(ini)}</span><span class="apn">${g.done}<i>/${g.total}</i></span>`;
  b.title = (utente ? utente.email + ' · ' : 'Not signed in · ') +
    `${g.done} of ${g.total} exercises completed — click for details`;
}
function renderAccountPop(pop) {
  const utente = storage.currentUser();
  const configured = supabaseConfigured();
  const sync = storage.syncStatus();
  const g = globalStats(S.progress);
  const auto = Math.max(0, Math.round((1 - g.avgAssist / 3) * 100));
  /* ===== CHANGED v18 · the site is ONLINE: the labels follow. "local
     mode"/"local only" read like an offline-only app — now the chip says
     what the user can DO (sign in to sync) or what is missing (cloud off). ===== */
  const syncLabel = !configured ? 'cloud not configured'
    : !utente ? 'not signed in — sign in to sync your progress across devices'
      : sync === 'synced' ? '☁ progress synced'
        : sync === 'syncing' ? '☁ syncing…'
          : sync === 'error' ? '⚠ last sync failed'
            : storage.isSyncEnabled() ? '☁ signed in' : '🔒 sync paused (privacy)';
  pop.innerHTML = `
    <div class="ap-head">
      <span class="apa big" aria-hidden="true">${utente && utente.email ? esc(utente.email.trim()[0].toUpperCase()) : '?'}</span>
      <div class="ap-who">
        <b>${utente && utente.email ? esc(utente.email) : 'Local student'}</b>
        <span>${syncLabel}</span>
      </div>
    </div>
    <div class="ap-prog">
      <div class="ap-row"><span>exercises completed</span><b>${g.done}<i>/${g.total}</i></b></div>
      <div class="bar" aria-hidden="true"><i style="width:${Math.round(g.done / Math.max(1, g.total) * 100)}%"></i></div>
      <div class="ap-row"><span>steps passed</span><b>${g.solved}</b></div>
      <div class="ap-row"><span>average autonomy</span><b>${auto}%</b></div>
      <div class="ap-row"><span>full hints used</span><b>${g.l3}</b></div>
    </div>
    <div class="ap-acts">
      <button class="btn primary tiny" data-ap="settings">⚙ edit — settings</button>
      <button class="btn tiny" data-ap="panel">open the full Account panel</button>
      ${utente
      ? `<button class="btn tiny danger" data-ap="logout">sign out</button>`
      : configured ? `<button class="btn tiny" data-ap="signin">sign in / create account</button>` : ''}
    </div>`;
  pop.querySelectorAll('[data-ap]').forEach(btn => btn.addEventListener('click', () => {
    const act = btn.dataset.ap;
    closeAccountPop();
    if (act === 'settings') toggleImpostazioni(true);
    else if (act === 'panel') { if (isMobile()) { dock.setMobileTab('account'); dock.renderMobilePanel(); dock.renderMobileNav(); } else dock.activateOrInsert('account'); }
    else if (act === 'logout') storage.esci().then(() => { toast('Signed out.', ''); renderAccountChrome(); renderStatus(); dock.refreshPanels(['account', 'progressi']); });
    else if (act === 'signin') { if (isMobile()) { dock.setMobileTab('account'); dock.renderMobilePanel(); dock.renderMobileNav(); } else dock.activateOrInsert('account'); }
  }));
}
function closeAccountPop() {
  const pop = document.querySelector('.acct-pop');
  if (!pop) return;
  pop.remove();
  ACCT.open = false;
  const b = document.getElementById('btnAccount');
  if (b) b.setAttribute('aria-expanded', 'false');
}
function toggleAccountPop() {
  if (ACCT.open) { closeAccountPop(); return; }
  const b = document.getElementById('btnAccount');
  if (!b) return;
  const pop = elHtml(`<div class="acct-pop" role="dialog" aria-label="Account and progress"></div>`);
  document.body.appendChild(pop);
  renderAccountPop(pop);
  decorateA11y(pop);
  ACCT.open = true;
  b.setAttribute('aria-expanded', 'true');
}

/* ============================================================
   ===== NEW v17 · SETTINGS OVERLAY (sidebar ⚙ button) =====
   ------------------------------------------------------------
   Three sections, one overlay (same open/close/focus-trap
   pattern as the Guide): Appearance (dark ⇄ light), Access
   credentials (password / email / recovery, via Supabase) and
   Privacy (what is stored where, cloud-mirror switch, export
   and delete). On mobile it opens from the ⚙ button of the
   header. The host stays empty until the first open (the LCP
   path is untouched, like drawer and guide).
   ============================================================ */
const STG = { open: false, invoker: null };
function settingsEls() {
  let host = document.getElementById('settingsHost');
  if (!host) { host = document.createElement('div'); host.id = 'settingsHost'; document.body.appendChild(host); }
  if (!host.firstChild) {
    host.innerHTML =
      `<div class="ovl-bg" hidden></div>
       <div class="ovl stg" role="dialog" aria-modal="true" aria-labelledby="stgTitle" hidden>
         <div class="ovl-head">
           <!-- ===== CHANGED v18 · same gear icon as the sidebar button +
                the single name "Settings". ===== -->
           <span class="ovl-title" id="stgTitle">${icon('gear')} Settings</span>
           <button class="ovl-x" aria-label="Close the settings">✕</button>
         </div>
         <div class="ovl-body"></div>
       </div>`;
    host.querySelector('.ovl-x').addEventListener('click', () => toggleImpostazioni(false));
    host.querySelector('.ovl-bg').addEventListener('click', () => toggleImpostazioni(false));
  }
  return { host, ovl: host.querySelector('.ovl'), bg: host.querySelector('.ovl-bg'), body: host.querySelector('.ovl-body') };
}
function stgKey(ev) {
  if (ev.key === 'Escape') { ev.stopPropagation(); toggleImpostazioni(false); return; }
  if (ev.key === 'Tab') {
    const { ovl } = settingsEls();
    const f = [...ovl.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  }
}
function toggleImpostazioni(open) {
  const { host, ovl, bg, body } = settingsEls();
  const want = open === undefined ? !STG.open : !!open;
  if (want === STG.open) return;
  STG.open = want;
  /* ===== NEW v20 · same as the drawer/guide: the header comes back
     the moment Settings opens or closes. ===== */
  document.body.classList.remove('head-off');
  const ab = document.querySelector('.act-btn[data-panel="impostazioni"]');
  if (want) {
    STG.invoker = document.activeElement;
    bg.hidden = false; ovl.hidden = false;
    renderImpostazioni(body);
    decorateA11y(body);
    requestAnimationFrame(() => host.classList.add('open'));
    document.addEventListener('keydown', stgKey, true);
    if (ab) ab.classList.add('active');
    const x = ovl.querySelector('.ovl-x'); if (x) x.focus();
  } else {
    host.classList.remove('open');
    document.removeEventListener('keydown', stgKey, true);
    if (STG.invoker && STG.invoker.isConnected) { try { STG.invoker.focus(); } catch (e) { } }
    if (ab) ab.classList.remove('active');
    setTimeout(() => { if (!STG.open) { bg.hidden = true; ovl.hidden = true; } }, 240);
  }
}
function renderImpostazioni(box) {
  box.innerHTML = '';
  const tema = currentTheme();
  const configured = supabaseConfigured();
  const utente = storage.currentUser();
  const syncOn = storage.isSyncEnabled();
  const wrap = elHtml(`<div class="stg-wrap">
    <h2 class="pan-title">Settings</h2>
    <p class="pan-sub" style="margin-bottom:10px">Appearance, access credentials, privacy and reset.</p>

    <!-- 1 · APPEARANCE -->
    <section class="stg-sec">
      <h3>🎨 Appearance</h3>
      <div class="theme-cards" role="radiogroup" aria-label="Interface theme">
        <button class="theme-card${tema === 'dark' ? ' on' : ''}" data-tcard="dark" role="radio" aria-checked="${tema === 'dark'}">
          <span class="tc-prev tc-dark"><i class="a"></i><i class="b"></i><i class="c"></i></span>
          <b>Dark</b><span class="tc-sub">the current one</span>
        </button>
        <button class="theme-card${tema === 'light' ? ' on' : ''}" data-tcard="light" role="radio" aria-checked="${tema === 'light'}">
          <span class="tc-prev tc-light"><i class="a"></i><i class="b"></i><i class="c"></i></span>
          <b>Light</b><span class="tc-sub">playful pastels</span>
        </button>
      </div>
      <p class="stg-note">In <b>both</b> themes the terminals and every code-writing area stay <b>black</b>.</p>
    </section>

    <!-- 2 · ACCESS CREDENTIALS -->
    <section class="stg-sec">
      <h3>🔑 Access credentials</h3>
      ${!configured ? `
        <!-- ===== CHANGED v18 · the site is ONLINE: this block is now a
             compact setup guide for the owner — the three steps, the exact
             place to paste them (config.js) and the health check that
             verifies the pair on load. ===== -->
        <p class="stg-note">⚠ Cloud accounts are <b>not configured</b> yet: there are no credentials to manage here and the progress stays in this browser. To activate the accounts on the deployed site:</p>
        <ol class="stg-steps">
          <li>create a project on <b>supabase.com</b> (free) and run <code>supabase/schema.sql</code> in its SQL editor;</li>
          <li>copy <b>Project URL</b> and the <b>anon public</b> key from Project Settings → API;</li>
          <li>paste them into <code>config.js → SUPABASE.url / anonKey</code> and redeploy.</li>
        </ol>
        <p class="stg-note">On the next load the app pings <code>/auth/v1/health</code>: a wrong URL or key shows <b>sync ✗</b> in the status bar right away. In Supabase → Authentication → URL Configuration set the <b>Site URL</b> to this site's address, so the confirmation emails land correctly.</p>` : !utente ? `
        <p class="stg-note">You are <b>not signed in</b>. Create an account or sign in from the Account panel (top-right button → “open the full Account panel”) to sync your progress across devices.</p>
        <div class="auth-card">
          <h3>Forgot your password?</h3>
          <div class="field"><label for="stgResetMail">Email of the account</label><input id="stgResetMail" type="email" placeholder="student@school.edu"></div>
          <div class="step-actions" style="margin-top:8px"><button class="btn" id="stgResetGo">✉ send recovery email</button></div>
          <div class="auth-msg" id="stgResetMsg"></div>
        </div>` : `
        <div class="user-chip">${icon('user')}<div><b>${esc(utente.email)}</b></div></div>
        <div class="auth-card">
          <h3>Change password</h3>
          <div class="auth-grid">
            <div class="field"><label for="stgPw1">New password (min 6 characters)</label><input id="stgPw1" type="password" placeholder="••••••••"></div>
            <div class="field"><label for="stgPw2">Repeat it</label><input id="stgPw2" type="password" placeholder="••••••••"></div>
          </div>
          <div class="step-actions" style="margin-top:8px"><button class="btn primary" id="stgPwGo">update password</button></div>
          <div class="auth-msg" id="stgPwMsg"></div>
        </div>
        <div class="auth-card">
          <h3>Change email</h3>
          <div class="field"><label for="stgMail">New email address</label><input id="stgMail" type="email" placeholder="student@school.edu"></div>
          <div class="step-actions" style="margin-top:8px"><button class="btn" id="stgMailGo">update email</button></div>
          <div class="auth-msg" id="stgMailMsg"></div>
          <p class="stg-note">Two-step: a <b>confirmation link</b> arrives at the new address — until you open it, the old email stays active.</p>
        </div>`}
    </section>

    <!-- 3 · PRIVACY -->
    <section class="stg-sec">
      <h3>🔒 Privacy and data</h3>
      <ul class="priv-list">
        <li><b>Cookies</b> — <b>none</b>: this site sets no cookies and uses no analytics/tracking (see the notice at the bottom of the page).</li>
        <li><b>Progress and drafts</b> — <code>localStorage</code> of this browser (only you can read it; it never leaves the device unless you sign in).</li>
        <li><b>Solution files of the book</b> — <code>IndexedDB</code> of this browser (public book material, no personal data).</li>
        <li><b>Cloud mirror</b> — only if you <b>sign in</b>: your progress row on the school's Supabase, tied to the account email. Nothing else is ever sent.</li>
        <li><b>Python runtime, charts, games</b> — downloaded from public CDNs (jsDelivr/Plotly) the first time you use them; they carry no personal data.</li>
      </ul>
      <div class="priv-row">
        <div>
          <b>Cloud sync</b>
          <span>${!configured ? 'needs a configured account' : !utente ? 'active only while signed in' : syncOn ? 'on — progress mirrors to your account' : 'off — nothing leaves this browser'}</span>
        </div>
        <button class="switch${syncOn ? ' on' : ''}" id="stgSyncSw" role="switch" aria-checked="${syncOn}"
          ${(!configured || !utente) ? 'disabled title="Available after signing in with the cloud configured"' : ''} aria-label="Cloud sync"><i></i></button>
      </div>
      <div class="step-actions" style="margin-top:12px">
        <button class="btn" id="stgExport">⬇ export my data (JSON)</button>
        <button class="btn danger" id="stgWipeLocal">🗑 delete local data</button>
        ${utente ? `<button class="btn danger" id="stgWipeCloud">☁ delete cloud data</button>` : ''}
      </div>
    </section>

    <!-- 4 · RESET (v19 · moved here from the titlebar) -->
    <section class="stg-sec">
      <h3>⟲ Reset</h3>
      <p class="stg-note">The reset buttons live here now: the titlebar keeps only Guide and Account.</p>
      <div class="step-actions" style="margin-top:8px">
        <button class="btn" id="stgResetLayout" title="Reopen the default panel layout — your progress is NOT touched">⟲ reset the panel layout</button>
        <button class="btn danger" id="stgResetAll">⟲ reset everything — progress included</button>
      </div>
    </section>
  </div>`);

  /* --- 1 · theme cards --- */
  wrap.querySelectorAll('[data-tcard]').forEach(c => c.addEventListener('click', () => {
    if (c.dataset.tcard === tema) return;
    applyTheme(c.dataset.tcard);
  }));

  /* --- 2 · credentials --- */
  const pwGo = wrap.querySelector('#stgPwGo');
  if (pwGo) pwGo.addEventListener('click', async () => {
    const msg = wrap.querySelector('#stgPwMsg');
    const p1 = wrap.querySelector('#stgPw1').value, p2 = wrap.querySelector('#stgPw2').value;
    if (p1.length < 6) { msg.className = 'auth-msg err'; msg.textContent = 'The password needs at least 6 characters.'; return; }
    if (p1 !== p2) { msg.className = 'auth-msg err'; msg.textContent = 'The two passwords do not match.'; return; }
    msg.className = 'auth-msg'; msg.textContent = 'Updating…';
    try { await storage.cambiaPassword(p1); msg.className = 'auth-msg ok'; msg.textContent = 'Password updated ✓'; wrap.querySelector('#stgPw1').value = ''; wrap.querySelector('#stgPw2').value = ''; }
    catch (er) { msg.className = 'auth-msg err'; msg.textContent = String(er.message || 'Update failed.'); }
  });
  const mailGo = wrap.querySelector('#stgMailGo');
  if (mailGo) mailGo.addEventListener('click', async () => {
    const msg = wrap.querySelector('#stgMailMsg');
    const em = wrap.querySelector('#stgMail').value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { msg.className = 'auth-msg err'; msg.textContent = 'Enter a valid email address.'; return; }
    msg.className = 'auth-msg'; msg.textContent = 'Sending…';
    try { await storage.cambiaEmail(em); msg.className = 'auth-msg ok'; msg.textContent = 'Confirmation link sent to ' + em + ' ✓'; }
    catch (er) { msg.className = 'auth-msg err'; msg.textContent = String(er.message || 'Update failed.'); }
  });
  const resetGo = wrap.querySelector('#stgResetGo');
  if (resetGo) resetGo.addEventListener('click', async () => {
    const msg = wrap.querySelector('#stgResetMsg');
    const em = wrap.querySelector('#stgResetMail').value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { msg.className = 'auth-msg err'; msg.textContent = 'Enter a valid email address.'; return; }
    msg.className = 'auth-msg'; msg.textContent = 'Sending…';
    try { await storage.inviaResetEmail(em); msg.className = 'auth-msg ok'; msg.textContent = 'Recovery email sent to ' + em + ' ✓'; }
    catch (er) { msg.className = 'auth-msg err'; msg.textContent = String(er.message || 'Send failed.'); }
  });

  /* --- 3 · privacy --- */
  const sw = wrap.querySelector('#stgSyncSw');
  if (sw && !sw.disabled) sw.addEventListener('click', () => {
    const novo = !storage.isSyncEnabled();
    storage.setSyncEnabled(novo);
    sw.classList.toggle('on', novo);
    sw.setAttribute('aria-checked', String(novo));
    sw.parentElement.querySelector('span').textContent = novo ? 'on — progress mirrors to your account' : 'off — nothing leaves this browser';
    renderStatus(); renderAccountChrome();
    toast(novo ? '☁ Cloud sync on.' : '🔒 Cloud sync off: everything stays in this browser.', novo ? 'ok' : '');
  });
  wrap.querySelector('#stgExport').addEventListener('click', () => {
    const st = storage.loadLocal();
    const payload = { app: APP.name, exportedAt: new Date().toISOString(), current: st.current, progress: st.progress };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tutor-progress-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('⬇ Progress exported as JSON (keep it: it is your only offline backup).', 'ok');
  });
  wrap.querySelector('#stgWipeLocal').addEventListener('click', async () => {
    const ok = await modal('<h3>🗑 Delete the local data?</h3><p>Progress, drafts and the panel layout of <b>this browser</b> will be erased (the chosen theme and the solutions database stay). The cloud copy, if any, is NOT touched.</p>', 'Delete');
    if (!ok) return;
    storage.resetLocal();
    toast('Local data deleted — reloading…', '');
    setTimeout(() => location.reload(), 700);
  });
  const wipeCloud = wrap.querySelector('#stgWipeCloud');
  if (wipeCloud) wipeCloud.addEventListener('click', async () => {
    const ok = await modal('<h3>☁ Delete the cloud data?</h3><p>The progress row of your account on the server will be erased. The data in this browser is NOT touched.</p>', 'Delete');
    if (!ok) return;
    try { await storage.azzeraRemoto(); toast('Cloud data deleted.', 'ok'); }
    catch (er) { toast('⚠ Could not delete the cloud data.', 'warn'); }
  });

  /* --- 4 · reset (v19 · moved here from the titlebar and the Progress
     panel: ONE place owns every "start over") --- */
  wrap.querySelector('#stgResetLayout').addEventListener('click', () => {
    dock.resetLayout();
    toast('⟲ Panel layout restored to the default.', 'ok');
  });
  wrap.querySelector('#stgResetAll').addEventListener('click', async () => {
    const ok = await modal('<h3>⟲ Reset everything?</h3><p>Progress, drafts and the panel layout go back to the initial state — the cloud copy, if any, is deleted too. This cannot be undone.</p>', 'Yes, reset');
    if (ok) resetAll();
  });

  box.appendChild(wrap);
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

/* ===== CHANGED v14 · plotly.js is NOT in index.html anymore (it used
   to load with <script defer> on every page load: 1.33 MB of which 77%
   unused, on the LCP critical chain). This loader is now the ONLY
   entry point: it fires on the first Plotly chart (or on a panel
   refresh of an already-produced chart) and downloads the library
   once — if the CDN is down, the card shows the error below. ===== */
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
    /* ===== CHANGED v21 · shorter game-start toast: the Game tab is already
       in front — only the controls are worth saying. ===== */
    toast(isMobile()
      ? '🎮 Game started: play with the <b>on-screen pad</b> · ■ Stop closes it.'
      : '🎮 Game started: click the canvas, play with arrows / space / q · ■ Stop closes it.', '');
    if (isMobile()) { dock.setMobileTab('gioco'); dock.renderMobilePanel(); dock.renderMobileNav(); }
    else dock.activateOrInsert('gioco');   /* v20 · the single tab bar lands on the game too */
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
  /* ===== NEW v16 · on a phone there is no keyboard: the on-screen pad
     appears while the game runs and disappears when it ends. ===== */
  const pad = document.getElementById('gamePad');
  if (pad) pad.hidden = !GAME.active;
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

  /* FIX v7 · panel bar: counter + "clear" (closes all)
     ===== NEW v16.2 · + ⛶ full screen: the wrap becomes the fullscreen
     element and this toolbar floats OVER the charts (sticky overlay, see
     .graphs-wrap.fs in styles.css). Hidden while there is nothing to show. ===== */
  const bar = elHtml(`<div class="graphs-toolbar"><span class="graphs-count"></span></div>`);
  const btnAll = elHtml(`<button class="btn tiny" title="Closes all charts">🧹 clear</button>`);
  btnAll.addEventListener('click', () => {
    GRAPHS.items.forEach(purgeGraph);
    GRAPHS.items.length = 0;
    dock.refreshPanels(['grafici']);
  });
  bar.appendChild(btnAll);
  const btnFs = elHtml(`<button class="btn tiny graphs-fs" title="Full screen — the toolbar overlays the charts (Esc exits)" aria-label="Toggle full screen">⛶ full screen</button>`);
  btnFs.style.display = GRAPHS.items.length ? '' : 'none';   // nothing to magnify yet
  bar.appendChild(btnFs);
  wrap.appendChild(bar);
  setupFs(wrap, btnFs);

  if (!GRAPHS.items.length) {
    /* ===== CHANGED v19 · one short line: a first-time visitor does not
       need the library lesson — the how-to lives in the Guide. ===== */
    wrap.appendChild(elHtml(`<div class="graphs-empty">No charts yet — run <code>plt.show()</code> or <code>fig.show()</code>.</div>`));
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
      /* ===== a11y (checklist M2) ===== the chart card is a <figure> with its
         header in <figcaption>; the Matplotlib PNG carries a descriptive
         alt (~150 chars, date included); the Plotly container is announced
         as an image with the chart title. */
      const descAlt = `Matplotlib figure produced by the program at ${t}. It is the PNG image generated with plt.show(): the chart data is not exposed as text, run the program again to view it once more.`;
      const card = elHtml(`<figure class="graph-card">
        <figcaption class="graph-card-head"><b>${esc(titolo)}</b><span class="badge">${t}</span>
          <button class="graph-close" title="Close this chart" aria-label="Close this chart">✕</button></figcaption>
        <div class="graph-card-body">${item.kind === 'plotly'
          ? `<div id="${item.id}" class="plotly-div" role="img" aria-label="${esc(titolo)} · interactive Plotly chart"></div>`
          : `<img src="data:image/png;base64,${item.b64}" alt="${esc(descAlt)}">`}</div>
      </figure>`);
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
/* ===== NEW v16 · on-screen game pad (mobile) =====
   A phone has no keyboard: without these buttons the games were
   watchable but not playable. The pad sends the SAME KEYDOWN/KEYUP
   events the canvas keyboard handler sends (pygame constants), so the
   runtime sees no difference. It only mounts on mobile and is visible
   while GAME.active (updateGameMeta toggles it).
   ===== CHANGED v16.1 · redesigned for immersion: bigger glassy keys with
   a pressed-look shadow, a wider pill for the fire button, labels under
   the glyphs, and a safe-area-aware bar. The same pad is reused in full
   screen mode, where it floats over the bottom of the canvas. ===== */
function buildGamePad() {
  const pad = elHtml(`<div class="game-pad" id="gamePad" hidden>
    <div class="gp-dpad" role="group" aria-label="Directional pad">
      <span></span><button class="gp" data-key="K_UP" aria-label="Up">▲</button><span></span>
      <button class="gp" data-key="K_LEFT" aria-label="Left">◀</button>
      <button class="gp" data-key="K_DOWN" aria-label="Down">▼</button>
      <button class="gp" data-key="K_RIGHT" aria-label="Right">▶</button>
    </div>
    <div class="gp-side">
      <button class="gp gp-fire" data-key="K_SPACE" aria-label="Space / fire"><span class="gp-glyph">␣</span><span class="gp-lbl">fire</span></button>
      <button class="gp gp-q" data-key="K_q" aria-label="Quit the game (q key)"><span class="gp-glyph">q</span><span class="gp-lbl">quit</span></button>
    </div>
  </div>`);
  pad.querySelectorAll('button.gp').forEach(b => {
    const key = b.dataset.key;
    const ch = key === 'K_q' ? 'q' : '';
    const down = ev => {
      ev.preventDefault();
      if (!GAME.active) return;
      b.classList.add('on');
      sendPygameEvent({ t: 'KEYDOWN', key, ch });
    };
    const up = ev => {
      if (ev.cancelable) ev.preventDefault();
      b.classList.remove('on');
      sendPygameEvent({ t: 'KEYUP', key });
    };
    /* pointer events (not touch events): one code path for touch, pen
       and mouse; pointerleave/cancel release the key even if the finger
       slides off the button */
    b.addEventListener('pointerdown', down);
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    b.addEventListener('pointerleave', up);
    b.addEventListener('contextmenu', ev => ev.preventDefault());
  });
  return pad;
}
function renderGioco(box) {
  box.innerHTML = '';
  /* ===== NEW v16.1 · the panel container is marked so the mobile layout
     can go edge-to-edge (no padding, dark stage) for immersion ===== */
  box.classList.add('gioco-panel');
  const wrap = elHtml(`<div class="game-wrap"></div>`);
  if (!GAME.lastFrame) {
    /* ===== CHANGED v19 · same treatment as the Charts panel: one line,
     the playable/keyboard details already live in the help below the
     canvas and in the Guide. ===== */
    wrap.appendChild(elHtml(`<div class="game-empty">No game yet — run a program with <code>pygame.display.flip()</code>.</div>`));
  } else {
    wrap.appendChild(elHtml(`<div class="game-meta" id="gameMeta">
      <span class="dim"><b>${GAME.meta.w}×${GAME.meta.h}</b></span>
      <span class="st">${GAME.active ? '🎮 <b>running</b> — click the canvas and play' : 'last frame: ' + new Date(GAME.meta.ts).toLocaleTimeString('en-GB')}</span>
      <span class="gm-actions">
        <button class="btn tiny" id="gameFsBtn" title="Full screen — immersive mode (mobile: auto-landscape)" aria-label="Toggle full screen immersive mode">⛶ full screen</button>
        <button class="btn tiny danger" id="gameStopBtn" title="Closes the running game (even if it stopped responding)">■ Stop</button>
      </span>
    </div>`));
    /* FIX v8 · the canvas lives in a flexible stage: it fills the
       remaining space and resizes (proportionally) instead of being
       cut off when the group is short. */
    const stage = elHtml(`<div class="game-stage"></div>`);
    const cv = elHtml(`<canvas id="gameCanvas" class="game-canvas" tabindex="0" role="img" aria-describedby="gameMeta"
      aria-label="Pygame game viewport: the frame drawn by your program. Click here, then play with arrows / space / q"
      title="Click here, then use arrows / space / q">Your browser cannot render the game canvas.</canvas>`);
    stage.appendChild(cv);
    wrap.appendChild(stage);
    /* ===== NEW v16 · on-screen controls on mobile: a phone has no
       keyboard, so the game was not playable there. ===== */
    if (isMobile()) wrap.appendChild(buildGamePad());
    wrap.appendChild(elHtml(`<div class="game-help">${isMobile()
      ? '📱 Play with the <b>on-screen pad</b>: ◀ ▲ ▼ ▶ move · ␣ fire · q quits. <b>⛶ full screen</b> for maximum immersion (the phone rotates by itself where supported). ■ Stop closes the game.'
      : '🖱 Click the canvas to activate the keyboard: <span class="kbd">←</span><span class="kbd">→</span><span class="kbd">↑</span><span class="kbd">↓</span> move, <span class="kbd">space</span> shoots, <span class="kbd">q</span> exits. The mouse passes straight to the game. <b>⛶ full screen</b> hides everything else.'}</div>`));
    const stopBtn = wrap.querySelector('#gameStopBtn');
    stopBtn.style.display = GAME.active ? '' : 'none';
    stopBtn.addEventListener('click', () => { stopPygameGame(); toast('Game close requested…', ''); });
    /* ===== NEW v16.1 · immersive full screen: the whole game wrap (meta
       bar + stage + pad) becomes the fullscreen element, so the canvas
       fills the screen, the pad floats over its bottom edge and the meta
       bar becomes a translucent overlay. On phones it also asks the
       orientation to lock to landscape (best effort: iOS Safari refuses,
       the help text invites a hand rotation). Esc / ⛶ exits.
       ===== CHANGED v16.2 · shared with the Charts panel: setupFs. ===== */
    setupFs(wrap, wrap.querySelector('#gameFsBtn'), { landscape: true });
    attachGameInput(cv);
  }
  box.appendChild(wrap);
  requestAnimationFrame(() => { drawGameFrame(); if (GAME.focused) { const c = document.getElementById('gameCanvas'); if (c) c.focus(); } });
}

/* ===== CHANGED v16.2 · setupGameFs → setupFs: the SAME helper now drives
   the full screen of the Game panel AND of the Charts panel. The button is
   marked data-fsbtn and its wrap data-fswrap, so ONE document-level
   listener (installed once) keeps every button in sync with the real
   fullscreen state: the panels re-render often (new frame, tab switch) and
   must never accumulate listeners. In full screen the control bars float
   OVER the content (.game-wrap.fs / .graphs-wrap.fs in styles.css). */
let _fsListenerOn = false;
function setupFs(wrap, btn, opts = {}) {
  if (!wrap || !btn) return;
  wrap.dataset.fswrap = '1';
  btn.dataset.fsbtn = '1';
  const sync = () => {
    const on = document.fullscreenElement === wrap;
    wrap.classList.toggle('fs', on);
    btn.textContent = on ? '⤡ exit' : '⛶ full screen';
    btn.setAttribute('aria-label', on ? 'Exit full screen' : (btn.title || 'Enter full screen'));
  };
  btn.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement === wrap) {
        await document.exitFullscreen();
      } else {
        await wrap.requestFullscreen();
        /* landscape fills the phone: best effort (Game only), silently
           ignored where unsupported (iOS Safari: the user rotates by hand) */
        if (opts.landscape && screen.orientation && typeof screen.orientation.lock === 'function') {
          screen.orientation.lock('landscape').catch(() => { });
        }
      }
    } catch (err) {
      toast('⚠ Full screen is not available in this browser (or was blocked).', 'warn');
    }
  });
  if (!_fsListenerOn) {
    _fsListenerOn = true;
    document.addEventListener('fullscreenchange', () => {
      const on = document.fullscreenElement;
      document.querySelectorAll('[data-fsbtn]').forEach(b => {
        const w = b.closest('[data-fswrap]');
        if (!w) return;
        const active = on === w;
        w.classList.toggle('fs', active);
        b.textContent = active ? '⤡ exit' : '⛶ full screen';
      });
      /* Plotly figures must re-fit the new container size after the
         fullscreen transition (Matplotlib PNGs scale on their own via
         max-width). The small delay lets the new layout settle first. */
      setTimeout(() => {
        if (window.Plotly) document.querySelectorAll('.plotly-div[data-rendered]').forEach(el => {
          try { Plotly.Plots.resize(el); } catch (e) { }
        });
      }, 240);
    });
  }
  sync();
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
  /* ===== a11y (checklist M4) ===== the hint keywords behave as real
     buttons: role + tabindex (they are activated by keyboard below). */
  return esc(f).replace(/\{\{(.+?)\}\}/g, (m, w) =>
    `<span class="kw${h[w] ? ' used' : ''}" role="button" tabindex="0" data-w="${esc(w)}">${esc(w)}</span>`);
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
        <p class="muted" style="margin-top:7px;font-size:0.71875rem">Transcribe it yourself in the editor below: the check stays active.</p></div>`);
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
  else dock.refreshPanels(['esercizio', 'console', 'progressi', 'codice', 'righe']);   // ===== CHANGED v16 · moduli is a drawer now, not a dock tab — v16.2: traccia is gone too (the statement lives in the Exercise panel) =====
  if (DRAWER.open) toggleDrawer(false);   // ===== CHANGED v16 · picking an exercise closes the drawer (both modes: its backdrop blocks the work area) =====
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
  dock.refreshPanels(['esercizio', 'console', 'progressi', 'codice', 'righe']);   // ===== CHANGED v16 · moduli is a drawer now, not a dock tab =====
  if (DRAWER.open) renderDrawerBody();
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
  /* ===== CHANGED v21 · "Execution started…" is gone (the outcome arrives
     a moment later with its own feedback); ONLY the one-time runtime
     download is announced, because it explains a long wait. ===== */
  if (getStatus().status !== 'ready')
    toast('First run: downloading the Python runtime (~10 MB), only this time…', '');
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
  /* ===== NEW v16.1 · a chart produced by THIS run is recorded on the run
     itself: plotting exercises (16-9 "World Fires", 16-1…) print nothing,
     and the console block used to say "(no output: so far your code only
     defines names)" — the exact opposite of the truth, and the student
     read it as "my solution is rejected". Now the block points to the
     Charts panel, and on the phone the app switches straight to it. ===== */
  if (res.ok && GRAPHS.items.length > mediaBefore.g) run.chart = true;
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
      else if (mod) toast('⌨ Your version ran — see the output in the Console.', 'ok');
      /* ===== NEW v16.1 · chart-only runs get their own message: the output
         is not "missing", it lives in the Charts panel
         ===== CHANGED v21 · shorter (the tab bar already lands on the
         chart: the toast confirms, it doesn't have to give directions). ===== */
      else if (run.chart && !outputUtile(res.output).trim())
        toast((mod ? '⌨ modified version — ' : '') + '📊 The program drew a chart.', 'ok');
      /* ===== CHANGED v21 · the plain "open the Console" toast is GONE: since
         v20 the tab bar lands on the panel that holds the result, so the
         direction was already given — a toast on top of it was noise. ===== */
    }
    /* ===== CHANGED v16.1 · where the phone lands after the run: the panel
     that actually holds the result — the Game for a game, the Charts for a
     chart, the Console otherwise. Before, a chart run dumped the student
     on an empty-looking console. ===== */
    if (isMobile()) {
      dock.setMobileTab(run.game ? 'gioco' : (run.chart && !outputUtile(res.output).trim() ? 'grafici' : 'console'));
      dock.renderMobilePanel(); dock.renderMobileNav();
    }
    /* ===== NEW v20 · the desktop single tab bar lands on the panel that
       holds the result too (the same rule the phone already used): with
       one bar the output would otherwise stay hidden behind the Exercise
       tab, like it was visible by default in the old split layout. ===== */
    else dock.activateOrInsert(run.game ? 'gioco' : (run.chart && !outputUtile(res.output).trim() ? 'grafici' : 'console'));
  } else if (res.error && res.error.tipo === 'TimeoutError' && GAME.meta.ts > mediaBefore.f) {
    // ===== MODIFIED · a Pygame game had been running a while without closing:
    // the watchdog stopped it: it's not a student error =====
    run.err = null; run.game = true;
    toast('🎮 The game was closed by the tutor (time limit or inactivity): see the frames in the Game panel.', 'ok');
    if (isMobile()) { dock.setMobileTab('gioco'); dock.renderMobilePanel(); dock.renderMobileNav(); }
    else dock.activateOrInsert('gioco');   /* v20 · same landing on the single tab bar */
  } else {
    toast('Execution error — see the Console for the translated traceback.', 'err');
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
    else dock.activateOrInsert('console');   /* v20 · the traceback lands in front on the single tab bar */
  }
  saveProgress();
  dock.refreshPanels(['console', 'esercizio', 'progressi']);
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
  /* ===== CHANGED v21 · same quiet-start rule as the main run. ===== */
  if (getStatus().status !== 'ready')
    toast('First run: downloading the Python runtime (~10 MB), only this time…', '');
  const mediaBefore = snapMedia();
  const res = await runPythonCode(code, vFiles, { mode: sol.mode, entry });
  if (res.busy) { toast(res.error && res.error.hint || 'A run is already in progress.', 'warn'); return; }
  const nFile = Object.keys(files).filter(n => n !== 'main.py').length;
  const run = { t: nowT(), dur: res.durataMs, out: res.output || '', err: res.error || null, entry, proj: nFile };
  if (mod) run.custom = true;
  if (res.ok && GAME.meta.ts > mediaBefore.f) run.game = true;
  if (res.ok && GRAPHS.items.length > mediaBefore.g) run.chart = true;   // ===== NEW v16.1 · see eseguiEsercizio =====
  if (!res.ok && res.error && res.error.tipo === 'TimeoutError' && GAME.meta.ts > mediaBefore.f) {
    run.err = null; run.game = true;   // game closed by the watchdog: not an error
  }
  st.runs.push(run); st.runs = st.runs.slice(-12);
  if (run.game) {
    /* ===== CHANGED v21 · shorter: the Game tab is already in front — the
       toast just reminds the controls. ===== */
    toast((mod ? '⌨ modified version — ' : '') + '🎮 Game started: arrows / space / q to play · ■ Stop closes it.', 'ok');
    if (isMobile()) { dock.setMobileTab('gioco'); dock.renderMobilePanel(); dock.renderMobileNav(); }
    else dock.activateOrInsert('gioco');   /* v20 · same landing on the single tab bar */
  } else if (res.ok) {
    const soAll = e.steps.flatMap(s => s.so || []);
    const ver = verificaOutput(soAll, res.output || '');
    if (ver) st.verificato = ver.ok; else delete st.verificato;
    /* ===== CHANGED v16.1 · chart-only project runs: message + phone
       landing panel follow the actual result (Charts), not the console ===== */
    if (run.chart && !outputUtile(res.output).trim()) {
      toast((mod ? '⌨ modified version — ' : '') + '📊 The program drew a chart.', 'ok');
      if (isMobile()) { dock.setMobileTab('grafici'); dock.renderMobilePanel(); dock.renderMobileNav(); }
      else dock.activateOrInsert('grafici');   /* v20 · same landing on the single tab bar */
    } else {
      toast((mod ? '⌨ modified version — ' : '') + '✓ Full program run (' + nFile + ' files) — see the Console.', 'ok');
      if (isMobile()) { dock.setMobileTab('console'); dock.renderMobilePanel(); dock.renderMobileNav(); }
      else dock.activateOrInsert('console');   /* v20 · same landing on the single tab bar */
    }
  } else {
    toast((mod ? '⌨ modified version — ' : '') + 'execution error — see the Console for the traceback.', 'err');
    if (isMobile()) { dock.setMobileTab('console'); dock.renderMobilePanel(); dock.renderMobileNav(); }
    else dock.activateOrInsert('console');   /* v20 · same landing on the single tab bar */
  }
  saveProgress();
  dock.refreshPanels(['console', 'esercizio', 'progressi']);
  renderStatus();
}
function notaSoluzioneNonEseguibile(st, sol) {
  const motivo = sol.reason === 'django' ? 'Django project' : 'project not runnable in the browser';
  toast('📦 This exercise modifies a ' + motivo + ': the files are archived in the database, but running it requires Python locally.', 'warn');
  st.runs.push({ t: nowT(), dur: 0, out: '📦 Not runnable in the browser (' + motivo + ').\nThe steps of this exercise are fragments of DIFFERENT files of a complete project (archived in the local database): they do not form a single Python program. To run it, replicate the files locally with Python installed.', err: null, sol: true });
  st.runs = st.runs.slice(-12);
  saveProgress(); dock.refreshPanels(['console']); renderStatus();
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
  const soluzioneGrafico = GRAPHS.items.length > mediaBefore.g;   // ===== NEW v16.1 · chart runs of the official solution are labeled as such =====
  if (res.ok && soluzioneGrafico) run.chart = true;
  st.runs.push(run); st.runs = st.runs.slice(-12);
  /* FIX v8 · if the solution is a GAME, the toast says so clearly:
     before it only mentioned the "Console" and the student didn't open the
     Game panel. NB: this toast arrives at the end of the game (the start is
     announced by "🎮 Game started" on the first frame): the text invites
     replaying. ===== CHANGED v16.1 · chart solutions get their destination
     too (the Charts panel), instead of pointing at an empty console. ===== */
  const dove = run.game
    ? 'it was the <b>game</b>: review it in the <b>Game</b> panel — to replay, press ▶ run again'
    : (run.chart && !outputUtile(run.out).trim()
        ? 'it drew a <b>chart</b>: see it in the <b>Charts</b> panel'
        : 'see the Console');
  toast(automatica
    ? (nomeMancante
      ? `🧩 Your code uses the name "${esc(nomeMancante)}" which is not yet defined: this is a step that modifies a larger program and cannot run on its own. The <b>full solution</b> ${dove}.`
      : `🧰 Your code doesn't produce output yet (it only defines classes/functions): the full solution ${dove}.`)
    : `📚 Solution run: ${run.game ? 'game in the <b>Game</b> panel, output in the Console.' : (run.chart && !outputUtile(run.out).trim() ? 'chart in the <b>Charts</b> panel.' : 'output in the Console.')}`, 'ok');
  if (isMobile()) { dock.setMobileTab(run.game ? 'gioco' : (run.chart && !outputUtile(run.out).trim() ? 'grafici' : 'console')); dock.renderMobilePanel(); dock.renderMobileNav(); }
  else dock.activateOrInsert(run.game ? 'gioco' : (run.chart && !outputUtile(run.out).trim() ? 'grafici' : 'console'));   /* v20 · same landing on the single tab bar */
  saveProgress(); dock.refreshPanels(['console', 'esercizio', 'progressi']); renderStatus();
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
    ta.name = `step-code-${e.id}-${idx}`;
    ta.className = 'code-input'; ta.spellcheck = false; ta.autocapitalize = 'off'; ta.autocomplete = 'off';
    ta.setAttribute('aria-label', `Python code editor, step ${idx + 1} of ${e.steps.length} of exercise ${e.id}`);
    /* ===== CHANGED v18 · BIGGER writing zone: the step textarea starts at
       4 rows minimum (was 2, sized on the expected lines only) and grows
       with what the student types (armAutogrow, 132px minimum — see
       .code-input in styles.css). More room to think, less scrolling in
       the small box. ===== */
    ta.rows = Math.max(4, nExp + 2);
    ta.placeholder = nExp > 1 ? `write the ${nExp} Python lines for this step here…` : 'write the Python line for this step here…';
    ta.value = S.drafts[e.id + '::' + idx] || '';
    armAutogrow(ta, 132);
    ta.addEventListener('input', () => { S.drafts[e.id + '::' + idx] = ta.value; });
    ta.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); doVerify(e, idx, ta); }
    });
    row.appendChild(ta); area.appendChild(row);
    card.appendChild(area);
    const acts = elHtml(`<div class="step-actions">
      <button class="btn primary" title="Ctrl/Cmd+Enter">✓ Check</button>
      <button class="btn ghost" title="Show the full line (after an attempt!)">🪂 Full hint</button>
      <span class="assist-line muted" style="font-size:0.65625rem">Ctrl+Enter to check</span>
    </div>`);
    acts.querySelectorAll('button')[0].addEventListener('click', () => doVerify(e, idx, ta));
    acts.querySelectorAll('button')[1].addEventListener('click', () => fullParachute(e, idx));
    card.appendChild(acts);
    card.appendChild(elHtml(`<div class="step-msg" id="stepMsg"></div>`));
  } else if (s.ta) {
    /* ===== CHANGED v18 · same bigger-zone treatment for the written-answer
       step: the reflection textarea grows with the answer (96px minimum). ===== */
    const refl = elHtml(`<div class="reflect-box"><textarea id="refTa" aria-label="Written answer, step ${idx + 1} of ${e.steps.length}: ${esc(s.ta)}" placeholder="${esc(s.ta)}">${esc(exState(e.id).notes[idx] || '')}</textarea></div>`);
    card.appendChild(refl);
    const ta = refl.querySelector('#refTa');
    ta.name = `written-answer-${e.id}-${idx}`;
    armAutogrow(ta, 96);
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
  /* ===== a11y (checklist M4) ===== the .kw keywords are real buttons:
     Enter and Space activate them from the keyboard (SC 2.1.1). */
  card.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    const kw = ev.target.closest('.kw');
    if (kw) { ev.preventDefault(); onKwClick(document.getElementById('hintArea'), e, idx, kw.dataset.w, kw); }
  });
  return card;
}
function runRow(e, primary) {
  const st = exState(e.id);
  const armato = codiceArmato(e, st);   // ===== NEW v10 · modified version in the editor? =====
  const row = elHtml(`<div class="ex-actions">
    <button class="btn ${primary ? 'primary' : ''}" data-run="1">${icon('term')} ${primary ? '▶ Run and check the output' : '▶ Run program'}</button>
    ${e.noRun ? '' : `<button class="btn tiny" id="btnCodiceOpen" data-code="1" title="Open the full code this button runs: you can modify it and run it again — the output lands in the Console tab">⌨ code</button>`}
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
  /* ===== CHANGED v15 · PERFORMANCE: `wrap` stays DETACHED while every
       section below is built and appended — the panel mutates the LIVE
       DOM exactly once, at the end of the function. Before, `wrap` was
       attached to `box` up front, so each of the ~8 appendChild calls
       re-invalidated the layout of a connected subtree (renderEsercizio
       is one of the two functions the trace flagged for Layout work).
       The empty container + final single append also collapse the whole
       build into one parse+style+layout pass. ===== */
  // ===== Prerequisite banner =====
  if (e.prereq) {
    const prereqIds = Array.isArray(e.prereq) ? e.prereq : [e.prereq];
    const info = prereqIds.map(pid => {
      const pex = EX[pid];
      const pst = exState(pid);
      const label = pex ? `${pid} · ${esc(pex.t)}` : `${pid} (not found)`;
      const stateIcon = pst.done ? '✓' : (pst.solved > 0 ? '◐' : '○');
      return `<span style="font-family:var(--mono);font-size:0.6875rem;color:${pst.done ? 'var(--ok)' : 'var(--acc)'}">${stateIcon} ${label}</span>`;
    }).join(' · ');
    const banner = elHtml(`<div class="note" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;border-left-color:var(--acc);background:var(--acc-soft)">
      <span>📚 <b>Extends the code of:</b> ${info}</span>
      <label style="margin-left:auto;font-size:0.71875rem;display:flex;gap:5px;align-items:center;cursor:pointer">
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
        <summary style="cursor:pointer;font-family:var(--mono);font-size:0.75rem;color:var(--acc)">
          📄 ${esc(name)} <span style="font-size:0.65625rem;color:var(--faint);font-weight:400">(already available — do NOT rewrite it)</span>
        </summary>
        <pre style="background:#141519;padding:8px;border-radius:6px;margin-top:5px;font-size:0.71875rem;overflow:auto">${esc(typeof content === 'string' ? content : '(binary file — image already provided to the runtime)')}</pre>
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
      const shown = solIdx.names.slice(0, 6).map(x => `<code style="font-size:0.6875rem">${esc(x)}</code>`).join(' · ');
      wrap.appendChild(elHtml(`<div class="note" style="background:rgba(111,211,231,.13);border-left-color:var(--cyan)">
        <b>🧰 Support files in the runtime (${n}):</b> ${shown}${n > 6 ? ` <span class="muted">…and ${n - 6} more</span>` : ''}<br>
        <span class="muted" style="font-size:0.6875rem">From the local solutions database: import them with <code>import</code>/<code>from</code> or read them with <code>Path(...)</code> without recreating them. If your code produces no output, the full solution is run automatically to show you the correct one.</span>
      </div>`));
    }
  }
  const doneCount = st.solved;
  const aut = autonomiaOf(S.progress, e.id);   // v15 · computed once, it was called twice below
  wrap.appendChild(elHtml(`<div class="ex-head">
    <h1>${esc(e.t)}</h1><span class="orig">"${esc(e.orig)}"</span>
    <div class="ex-meta">
      <span class="chip acc">Ch. ${e.ch} · ${esc(CH[e.ch - 1].t)}</span>
      <span class="chip">${esc(e.id)}</span>
      <span class="chip ${e.lvl === 3 ? 'warn' : e.lvl === 2 ? 'purple' : 'ok'}">${'●'.repeat(e.lvl)}${'○'.repeat(3 - e.lvl)} ${e.lvl === 3 ? 'Challenging' : e.lvl === 2 ? 'Medium' : 'Easy'}</span>
      <span class="meter" title="Syntactic autonomy index on solved steps">
        <span class="bar"><i style="width:${aut}%"></i></span>
        <span>${aut}% autonomy</span></span>
    </div>
    <div class="ex-progress">${e.steps.map((s, i) =>
    `<span class="p-dot ${i < doneCount ? 'done' : (i === doneCount && !st.done ? 'cur' : '')}" aria-hidden="true"></span>`).join('')}
      <span class="muted" style="font-size:0.6875rem;margin-left:6px">${Math.min(doneCount, e.steps.length)}/${e.steps.length} steps</span></div>
  </div>`));
  wrap.appendChild(elHtml(`<details class="ex-statement" ${doneCount === 0 ? 'open' : ''}>
    <summary>📖 Exercise statement (from the book)</summary>
    <div class="body">${e.tr}</div>
    <!-- ===== NEW v16.2 · chapter concepts: they lived in the removed
         Walkthrough panel; now they sit right under the statement, so the
         Exercise tab is self-contained (statement + concepts + steps). ===== -->
    <div class="concepts ex-concepts" aria-label="Chapter ${e.ch} concepts">
      <span class="concepts-lbl">Ch. ${e.ch} concepts</span>
      ${CH[e.ch - 1].concepts.map(x => `<span class="chip">${esc(x)}</span>`).join('')}
    </div></details>`));
  for (let i = 0; i < Math.min(doneCount, e.steps.length); i++) {
    const s = e.steps[i];
    const d = elHtml(`<details class="step-done">
      <summary><span class="n">✓</span><span class="ph">${esc(plainFrase(s.f))}</span>
        <span class="muted" style="font-size:0.625rem;flex:none">step ${i + 1}</span></summary>
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
  /* v15 · the only live-DOM mutation of the whole build: one append of
     the fully populated tree → one style/layout pass instead of one per
     section */
  box.innerHTML = ''; box.appendChild(wrap);
  requestAnimationFrame(() => {
    const c = box.querySelector('#stepCard') || box.querySelector('.ex-final');
    if (c) c.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  });
}

/* ============================================================
   ===== NEW v10 · CODE PANEL (full-program editor) =====
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
   · ===== CHANGED v18 · EDITOR ONLY: the terminal that used to
     live below the textarea is gone. The output of ▶ Run goes
     to the Console tab (the app's single console).
     ===== CHANGED v19 · the compact "output in the Console" note
     is gone too — pure editor, zero footer noise; =====
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
    <p class="pan-sub righe-sub" style="margin-bottom:8px">Only the lines of this exercise — the full program is in <b>⌨ Code</b>. "▶ run" executes it <b>with your edits</b>.</p>
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
      sub.innerHTML = `Only the <b>lines of your exercise</b> — the whole project (${slice.nPy} files · ▶ <code>${esc(slice.entry)}</code>) lives in ⌨ Code: ${rif}. Your edits flow to the module via the <b>⚙ bridge</b>.` +
        (slice.prev ? ` <span class="muted">Extends ${esc(slice.prev.id)} "${esc(slice.prev.t)}".</span>` : '');
      sub.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => apriModulo(b.dataset.open)));
    } else if (slice.modo === 'files') {
      sub.innerHTML = `<b>Multi-file</b> exercise: your files, one per block — "▶ run" launches <b>▶ ${esc(slice.main)}</b>.`;
    } else {
      const nBase = slice.base ? slice.base.split('\n').filter(l => l.trim()).length : 0;
      const nRighe = slice.righe ? slice.righe.split('\n').filter(l => l.trim()).length : 0;
      sub.innerHTML = `Only the <b>exercise lines</b> (${nRighe} passed so far)${nBase ? ` · prerequisite base hidden (${nBase} lines, re-added by ▶ run)` : ''}${slice.supporto.length ? ` · support modules: ${esc(slice.supporto.join(', '))}` : ''} — the full program is in ⌨ Code.`;
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
        ta.name = `exercise-lines-${e.id}-${k}`;
        ta.className = 'codice-ta rg-ta'; ta.spellcheck = false; ta.autocapitalize = 'off'; ta.autocomplete = 'off';
        ta.setAttribute('aria-label', `Editor of your exercise lines${slice.passi.length > 1 ? ' — step ' + (k + 1) + ' of ' + slice.passi.length : ''}`);
        ta.rows = Math.max(3, n + 1);
        ta.value = val;
        ta.placeholder = 'your exercise lines…';
        armAutogrow(ta, 64);   // ===== NEW v17 · the block grows with its lines =====
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
        ta.name = `project-file-${e.id}-${fn}`;
        ta.className = 'codice-ta rg-ta'; ta.spellcheck = false; ta.autocapitalize = 'off'; ta.autocomplete = 'off';
        ta.setAttribute('aria-label', `Editor of the project file ${fn}${main ? ' — file executed by run' : ''}`);
        ta.rows = Math.max(3, (cur || orig).split('\n').length + 1);
        ta.value = cur;
        ta.placeholder = `content of ${fn}…`;
        armAutogrow(ta, 64);   // ===== NEW v17 =====
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
      ta.name = `exercise-lines-${e.id}`;
      ta.className = 'codice-ta rg-ta'; ta.spellcheck = false; ta.autocapitalize = 'off'; ta.autocomplete = 'off';
      ta.setAttribute('aria-label', `Editor of the exercise lines in ${slice.main}`);
      ta.rows = Math.max(5, (val || righe).split('\n').length + 2);
      ta.value = val;
      ta.placeholder = 'Pass the first step in the Exercise panel, or write the lines of your program here directly…';
      armAutogrow(ta, 96);   // ===== NEW v17 =====
      head.querySelector('[data-open]').addEventListener('click', () => apriModulo(slice.main));
      const blocco = mkBloco(head, ta, null, { orig: righe, divergente, base });
      if (divergente) blocco.classList.add('extra');
      blocchi.appendChild(blocco);
    }
    /* --- actions (v19: no output note, no status noise — the badge and
       the Console tab say everything) --- */
    const acts = elHtml(`<div class="ex-actions" style="margin-top:0">
      <button class="btn primary" id="rgRun">▶ run</button>
      <button class="btn" id="rgReset" title="Discard the edits: go back to the exercise's original lines (they apply to the ⌨ Code editor too)">⟲ restore original</button>
      <span class="rt-note" id="rgStatus" hidden></span>
    </div>`);
    wrap.appendChild(acts);
    /* --- input → arms/disarms the overrides (the same ones as ⌨ Code) --- */
    /* ===== CHANGED v19 · the constant "Ctrl+Enter to run · edits are
       saved…" noise is gone: the note stays hidden and speaks only when
       there is something to SAY (bridge warnings, values that did not
       flow through). ===== */
    const aggiornaStato = (avviso) => {
      document.querySelectorAll('#rgStatus').forEach(el => {
        el.textContent = avviso || '';
        el.hidden = !avviso;
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
    requestAnimationFrame(() => { aggiornaBadgeCodice(e); });
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
    b.appendChild(elHtml(`<span class="run-meta">${esc(r.t)} · ${r.dur} ms · ${r.game ? '🎮 game run' : (r.chart ? '📊 chart run' : 'solution output')}</span>`));
    if (r.out) b.appendChild(elHtml(`<div class="run-out">${esc(r.out)}</div>`));
    if (r.game) b.appendChild(elHtml(`<span class="run-hint">🎮 The game (full solution) has been run in the Game panel: it's interactive — click the canvas and play.</span>`));
    if (r.chart && !r.out) b.appendChild(elHtml(`<span class="run-hint">📊 The full solution drew its chart: open the <b>Charts</b> panel to see it.</span>`));   // v16.1
    if (r.err) {
      b.appendChild(elHtml(`<div class="run-err">${esc(r.err.tipo)}: ${esc(r.err.messaggio || '')}</div>`));
      if (r.err.hint) b.appendChild(elHtml(`<span class="run-hint">${esc(r.err.hint)}</span>`));
    }
  } else {
    b.appendChild(elHtml(`<span class="run-cmd">student@tutor:~$ python ${esc(r.entry || fileSafe(e.id) + '.py')}</span>`));
    b.appendChild(elHtml(`<span class="run-meta">${esc(r.t)} · ${r.dur} ms · ${r.game ? '🎮 game run' : (r.err ? 'exit with error' : 'clean exit')}${r.proj ? ' · full program (' + r.proj + ' files)' : ''}${r.custom ? ' · ⌨ modified version' : ''}</span>`));
    if (r.out) b.appendChild(elHtml(`<div class="run-out">${esc(r.out)}</div>`));
    /* ===== CHANGED v16.1 · chart runs: the old "(no output: so far your
       code only defines names)" fired for every plotting exercise (16-9
       "World Fires"…), because fig.show() prints nothing: the student
       read it as a rejected solution. A chart IS the output — the block
       now says where to find it. ===== */
    if (!r.out && r.chart) b.appendChild(elHtml(`<div class="run-out" style="color:var(--acc)">📊 The program produced a chart: open the <b>Charts</b> panel to see it.</div>`));
    if (!r.out && !r.err && !r.game && !r.chart) b.appendChild(elHtml(`<div class="run-out muted" style="opacity:.55">(no output: so far your code only defines names)</div>`));
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
/** ===== REMOVED v19 · updateCodiceOut() and the .ed-out-note it fed
 *  are gone: the "last run: ✓ ok · output in the Console tab · N runs…"
 *  line (and its "Ctrl+Enter to run · edits are saved" sibling) was
 *  retired with the user's v19 review — the editors are pure writing
 *  space now, the run status lives in the Console tab and the
 *  "modified" badge says the rest. ===== */
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
  /* ===== CHANGED v16 · UX: this used to be a 3-line wall of text that
     repeated on every exercise ("This is the program that ▶ Run actually
     runs. Feel free to modify it: from that moment… Terminal: Ctrl+Enter…").
     It is now ONE short line per mode; the full explanation lives in the
     Guide overlay (the "? how it works" link opens it). ===== */
  wrap.appendChild(elHtml(`<div>
    <h2 class="pan-title">${icon('filecode')} Full code · ${esc(e.id)} ${esc(e.t)}</h2>
    <p class="pan-sub codice-sub" style="margin-bottom:8px">The program that <b>▶ Run</b> executes — edit it freely: Run will use <b>your version</b>. <button class="sub-link" data-guide type="button" title="The full explanation, in the Guide">? how it works</button></p>
    <div class="codice-headrow"><span class="chip ok" id="codiceBadge"></span>
      <button class="btn tiny" id="cdToRighe" title="Lightweight editor: only the lines of your exercise (\"Exercise completed\"), with the ⚙ bridge to the project's modules">✎ only the exercise lines</button></div>
  </div>`));
  wrap.addEventListener('click', ev => { const g = ev.target.closest('[data-guide]'); if (g) toggleGuida(true); });   // ===== NEW v16 · guide link =====
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
        `Fragments of a larger program: ▶ Run executes the <b>full project below</b> — edit any file, run with your changes. <button class="sub-link" data-guide type="button" title="The full explanation, in the Guide">? how it works</button>`;
    } else if (snap.modo === 'files') {
      wrap.querySelector('.codice-sub').innerHTML =
        `Multi-file exercise: ▶ Run executes <b>your files</b>, one per tab. <button class="sub-link" data-guide type="button" title="The full explanation, in the Guide">? how it works</button>`;
    } else if (snap.supporto.length) {
      wrap.querySelector('.codice-sub').innerHTML =
        `▶ Run executes this program: your passed steps + the imported <b>support modules</b> (last tabs). <button class="sub-link" data-guide type="button" title="The full explanation, in the Guide">? how it works</button>`;
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
    ta.setAttribute('aria-label', `Code editor — ${multi ? cur : mainLabel}`);
    ta.placeholder = multi
      ? `content of ${cur}…`
      : 'The program appears here as you pass the steps — or write a program of your own directly and press ▶ run.';
    ta.value = curTab.storage === 'code'
      ? (typeof st.customCode === 'string' ? st.customCode : curTab.original)
      : ((st.customFiles && typeof st.customFiles[curTab.name] === 'string') ? st.customFiles[curTab.name] : curTab.original);
    /* ===== NEW v17 · the writing zone is as tall as the program: the
       textarea grows with its content and the PANEL scrolls when it
       does not fit (see armAutogrow). ===== */
    armAutogrow(ta, 260);
    wrap.appendChild(ta);
    /* ===== CHANGED v18 · this panel is an EDITOR ONLY: the output console
       that used to live below the textarea is GONE — one console for the
       whole app, the Console tab.
       ===== REMOVED v19 · the .ed-out-note that replaced the terminal (with
       its "⌨ open Console" button) is gone too: zero footer noise, the
       Console tab in the tab bar is one click away. ===== */
    const acts = elHtml(`<div class="ex-actions" style="margin-top:0">
      <button class="btn primary" id="cdRun">▶ run</button>
      <button class="btn" id="cdReset" title="Discard the edits: go back to the original program (passed steps or database project)">⟲ restore original</button>
      <button class="btn tiny" id="cdCopy" title="Copy the code to the clipboard">copy</button>
    </div>`);
    wrap.appendChild(acts);

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
      aggiornaBadgeCodice(e);   // v19 · the badge is the only editor status left
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
    /* ===== REMOVED v18 · the "🧹 clear" button went away together with the
       embedded terminal: the run history is managed from the Console tab
       (its own "clear" button), which is now the only place it is shown.
       ===== REMOVED v19 · the "⌨ open Console" button of the old
       .ed-out-note is gone with it. ===== */

    /* FIX v10 · during renderLayout() the panel is still DETACHED from
       the document (the dock mounts it only at the end): getElementById
       in here finds null. The badge updates in the next frame, when
       the tree is already attached. */
    requestAnimationFrame(() => { aggiornaBadgeCodice(e); });
  })();
  const cdToRighe = wrap.querySelector('#cdToRighe');   // ===== NEW v12 · link to the lightweight editor =====
  if (cdToRighe) cdToRighe.addEventListener('click', () => apriRighe());
}

/* ---------- MODULES (v16 · rendered inside the side drawer) ---------- */
function renderModuli(box, inDrawer) {
  const wrap = elHtml(inDrawer ? `<div></div>` : `<div><h2 class="pan-title">${icon('files')} Modules · Python Crash Course</h2>
    <p class="pan-sub">Exercises from Chapters 1–20 + Appendices D–E. Click an exercise to open it.</p></div>`);
  const tree = elHtml(`<div class="tree"></div>`);
  CH.forEach(c => {
    const doneN = c.ex.filter(x => exState(x.id).done).length;
    const open = S.filter ? true : (S.current && EX[S.current] && EX[S.current].ch === c.n) ? true : c.n <= 2;
    /* ===== a11y (checklist M4) ===== the chapter accordion button exposes
       its state with aria-expanded and points to the list it controls. */
    const listId = 'chlist-' + c.n;
    const chEl = elHtml(`<div class="tree-ch ${open ? 'open' : ''}">
      <button class="tree-ch-head" aria-expanded="${open ? 'true' : 'false'}" aria-controls="${listId}">
        <span class="chev" aria-hidden="true">▶</span><span>Ch. ${c.n} · ${esc(c.t)}</span>
        <span class="cnt"><span class="sr-only">exercises done:</span> ${doneN}/${c.ex.length}</span></button>
      <div class="tree-ch-bar" aria-hidden="true"><i style="width:${Math.round(doneN / c.ex.length * 100)}%"></i></div>
    </div>`);
    const list = document.createElement('div');
    list.id = listId;
    if (!open) list.style.display = 'none';
    const headBtn = chEl.querySelector('.tree-ch-head');
    headBtn.addEventListener('click', () => {
      const aperto = chEl.classList.toggle('open');
      list.style.display = aperto ? '' : 'none';
      headBtn.setAttribute('aria-expanded', aperto ? 'true' : 'false');
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
      /* ===== a11y (checklist M4) ===== the state glyphs (✓ ◐ ○) and the
         difficulty dots are color+shape only: the whole button carries an
         explicit accessible name with state, difficulty and the current
         position (SC 1.4.1 + 4.1.2). */
      const stato = st.done ? 'completed' : st.solved > 0 ? 'in progress' : 'not started';
      const row = elHtml(`<button class="tree-ex ${cur ? 'current' : ''}" data-ex="${x.id}"${cur ? ' aria-current="true"' : ''}
        aria-label="Exercise ${esc(x.id)}: ${esc(x.t)} — ${stato}, difficulty ${x.lvl} of 3">
        <span class="st ${cls}" aria-hidden="true">${sym}</span><span class="id">${esc(x.id)}</span>
        <span class="tt">${esc(x.t)}</span><span class="dots" aria-hidden="true">${'●'.repeat(x.lvl)}</span></button>`);
      row.addEventListener('click', () => openExercise(x.id));
      list.appendChild(row);
    });
    chEl.appendChild(list);
    tree.appendChild(chEl);
  });
  wrap.appendChild(tree);
  if (ROADMAP.length) {
    /* ===== a11y (checklist M1) ===== heading level: the roadmap title was
       an h4 directly under the h2 of the panel (skipped h3): promoted. */
    const road = elHtml(`<div class="tree-roadmap"><h3>Roadmap · later modules of the book</h3></div>`);
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

/* ===== REMOVED v16.2 · the WALKTHROUGH panel (renderTraccia). It was a
   duplicate of what the Exercise panel already shows: the statement from
   the book is the "📖 Exercise statement" details and the chapter
   concepts are the chips right under it (moved here in v16.2). One tab
   less in the activity bar, in the mobile bar and in the default
   layout — and one body less to render on startup. ===== */

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
  wrap.querySelector('[title="Clear the console"]').addEventListener('click', () => { st.runs = []; st.outputs = []; delete st.verificato; saveProgress(); dock.refreshPanels(['console']); });
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
      <div class="stat-card"><div class="v">${g.done}<span class="muted" style="font-size:0.8125rem">/${g.total}</span></div><div class="l">exercises completed</div></div>
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
    <!-- ===== CHANGED v19 · the "⟲ Reset all progress" button moved to
         Settings → Reset (one place owns every "start over"). ===== -->
  </div>`);
  box.innerHTML = ''; box.appendChild(wrap);
}

/* ---------- GUIDE (v16 · rendered inside the overlay) ---------- */
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
      <h3>🧭 Finding your way around <span class="chip acc" style="font-size:.59375rem">updated in v19</span></h3>
      <p>· The <b>☰ Modules</b> tree (199 exercises) is a <b>slide-out menu</b> on the left: open it from the first icon of the activity bar — or from ☰ in the header on a phone — pick an exercise, and it closes by itself.</p>
      <p>· <b>Hover the left bar</b> and it expands like a bubble, showing the <b>full names</b> of the panels; each button has <b>one name</b> — the same name of the tab it opens. Move away and it shrinks back to the icons (the keyboard gets the same with Tab: focus expands it).</p>
      <p>· The <b>icons on the left bar are toggles</b>: click the icon of the panel you are looking at and the panel <b>closes</b>; click again and it comes back. The × on each tab does the same.</p>
      <p>· <b>Drag a tab only sideways</b> (new in v19): panels stack <b>side by side</b> — to the left or right of another one, or into its tab bar. A tab can never end up above or below another.</p>
      <p>· The <b>account button is in the top-right corner</b>: it shows your avatar and the exercises completed; a click opens the summary (progress, autonomy, sync) and the <b>⚙ edit</b> bridge to the Settings.</p>
      <p>· The <b>⚙ Settings</b> (last icon of the left bar, or ⚙ on a phone) hold the <b>dark / light theme</b> (both keep terminals and code areas black), the <b>access credentials</b>, the <b>privacy</b> switches and the <b>reset</b> buttons.</p>
      <p>· This <b>Guide</b> is an overlay: it never takes space away from the code.</p>
      <p>· On a phone, the bottom bar holds the four tabs you use between two taps; everything else is in the <b>⋯ More</b> menu.</p>
    </div>
    <div class="guide-sec">
      <h3>⌨ The Code editor, in full</h3>
      <p>The <b>⌨ code</b> button next to "▶ Run" opens the exercise's <b>full program</b> — exactly the code the Run button sends to the runtime. One line under the title tells you which program you are looking at; the details are these:</p>
      <p>· You can <b>modify it</b> freely: from that moment "Run and check the output" runs <b>your version</b> (marked ⚠, saved with your progress) — so you can reach the same result <b>in a different way</b> than the predetermined solution. The soft output check stays active: if your program prints the expected lines, the "✓" arrives.</p>
      <p>· <b>Editors only, one console</b> (v18): the <b>Code</b> and <b>Lines</b> tabs are pure writing space — no terminal below the editor. <span class="kbd">Ctrl</span>+<span class="kbd">Enter</span> runs, and the <b>output lands in the Console tab</b>, with the full history and the "clear" command.</p>
      <p>· <b>Fragments of a larger program</b> (the ch. 12–14 games, class extensions…): the steps are pieces of a whole project. The editor shows <b>all the files</b>, from the initial imports to the end, and ▶ Run always executes the <b>full project</b> — with your edits, file by file (e.g. change a speed in <code>settings.py</code> and the game starts with it).</p>
      <p>· <b>Multi-file exercises</b>: one tab per file, from the main to the last module; ▶ Run executes <b>your files</b>.</p>
      <p>· <b>Support modules</b> (read-only project files from the local database) sit in the last tabs: they run together with your program, you don't rewrite them.</p>
      <p>· <b>⟲ restore original</b> discards the edits and goes back to the program of the passed steps. If you don't touch anything, the run always follows the last passed step.</p>
    </div>
    <div class="guide-sec">
      <h3>🖼 Charts and games</h3>
      <p>When you run a program with <code>plt.show()</code> (Matplotlib) or <code>fig.show()</code> (Plotly), the chart appears in the <b>Charts</b> panel. When you use <code>pygame.display.flip()</code>, the frame appears in the <b>Game</b> panel. Both panels have their own icon in the left bar (new in v16): closing them no longer hides them forever. Both also have a <b>⛶ full screen</b> button: the screen fills with the chart or the game, the controls float <b>over</b> it and <span class="kbd">Esc</span> brings everything back.</p>
      <p><b>Note</b>: the first use of Matplotlib or Pygame downloads the package (~10-30 MB), then it stays in the browser cache.</p>
      <p><b>How Pygame runs in the browser — now it's playable</b>: games run on software surfaces in the runtime and the frames appear in the <b>Game</b> panel. <b>Click the canvas</b> (it captures the keyboard) and use <b>arrows</b>, <b>space</b>, <b>q</b>; the mouse passes to the game too. <b>On a phone</b> the on-screen pad below the canvas drives the game (◀ ▲ ▼ ▶, fire, q). The game keeps running until you press <b>■ Stop</b> or quit with <code>q</code>; after 25 s of complete inactivity the tutor closes it on its own, and there is an absolute limit of 10 minutes. For full performance run locally with <code>pip install pygame-ce</code>.</p>
    </div>
    <div class="guide-sec">
      <h3>🧰 Solutions database</h3>
      <p>The official book solution files are archived in a <b>database in the browser</b> (IndexedDB), seeded on first launch. They are used in two ways:</p>
      <p>· <b>Support files</b>: imported modules (<code>restaurant.py</code>…), data (<code>learning_python.txt</code>, weather CSVs…), images of the Pygame projects. Listed in the exercise banner, you use them with <code>import</code> or <code>Path(...)</code> without rewriting them.</p>
      <p>· <b>Double run</b>: if your code produces no output (because it only defines classes/functions or depends on other files), the <b>full solution</b> is run automatically and its output appears in the Console marked with <b>📚</b>. The solution's code is never shown: only its output.</p>
      <p>· <b>pytest tests</b>: the solutions of the testing chapters run with integrated pytest (output "1 passed"…).</p>
      <p>· <b>Django and Git projects</b> (Ch. 18–22): the files are archived but not runnable in the browser — you need Python and Django locally.</p>
    </div>
    <div class="guide-sec">
      <h3>📊 Syntactic autonomy</h3>
      <p>Every solved step is worth 3 points: <b>3</b> with no help, <b>2</b> with the concept, <b>1</b> with the syntax, <b>0</b> with the full line.</p>
    </div>
  </div>`));
}

/* ===== REMOVED v19 · the SANDBOX panel (SANDBOX_SAMPLES + renderSandbox)
   is gone: the ⌨ Code editor is already a free-program editor on the same
   runtime — one writing surface less, one sidebar button less. The status
   bar's Python chip now opens the Console. ===== */

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
      ? `<div class="sync-banner off">⚠ Cloud accounts not configured — your progress stays in this browser. <b>Owner:</b> fill <code>config.js → SUPABASE</code> to activate the sync (see Settings → credentials).</div>`
      : stato === 'error'
        ? `<div class="sync-banner off">⚠ Cloud unreachable — check url/anonKey in config.js.</div>`
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
    <!-- ===== NEW v17 · bridge to the Settings overlay: credentials,
         privacy and theme live there now. ===== -->
    <div class="step-actions" style="margin-top:8px">
      <button class="btn tiny" id="btnStgFromAccount">⚙ settings</button>
    </div>
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
  if (btOut) btOut.addEventListener('click', async () => { await storage.esci(); toast('Signed out.', ''); dock.refreshPanels(['account', 'progressi']); renderStatus(); renderAccountChrome(); });
  const btStg = wrap.querySelector('#btnStgFromAccount');   // ===== NEW v17 =====
  if (btStg) btStg.addEventListener('click', () => toggleImpostazioni(true));
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
    py.status === 'ready' ? `<span class="sb-chip ok" data-act="console" title="Python runtime active">Python ${esc(py.version || '3.14')} ✓</span>` :
      py.status === 'loading' ? `<span class="sb-chip busy"><span class="spin"></span> runtime…</span>` :
        py.status === 'error' ? `<span class="sb-chip err" data-act="console">runtime ✗</span>` :
          `<span class="sb-chip" data-act="console">Python (Pyodide) not loaded</span>`;
  /* ===== CHANGED v18 · online-site wording: "local mode"/"local only"
     became "sign in to sync" (the app is on the web: the account is the
     feature, offline stays the fallback) and "cloud off" (not configured). ===== */
  const syncChip =
    sync === 'synced' ? `<span class="sb-chip ok" data-act="account">☁ synced</span>` :
      sync === 'syncing' ? `<span class="sb-chip busy"><span class="spin"></span> sync…</span>` :
        sync === 'error' ? `<span class="sb-chip err" data-act="account">sync ✗</span>` :
          sync === 'local' ? `<span class="sb-chip acc" data-act="account" title="The app is online: sign in (Account panel) and your progress follows you on every device">☁ sign in to sync</span>` :
            `<span class="sb-chip" data-act="account" title="Cloud sync disabled: fill url/anonKey in config.js to activate the accounts">☁ cloud off</span>`;
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
  /* ===== a11y (checklist M4) ===== the clickable chips of the status bar
     act as buttons: focusable and operable with Enter/Space (the handler is
     registered in init()). The busy chip stays informative-only. */
  sb.querySelectorAll('[data-act]').forEach(el => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
  });
  renderAccountChrome();   // ===== NEW v17 · keeps the top-right count in sync =====
}

/* ---------- mobile header ---------- */
function mobileHeadHtml() {
  const e = EX[S.current] || EX[ORDER[0]];
  const st = exState(e.id);
  const sync = storage.syncStatus();
  return `
    <span class="m-brand">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="#4f9cf7" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3"/><path d="M4 8a8 8 0 0 1 16 0"/><path d="M3.5 8.5c2.5 1 4.5 1 6 0 1 2 3 2 5 0 1.5 1 3.5 1 6 0"/><path d="M12 12v6a2.2 2.2 0 0 0 4.4 0"/></svg>
      <span>Tutor</span></span>
    <div class="m-ex">
      <div class="t">${esc(e.id)} · ${esc(e.t)}</div>
      <div class="s">${st.done ? 'completed ✓' : 'step ' + Math.min(st.solved + 1, e.steps.length) + ' of ' + e.steps.length}</div>
    </div>
    <!-- ===== CHANGED v16 · the ☰ drawer and the ? guide overlay replace the
         old flat tab bar entries (they were always-visible tabs before).
         ===== CHANGED v18 · same single names as the sidebar buttons. ===== -->
    <button class="tl-btn" data-mact="moduli" title="Modules" aria-label="Open the modules menu" style="padding:5px 9px">☰</button>
    <button class="tl-btn" data-mact="home" title="Home" aria-label="Back to the presentation page" style="padding:5px 9px">⌂</button>
    <button class="tl-btn" data-mact="guida" title="Guide" aria-label="Open the guide" style="padding:5px 9px">?</button>
    <button class="tl-btn" data-mact="account" title="Account" style="padding:5px 9px">☁</button>
    <!-- ===== NEW v17 · Settings on mobile too (theme, credentials, privacy):
         same overlay as the desktop sidebar gear. ===== -->
    <button class="tl-btn" data-mact="impostazioni" title="Settings" aria-label="Open the settings" style="padding:5px 9px">⚙</button>`;
}

/* ---------- default layout and panel registry ---------- */
function defaultLayout() {
  /* ===== CHANGED v20 · ONE TAB: the workbench starts with a single
       Exercise tab — the homepage presents the site, and the first
       click enters a clean, full-width workspace. Every other panel
       joins THIS tab bar when it is opened (activity bar, status
       chips, the Charts/Game switch of a run): the single-bar view is
       the privileged layout, and side-by-side stays the explicit
       drag gesture (left/right zone of a group wide enough). ===== */
  return { type: 'group', tabs: ['esercizio'], active: 'esercizio' };
}
const Panels = {
  /* ===== REMOVED v16.2 · 'traccia' (Walkthrough): the statement and the
     chapter concepts are inside the Exercise panel — and the dock strips
     it from layouts saved by older versions (unknown pid → tab dropped). ===== */
  esercizio: { id: 'esercizio', title: 'Exercise', icon: 'code', render: renderEsercizio },
  codice: { id: 'codice', title: 'Code', icon: 'filecode', render: renderCodice },   // ===== NEW v10 · full program editor — v18: editor only, output in the Console tab =====
  righe:  { id: 'righe',  title: 'Lines',  icon: 'rows',    render: renderRighe },    // ===== NEW v12 · lightweight editor: only the exercise lines =====
  console: { id: 'console', title: 'Console', icon: 'term', render: renderConsole },
  grafici: { id: 'grafici', title: 'Charts', icon: 'chart', render: renderGrafici },   // ===== NEW =====
  gioco: { id: 'gioco', title: 'Game', icon: 'flask', render: renderGioco },     // ===== NEW =====
  progressi: { id: 'progressi', title: 'Progress', icon: 'chart', render: renderProgressi },
  /* ===== REMOVED v19 · 'sandbox': the ⌨ Code editor already covers free
     programming; the dock strips it from layouts saved by older versions
     (unknown pid → tab dropped automatically). ===== */
  account: { id: 'account', title: 'Account', icon: 'user', render: renderAccount },
  /* ===== CHANGED v16 · 'moduli' and 'guida' are NOT dock panels anymore:
     the Modules tree renders inside the side drawer (renderDrawerBody)
     and the Guide inside the overlay (toggleGuida). Their activity-bar
     icons survive as special triggers — see specialPanels below. ===== */
};

/* ============================================================
   ===== a11y · runtime decoration of the dock-generated DOM =====
   ------------------------------------------------------------
   Checklist M4/M2 · the residual items that lived on the DOM built
   by engine/dock.js (not part of this delivery) are closed here with
   a decoration pass that works whatever the dock emits:
   · .act-btn.active   → aria-current="true" (SC 2.4.8 · position)
   · .act-btn icon-only → aria-label taken from its title, if any
   · .dk-tab            → Alt+←/→ moves the focused tab inside its bar
                          (keyboard alternative to the mouse drag)
   · decorative <svg>   → aria-hidden="true" + focusable="false"
   The pass also runs after every panel render (wrapper below) and
   observes the DOM mutations of the two dock roots.
   ============================================================ */
function decorateA11y(root) {
  /* ===== CHANGED v15 · PERFORMANCE: the <svg> pass is scoped to the root
       it is given; the .act-btn pass only runs for document-level calls —
       a panel body never contains activity-bar buttons, yet the old code
       re-queried them (document-wide) after EVERY panel render, and the
       panels now re-render one per frame during startup. ===== */
  (root || document).querySelectorAll('svg').forEach(sv => {
    if (!sv.hasAttribute('aria-hidden') && !sv.hasAttribute('aria-label') && !sv.querySelector('title'))
      sv.setAttribute('aria-hidden', 'true');
    if (!sv.hasAttribute('focusable')) sv.setAttribute('focusable', 'false');
  });
  if (!root) document.querySelectorAll('.act-btn').forEach(b => {
    if (b.classList.contains('active')) b.setAttribute('aria-current', 'true');
    else b.removeAttribute('aria-current');
    if (!b.textContent.trim() && !b.getAttribute('aria-label') && b.title)
      b.setAttribute('aria-label', b.title);
  });
}
/* v15 · PERFORMANCE: the two MutationObservers below fire on every dock
   mutation; the pass they request is debounced, so a burst of mutations
   (progressive body rendering, a panel refresh storm) costs ONE document
   pass instead of one per event. 40 ms is imperceptible for the a11y tree. */
let _decT = 0;
function decorateSoon() { clearTimeout(_decT); _decT = setTimeout(() => decorateA11y(), 40); }
/* every panel render is followed by the decoration of its subtree */
Object.values(Panels).forEach(p => {
  const orig = p.render;
  p.render = box => { orig(box); decorateA11y(box); };
});

const dock = createDock({
  panels: Panels,
  defaultLayout,
  storageKey: KEYS.layout,
  toast,
  mobileHead: mobileHeadHtml,
  /* ===== CHANGED v16 · the special activity-bar icons do not insert a
     dock tab: they open the Modules drawer, the Guide overlay and (NEW v17)
     the Settings overlay. ===== */
  specialPanels: { moduli: true, guida: true, impostazioni: true },
  onSpecial: pid => {
    if (pid === 'moduli') toggleDrawer();
    else if (pid === 'guida') toggleGuida();
    else if (pid === 'impostazioni') toggleImpostazioni();   // ===== NEW v17 =====
  },
  /* ===== CHANGED v16.1 · every layout/tab change restores the auto-hidden
     header: a freshly rendered panel starts at scrollTop 0, where an
     upward flick is impossible and the bar would stay trapped off-screen. ===== */
  onLayoutChange: () => { renderStatus(); document.body.classList.remove('head-off'); },
});

/* dock-generated elements (activity bar, tab bars) are decorated too:
   the class flips on the activity bar are observed so aria-current
   always follows the active button; Alt+arrows give the tabs the
   keyboard alternative to the drag & drop reordering. */
const dockRootEl = document.getElementById('dockRoot');
if (dockRootEl) {
  new MutationObserver(decorateSoon).observe(dockRootEl, { childList: true, subtree: true });
  dockRootEl.addEventListener('keydown', ev => {
    if (!ev.altKey || (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight')) return;
    const tab = ev.target.closest('.dk-tab'); if (!tab) return;
    ev.preventDefault();
    if (ev.key === 'ArrowLeft' && tab.previousElementSibling)
      tab.parentElement.insertBefore(tab, tab.previousElementSibling);
    else if (ev.key === 'ArrowRight' && tab.nextElementSibling)
      tab.parentElement.insertBefore(tab.nextElementSibling, tab);
    tab.focus();
  });
}
const actBarEl = document.getElementById('activitybar');
if (actBarEl) new MutationObserver(decorateSoon).observe(actBarEl, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

/* ---------- startup ---------- */
function init() {
  dock.renderActivity();
  dock.applyMode(true);
  /* ===== a11y · first decoration pass on the freshly rendered dock ===== */
  decorateA11y();
  storage.init();
  // ===== CHANGED v14 · the solutions database is no longer bulk-seeded at
  // startup (that downloaded the whole ~7.7 MB bundle on the first visit,
  // straight onto the LCP critical chain). init() is now cheap: it only
  // opens IndexedDB and migrates a v13 bulk seed if present. Each chapter's
  // files are imported on demand by the first getSolution() of that chapter
  // and seeded then — the toast below fires on those first-time downloads. =====
  // ===== CHANGED v21 · the chapter download and the "database ready"
  // toasts are GONE: they are background work the visitor cannot act on
  // ("reduce or eliminate popups like solution files…"). Only a real
  // failure stays visible. =====
  document.addEventListener('soldb:chapter', () => { /* quiet */ });
  solDb.init().catch(() => { toast('⚠ Solutions database unavailable: running without support files.', 'warn'); });
  onPythonStatus(() => { renderStatus(); });
  storage.onSyncChange(() => { renderStatus(); });
  /* ===== NEW v18 · Supabase health check (see engine/storage.js): a
     configured-but-unreachable project is announced once and loudly,
     instead of failing silently as a fake "local mode". ===== */
  window.addEventListener('tutor:supabase-unreachable', () => {
    renderStatus();
    toast('⚠ Supabase unreachable — check <b>url</b> and <b>anonKey</b> in config.js.', 'warn');
  });
  storage.onAuthChange(() => { renderStatus(); renderAccountChrome(); dock.refreshPanels(['account', 'progressi']); });
  storage.onRemoteApply((st) => {
    S.progress = st.progress || {};
    if (st.current) S.current = st.current;
    S.hintsOpen = {};
    dock.refreshAll();
    renderStatus();
    toast('☁ Progress updated ' + (st.viaRealtime ? 'in real time' : 'from the cloud') + '.', 'ok');
  });
  const gs = $('#globalSearch');
  /* ===== CHANGED v16 · the Modules tree is a drawer: typing a filter
     opens it (there is nothing to filter behind it anymore) and keeps
     it in sync; the drawer's own search box feeds the same S.filter. ===== */
  if (gs) gs.addEventListener('input', ev => {
    S.filter = ev.target.value.trim();
    if (!isMobile()) { if (S.filter && !DRAWER.open) toggleDrawer(true); else if (DRAWER.open) renderDrawerBody(); }
    const ds = document.getElementById('drawerSearch');
    if (ds && document.activeElement !== ds) ds.value = ev.target.value;
  });
  /* ===== REMOVED v19 · the titlebar "⟲ Reset" button: the reset moved
     into Settings → Reset (layout only, or everything). ===== */
  /* ===== NEW v19 · cookie notice (the site is online and indexed): one
     honest banner, shown once. This app sets NO cookies at all — progress
     and preferences live in this browser's localStorage — and there is no
     analytics. "privacy" opens the Settings overlay, where the storage
     list spells out every byte. ===== */
  const cookieBar = document.getElementById('cookieBar');
  if (cookieBar) {
    let cookieOk = false;
    try { cookieOk = !!localStorage.getItem('tutorCookieOk'); } catch (e) { }
    if (!cookieOk) setTimeout(() => {
      cookieBar.hidden = false;
      requestAnimationFrame(() => cookieBar.classList.add('show'));
    }, 1200);
    const cbOk = document.getElementById('cbOk');
    if (cbOk) cbOk.addEventListener('click', () => {
      try { localStorage.setItem('tutorCookieOk', '1'); } catch (e) { }
      cookieBar.classList.remove('show');
      setTimeout(() => { cookieBar.hidden = true; }, 380);
    });
    const cbInfo = document.getElementById('cbInfo');
    if (cbInfo) cbInfo.addEventListener('click', () => toggleImpostazioni(true));
  }
  /* ===== CHANGED v16 · the Guide is an overlay, not a dock tab ===== */
  $('#btnGuida').addEventListener('click', () => toggleGuida());
  /* ===== NEW v17 · the ACCOUNT button (top right): popover with info,
     synthetic progress and the “edit” bridge to Settings. It closes on
     outside click, on Esc and when the auto-hide header slides away. ===== */
  const btnAcct = $('#btnAccount');
  if (btnAcct) {
    renderAccountChrome();
    btnAcct.addEventListener('click', ev => { ev.stopPropagation(); toggleAccountPop(); });
  }
  document.addEventListener('click', ev => {
    if (!ACCT.open) return;
    const pop = document.querySelector('.acct-pop');
    if (pop && !pop.contains(ev.target) && !ev.target.closest('#btnAccount')) closeAccountPop();
  });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && ACCT.open) closeAccountPop(); }, true);
  /* the popover is anchored to the titlebar: when the bar auto-hides
     (head-off) the popover must not stay floating alone over the panels */
  new MutationObserver(() => { if (document.body.classList.contains('head-off')) closeAccountPop(); })
    .observe(document.body, { attributes: true, attributeFilter: ['class'] });
  $('#statusbar').addEventListener('click', ev => {
    const t = ev.target.closest('[data-act]'); if (!t) return;
    if (isMobile()) { dock.setMobileTab(t.dataset.act); dock.renderMobilePanel(); dock.renderMobileNav(); }
    else dock.activateOrInsert(t.dataset.act);
  });
  /* ===== a11y (checklist M4) ===== the status chips are buttons: Enter
     and Space activate them from the keyboard (SC 2.1.1). */
  $('#statusbar').addEventListener('keydown', ev => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    const t = ev.target.closest('[data-act]'); if (!t) return;
    ev.preventDefault();
    if (isMobile()) { dock.setMobileTab(t.dataset.act); dock.renderMobilePanel(); dock.renderMobileNav(); }
    else dock.activateOrInsert(t.dataset.act);
  });
  $('#mHead').addEventListener('click', ev => {
    const t = ev.target.closest('[data-mact]'); if (!t) return;
    /* ===== CHANGED v16 · ☰ opens the Modules drawer and ? the Guide
       overlay; the cloud button still switches to the Account tab.
       ===== NEW v17 · ⚙ opens the Settings overlay. ===== */
    if (t.dataset.mact === 'moduli') toggleDrawer();
    else if (t.dataset.mact === 'home') goHome();
    else if (t.dataset.mact === 'guida') toggleGuida();
    else if (t.dataset.mact === 'account') { dock.setMobileTab('account'); dock.renderMobilePanel(); dock.renderMobileNav(); }
    else if (t.dataset.mact === 'impostazioni') toggleImpostazioni();
  });
  let rzT = null;
  window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => dock.applyMode(false), 160); });
  /* ===== NEW v16.1 · auto-hide header (titlebar on desktop, m-head on
     mobile): the page itself never scrolls (panels do), so the watcher
     listens — in capture phase — to the scroll of every scrollable app
     container (.dk-body panels, .m-content, the drawer and overlay
     bodies). Scrolling DOWN hides the bar (immersion: the code wins the
     space); scrolling UP, or returning to the top, brings it back. A small
     dead zone (6px) keeps the trigger away from sub-pixel jitters and
     momentum artifacts. ===== */
  /* .dk-panel is the real scrollable element of every dock panel (absolute,
     overflow:auto inside .dk-body); .m-content is the mobile view */
  const SCROLLABLE_SEL = '.dk-panel, .m-content, .drawer-body, .ovl-body';
  const lastScrollPos = new WeakMap();
  document.addEventListener('scroll', ev => {
    const t = ev.target;
    if (!(t instanceof Element) || !t.matches(SCROLLABLE_SEL)) return;
    /* ===== CHANGED v20 · the header NEVER auto-hides while the Guide, the
       Settings overlay or the Modules drawer is open. Scrolling inside
       those surfaces used to slide the titlebar away, and closing them
       left it hidden with nothing to scroll back up (the "header that
       never returns" bug). Any scroll there now keeps it visible. ===== */
    if (OVL.open || STG.open || DRAWER.open) { document.body.classList.remove('head-off'); return; }
    const y = t.scrollTop, last = lastScrollPos.get(t) || 0;
    lastScrollPos.set(t, y);
    if (y > last + 6 && y > 48) document.body.classList.add('head-off');
    else if (y < last - 6 || y <= 6) document.body.classList.remove('head-off');
  }, true);
  /* opening a drawer/overlay or switching tab always brings the bar back:
  no trap of an invisible header on a freshly-rendered view */
  const headBack = () => document.body.classList.remove('head-off');
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape') headBack(); }, true);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', headBack);
  /* ===== CHANGED v21 · HOMEPAGE wiring: ONE CTA (▶ Start learning) plus
     the contextual ↩ Resume — the "Browse the 199 exercises" button is
     gone (start IS browsing, one click later). Enter/Esc keep working as
     keyboard shortcuts. The ⌂ Home button (titlebar + mobile header)
     brings the presentation back via goHome(). ===== */
  const hpStart = document.getElementById('hpStart');
  const hpResume = document.getElementById('hpResume');
  if (hpStart) hpStart.addEventListener('click', () => enterApp());
  if (hpResume) hpResume.addEventListener('click', () => enterApp());
  const btnHome = document.getElementById('btnHome');
  if (btnHome) btnHome.addEventListener('click', () => goHome());
  /* ===== CHANGED v21 · same-session reload: the bootstrap script in
     <head> already hid #homePage before the first paint (data-skip-home);
     here the state catches up — the node is just HIDDEN now (the ⌂ Home
     button can still revive it), HOME is marked as entered and no stray
     Enter can re-trigger anything. ===== */
  if (document.documentElement.hasAttribute('data-skip-home')) {
    HOME.entered = true;
    document.body.classList.add('in-app');
    const hp0 = document.getElementById('homePage');
    if (hp0) hp0.hidden = true;
  } else {
    /* first visit (or back from ⌂ Home): the presentation is on screen —
     start its motion layer */
    armHomeFx(document.getElementById('homePage'));
  }
  if (hpResume) {
    const e = EX[S.current];
    if (e && S.current !== '2-1') {
      hpResume.hidden = false;
      hpResume.innerHTML = '↩ Resume «' + esc(e.id) + ' · ' + esc(e.t) + '»';
    }
  }
  document.addEventListener('keydown', ev => {
    if (HOME.entered) return;
    if (ev.key !== 'Enter' && ev.key !== 'Escape') return;
    if (ev.key === 'Enter' && ev.target && ev.target.closest && ev.target.closest('#homePage button')) return;
    enterApp();
  }, true);
}
if (typeof document !== 'undefined' && document.readyState !== 'loading') init();
else if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', init);