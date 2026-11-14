# Release v12 — tutor-scomposizione-esm-soluzioni

Date: 2026-11-12 · Based on: v11 (2026-11-12) · **v12.1.1: 2026-11-13**

## v12.1.1 · runtime verification of the fix + anti-cache (2026-11-13)

After the report «with all lines at 10 the game's speed does not
change», the v12.1 bridge was verified **inside the runtime**, not
just in the Node tests:

- **runtime verified for real**: 14-3 run with the three lines at
  10 → the runtime's `/home/pyodide/settings.py` file contains
  `speedup_scale = 10` **and** `ship_speed = 30`, `bullet_speed = 120`,
  `target_speed = 15`, and the `settings` module imported by the game
  really produces those values (the «sys.modules cached» hypothesis is
  disproved: the prelude already does `sys.modules.pop` of the
  virtual modules on every run); re-execution **with the game still
  running** was verified in the runtime too: old game closed and
  logged, new game started with the new values (×2 → 6/24/3);
- **most likely cause of the report**: the described behavior (only
  `speedup_scale` changes, the starting speeds stay 3.0/12.0/1.5) is
  **exactly** v12.0's (before the scale rules). The app was served
  without cache headers and `index.html` loaded `app.js`/`engine/*.js`
  without a version marker: after an update the browser can serve the
  **old modules from the HTTP cache** (same port, same URLs).
  Remedies:
  - **`serve.py`** (new): development server with
    `Cache-Control: no-store` — the recommended way to serve the app
    locally (`npm run serve` / `python3 serve.py`);
  - **`index.html`** loads `app.js` and `styles.css` with a version
    marker (`?v=12.1.1`): to be updated on every release;
  - README: explicit note (hard refresh after an update if
    `python -m http.server` is used);
- **ready for publication**: added `README.md` (complete
  instructions), `LICENSE` (MIT), `.gitignore`, repository/license
  fields in `package.json` (version 12.1.1, `engines.node >= 18`,
  `serve` script). No changes to the data, the schema or the app's
  behavior: only the version marker in `index.html` and the new
  `serve.py`.

## Summary

Three requests, all implemented:

1. **The editors open in a separate tab and are independently
   accessible**: in the default layout the editors (⌨ «Codice
   completo» + the new ✎ «Righe») live in a **separate tab group**
   from Console/Charts/Game — opening them no longer covers the
   output. Both are **top-level panels**: they open and close on
   their own from the **activity bar** on the left (or from the ⌨/✎
   buttons next to «Esegui»), without going through the Exercise
   panel. The layout key was renewed (`tutorLayoutV12`), so even
   anyone with a saved layout immediately sees the new arrangement.
2. **New ✎ Lines panel — the lightweight editor**: it shows **only
   the exercise's lines** — those of «Esercizio completato» —
   without the complete code around them, and it is editable:
   **edits take effect on the output**.
3. Dedicated **⟲ ripristina originale** (besides the one in ⌨ Code).

### v12.1 · edits become VISIBLE in the output (follow-up to field testing)

Two problems surfaced while trying 14-3 with `speed_scale = 10` on
all lines, both fixed:

- **The speed did not change**: `speed_scale *= 1.1` does become
  `self.speedup_scale = 10`, but that value kicks in **only after 10
  hits** (levelup) — the starting speed (ship 3.0, bullets 12.0,
  target 1.5) does not depend on it. New **scale** rules: the
  `speed_scale = X` line (start and reset) **multiplies the base
  speeds** in `initialize_dynamic_settings` — with X = 10 the game
  starts at ship 30 / bullets 120 / target 15, immediately visible;
  with X = 0.5 everything runs at half speed. The bridge note says
  when the increase kicks in (`speedup_scale`, after every 10 hits).
