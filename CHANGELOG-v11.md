# Release v11 — tutor-scomposizione-esm-soluzioni

Date: 2026-11-12 · Based on: v10 (2026-11-12)

## Summary

Two defects reported by the user, both fixed:

1. **Code edited in the editor had no effect on the output**
   (example: 14-3 «Challenging Target Practice» did not change
   speed). Cause: the steps of 14-3 are a 3-line fragment
   (`speed_scale = 1.0 …`) that produces no output on its own, so
   after the student's lines ran, the platform started **the original
   solution** («double execution»): the game always ran at the book's
   speed and the edits remained invisible.
2. **The editor showed only the exercise's lines**, not the complete
   program the button really runs.

### The solution: three MODES of the ⌨ Code editor

The Code panel now always shows **the complete program that «▶ Esegui
e verifica l'output» sends to the runtime — from the initial imports
to the very end**:

| Mode | When | What it shows |
|---|---|---|
| `step` | the steps' program produces output on its own (the large majority: 2-x, 3-x, 8-x, 16-x…) | the lines of the passed steps (+ prerequisite base) + **tabs of the imported support modules** (e.g. `printing_functions.py`) |
| `files` | multi-file exercises (9-10, 9-11, 9-12, 11-1, 11-3) | YOUR files, one per tab (+ any support modules) |
| `sol` | the steps are **fragments of a larger program**: Pygame games of ch. 12–14 (14-1…14-8, 13-x, 12-x), class extensions (9-9), test programs (11-2, 17-3), refactoring (15-5), API (17-1) | **the complete project from the local database**: the entry (▶) + all `.py` modules as editable tabs + the list of data/image files (read-only) |

How it is decided: `modoCodice()` looks at the **target program**
(`bozzaProgramma`: the `c` lines of all the steps, prerequisites
included) — if it contains an output call (`print` / `.show` /
`input`) the exercise is «self-sufficient» (`step`), otherwise it is
a project (`sol`). The choice is **also learned in the field**: after
every run without an override, `st.studentOut` remembers whether the
steps' program produced output on its own (e.g. 8-15 prints through
the imported module: it stays `step`/`files`); passing a new step
re-evaluates.

### Edits now take effect (a real terminal)

- For exercises in `sol` mode, «▶ Esegui e verifica l'output» refers
  **always to the editor's project** — original or modified as it may
  be: `eseguiProgetto()` runs the entry with the database's files
  **plus the student's file-by-file overrides**. Change a speed in
  `settings.py` or in `target_practice.py`, press run: the game
  starts at YOUR speed.
- **With an armed override there is no longer any fallback to the
  original solution** (double execution and NameError→solution apply
  only without edits): the output, the game or the error you see is
  exactly the result of YOUR code — as in a terminal.
- The prompt of the Console and of the editor's terminal shows the
  **real** file executed (`python target_practice.py`, `python
  main.py`…) and runs are marked «programma completo (N file)» and
  «⌨ versione modificata».
- Support modules (`settings.py`, `printing_functions.py`…) are
  editable in the other modes too: the override applies to ALL the
  program's files.

### Zero regressions

- Without edits, `step`/`files` modes behave as in v10 (same
  pipeline, same teaching double executions).
- Data unchanged: `exercises.js`, `solutions.js`, `solutions-index.js`
  stay those of v9/v10 (no re-seed; `SOLUTIONS_INDEX_VERSION`
  unchanged). Overrides travel inside progress
  (`st.customCode` / `st.customFiles` / `st.customMode` /
  `st.studentOut`): localStorage right away, cloud with the existing
  debouncing.
- Backward compatibility: a v10 override (`customCode`) keeps running
  in `step` mode; «⟲ ripristina originale» resets everything.

## How to verify

```bash
# audit and tests (Node ≥ 18) — data unchanged
npm run audit            # 199 exercises · 485 steps · 0 inconsistent
npm run test:16-9        # 10/10
npm run test:v5          # 31/31

# interface (browser, serve over http)
python3 -m http.server 8000
# open http://localhost:8000
# → 14-3 «Challenging Target Practice»: press «⌨ codice»:
#   1. the editor opens the COMPLETE PROJECT: ▶ target_practice.py +
#      bullet.py, button.py, game_stats.py, settings.py, ship.py,
#      target.py (tabs) + images (read-only list);
#   2. open settings.py, change a speed, press ▶ esegui:
#      the game starts at YOUR speed (badge «⚠ modificato»,
#      run marked «programma completo (7 file) · ⌨ versione modificata»);
#   3. «⟲ ripristina originale» brings back the database's project;
# → 2-1: empty editor (placeholder), type print("ciao"), ▶ esegui:
#   output in the terminal, then «Esegui e verifica» uses your program;
# → 8-1: main tab (es_8_1.py) + printing_functions.py tab
#   (support module, editable);
# → 9-10: your my_restaurant.py / restaurant.py tabs (files mode).
```

Verified end-to-end in the browser (Pyodide runtime from the CDN):
14-3 with the complete project in tabs, `settings.py` override
executed by the button (game at the modified speed, ⌨ marker), 2-1
with a free-form program, 8-1 with a support module, 9-10
multi-file, no JavaScript errors in the console.

## Deployment notes

- No changes to the data or to the Supabase schema (progress is a
  JSON blob: new keys travel on their own).
- Teaching note: for exercises in `sol` mode the complete project
  (the book's solution) is now **visible and editable** upon the
  user's explicit request (the ⌨ button stays opt-in); the steps keep
  being verified as always in the Exercise panel.
- Full history: `CHANGELOG-v5.md` … `CHANGELOG-v10.md`.
