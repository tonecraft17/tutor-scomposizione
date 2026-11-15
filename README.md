# Tutor · Progressive Breakdown — Python Crash Course

An **interactive study environment** for the exercises of *Python Crash Course* (3rd edition, chapters 1–20 + appendices D–E): **199 exercises** and **485 guided steps**, with **real Python running in the browser** (Pyodide) — no installation, works offline after the first load, **optional free account** to sync your progress across devices.

```text
study an exercise → break it down into steps → write the lines → really run it
       ↑                                                          │
       └────────── real output: console, charts, games ───────────┘
```

- **Real Python runtime in the browser**: Pyodide (CPython 3.14 compiled to WebAssembly) in a dedicated Web Worker. The student's code really runs — nothing is simulated.
- **Interactive Pygame games**: the projects of chapters 12–14 (*Alien Invasion*, *Target Practice*, *Sideways Shooter*…) run in the **Game** panel with live keyboard/mouse input.
- **Charts**: matplotlib (PNG images) and Plotly (interactive figures) from the first `import`, zero configuration.
- **Tests with pytest**: the test chapters' solutions run with real pytest, inside the browser.
- **Real HTTP requests** (chapter 17: the GitHub, USGS and Hacker News APIs) via `pyodide-http`.
- **The progressive breakdown method**: every exercise is split into steps verified one by one; the **⌨ Code** editor shows the complete program, the **✎ Lines** editor only your exercise's lines.
- **⚙ Bridge to the project**: for exercises that are fragments of a bigger project (e.g. 14-3 «Challenging Target Practice»), the lines you edit in ✎ flow into the project's real modules (`settings.py`, `target_practice.py`…) and the output changes accordingly.
- **Progress saved locally** (localStorage) with every exercise, step and terminal run; **optional** cloud sync via Supabase (off by default).
- **Two themes, one click** (v17): dark (default) and a playful light one — both keep the **terminals and every code-writing area black**. Switch and manage credentials/privacy from the **⚙ Settings** overlay (last icon of the sidebar).
- **Account in the top-right corner** (v17): avatar + exercises-completed counter; a click opens the summary popover (progress, autonomy, sync) with the “edit” bridge to Settings.
- **No build step, no npm dependencies**: native ES modules + CSS. Serve it with any static server.
- **Cookie notice + SEO** (v19): a one-time honest banner (no cookies, no tracking — progress lives in localStorage), canonical URL, Open Graph/Twitter cards with a custom `assets/og-image.png`, JSON-LD `WebApplication` data, `robots.txt` and `sitemap.xml` for Google indexing.

---

## Tech stack

