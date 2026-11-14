# Lighthouse v14 — criticalities and fixes (before → after)

Source audit: Lighthouse 13.5.0, mobile emulation (slow 4G, 4× CPU),
cold cache, `https://tonecraft17.github.io/tutor-scomposizione/`,
2026-11-14 (report `tonecraft17.github.io-20261114T112957.html`).

## Category scores

| Category | Before | After (expected) | Why the expectation |
|---|---|---|---|
| Performance | **39** | ~90+ | the two multi-MB downloads that dominated the critical chain are gone from the initial load (see below) |
| Accessibility | **98** | 100 | main landmark added for the mobile view |
| Best Practices | **96** | 100 | the only console error was the favicon 404, now a data-URI icon |
| SEO | **90** | 100 | meta description added |
| Agentic Browsing | 100 | 100 | untouched |

## Failed audits → fix

| Audit (before) | Value | Root cause | v14 fix |
|---|---|---|---|
| Largest Contentful Paint | **17.6 s** (score 0) | critical chain: document → app.js → solutions-db.js → **data/solutions.js (1.65 MB transferred / 7.7 MB raw)** + **plotly.js (1.33 MB)** competing for the same slow-4G pipe | solutions split into 19 per-chapter bundles loaded on demand; Plotly no longer in the page |
| First Contentful Paint | **5.6 s** (score 0.05) | same bandwidth contention at the head of the load | same |
| Time to Interactive | **17.6 s** (score 0.04) | network never quiet while the two big downloads ran | same |
| Total Blocking Time | **890 ms** (score 0.32) | Plotly evaluation long task (792 ms) + a 653 ms task for module graph + bulk seed | Plotly deferred to the first chart; no bulk seed at startup |
| Speed Index | **6.8 s** (score 0.35) | progressive fill throttled by the same downloads | same |
| Max Potential FID | **790 ms** | Plotly long task | same |
| Total byte weight | **3.2 MB** | solutions.js 1.65 MB + plotly 1.33 MB | first load now ≈ **190 KB** of JS (app + engine + exercises + index) |
| Unused JavaScript | Plotly 1.02 MB · app.js 35.5 MB… 35.5 KB | Plotly 77% unused on load | Plotly lazy; app.js is one no-build file (kept, see below) |
| errors-in-console | 404 `/favicon.ico` | no favicon in the page; GitHub Pages 404 | inline SVG data-URI favicon (the titlebar brand) |
| landmark-one-main | no main landmark | on mobile `.workbench` (with `<main id="dockRoot">`) is hidden and the mobile view had none | `#mContent` is now `<main>`; exactly one visible main per mode |
| meta-description | missing | — | added |
| network-dependency-tree | flagged | depth of the request chain | the chain now ends at the ES module graph (~190 KB) |

## Audits acknowledged but deliberately not "fixed"

| Audit | Potential savings | Decision |
|---|---|---|
| Minify CSS (styles.css) | 3.5 KB (29.7%) | no-build project: the Node tests and the maintenance workflow run on the readable sources; the saving is ~1% of what the structural fixes removed |
| Minify JS (app.js, exercises.js) | 31.6 KB (30% / 15%) | same — introducing a minification build step would change the publishing workflow for a marginal gain |
| valid-source-maps | informational | source maps only make sense together with a minifier |

## How to re-verify

1. Publish v14 (or serve locally: `python3 serve.py` → http://localhost:8000).
2. Chrome DevTools → Lighthouse → **Mobile**, **Navigation**, cold cache
   (or incognito), categories Performance + Accessibility + Best Practices + SEO.
3. Expected first-load requests: document, `styles.css?v=14.0`,
   `app.js?v=14.0`, `config.js`, `data/exercises.js`, `engine/*.js`,
   `data/solutions-index.js` — **no** `plotly-*.js`, **no** `data/solutions.js`.
4. Open an exercise of a chapter never opened before → one
   `data/solutions/chNN.js` request + the "first time only" toast.
5. Run a program that produces a Plotly figure → `plotly-2.35.2.min.js`
   loads once and the chart renders in the Charts panel.
