# Release v14.0 — tutor-scomposizione (English edition)

Date: 2026-11-14 · Based on: v13.0 (2026-11-14) · **v14.0.0**

## v14.0 · Lighthouse criticalities fixed (first-load performance, a11y, SEO, Best Practices)

Driven by a Lighthouse 13.5 mobile audit of the published site
(Performance **39**, Accessibility **98**, Best Practices **96**, SEO **90**).
Every change below maps to a failed audit; the full before/after table is in
`docs/LIGHTHOUSE-v14.md`.

**Performance · the 3.2 MB critical chain (FCP 5.6 s · LCP 17.6 s · TTI 17.6 s · TBT 890 ms)**

The network dependency tree showed the whole page waiting on two giant
downloads that the first screen never uses:

- **Plotly.js is no longer preloaded** (`index.html`). The `<script defer>`
  pulled **1.33 MB** (77% unused, per the audit) on every page load and its
  evaluation was the longest main-thread task (792 ms). The Charts panel now
  loads the library on demand through `ensurePlotlyJs()` in `app.js` — the
  fallback path that already existed: the first Plotly figure pays a one-time
  download, every load before it gets faster.
- **The solutions database loads per chapter** (`engine/solutions-db.js` +
  `scripts/split-solutions.mjs`). Until v13 the first visit downloaded the
  whole `data/solutions.js` bundle (**7.7 MB raw / 1.65 MB transferred**) and
  seeded it before the UI was usable — right on the LCP chain. The bundle is
  now split into 19 per-chapter modules (`data/solutions/chNN.js`, from
  ch. 2's **2.3 KB** to ch. 16's 5.3 MB): opening an exercise imports and
  seeds only its own chapter, once, into the same IndexedDB as before.
  `data/solutions.js` stays in the repo as the build input and for the Node
  test suite; the browser never fetches it.
  - migration: a v13 bulk seed with the current `SOLUTIONS_INDEX_VERSION` is
    recognized and marked per-chapter — **existing users re-download nothing**;
  - without IndexedDB (private mode) the chapter bundles serve from memory;
  - the first download of a chapter shows a discreet toast
    (`soldb:chapter` event → `app.js`);
  - the "database ready" toast at startup now tells the truth about the new
    behaviour (metadata ready; chapter files on demand).
- **dns-prefetch** (not preconnect — both CDNs are used only later, at the
  first run/chart) for `cdn.jsdelivr.net` (Pyodide) and `cdn.plot.ly`.

Net effect on a cold first visit: **~190 KB of JavaScript instead of ~3.2 MB**
(the Plotly script and the whole solutions bundle are gone from the initial
chain; only the chapter actually opened is fetched, lazily).

**Best Practices · console error**

- **Inline SVG favicon** (`index.html`): the browser used to request
  `/favicon.ico` and log a 404 (audit "Browser errors were logged to the
  console"). The data-URI icon is the titlebar brand mark — zero requests.

**Accessibility · main landmark**

- `#mContent` (the mobile content host) is a `<main>` now: on mobile the
  desktop `<main id="dockRoot">` is hidden with `.workbench`, so the mobile
  view exposed no main landmark at all (audit "Document does not have a main
  landmark"). Exactly one main landmark is visible in either mode.

**SEO**

- `<meta name="description">` added (audit "Document does not have a meta
  description").

**Housekeeping**

- cache-busting bumped: `styles.css?v=14.0`, `app.js?v=14.0`;
- `package.json` → 14.0.0;
- README: architecture and data-flow updated (per-chapter loading,
  `data/solutions/`, the new script);
- new `scripts/split-solutions.mjs` (idempotent: run it again after
  regenerating `data/solutions.js`).

**What was deliberately NOT done (and why)**

- *Minify CSS/JS in place*: the flagged potential savings are ~35 KB
  (styles.css 3.5 KB + app.js 14 KB + exercises.js 17.5 KB) against the
  ~3 MB structural win above; this repo is a no-build project whose tests
  run directly on the sources (`npm test` imports them), and minified
  sources would break that workflow and the diff-based maintenance.
- *Source maps* (informational audit): same reason — they only make sense
  with a minification build step.

**Verification** — all the v13 checks still green (`npm run audit`,
`npm run test:righe` + the full `npm test` chain), plus a manual smoke test
of first load, exercise opening with per-chapter download, Charts panel
with lazy Plotly, and mobile view.
