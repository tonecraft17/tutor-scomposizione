# Release v17 — tutor-scomposizione (English edition)

Date: 2026-11-15 · Based on: v16.2 (UI round) · **v17.0**

## v17 · Hover-expand sidebar · account top-right · Settings overlay · dark/light themes · wider code zones

Five requests from the v16.2 test round. The pedagogical engine, the
data and the v14–v16.2 performance work are untouched.

**1 · The left sidebar expands on hover, showing the full names**
(`engine/dock.js`, `styles.css`)

Every activity-bar button now carries a hidden `.act-label` with the
panel's full name. At rest the bar is the usual 46px icon strip; on
`:hover` — or `:focus-within`, so Tab gives keyboard users the same
reveal — it springs open to **232px** with the same overshoot curve as
the Modules drawer ("bubble" feel), the labels sliding into place.
The trick that keeps the dock untouched: the expanded bar grows a
**negative right margin of exactly 232−46 px**, so its net width in
the flex flow stays 46px — the expansion floats OVER the panels
(z-index 40, soft shadow), with **no reflow, no canvas resize, no
splitter jump**. Leaving the bar collapses it back; the separator
stretches with it; `prefers-reduced-motion` kills the animation via
the existing global switch.

**2 · Wider code-writing zones, with scrollbar when they don't fit**
(`app.js`, `styles.css`)

The ⌨ Code editor, the ✎ Lines blocks and the Sandbox textarea are
now **as tall as their content**: `armAutogrow()` sizes each textarea
to its `scrollHeight` (retrying while the progressive scheduler still
holds it detached, where `scrollHeight` would be 0), re-fits on every
input and on focus. The type grows to **14px mono** with 1.75 line
height, minimum heights rise (260px full editor, 240px sandbox, 64px
per Lines block, no more 22-rows cap). When a program is longer than
the panel, **the panel itself scrolls** with its own scrollbar (the
`.dk-*` panel is the scroll container): the old small-box-with-
internal-scroll is gone. The wraps switched from `height:100%` to
`min-height:100%`, the editor terminal's max-height from `38%` to a
`46vh` that still means something in the new geometry, and the Lines
blocks container no longer scrolls on its own.

**3 · Account button in the top-right corner** (`index.html`, `app.js`,
`styles.css`)

The account moved OUT of the activity bar (the icon is gone from the
sidebar; the dock panel survives for the status-bar chip, the mobile
⋯ More menu and the popover itself). The titlebar's right corner now
holds a pill with the **avatar initial + exercises-completed counter**
(`0/199`), always in sync (refreshed with the status bar, on auth
changes and on remote applies). A click opens a **popover** with the
account info (email or "Local student", sync state), the **synthetic
progress** (done/total with bar, steps passed, average autonomy, full
hints) and two bridges: **"⚙ edit — settings"** (opens the Settings
overlay) and "open the full Account panel", plus sign in/out. The
popover closes on outside click, Esc, and whenever the auto-hide
header slides away (a MutationObserver on `body.head-off`), so it can
never float orphaned over the work area.

**4 · ⚙ Settings: sidebar button, credentials, privacy** (`app.js`,
`engine/storage.js`, `engine/dock.js`, `index.html`, `styles.css`)

A **gear icon at the bottom of the activity bar** (after the spacer,
VS Code-style) — and ⚙ in the mobile header — opens a new overlay
(same shell, focus trap and Esc/backdrop close as the Guide) with
three sections:

- **🎨 Appearance** — the dark/light switch, see point 5.
- **🔑 Access credentials** — signed in: change password (double
  field, immediate), change email (two-step, confirmation link to the
  new address); not signed in: "forgot password" recovery email;
  local mode: what to fill in `config.js` to enable accounts. Three
  new `storage.js` functions wrap `supabase.auth.updateUser` /
  `resetPasswordForEmail`.
- **🔒 Privacy and data** — a plain-language list of what is stored
  where (localStorage progress, IndexedDB book solutions, the optional
  cloud row, the public CDNs); a **cloud-sync switch** that really
  stops the mirror (gates `push`/`pull`/realtime in `storage.js`,
  persists in localStorage, re-pulls on re-enable); **export my data**
  (JSON download of the progress); **delete local data** and **delete
  cloud data** (separate, both confirmed with a modal).

**5 · Two CSS files, two real themes — terminals stay black**
(`styles-light.css` rewritten, `index.html`, `app.js`, `config.js`)

`styles-light.css` is no longer a test-only file to swap by hand: it
is the **light half of the switch**, always loaded after `styles.css`
with **every rule scoped under `[data-theme="light"]"`** (zero cost in
dark mode). `applyTheme()` flips the attribute on `<html>`, updates
`<meta name="theme-color">`, persists the choice
(`KEYS.theme`) and toasts; a tiny bootstrap `<script>` in `<head>`
applies the attribute **before the first paint**, so a light user
never sees a dark flash. The light theme is deliberately **not plain
white**: a playful pastel set — warm cream titlebar, baby-blue
activity bar, mint status bar, lilac workbench, white cards, violet
accent, 14px base radius. And the rule the student asked for: **in
BOTH themes the terminals and every code-writing area stay BLACK**
(⌨/✎/Sandbox editors, step inputs, read-only code blocks, consoles,
the `input()` prompt) — with `color-scheme: dark` on those surfaces so
their inner scrollbars and carets match, and the dark-tuned Python
syntax colors keep working. On mobile the sheets round only at the
top, as before.

**Housekeeping** — version bump to `?v=17` on every specifier/
preload/stylesheet (the stale-service-worker protocol), service worker
cache renamed `tutor-v17`, the Account panel gained a "⚙ settings"
bridge, the Guide's "Finding your way around" section documents the
new navigation, and the welcome tour is unchanged.

**Tested** — local server, headless browser: bar 46→232px with labels
and the dock root pixel-stable at 1394px; popover content and
closers; settings sections; theme switch + reload persistence
(`data-theme=light`, cream/mint/blue/lilac zones) with black
`#14151a`/`#101216` writing zones and terminals in light mode;
autogrow (80 lines → 1989px textarea, panel scrolls); mobile header
(☰ ? ☁ ⚙), mobile settings sheet, sandbox autogrow; zero console
errors.
