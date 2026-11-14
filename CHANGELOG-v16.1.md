# Release v16.1 — tutor-scomposizione (English edition)

Date: 2026-11-14 · Based on: v16.0 (UX) · **v16.1.0**

## v16.1 · Bug fixes: hybrid-cache "tab does not open", drawer toggle, auto-hide header, World Fires console, immersive mobile Game

A test of the published v16.0 produced five reports. This release fixes
all of them; the pedagogical engine, the data and the v15/v16.0
performance work are untouched.

**1 · Root cause of "Modules & exercises does not open": hybrid cache
after a deploy** (`app.js`, `engine/*.js`, `index.html`, `sw.js`)

The ES modules (`engine/dock.js`, `data/exercises.js`, …) carried **no
version in their URL**, while `app.js`/`styles.css` did (`?v=16.0`). On
the first visit after a deploy the previous release's service worker was
still in control and served the **old** `engine/dock.js` from its cache
(same URL ⇒ cache hit) together with the **fresh** `app.js?v=16.0`
(new URL ⇒ cache miss): a mixed app in which the activity-bar button
called a dock that no longer knew the `moduli` panel — the drawer never
appeared. The same race could pair a new runner with an old Python
worker.

Every import specifier now carries the same `?v=16.1` as the
`<script>`/`<link>` tags (and the `modulepreload` hrefs match
character-for-character, so nothing is fetched twice): a release changes
**all** module URLs, and even a stale worker cache-misses and fetches the
fresh, consistent set. `sw.js` bumps to `tutor-v16.1`. Deploy procedure:
bump `?v=` everywhere on each release (checklist updated in `sw.js`).
*Note for the reporter: one reload of the published page is enough to
recover even from the old mixed state — the v16 worker takes over and
purges the old cache.*

**2 · The drawer no longer covers the icons that open it**
(`styles.css`)

The open drawer was `inset: 0`: it hid the activity bar (desktop) and
the mobile header, so the natural "click the icon again to close" landed
on the drawer's search box. The drawer now slides over the **work area
only** — `left: 46px` (after the sidebar) and `top: 38px` (below the
titlebar) on desktop, below the 54px mobile header on a phone — VS Code
style: the ☰/files icon stays visible and **re-clicking it toggles the
drawer closed**. The backdrop follows the same inset, so the top bar
keeps working while the drawer is open. Also fixed: the Guide
activity-bar `aria-label` said "slide-out menu" (it is an overlay).

**3 · Auto-hide header** (`app.js`, `styles.css`)

The "Tutor · Progressive Breakdown" titlebar (and the mobile header)
now **slide away when you scroll down** inside any panel and **come back
when you scroll up**: the work area grows by the freed 38/54 px. The
watcher listens (capture phase) to the real scrollable elements —
`.dk-panel`, `.m-content`, the drawer and overlay bodies — with a 6 px
dead zone against momentum jitters; every layout/tab change, Esc key or
viewport resize restores the bar, so a freshly-rendered view never traps
it off-screen.

**4 · World Fires (16-9): the console denied a correct solution**
(`app.js`, `data/solutions.js`, `data/solutions/ch16.js`,
`data/solutions-index.js`)

Plotting exercises print nothing, and the console block concluded
"(no output: so far your code only defines names)" — read by the
student as "my solution is rejected", while the chart was actually
sitting in the Charts panel. Runs now record `chart` (like `game`):
the console block says "**📊 The program produced a chart: open the
Charts panel to see it**", the toast says so, and on the phone the app
**lands on the Charts tab** after the run (previously: an empty-looking
console). The official solution run ("double run") gets the same
treatment. In addition, the archived `world_fires.py` used the
hard-coded `row[0]/row[1]/row[2]` while the step-by-step path teaches
`header_row.index(...)`: the official file was aligned with the steps
(same indexes, same "Global Fires" title), and `SOLUTIONS_INDEX_VERSION`
was bumped to 4 so chapter 16 re-seeds in every browser that had already
cached the old file in IndexedDB.

**5 · Mobile Game tab: immersive mode** (`app.js`, `styles.css`)

- **⛶ full screen** button in the game meta bar (desktop and mobile):
  the whole game area becomes the fullscreen element — canvas centered
  on black, meta bar a translucent overlay, on-screen pad floating over
  the bottom edge. On phones it also **locks the orientation to
  landscape** (best effort: iOS Safari ignores it, the help text
  suggests a hand rotation). Esc / ⛶ exits.
- **Edge-to-edge layout** on mobile: no panel padding, dark stage,
  full-width canvas — the tab looks like a console screen.
- **Redesigned pad**: 56 px keys (48 px touch minimum, and the quit key
  48), pressed-key 3D look that travels down on touch, a wider
  blue FIRE pill and a small QUIT key with uppercase labels, safe-area
  aware bar. Same KEYDOWN/KEYUP events as before: the runtime sees no
  difference.

## Files touched

- `index.html` — `?v=16.1` on stylesheet/script; modulepreload hrefs versioned.
- `app.js` — versioned imports; scroll watcher (auto-hide header);
  `run.chart` tracking in `eseguiEsercizio`/`eseguiProgetto`/`eseguiSoluzione`;
  chart-aware console blocks, toasts and mobile landing tab; redesigned
  game pad; full-screen support (`setupGameFs`).
- `engine/dock.js` — versioned import; per-exercise Guide aria-label;
  `renderMobilePanel` notifies `onLayoutChange`.
- `engine/tutor.js`, `engine/storage.js`, `engine/python-runner.js`,
  `engine/python-worker.js`, `engine/solutions-db.js` — versioned
  imports (static, the 19 chapter bundles, and the worker URL).
- `styles.css` — drawer inset below titlebar/after sidebar; mobile
  header 54 px and above the drawer; auto-hide states; game pad
  redesign; `.fs` full-screen rules; edge-to-edge mobile game tab.
- `data/solutions.js`, `data/solutions/ch16.js` — `world_fires.py`
  aligned with the step-by-step solution.
- `data/solutions-index.js` — `SOLUTIONS_INDEX_VERSION` → 4.
- `sw.js` — cache name `tutor-v16.1`; deploy checklist updated.

## Compatibility

No data format changed: saved layouts, progress and IndexedDB solutions
keep working. The bump of `SOLUTIONS_INDEX_VERSION` re-seeds the chapter
bundles on demand (a few KB each) on first use.
