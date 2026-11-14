# Release v15.0 — tutor-scomposizione (English edition)

Date: 2026-11-14 · Based on: v14.0 (Lighthouse fix) · **v15.0.0**

## v15.0 · performance: parallel modules, progressive dock, zero-CLS toasts, service worker

A detailed load trace of the published v14 (Lighthouse 97–98 mobile, 100
desktop) showed the page performs well but with four residual bottlenecks:
**LCP 978 ms of which 812 ms (83%) render delay** (main thread busy with
156 ms of Layout and script execution during navigation), a **sequential
JavaScript waterfall** (app.js → its 8 imports → solutions-index.js: three
network rounds before the first render), a **0.02 layout shift** of the
`#toasts` container, and **184.3 kB re-downloaded on repeat visits**
(GitHub Pages pins `Cache-Control: max-age=600`). This release addresses
all four.

**1 · Module graph preloaded in parallel** (`index.html`)

Nine `<link rel="modulepreload">` tags (data/exercises.js, config.js,
engine/dock.js, tutor.js, solutions-db.js, storage.js, python-runner.js,
ponte.js, data/solutions-index.js) hand the whole static module graph to
the browser while app.js is still downloading: the discovery waterfall
collapses into one parallel fetch round. The hrefs intentionally carry
**no `?v=` query** — they must match the import specifiers
character-for-character or each module would be fetched twice. The deploy
procedure is unchanged (bump `?v=` on app.js/styles.css only).

**2 · Progressive dock rendering** (`engine/dock.js`)

`renderLayout()` used to synchronously render the body of every open panel
(the 199-exercise Modules tree, Walkthrough, Exercise, Console, Code) in
one long main-thread task, so nothing could paint until all of them were
done. Now the dock skeleton plus the LCP-likeliest panel (Exercise) render
in the first frame, and the remaining bodies follow one frame at a time
(~8 ms budget per frame) through a `requestAnimationFrame` scheduler with
an explicit priority order (`BODY_PRIO`: esercizio → moduli → traccia →
…). The browser paints in between: the largest element shows up first and
no long task blocks input. Panels the user explicitly opens/drops are
still rendered synchronously (`refreshBody` after `activateOrInsert` /
`movePanel`), and the mobile single-panel view is untouched.

**3 · `renderEsercizio` batched to a single DOM mutation** (`app.js`)

The exercise panel built its ~8 sections by appending them one at a time
to a container that was **already attached to the live DOM**, invalidating
the layout of a connected subtree at every step. Now `wrap` stays detached
while it is populated and enters the live DOM exactly once — one
parse/style/layout pass. (The `autonomiaOf` meter value is also computed
once instead of twice.)

**4 · Cheaper a11y decoration** (`app.js`)

`decorateA11y()` ran a document-wide `.act-btn` query after **every**
panel render (panel bodies never contain activity-bar buttons), and the
two dock MutationObservers triggered a full document pass per mutation
burst. The button pass now only runs for document-level calls, and the
observer callbacks are debounced (40 ms) — with panels rendering one per
frame during startup, this removes several redundant passes.

**5 · Zero-CLS toasts** (`styles.css`)

`#toasts` now has its height **reserved** (150 px ≈ three stacked toasts)
and stacks with `justify-content: flex-end`; `.toast` gets
`flex-shrink: 0`. Adding the second toast no longer grows the container
toward the top, so the 0.02 shift is gone; the empty container paints
nothing and the mobile media query keeps working as is.

**6 · Touch-target hardening** (`styles.css`)

`.act-btn` gains `min-width/min-height: 24px`: the target-size audit
(WCAG 2.5.8) can no longer trip on a CSS regression (see the v14 report:
the 12:05 desktop run measured 36×15 px buttons on a style sheet still
propagating on the CDN).

**7 · Service worker: modern caching on GitHub Pages** (`sw.js`, new)

GitHub Pages offers no way to extend cache TTLs, so the app ships its
own: same-origin static assets (modules, CSS, the lazy solution chapter
bundles) are served **cache-first** from a versioned Cache Storage bucket;
HTML navigations are **network-first** so a deploy is never masked by a
stale shell — the cache is only an offline fallback. Cross-origin
requests (Pyodide/Plotly CDNs, Supabase) are not intercepted. Staleness
is impossible by construction: assets are versioned by URL (`?v=`), the
cache name (`tutor-v15`) is bumped at every release with the old bucket
deleted on `activate`, and the page registers the worker with
`updateViaCache: 'none'` so `sw.js` itself is always revalidated.
Registration happens after the `load` event (zero cost on the critical
path) and only on `https://` — local development via `serve.py` keeps its
`no-store` behaviour; add `?sw` to a localhost URL to test the worker
locally. Note: dedicated-worker script loads (`engine/python-worker.js`)
are fetched by the worker context, which a page's service worker does not
control — they keep using the plain HTTP cache, which is fine as they sit
outside the startup path.

**Version marker**: `?v=15.0` on `app.js`/`styles.css`; `sw.js` cache
`tutor-v15`; `package.json` → `15.0.0`.

**What did NOT change**: the pedagogical engine (tutor.js, ponte.js), the
data (199 exercises, 485 steps), the solutions database and its lazy
per-chapter bundles, storage/Supabase sync, the Python runtime, and the
whole UI. No build step was introduced: the project stays readable,
vanilla, no-dependency.

**Not done on purpose** (from the v14 report): CSS/JS minification
(~25 KiB, § 4.2 — readability wins), render-blocking `styles.css` inline
(§ 4.3 — FOUC risk not worth 150 ms).