- **The old game kept running with the old settings**: if a Pygame
  game is still running, «▶ esegui» used to be rejected
  («Un'esecuzione è già in corso») and the old game stayed on
  screen. Now **▶ esegui closes the active game on its own** and
  relaunches immediately with the just-edited lines (verified
  end-to-end: first run with everything at 10 → edit to 3.5 with the
  game active → ▶ esegui → old game closed and logged, new game
  started with speedup 3.5).

## The Lines panel: what it shows, per exercise

The classification is the same as v11's (`modoCodice`), so ✎ and ⌨
always agree on what «▶ Esegui e verifica» sends to the runtime:

| Mode | What you see in ✎ Lines | Module reference |
|---|---|---|
| `step` | the lines of the **passed steps** (YOUR lines), **without** the prerequisite base and without the support modules | «righe dell'esercizio + N di base prerequisito (nascosta: la riaggiunge ▶ esegui)» · ⌨ apri il modulo |
| `files` (9-10, 9-11, 9-12, 11-1, 11-3) | your **files**, one per block, without the support modules | «▶ file eseguito» / «modulo dell'esercizio» · ⌨ apri il modulo |
| `sol` (Pygame games 12–14, fragments, tests…) | **only YOUR exercise's lines** — exactly those of «Esercizio completato» (the saved step lines, or the trace), one block per step. E.g. 14-3: the 3 lines `speed_scale = 1.0` / `speed_scale *= 1.1` / `speed_scale = 1.0`, nothing else | the **project modules** where the exercise lives (file + lines): «📄 settings.py · righe 27–43 di 43», «📄 target_practice.py · righe 73–74 · 139–143»… · click = open the module in ⌨ Code |

### ⚙ The bridge: how the exercise's lines map onto the project (`sol` mode)

The «Esercizio completato» lines of `sol` exercises are the
**conceptual trace**: the real program is the complete project in the
local database, where the trace lives in its final form (for 14-3
`speed_scale *= 1.1` → `self.speedup_scale = 2.1` in `settings.py`).
The panel shows **the mapping** and the **bridge** walks it in both
directions:

- below the lines, **«⚙ ponte col progetto — cosa corrisponde a
  cosa»**: for each mapped value, the trace's line → the project
  module and line that implements it («`speed_scale *= 1.1` → 📄
  settings.py `self.speedup_scale = 2.1`»), updated **live** while
  you edit («✓ 1.1 → 3.5», `self.speedup_scale = 3.5`);
- the values you change **carry over to the project**: `1.1 → 3.5`
  in ✎ Lines ⇒ `self.speedup_scale = 3.5` in settings.py ⇒ ▶ esegui
  runs the game at YOUR speed. The rules live in `engine/ponte.js`
  (data, verified by the test) and come in four kinds:
  - **slot** (19 exercises): the trace line's value (number, key,
    label…) replaces the corresponding value in the module — e.g.
    14-3 `speedup_scale`, 14-2 `miss_limit`, 12-4/12-6/13-3/13-5 the
    speeds, 14-1 the `K_p` key, 14-4 the button labels, 14-8 the
    points per alien, 17-1 the API language and stars, 13-2 the star
    scatter, 13-6 the lives;
  - **scale**: the line's value is a FACTOR that multiplies the base
    value in the module — e.g. 14-3 `speed_scale = 10` → the
    starting speeds of initialize_dynamic_settings become ship 30 /
    bullets 120 / target 15 (immediately visible);
  - **block**: the step's edited lines replace the corresponding
    block in the module, re-indented as needed (9-9 the
    `upgrade_battery` method, 11-2 function + test, 14-6
    `_start_new_level`, 15-5 `get_step`);
  - **program**: the trace IS a complete program and replaces the
    entry (8-15 `printing_models.py`, 12-1 `blue_sky_game.py`).
- lines **without** a mapping say so clearly (each line's note tells
  where the value lives in the project); the 4 purely conceptual
  traces (12-2, 13-1, 14-5, 17-3) explain it and point to ⌨ Code;
- if you change the **number of lines** of a step, single values no
  longer carry over (the indexes are no longer reliable): explicit
  warning, while blocks keep carrying over.

As in the previous v12, the **reference** calculation (which modules
and lines the exercise lives in) is automatic: diff against the
predecessor in the same chain (14-3 ← 14-2), new project files, step
fragments matched verbatim — all verified by the test.

### Edits take effect (same override as ⌨ Code)

