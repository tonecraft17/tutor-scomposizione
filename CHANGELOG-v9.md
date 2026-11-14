# Release v9 — tutor-scomposizione-esm-soluzioni

Date: 2026-11-12 · Based on: v8 (2026-11-12)

## Summary

- **Full re-check of assignments and outputs**: every assignment of the
  199 exercises was re-read against the original wording of *Python
  Crash Course* (3rd ed.) and every output was tested against the real
  behavior of the code (both the guided code of the steps and the
  official code of the solutions).
- Three levels of automated verification, all green:
  1. **static audit** of all 260 Python files of the solutions database
     (syntax + undefined names + imports across the project's files,
     checking every file, not just the entry point) — it would
     reproduce the old 14-8 bug (`Button` not defined) if it ever came
     back;
  2. **runtime audit**: every executable solution run with real Python —
     114 programs terminate cleanly (simulated interactive inputs), 4
     pytest suites pass (11-1, 11-2, 11-3, 17-3), 18 Pygame games
     remain validated in the browser (v5/v8), 14 Django projects
     correctly not executable (mode none);
  3. **guided-path audit**: the cumulative code of the steps (field `c`,
     with the prerequisites of exercises that «start from the previous
     one», exactly as `codiceEsercizio()` does) executed step by step
     and compared with the expected outputs (`so`) with the same
     semantics as `verificaOutput()`.
- Five inconsistencies found and fixed (details below): 3-10 and 10-10
  had **expected outputs that could never be produced** (or were
  wrong), 2-7 and 4-4 expected lines the runtime can never show, and
  the solution of 6-11 printed two typos to the console, inherited
  from the book's official repo.
- The 16-9 test (`test_flessibilita.mjs`) now distinguishes the
  negative cases («this code must be rejected»): before, it printed ✗
  FAIL even when the verifier correctly rejected the code, and the
  test had no exit code: `npm test` never noticed.
- `SOLUTIONS_VERSION` 2→3 and `SOLUTIONS_INDEX_VERSION` 2→3: the
  solutions IndexedDB re-seeds itself on first launch (verified in the
  browser: seed v3, the 6-11 solution already fixed in the local
  database).

## The five fixes

| Exercise | Problem | Fix |
|---|---|---|
| **3-10 · Every Function** | Steps 2–7 and 9 announced confirmation outputs («Aggiunto in coda: torino»…) that the guided code never printed: append/insert/del/remove/sort/reverse produce no output. And two values were simply wrong: `pop()` after `append("torino")` removes **torino**, not napoli; `sorted()` at that point gives `['bologna', 'napoli']`, not `['bologna', 'torino']`. Whoever followed the hint never saw the «✓ Output verificato» | The steps now also ask for the confirmation `print()` (two-line hint, updated regexes); `so` fixed (pop → torino, sorted → ['bologna', 'napoli']). The guided program now produces exactly the announced outputs |
| **10-10 · Common Words** | The test text contains «the» 5 times (*the cat, the mat, then, the dog, there*), but the expected output said 4 | `so`: «Occorrenze di 'the': 5» (the «with space» count: 3 was already correct) |
| **2-7 · Stripping Names** | Step 3 (lstrip) expected the line «Grace Hopper\n» with a **literal \n**: no real output can ever contain it (the soft verification always failed) | `so`: «Grace Hopper»; a new teaching note explains that the trailing \n stays and why an empty line appears after the name |
| **4-4 · One Million** | The expected output included «999999», «1000000» and «[output interrotto: troppo lungo]», but the console captures at most 200 KB: those lines never appeared | `so`: «1 2 3 …» (the first lines, always present; «…» is a placeholder skipped by verification); a note explains the truncation and the ■ termina button |
| **6-11 · Cities** | The book's official solution prints two typos to the console: «The Andes **mounats** are nearby» and 'himilaya' (the official pcc_3e repo has them too, verified) | Fixed to «mountains» and 'himalaya' in the local database's 6-11 solution: the student sees clean text. A deliberate deviation from the official version, documented as such |

The 16-9 test: `verifyNeg()` for the negative cases (incomplete version →
count error; `color_continuous_scale` missing → «contenuto non
corrisponde») and exit code 0/1; `npm test` now really fails when
something breaks.

## How to verify

```bash
# audit and tests (Node ≥ 18)
npm run audit            # 199 exercises · 485 steps · 0 inconsistent
npm run test:16-9        # 10/10 (including the 2 negative cases, exit code)
npm run test:v5          # 31/31

# interface (browser, serve over http)
python3 -m http.server 8000
# open http://localhost:8000
# → exercise 3-10: step 2 now asks for 2 lines (append + confirmation
#   print) and the «✓» arrives; at the end of the exercise «▶ Esegui e
#   verifica» shows ALL the announced lines in the console, with pop →
#   torino and sorted → ['bologna', 'napoli'];
# → exercise 6-11: complete the steps and run: the console shows
#   «The Himalaya mountains are nearby.» (before: «mounats»);
# → anyone who already had v8 open: the local database re-seeds itself
#   (SOLUTIONS_INDEX_VERSION 3): no action required.
```

Verified end-to-end in the browser (Pyodide runtime from the CDN): app
started with no JavaScript errors, exercise 3-10 steps 1–2 passed with
the new two-line code («PASSO 3 DI 10»), IndexedDB re-seeded with seed
v3 and the 6-11 solution already fixed inside the database.

## Deployment notes

- No engine or interface file changes: only data (`data/exercises.js`,
  `data/solutions.js`, `data/solutions-index.js`), the 16-9 test and
  the version.
- The IndexedDB re-seed is automatic on first launch (no user action,
  no progress lost: only the solutions table is regenerated).
- Full history: `CHANGELOG-v5.md` (36 steps verified),
  `CHANGELOG-v6.md` (native numpy+pandas for plotly),
  `CHANGELOG-v7.md` (Charts panel fixed + single close),
  `CHANGELOG-v8.md` (Game panel visible and playable, mouse fixed).
