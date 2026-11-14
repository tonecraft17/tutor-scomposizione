# GitHub publication checklist — v13.0 (English edition)

> Final quality and security check before the **first push** of the repository.
> Last verification date: 2026-11-14 · All tests run with Node ≥ 18.

---

## 1 · Quality checks — all green

| Check | Command | Result |
|---|---|---|
| Exercises/steps/solutions consistency | `npm run audit` | **199 exercises · 485 code steps · 0 inconsistencies** |
| Plotly runtime (16-9) | `npm run test:16-9` | **10/10** |
| Runtime flexibility (imports, CSV, images) | `npm run test:v5` | **31/31** |
| Three editor modes (step / files / sol) | `npm run test:modi` | **199 exercises classified: 171 step · 5 files · 23 sol** |
| ✎ Lines panel + bridge | `npm run test:righe` | **23 'sol' exercises · 19 with bridge · 27 rules applied** |
| Full suite | `npm test` | ✅ all of the above, chained |

Language-conversion checks for this English edition (v13.0):
- all 16 exercise groups pass the structural integrity checker (code skeletons, regex
  matching power, expected-output ↔ print consistency, `{{placeholder}}` ↔ hint-key sync);
- zero surviving Italian identifiers/keys across the 199 exercises (the student-facing
  code now uses the book's own English names — which also aligns the steps with the
  official solutions, e.g. 3-1 `names`, 2-1 `msg`);
- `rg "[éèàùòìÉÈÀÙÒÌ]"` is clean on every code and data file (the only remaining
  accented characters live in the CHANGELOGs, where they quote the historical Italian
  UI labels).

---

## 2 · Security — no sensitive data in the code

- **Secrets scan**: no API keys, tokens or passwords hardcoded in the sources
  (scanned `app.js`, `engine/`, `data/`, `supabase/`, `index.html`, `serve.py`).
- **Supabase** (cloud sync is *optional*, off by default):
  - `config.js` ships with `url: ''` and `anonKey: ''` — the app is 100% local;
  - the `@supabase/supabase-js` runtime (UMD) is downloaded from the CDN **only if**
    `supabaseConfigured()` is true — never in the base configuration;
  - `supabase/schema.sql` enables **Row Level Security**: every row is visible only
    to its owner. Use **only the `anon public` key**, never the service key.
- **No npm dependencies** and no `.env` file is ever read: the only configuration
  lives in `config.js` (versioned, empty defaults). This is why **`.env.example`
  is not needed**; the `!.env.example` rule in `.gitignore` remains useful for
  future projects.
- **External resources** (all public, no key required) — if you publish on GitHub
  Pages or similar, visitors must be able to reach these domains:
  - `cdn.jsdelivr.net` — the Pyodide 314.0.7 runtime and packages (matplotlib,
    pygame-ce, pytest, micropip for plotly/requests) + the supabase-js UMD (only if configured);
  - `cdn.plot.ly` — Plotly.js 2.35.2;
  - public APIs used by the chapter-17 exercises: `api.github.com`,
    `earthquake.usgs.gov`, Hacker News; and image credits
    (`opengameart.org`, `pygame.org`, …) cited in the solution sources.

---

## 3 · Before the first `git push`: values to fill in

| File | Placeholder | What to put |
|---|---|---|
| `README.md` | `YOUR-USERNAME` (×2) | your GitHub username (`git clone` URL and GitHub Pages demo link) |
| `package.json` | `YOUR-USERNAME` (×3) | GitHub username (repository, bugs, homepage) |
| `package.json` | `YOUR-FULL-NAME` | your name in the `author` object |
| `LICENSE` | `[YEAR] [FULL NAME]` | release year and full name |
| `config.js` | — (optional) | `SUPABASE.url` + `SUPABASE.anonKey` only if you want cloud sync |

The placeholders are searchable: `rg -n "YOUR-USERNAME|YOUR-FULL-NAME|\[YEAR\]"`.

---

## 4 · Assets to add manually (recommended)

Screenshots and the live demo are referenced in the README (§ "Screenshots and
demo") but the files are not in the repository: capture them from the running app
and put them in `docs/`:

- `docs/screenshot-exercise.png` — the Exercise panel with a verified step;
- `docs/screenshot-lines-bridge.png` — the ✎ Lines editor of 14-3 with the ⚙ bridge to `settings.py`;
- `docs/screenshot-game.png` — a Pygame game in the Game panel;
- `docs/screenshot-charts.png` — a Plotly chart in the Charts panel;
- `docs/screenshot-mobile.png` — the mobile view.

No other asset is missing: the projects' images and data (PNG, CSV…) are already
embedded in `data/solutions.js` as base64.

---

## 5 · Behavior note (14-3 «Challenging Target Practice»)

Not a bug: in the book's game `speedup_scale` is the **level-up multiplier** and
only acts inside `increase_speed()`, which fires **after every 10 hits**
(`levelup_hits`). So:

- changing **only** the `speed_scale *= 1.1` line changes `speedup_scale`, but the
  **starting** speed stays 3.0 / 12.0 / 1.5 until the first level-up (verified by
  running the project's real `settings.py`);
- to change the speed **from the very start**, edit the **first** line
  (`speed_scale = 1.0` → *scale* rule): e.g. `= 10` → ship 30 · bullets 120 ·
  target 15, visible immediately.

The note is already visible in the UI (📐 next to the line) and in
[CHANGELOG-v12.md](../CHANGELOG-v12.md) § v12.1.1.

---

## 6 · First publication — steps

```bash
# 1. inside the project folder (already unzipped/cloned)
git init -b main
git add -A
git commit -m "v13.0 · Python Crash Course tutor — English edition (199 exercises, 485 steps)"

# 2. create the EMPTY repository on github.com (no README/LICENSE: already present)
git remote add origin https://github.com/YOUR-USERNAME/tutor-scomposizione.git
git push -u origin main

# 3. (optional) GitHub Pages: Settings → Pages → Branch: main / root
#    the app is a static site: no build, no action required
```

**Future updates**: at every release bump the version marker `?v=…` of `app.js`
and `styles.css` in `index.html` (prevents stale module caching), the `CACHE`
constant in `sw.js` (purges the previous service-worker bucket on activate),
the `version` in `package.json`, and the CHANGELOG.

---

## 7 · Repository structure

Full annotated tree: [README.md](../README.md) § "Project structure". In short:
`index.html` + `styles.css` + `app.js` (UI), `engine/` (runtime, bridge, storage),
`data/` (exercises and solutions), `supabase/` (optional schema), `docs/` (this
checklist and the screenshots), the `test_*.mjs` / `audit_step_check.mjs` tests,
and a CHANGELOG per release.