✎ Lines arms **the same overrides** as v11 (`st.customCode` /
`st.customFiles`): «▶ Esegui e verifica» — here, in the Exercise panel
and in ⌨ Code — runs the modified version, and the «⚠ modificato»
badge is synchronized everywhere. In `sol` mode the bridge files are
**always regenerated from the original project** on every edit:
consecutive edits are stable (`1.1 → 9.9` and then `1.1 → 4.4` gives
`4.4`), and the edited lines reopen as you left them
(`st.customRighe`). In `step` mode the prerequisite base is
**automatically prepended** to the override. «⟲ ripristina
originale» discards the edits (it counts for ✎ and ⌨ together) and
brings back the exercise's lines.

## How to verify

```bash
# audit and tests (Node ≥ 18) — data unchanged
npm run audit            # 199 exercises · 485 steps · 0 inconsistent
npm run test:16-9        # 10/10
npm run test:v5          # 31/31
npm run test:modi        # 171 step · 5 files · 23 sol
npm run test:righe       # v12.1 · 23 'sol' exercises: steps = «esercizio
                         #   completato», valid references, 27 bridge
                         #   rules (slot/scale/block/program)
                         #   verified on the real files, patch and round-trip

# interface (browser, serve over http)
python3 -m http.server 8000
# open http://localhost:8000
# → 14-3: «✎ righe» button: ONLY the 3 speed_scale lines (as in
#   «Esercizio completato»), the modules cited as reference (📄
#   settings.py righe 27–43…) and the bridge «speed_scale *= 1.1 →
#   settings.py self.speedup_scale = 2.1»;
#   type 10 on all the lines: the bridge shows «×10 → 30 / 120 / 15
#   ✓» (the starting speeds) and «1.1 → 10» (the increase per
#   level, which kicks in after 10 hits); ▶ esegui → the game starts
#   IMMEDIATELY 10× faster (run marked «programma completo · ⌨
#   versione modificata»);
#   with the game still running, change the lines again and press
#   ▶ esegui: the old game closes on its own and restarts with the
#   new lines — no more «esecuzione già in corso»;
#   «⌨ apri il modulo» shows settings.py already modified;
#   «⟲ ripristina» brings everything back to the original;
# → 2-1: empty editor, type print("ciao"), ▶ esegui → output in the terminal;
# → 15-2: only the exercise's line, the 15-1 base (5 lines) is hidden
#   and added back on its own at execution;
# → 9-10: your files one per block (main.py ▶);
# → 14-6/15-5: the edited block replaces the method in the module (re-indented);
# → 8-15/12-1: your trace IS the program, it replaces the entry.
```

Verified end-to-end in the browser (Pyodide runtime from the CDN):
14-3 with ALL lines at 10 → settings.py with ship 30 / bullets 120 /
target 15 (start) and `speedup_scale = 10`, in ✎ and in ⌨; game run
with the modified version; **re-execution with the game still
running** → old game closed and logged, new game started with the
updated override (3.5), no errors; restore, reopening with the edited
lines persisted, 2-1 with a free-form program, 9-10 multi-file,
mobile view, no JavaScript errors in the console.

## Deployment notes

- No changes to the data (`exercises.js`, `solutions.js`,
  `solutions-index.js` unchanged: no re-seed) or to the Supabase
  schema: overrides travel inside progress as in v11 (new optional
  field `customRighe`: the ✎ panel's edited lines).
- **New `engine/ponte.js`**: the lines→project mapping table (pure
  data, no DOM) — one more file to serve.
- **`engine/python-runner.js`**: if a Pygame game is what's running,
  «▶ esegui» closes it on its own (pg-quit + wait for the run to end)
  and relaunches right after: edits take effect immediately, with no
  manual «■ termina».
- `engine/solutions-db.js` exposes `getSolutionRaw()` (only the
  exercise's own files) and `indexIds()`, used by the reference
  calculation.
- New layout key `tutorLayoutV12` (config.js): the saved layout
  updates itself on first launch; progress is untouched.
- Full history: `CHANGELOG-v5.md` … `CHANGELOG-v11.md`.
