# Release v16.2 — tutor-scomposizione (English edition)

Date: 2026-11-15 · Based on: v16.1 (bug fixes) · **v16.2.0**

## v16.2 · Walkthrough tab removed · full screen for Charts · bubble drawer · light test theme

Four requests from the v16.1 test round. The pedagogical engine, the
data and the v15/v16.1 performance work are untouched.

**1 · The Walkthrough tab is gone** (`app.js`, `engine/dock.js`)

The panel was a duplicate: the statement from the book is the
"📖 Exercise statement" details **inside the Exercise panel**, which every
student has open anyway. What only the Walkthrough showed — the chapter
concept chips — moved **under the statement** (a small "Ch. N concepts"
label + chips), so the Exercise tab is now self-contained: statement,
concepts, steps. Removed: the `renderTraccia` renderer, the `traccia`
entry from the panel registry / activity bar / mobile bar (`MOBILE_MAIN`
is now exercise · console · charts · game), the left group of the default
layout (the Exercise panel starts full-width) and one body from the
progressive render queue. Layouts saved by older versions are sanitized
automatically (unknown panel id → tab dropped), so upgrading keeps every
other panel exactly where it was.

**2 · ⛶ Full screen also in the Charts panel, with overlay controls**
(`app.js`, `styles.css`)

`setupGameFs` became the generic `setupFs(wrap, button, opts)`: the same
helper now drives the Game panel (unchanged behaviour, including the
landscape lock on phones) and the new Charts button. In the Charts panel
the toolbar (count · 🧹 clear · ⛶ full screen) becomes a **sticky overlay**
that floats over the charts and follows the scroll, with glassy pills
readable over the scrim — the same immersive treatment as the Game meta
bar. Plotly figures are re-fitted (`Plotly.Plots.resize`) after the
fullscreen transition; Matplotlib PNGs scale on their own. The button is
hidden while there are no charts. Esc / ⤡ exits, as in the Game panel.
The Guide now documents both buttons.

**3 · Bubble animation for the Modules drawer** (`styles.css`, `app.js`)

The side-sliding menu opens with a **springy overshoot** (a soap-bubble
pop): while closed it rests slightly squashed (`scale(.96)`) against the
sidebar, then springs past its final position and settles — with softly
rounded right corners (20 px) to complete the bubble look. Closing keeps
a quick, sober curve (the transition of the destination state is the one
that runs, so open and close each get their own timing). The
`[hidden]`-after-close timeout follows the new duration. All of it is a
plain CSS `transform` transition: compositored, no layout work, and
already covered by the `prefers-reduced-motion` kill-switch.

**4 · `styles-light.css` — a light, rounded TEST theme (not part of the
main project)** (new file)

A second stylesheet with a friendlier look: light surfaces, softer
shadows, 14 px base radius, pastel tints — for evaluation only, the dark
theme remains the project's theme. It `@import`s `styles.css` and
overrides only colors/shadows/radii, so every layout rule, the drawer,
the overlay and the mobile view keep working. Two deliberate dark
survivors: the Console (a terminal is expected to be dark and its output
colors are tuned for it) and the immersive Game stage / full-screen
scrims. To try it, see the header of the file: swap the `<link>` in
`index.html` (or add the light file right after the main one) — nothing
else changes.

## Files touched

- `index.html` — `?v=16.2` on stylesheet/script; modulepreload hrefs versioned.
- `app.js` — versioned imports; `renderTraccia` removed; chapter concepts
  folded into the Exercise statement; `refreshPanels` list without
  `traccia`; `defaultLayout` without the left group; `setupGameFs` →
  generic `setupFs` (game + charts, Plotly re-fit, overlay controls);
  drawer close timeout follows the bubble animation; Guide text updated
  (four mobile tabs, ⛶ full screen documented).
- `engine/dock.js` — versioned import; `traccia` dropped from `ACT`,
  `MOBILE_MAIN`, `OPEN_ZONES`, `BODY_PRIO`.
- `engine/python-worker.js`, `engine/tutor.js`, `engine/storage.js`,
  `engine/solutions-db.js`, `engine/python-runner.js` — versioned imports.
- `styles.css` — drawer bubble animation + rounded corners; `.graphs-wrap`
  full-screen rules (sticky overlay toolbar, glassy pills, dark stage);
  `.ex-statement .concepts` styles.
- `styles-light.css` — NEW: the light test theme.
- `sw.js` — cache name `tutor-v16.2`.
- `package.json` — version 16.2.0.
- `README.md` — project structure mentions the new file and the changelog.

## Compatibility

No data format changed: saved layouts, progress and IndexedDB solutions
keep working. A layout saved by v16.1 that still contains a `traccia` tab
is sanitized on load (the tab disappears, everything else stays). The
service worker picks the new cache name on the next visit and purges the
old one.