| Layer | Technology |
|---|---|
| Python runtime | [Pyodide](https://pyodide.org) 314.0.7 (CPython 3.14 in WebAssembly) loaded from a CDN in a **Web Worker** |
| Games | `pygame-ce` (native Pyodide package) — software rendering relayed to the Game panel, live keyboard/mouse input, inactivity watchdog |
| Charts | `matplotlib` (PNG via the AGG backend), `plotly` 2.35 (via micropip + native numpy/pandas) |
| Tests | `pytest` executed in the in-browser runtime |
| Network | `requests` + `pyodide-http` (browser fetch) for the ch. 17 APIs |
| Frontend | **vanilla JavaScript** in **ES modules** (zero frameworks, zero build step), custom CSS (dark theme, VS Code-style dock layout, dedicated mobile view) + `styles-light.css`, the **light half of the v17 theme switch** (every rule scoped under `[data-theme="light"]`) |
| Storage | **localStorage** (progress, layout) + **IndexedDB** (local solutions database: per-chapter bundles from `data/solutions/`, seeded on first use of each chapter — v14) |
| Cloud (optional) | Supabase (progress sync across devices) — see [Optional configuration](#optional-configuration-supabase) |
| Dev tests | Node.js ≥ 18 (`node test_*.mjs`, no dependencies to install) |

---

## How it works

1. **Pick an exercise** in the tree on the left (search from the box at the top, next to the title). Every exercise shows its **steps**: questions, lines of code to write, checks.
2. **Write the lines** of the steps in the Exercise panel (or in the ✎ Lines / full ⌨ Code editors): passed steps assemble themselves into the program.
3. **Press "▶ Run and check the output"**: the code runs in the real Python runtime and the output appears in the Console (or as a chart, or as a game in the Game panel).
4. **Experiment**: edit the lines in ✎ or the project files in ⌨ — changes take **immediate effect on the output**. For Pygame projects, "▶ run" automatically closes a still-running game and restarts it with the freshly edited lines.
5. Progress stays in the browser: reopen and find everything as you left it (current exercise, passed steps, edited lines, run history).

### The three editors

| Editor | What it holds | Who it's for |
|---|---|---|
| **Exercise panel** | the exercise's steps, one at a time, with verification — the writing zone grows with your code (v18) | following the book step by step |
| **✎ Lines** | only your exercise's lines (those of "Exercise completed"), without the surrounding code — plus the **⚙ bridge** linking them to the project's modules | changing the values that matter (speeds, lives, scores…) |
| **⌨ Code** | the complete program: file by file, from the `import`s to the end, with the project's support modules. **Editors only** (v18): no terminal below — the output of ▶ Run lands in the **Console** tab | seeing the whole picture, rewriting everything |

> **v19**: the free-code **Sandbox** tab was removed — the ⌨ Code editor already covers free programming on the same runtime. Dock tabs now move **side by side only** (never above/below), and the reset buttons live in **Settings → Reset**.

---

## Local install and startup

### Prerequisites

- **Python 3.8+** (only for the static server — the Python runtime runs in the browser)
- A modern browser (Chrome/Edge 90+, Firefox 89+, Safari 15+)
- **Node.js ≥ 18** — *optional*, only to run the development tests

### Step 1 · Get the code

```bash
git clone https://github.com/YOUR-USERNAME/tutor-scomposizione.git
cd tutor-scomposizione
```

or download and unzip the release **zip** and enter the folder.

### Step 2 · Start the local server

> **Important**: the app uses **ES modules**, which browsers block on `file://`. A local server is therefore required — if only to read the files from disk.

**Recommended way** (dedicated server, caching disabled — see below):

```bash
python3 serve.py            # opens http://localhost:8000
```

Alternative with the standard library:

```bash
python3 -m http.server 8000
```

### Step 3 · Open the app

Go to **<http://localhost:8000>**. On the first Python command the browser downloads the Pyodide runtime from the CDN (~10 MB, once); after a few seconds the Console is ready.

> **Note on caching**: `python -m http.server` sends no cache headers and the browser may serve stale module versions after an update. That's what **`serve.py`** exists for (`Cache-Control: no-store`): use it as your dev server. With `python -m http.server`, do a hard refresh (**Ctrl+F5** / **Cmd+Shift+R**) after every update. `index.html` also loads `app.js` and `styles.css` with a version marker (`?v=…`): bump it at every release — **and since v16.1 the same `?v=` rides on every ES-module import and `modulepreload` href** (a stale service worker can no longer mix an old `engine/dock.js` with a new `app.js`).
>
> **Note on the service worker** (v15): on `https://` (e.g. GitHub Pages) a service worker caches the app's static assets for repeat visits — the HTML stays network-first, so deploys are always picked up. It never activates in local development (serve.py / `no-store`); to test it locally open `http://localhost:8000/?sw`.

---

## Project structure

```text
tutor-scomposizione/
├── index.html                  # single page: dock, activity bar, mobile view
├── styles.css                  # dark theme (default), dock layout, panels, mobile
├── styles-light.css            # LIGHT theme of the Settings switch — scoped [data-theme=light], terminals/code stay black (v17)
├── app.js                      # the application: panels, ✎/⌨ editors, bridge, execution
├── serve.py                    # dev server (caching disabled) — recommended
├── config.js                   # CDN endpoints, runtime constants, localStorage keys
├── package.json                # metadata + test scripts (no npm dependencies)
│
├── engine/                     # the engine (ES modules, DOM-free where possible)
│   ├── python-runner.js        # main-thread ↔ worker orchestrator
│   ├── python-worker.js        # Pyodide in the Web Worker: prelude, games, pytest, charts
│   ├── ponte.js                # exercise-lines → project-files table (pure data)
│   ├── solutions-db.js         # IndexedDB solutions database (lazy per-chapter seed + queries — v14)
│   ├── storage.js              # progress: localStorage + optional Supabase sync
│   ├── dock.js                 # dock layout of the panels (drag, tabs, mobile)
│   └── tutor.js                # step verification (expected output, minimum units)
│
├── data/
│   ├── exercises.js            # the 199 exercises: steps, questions, checks (~450 KB)
│   ├── solutions.js            # full solution bundle (~7.7 MB) — build input + Node tests, NEVER fetched by the browser (v14)
│   ├── solutions-index.js      # lightweight solutions index (for the UI)
│   └── solutions/              # per-chapter bundles chNN.js, loaded on demand (v14)
│
├── scripts/
│   └── split-solutions.mjs     # regenerates data/solutions/ from data/solutions.js (v14)
│
├── supabase/
│   └── schema.sql              # progress table schema (optional cloud sync)
│
├── docs/
│   ├── GITHUB-PUBLISHING.md    # quality/security checklist + first-push guide
│   └── LIGHTHOUSE-v14.md       # before/after of the v14 performance/a11y/SEO fixes
│
├── audit_step_check.mjs        # audit: exercises/steps/solutions consistency
├── test_righe_v12.mjs          # ✎ Lines panel + bridge tests (patch, round-trip)
├── test_modi_v11.mjs           # tests of the three editor modes (step/files/sol)
├── test_flessibilita.mjs       # runtime flexibility tests (16-9 plotly)
├── test_flessibilita_v5.mjs    # flexibility tests (v5: imports, CSV, images)
├── test_input_pygame.html      # manual page: Pygame game input
├── test_runtime_plotly.html    # manual page: Plotly runtime
│
├── CHANGELOG-v5.md … CHANGELOG-v19.md    # the full version history
├── robots.txt / sitemap.xml    # v19 · SEO: crawl rules + sitemap for Google
├── assets/og-image.png         # v19 · 1200×630 Open Graph / Twitter card
├── README.md                   # this file
├── LICENSE                     # MIT
└── .gitignore
```

---

## Running the tests (development)

No dependencies to install: Node ≥ 18 and go.

```bash
npm test                 # all: audit + flexibility + modes + lines
npm run audit            # 199 exercises · 485 steps · 0 inconsistencies
npm run test:righe       # 23 'sol' exercises: steps, references, 27 bridge rules
npm run test:modi        # 171 step · 5 files · 23 sol
npm run test:16-9        # 10/10 (Plotly runtime)
npm run test:v5          # 31/31 (imports, CSV, images)
```

The two `test_*.html` files are manual pages to open via http, for trying Pygame input and the Plotly runtime in the browser.

---

## Optional configuration: Supabase

Cloud progress sync is **off by default** and the app works 100% without it.
Since the site is deployed (GitHub Pages or any static host), activating it
takes five minutes:

1. Create a project on [supabase.com](https://supabase.com) (free).
2. Run `supabase/schema.sql` in the project's SQL editor.
3. Fill in `config.js`:

```js
export const SUPABASE = {
  url: 'https://YOUR-PROJECT.supabase.co',   // your project URL
  anonKey: 'YOUR-ANON-KEY',                  // public anon key (RLS active on the schema)
  // …
};
```

4. **Deploy-side checklist** (often forgotten):
   - in Supabase → **Authentication → URL Configuration** set **Site URL** to
     the deployed address (e.g. `https://USER.github.io/tutor-scomposizione/`),
     so confirmation/recovery emails land on the right pages;
   - use **only the anon key** (`anon public`), never the service key: the
     schema is protected by Row Level Security (each user sees only their
     own progress);
   - on the next load the app pings `GET {url}/auth/v1/health` — if the pair
     is wrong you get a toast and `sync ✗` in the status bar immediately
     (v18), instead of a silent local mode.

No key is needed for local use; the same `config.js` works from `localhost`.

---

## Screenshots and demo

> **To be added** — reserved slots for publication:
>
> | Planned file | Content |
> |---|---|
> | `docs/screenshot-exercise.png` | the Exercise panel with a verified step |
> | `docs/screenshot-lines-bridge.png` | the ✎ Lines editor of 14-3 with the ⚙ bridge to `settings.py` |
> | `docs/screenshot-game.png` | a Pygame game in the Game panel |
> | `docs/screenshot-charts.png` | a Plotly chart in the Charts panel |
> | `docs/screenshot-mobile.png` | the mobile view |
>
> **Live demo link**: `https://YOUR-USERNAME.github.io/tutor-scomposizione/` (GitHub Pages: this folder is already a static site — enable Pages on the `main` branch).

---

## Localization note

This is the **English edition (v13.0)** of a project originally developed in Italian (see `CHANGELOG-v5.md` … `CHANGELOG-v12.md` for the Italian history). All UI text, exercise instructions, hints and expected outputs are in English, matching the *Python Crash Course* 3rd-edition terminology; the code identifiers of the original engine are preserved.

---

## License

Released under the **MIT** license — see [LICENSE](LICENSE).

*Python Crash Course* is a book by Eric Matthes (No Starch Press): this project contains the book's exercise statements reworked for personal study; the solution sources are redistributed under the MIT license as teaching material.
