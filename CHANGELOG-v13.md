# Release v13.0 — tutor-scomposizione (English edition)

Date: 2026-11-14 · Based on: v12.1.1 (2026-11-13) · **v13.0.0**

## v13.0 · the whole project in English

The complete translation of the tutor (UI, data, docs, tests) from
Italian to natural, technical English — restoring the *Python Crash
Course* 3rd-edition terminology throughout.

**What was translated**

- **199 exercises, 485 steps** (`data/exercises.js`): statements,
  micro-phrase steps, two-level hints (concept + syntax), buttons,
  expected console outputs, notes and reflection prompts. The Italian
  **variable names in the expected code were restored to the book's
  own English names** (`nomi` → `names`, `pizze` → `pizzas`,
  `messaggio` → `msg`, `vite` → `lives`, `colonna` → `column` …) —
  which also **aligns the steps with the official solutions** (e.g.
  3-1's step code now matches `names = ['ron', 'tyler', 'dani']`).
  Hint keys and `{{clickable}}` keywords are English and stay in sync
  with the steps.
- **The engine**: ponte (`engine/ponte.js` — the 27 bridge rules now
  reference the English trace lines: 13-2 `column * star_width`, 13-6
  `lives = 3`, 14-4 `easy_button = Button(ai_game, "Easy")`), tutor
  (`engine/tutor.js` — teaching messages), dock, python-runner,
  python-worker (status messages, the Python prelude, the 17 error
  hints), storage, solutions-db, config (`Tutor · Progressive
  Breakdown`).
- **The app** (`app.js`, ~380 strings): panel titles (Modules,
  Walkthrough, Exercise, ⌨ Code, ✎ Lines, Console, Charts, Game,
  Progress, Guide, Sandbox, Account), buttons ("▶ Run and check the
  output", "⟲ restore original", "■ Stop", "✎ lines", "⚙ bridge to
  the project"), toasts, tooltips, empty states, the sandbox samples,
  the terminal prompt (`student@tutor:~$`), `en-GB` date formats.
- **Docs and meta**: README, this changelog, the v5–v12 CHANGELOGs
  (historical Italian UI labels preserved as quotes), the GitHub
  publication checklist (`docs/GITHUB-PUBLISHING.md`), `package.json`
  description, `serve.py`, `supabase/schema.sql`, the `.gitignore`
  headers, the CSS comments, and the two `data/solutions*.js` headers.
- **The test suite**: messages translated AND the assertion literals
  updated to the English data (13-2, 13-6, 14-4, 8-15 in
  `test_righe_v12.mjs`; the verify snippets of
  `test_flessibilita_v5.mjs` — 16-1/16-2/16-6 titles, 17-2 chart,
  8-7 keys…). **`npm test` is fully green on the English data.**

**Method and guarantees**

- The data translation ran per chapter group through 16 parallel
  passes, each validated by a structural integrity checker: code
  skeletons identical outside string literals/comments, every regex
  keeps its matching power, every expected output still matches what
  the expected code prints, `{{placeholders}}` ↔ hint keys in sync,
  per-exercise identifier renames forced to be consistent bijections.
- The engine/ponte rules were re-synced to the renamed trace lines;
  the 14-3 `speed_scale` lines are byte-identical (the bridge matches
  them).
- `data/solutions.js` (7.7 MB) is untouched apart from its header
  comment: the official solutions were already the book's English code.
- Anti-cache: `index.html` now loads `app.js`/`styles.css` with
  `?v=13.0`; `package.json` version is 13.0.0. No data schema change:
  `SOLUTIONS_VERSION` stays 3 (no re-seed), localStorage keys are
  unchanged (existing progress carries over).
- Known terminology: *ponte* → **bridge**, *paracadute* → **hint**,
  *scomposizione progressiva* → **progressive breakdown**; the
  original code identifiers (e.g. `righeUtente`, `applicaPonte`,
  `verificaOutput`) are preserved as internal APIs.

## How to verify

```bash
# audit and tests (Node ≥ 18) — all green on the English data
npm test
# → Exercises: 199 · Steps with code: 485 · Broken steps: 0
# → 10 of 10 · 31 of 31 · mode classification · 23 'sol' / 19 bridge / 27 rules

# UI (browser, needs http)
python3 serve.py         # → http://localhost:8000
# → 14-3: "✎ lines" tab: ONLY the 3 speed_scale lines (as in
#   "Exercise completed"), the module references (📄 settings.py
#   lines 27–43…) and the bridge "speed_scale *= 1.1 →
#   settings.py self.speedup_scale = 2.1";
#   write 10 on all the lines: the bridge shows "×10 → 30 / 120 / 15 ✓"
#   (the starting speeds) and "1.1 → 10" (the per-level increase,
#   which fires after 10 hits); ▶ run → the game starts 10×
#   faster, run marked "full program · ⌨ modified version";
```

## Deployment notes

- No changes to the storage schemas: no Supabase migration, no
  IndexedDB re-seed, no localStorage migration. The English edition
  reads the same progress keys as v12 — progress made in the Italian
  edition carries over (the exercise ids are unchanged).
- If you serve both the Italian and the English edition from the same
  origin, remember they share the same localStorage/IndexedDB.
- Version marker: `?v=13.0` in `index.html` — bump it at every release.
- Full history: `CHANGELOG-v5.md` … `CHANGELOG-v12.md` (Italian UI
  labels quoted there are historical).
