# Package v7 — tutor-scomposizione-esm-soluzioni

Date: 2026-11-11 · Based on: v6 (2026-11-11)

## Summary

- **Charts panel repaired**: after the «▶ esegui» of an exercise with
  Plotly (e.g. 16-9) the chart window opened **empty** and, once closed
  or refreshed, never came back. Now the figure is saved as data, is
  really drawn, and is redrawn on every panel refresh.
- **Closing individual charts**: every card has a **✕** that closes only
  that chart (previously the windows could never be removed); the panel
  bar has **«🧹 pulisci»** to close them all.
- End-to-end tests in the browser (real interface + Pyodide runtime):
  Plotly figure drawn and visible, redrawn after a tab switch, single
  close and «pulisci» verified, Matplotlib path intact, zero JavaScript
  errors.
- Audit and flexibility tests unchanged and green: **199 exercises ·
  485 steps · 0 inconsistent**, 31/31.

## The bugs (4 chained causes)

1. **The chart was never redrawn.** `onPlotlyFigure` drew the figure with
   a `requestAnimationFrame` right after `pushGraph`, but every panel
   refresh (a second figure, a tab switch, dragging a panel) rebuilt the
   cards from HTML strings with **empty divs**; the re-render read
   `window.__plotly_figs`, a registry that was **never populated**.
   → The cards came back empty.
2. **The Charts tab was not activated.** `pushGraph` activated the tab
   only if the panel was not already in a group: if the «Grafici» tab
   existed but was not the visible one, the chart was archived and
   `refreshPanels` rendered nothing.
3. **The group was too short.** With the compacted layout (e.g. the
   Sandbox tab open at the bottom) the Charts group was left a strip of
   ~90-125 px: a 280 px chart could not be seen.
4. **plotly.js could be missing.** If the CDN script (loaded with
   `defer`) had not arrived, the drawing was skipped silently, with no
   error and no recovery attempt.

## The fix (3 files)

| File | Change |
|---|---|
| `app.js` | figures saved as **data** (`fig` JSON / `b64`), not as HTML; `renderGrafici()` is the single drawing point: it builds the cards and redraws every Plotly figure after each refresh; every card has the ✕ (`closeGraph`, with `Plotly.purge`); bar with counter and «🧹 pulisci»; `pushGraph` always activates the Charts tab; `ensurePlotlyJs()` loads plotly.js on demand if it is missing, with a clear error message in the card if the CDN is unreachable; card limit 8→12 |
| `engine/dock.js` | new API `ensurePanelSpace(pid, minPx)`: if a panel's group is shorter/narrower than minPx, its slice of the split is widened (siblings never below 6%); `renderNode` also records `node._el` on splits (needed to measure) |
| `styles.css` | styles for `.graphs-toolbar` (counter + clean), `.graph-close` (✕ with red hover), `.plotly-err` (message in place of the chart) |

The title of each Plotly card is now the chart's own (from
`fig.layout.title`), no longer the generic «📊 Plotly».

## How to verify

```bash
# audit and tests (Node ≥ 18) — unchanged
npm run audit            # 199 exercises · 485 steps · 0 inconsistent
npm run test:v5          # 31/31

# interface (browser, needs http):
python3 -m http.server 8000
# open http://localhost:8000 → Sandbox panel → «Plotly» sampling → ▶ Esegui
# → the chart appears already drawn in the Charts panel;
# → ✕ on a card closes that chart, «🧹 pulisci» closes them all;
# → switch tab and come back: the chart is redrawn.
```

Tests performed (headless browser + real Pyodide from the CDN): Plotly
figure drawn (324 px group height after automatic expansion, 13.8% chart
area in the screenshot); second figure → both drawn; ✕ on one card → the
other stays drawn, counter updated; tab switch → redraw; «pulisci» →
empty state; Matplotlib sampling → 434×347 px image; zero JS errors.

## Deployment notes

- As with v5/v6: `package.json`, the audit/test scripts,
  `test_runtime_plotly.html` and the changelogs are not needed by the
  browser app.
- The automatic expansion of the Charts group (`ensurePanelSpace`) changes
  the saved layout only when the group is shorter than 330 px: whoever
  wants a thin strip can drag the gutter after the chart arrives.
- Full history: `CHANGELOG-v5.md` (36 steps verified) and
  `CHANGELOG-v6.md` (native numpy+pandas for plotly).
