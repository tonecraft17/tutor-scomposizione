# Release v10 — tutor-scomposizione-esm-soluzioni

Date: 2026-11-12 · Based on: v9 (2026-11-12)

## Summary

- **New Code panel (editor + terminal)**: a small **⌨ codice** button
  next to «▶ Esegui e verifica l'output» (and in the Console's header)
  opens the exercise's **complete program** — exactly the code the
  Run button sends to the runtime:
  - the lines of the **passed steps** (plus any **prerequisite base**,
    honoring the «Includi codice base» checkbox);
  - **file by file** in multi-file exercises (9-10, 9-11, 9-12, 11-1,
    11-3: `restaurant.py` / `main.py`… tabs, each editable on its own);
  - **editable**: every edit saves a per-exercise *override*
    (`st.customCode` / `st.customFiles`, stored inside progress →
    synced to the cloud as well) and from that moment **«Esegui e
    verifica l'output» runs the student's version**, from the
    Exercise panel, the Console or the editor itself alike. The same
    result can be achieved **in a way other than the preset
    solution**;
  - **works like a terminal**: `Ctrl`+`Enter` (or «▶ esegui») runs
    the code and the output appears **below the editor**, with the
    `studente@tutor:~$` prompt, translated tracebacks and a blinking
    cursor; the full history stays in the Console panel.
- **Smart override**: the override arms itself **only** if the typed
  content differs from the steps' program; if the student touches
  nothing, the execution always stays current with the last passed
  step (no stale «snapshot»). If the text goes back to being
  identical to the original, the override disarms itself.
- **⚠ marker everywhere**: when a modified version exists, the
  editor badge lights up, the ⌨ button shows «⌨ codice ⚠», the note
  next to «Esegui e verifica» warns («eseguirà la versione
  modificata») and Console runs are marked «· ⌨ versione modificata».
- **⟲ ripristina originale** (with confirmation): discards the edits
  and returns to the program assembled from the steps. Plus «copia»
  (to the clipboard) and «🧹 pulisci» (history shared with the
  Console).
- **Zero regressions**: with no edits the behavior is identical to
  v9 (same execution pipeline: support files from the local
  database, double execution, pytest, Pygame games, auto-import).

## How it works, in detail

| Piece | What it does |
|---|---|
| `snapshotCodice(e)` | Computes the COMPLETE program from the same source as `eseguiEsercizio` (`codiceEsercizio` / `codicePerFile`), so the editor really shows what runs |
| `codiceArmato(e, st)` | Tells whether an override exists for this exercise (`customCode` or `customFiles`) |
| `eseguiEsercizio` | If the override exists, runs it (file by file: the student's files become real runtime files, including ones emptied on purpose); otherwise the steps' program as always |
| `renderCodice(box)` | The panel: header with badge, file tabs (multi-file), textarea, actions, terminal |
| `runBlockEl(r, e)` | The block of ONE execution, shared by the Console and the editor's terminal: identical markup + ⌨ marker |
| `updateCodiceOut()` | Refreshes only the editor's output area after each run (typing never loses focus) |
| `aggiornaBadgeCodice(e)` | Live-updates the badge, note, ⌨ button and the file tabs' dots |

Teaching note: the official solutions' code stays **never shown**
(spoiler policy unchanged): the editor contains only the program the
student wrote in the steps (or edits of it). Non-executable exercises
(`noRun`: shell commands, Django projects) have no ⌨ button, and the
editor explains them instead of showing code.

## How to verify

```bash
# audit and tests (Node ≥ 18) — data unchanged from v9
npm run audit            # 199 exercises · 485 steps · 0 inconsistent
npm run test:16-9        # 10/10
npm run test:v5           # 31/31

# interface (browser, serve over http)
python3 -m http.server 8000
# open http://localhost:8000
# → exercise 2-1: press «⌨ codice» next to «▶ Esegui»:
#   1. the editor opens EMPTY (no steps passed) with the placeholder;
#   2. write your own program (e.g. print("ciao")) and press ▶ esegui:
#      the output appears in the terminal below, badge «⚠ modificato»;
#   3. «Esegui e verifica l'output» in the Exercise panel now runs
#      YOUR program (⚠ note and ⌨ marker in the Console);
#   4. pass step 1 as usual, then «⟲ ripristina originale»:
#      the editor goes back to the steps' program and the run follows;
# → exercise 9-10 (multi-file): restaurant.py / main.py tabs,
#   each file editable, the • dot marks modified files;
# → exercise 18-1 (shell): no ⌨ button (no Python to run).
```

Verified end-to-end in the browser (Pyodide runtime from the CDN): app
started with no JavaScript errors, editor opened on 2-1, custom program
run with output in the terminal, override applied by «Esegui e
verifica» (⌨ marker in the Console), original restored OK, multi-file
9-10 with file tabs and import of the modified module OK.

## Deployment notes

- No data changes: `data/exercises.js`, `data/solutions.js` and
  `data/solutions-index.js` stay those of v9 (no re-seed).
- Overrides (modified code) travel inside progress: localStorage
  right away, cloud with the existing debouncing.
- Anyone with a saved layout sees the new tab only after pressing
  ⌨ codice (the panel opens in the bottom group, next to the
  Console).
- Full history: `CHANGELOG-v5.md` (36 steps verified),
  `CHANGELOG-v6.md` (native numpy+pandas for plotly),
  `CHANGELOG-v7.md` (Charts panel fixed + single close),
  `CHANGELOG-v8.md` (Game panel visible and playable),
  `CHANGELOG-v9.md` (assignment and output re-check, 5 fixes).
