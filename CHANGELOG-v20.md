# Release v20 — tutor-scomposizione (English edition)

Date: 2026-11-16 · Based on: v19 (side-by-side tabs / cookies / SEO) · **v20.0**

## v20 · One tab bar · right-edge limit · homepage · header fix

Six requests from the v19 test round. The pedagogical engine, the
solutions database and the theme work are untouched.

**1 · Right-edge limit — tabs never get squashed** (`engine/dock.js`)

A new constant, `MIN_PANEL_PX = 320`, is the hard floor for every
column of a side-by-side split, enforced in the three places that
could squeeze a panel:

- **split creation** — `movePanel()` degrades a left/right drop to
  *center* (the tab joins the same bar, with an explaining toast)
  when the target group is narrower than `2 × MIN_PANEL_PX`;
- **resize gutters** — `makeGutter()`'s clamp is now pixel-based
  (`MIN_PANEL_PX/total`) instead of the old flat 6%, so a dragged
  gutter stops at ~320 px (it used to stop at ~80 px on a wide row);
- **runtime redistribution** — `ensurePanelSpace()` gives the siblings
  the same pixel floor, so widening the Game panel for a canvas can no
  longer crush a neighbour into an unreadable strip.

Net effect: however many panels are opened, the number of columns is
capped by the screen width — 4 columns on 1440 px, 3 on 1100, 2 on a
small laptop — and the right margin of the screen stays a usable
panel.

**2 · Tabs never go below — the vertical split is dead** (`engine/dock.js`)

- `insertSplit()` now always builds `'row'` splits: the top/bottom
  zones were already gone from the drag overlay in v19, and v20
  removes the last code paths that could still build a column
  (`nearestGroup()` lost its `top`/`bottom` branches too).
- **legacy layouts are migrated on load**: any saved tree that still
  contains a `col` split is flattened into ONE tab bar with all its
  panels in reading order (`treeHasCol` + `flattenInto`), and the
  migrated shape is persisted immediately. A returning user can never
  see a tab living under another tab again.
- `defaultLayout()` is a single group (`['esercizio']`) and the
  storage key is bumped to **`tutorLayoutV20`**: every visitor, new
  or returning, starts from the clean one-tab layout.

**3 · One tab bar by default — buttons add tabs, they don't split** (`engine/dock.js`, `app.js`)

`OPEN_ZONES` is gone: a closed panel reopened from the activity bar
(or a status chip, or the Charts/Game switch of a run) is **added to
the existing tab bar** — `'center'` for everyone. Side-by-side stays
possible, but only as the explicit gesture of dragging a tab onto the
left/right zone of a group wide enough to be split. The single-bar
view is the privileged layout, as requested.

The run flows got the matching treatment: on desktop the tab bar now
**lands on the panel that holds the result** (Console / Charts /
Game, including tracebacks and the pygame start/stop announcements) —
the same rule the phone already used. With one bar the output would
otherwise stay hidden behind the Exercise tab.

**4 · Header bug fixed — it never disappears in Settings/Guide** (`app.js`, `styles.css`)

The auto-hide watcher now **ignores every scroll while the Guide, the
Settings overlay or the Modules drawer is open** (and keeps the bar
visible), and `toggleDrawer()`/`toggleGuida()`/`toggleImpostazioni()`
restore the bar on both open and close. This closes the trap where
scrolling inside Settings slid the titlebar away and closing the
overlay left it hidden with nothing to scroll back up. The slide
itself is smoother: `.32s cubic-bezier(.4,0,.2,1)` on both the
desktop titlebar and the mobile header (was `.26s ease`).

**5 · Homepage — a real presentation of the site** (`index.html`, `app.js`, `styles.css`, `styles-light.css`)

A static `#homePage` section ships in `index.html`: brand, hero
("Learn Python by taking it apart."), two CTAs (**▶ Start learning**,
**☰ Browse the 199 exercises**) plus a **↩ Resume «id · title»**
button that appears only when there is a real exercise to resume,
four feature cards and the facts line. Because it is plain HTML+CSS:

- it paints with the first frame (it IS the landing LCP) and it gives
  the search engines real crawlable content (h1, cards, facts) next
  to the app-shell markup — the SEO work of v19 gains a body;
- `enterApp()` dismisses it with a fade+scale, marks the session
  (`sessionStorage`) so a **reload in the same tab skips it with zero
  flash** (the `data-skip-home` attribute is set on `<html>` by a
  bootstrap script in `<head>`, before the CSS parses), while a fresh
  visit always sees the presentation;
- the **welcome tour now fires after entering**, not behind the
  cover, and the informational toasts of the load phase (solutions
  database, sync notices) wait in a queue and are released on enter:
  the homepage stays clean for the visitor;
- Enter/Esc are keyboard shortcuts for "enter"; responsive down to
  phones (cards stack, CTAs go full width); light-theme variant in
  `styles-light.css` (cream background, white cards, deeper gradient
  on the hero word); `prefers-reduced-motion` disables the entrance
  cascade.

**6 · Initial layout = one tab** (`app.js`, `config.js`)

The workbench starts with a single **Exercise** tab, full width. The
Modules drawer and the Guide overlay keep their roles; every other
panel is one click away in the same bar. The old default (Exercise on
top, a 70/30 column with Console/Charts/Game/Code/Lines below) is
retired with the layout key bump.

**Housekeeping** — every specifier and tag is bumped to `?v=20`
(character-for-character identical between `index.html` and the
imports, per the stale-service-worker rule), `sw.js`'s cache name is
`tutor-v20`, and the a11y passes cover the new homepage buttons.

**Verified in this round** — single bar after 5 panel opens (1
group, 0 splits, layout persisted as a group) · drag → right creates
a 686/686 row split, a second drag to the 340-px column degrades to
center with the toast · gutter dragged to the extreme stops at ~320
px (was ~80) · legacy col layout flattened on load and saved back ·
header visible while scrolling inside Settings/Guide and after
closing them, auto-hide still working in panels (down → hides, up →
returns) · homepage: CTA/drawer/resume/session-skip/toast-queue on
desktop and mobile, no console errors.
