# Package v6 — tutor-scomposizione-esm-soluzioni

Date: 2026-11-11 · Based on: v5 (2026-11-08)

## Summary

- **Runtime repaired**: the «▶ esegui» of the exercises with Plotly
  (16-1 … 16-9) failed with `ImportError: Plotly Express requires numpy to be
  installed`. Now **numpy and pandas are loaded as native Pyodide packages
  BEFORE** installing plotly via micropip.
- **No learning content touched**: `data/` is byte-identical to v5; only
  `config.js` (package spec) and `engine/python-worker.js` (native
  dependency loading) change.
- v5 audit and tests still green: **199 exercises · 485 steps · 0
  inconsistent**, 31/31 flexibility tests.
- New **`test_runtime_plotly.html`**: end-to-end test of the runtime in the
  browser (downloads Pyodide from the CDN, runs the 16-9 program and checks
  that the Plotly figure reaches the panel). Result of the performed test:
  **PASSED** — run ok in 6.6 s, figure received (1 trace, 12,811 bytes).

## The bug (two missing dependencies, cascading)

The tutor installs `plotly` via **micropip** (the pure wheel from PyPI,
because the Pyodide distribution does **not** include plotly). The plotly
7.1 wheel declares only `narwhals` and `packaging` as dependencies, but
plotly.express actually also requires:

1. **numpy** — on first import, `plotly/express/__init__.py` does
   `raise ImportError("Plotly Express requires numpy to be installed…")`;
2. **pandas** — with list inputs (without a dataframe),
   `plotly/express/_core.py::to_named_series` raises
   `NotImplementedError("Pandas installation is required if no dataframe
   is provided.")`.

micropip can install neither numpy nor pandas from PyPI (binary wheels not
compatible with Pyodide), but **both exist as native packages** in the
Pyodide distribution (numpy 2.4.6, pandas 3.0.2): they must be loaded with
`pyodide.loadPackage()`.

Symptom seen on the platform (exercise 16-9, after passing the 7 steps,
pressing «▶ esegui»):

```
File "main.py", line 3, in <module>
  …plotly/express/__init__.py, line 12
ImportError: Plotly Express requires numpy to be installed. …
```

## The fix (2 files)

| File | Change |
|---|---|
| `config.js` | plotly spec: `{ native:false, name:'plotly', nativeDeps:['numpy','pandas'] }` — new `nativeDeps` key for dependencies to be loaded as native Pyodide packages |
| `engine/python-worker.js` | `loadPackage()`: in the micropip branch, BEFORE the installation it loads the `nativeDeps` with `py.loadPackage()`. Generic mechanism: reusable for other packages |

Why this way: `matplotlib` (native) already pulls in numpy on its own, so
the problem only concerned plotly; and loading numpy+pandas only when
plotly is needed (lazy) avoids ~17 MB of useless downloads for the other
exercises.

## How to verify

```bash
# audit and flexibility tests (Node ≥ 18, unchanged from v5)
npm run audit            # 199 exercises · 485 steps · 0 inconsistent
npm run test:v5          # 31/31
npm run test:16-9        # 16-9 verifier fix

# Pyodide runtime test (browser, needs http):
python3 -m http.server 8000
# then open  http://localhost:8000/test_runtime_plotly.html
# → it must print «✅ SUPERATO · run ok=true … figura ricevuta»
```

`test_runtime_plotly.html` uses the real `engine/python-runner.js`: it
downloads Pyodide from the CDN, loads numpy+pandas (native) and plotly
(micropip) through the new path, runs the complete 16-9 program on a
subset of the NASA/FIRMS data and verifies that the chart arrives as a
`plotly-figure` message (the one the app's panel then draws).

## Deployment notes

- As with v5: `package.json`, `audit_step_check.mjs`,
  `test_flessibilita*.mjs`, `test_runtime_plotly.html` and the changelogs
  are not needed by the browser app (can be excluded from the deploy).
- The fix requires the CDN's Pyodide distribution to have native numpy and
  pandas (v314.0.7 has them: numpy 2.4.6, pandas 3.0.2). If
  `PYODIDE.indexURL` is changed in the future, re-check the
  `pyodide-lock.json` of the new version.
- The first run of a plotly exercise now downloads ~17 MB more
  (numpy+pandas); subsequent runs are instantaneous (browser cache).
- Full history of the v4 → v5 changes: `CHANGELOG-v5.md`.
