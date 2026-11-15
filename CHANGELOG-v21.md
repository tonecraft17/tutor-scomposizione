# Release v21 — tutor-scomposizione (English edition)

Date: 2026-11-16 · Based on: v20 (homepage / one tab bar) · **v21.0**

## v21 · Quiet chrome · ⌂ Home · the kinetic homepage

Seven requests from the v20 test round. The pedagogical engine, the
solutions database, the dock layout (one tab bar, right-edge limit)
and the theme system are untouched.

**1 · The sidebar retracts again** (`engine/dock.js`)

The CSS opens the activity bar on `:hover` OR `:focus-within` — but a
mouse CLICK also focuses the button, so `:focus-within` kept the bar
expanded forever after every click ("the menu never retracts"). On
any pointer release inside the bar the pointer-given focus is now
released (`pointerup` → `blur()` of the active button, unless it is
keyboard-focus `:focus-visible`, which keeps the bar open for Tab
users). Verified: hover → 232 px, click + mouse away → 46 px.

**2 · The popups got quiet** (`engine/dock.js`, `app.js`)

A toast no longer fires for actions that explain themselves:

- **opening a panel from the sidebar** ("added to the tab bar") and
  **closing it** ("reopen it from the activity bar") — both gone: the
  tab appears/disappears right where the user is looking;
- the **welcome tour is ONE toast** (was six, one every ~4 s):
  where the exercises are, where the help is — the rest is discovered
  by using the app and the Guide overlay explains everything;
- the **solutions-database notices** (chapter download, "database
  ready") are gone — background work the visitor cannot act on; only
  a real failure still warns;
- **"Execution started…"** is gone; only the one-time Python runtime
  download (~10 MB) is announced, because it explains a long wait;
- **theme switch** is silent (the whole UI flips in front of you);
  run-outcome toasts are shorter ("📊 The program drew a chart.",
  "🎮 Game started: arrows / space / q · ■ Stop closes it.") since
  v20 already lands the tab bar on the result panel.

What stays LOUD, as requested: progress and completed actions —
"🎉 exercise completed", "✓ Step N passed", "✓ Output verified",
"☁ Progress updated", sign in/out, exports and resets, and every
warning/error (tracebacks, unreachable cloud, fullscreen blocked).

**3 · ⌂ Home button** (`index.html`, `app.js`)

A home button sits in the titlebar next to the brand icon (and a ⌂
in the mobile header, beside ☰). It brings the presentation page
back: `enterApp()` now HIDES `#homePage` instead of removing it, so
`goHome()` can revive it with the full entrance cascade while the
workbench stays mounted underneath — **no state is lost** (open tabs,
code, progress). Going home also clears the session flag, so a
reload from there shows the presentation again. The hidden state
needed a CSS guard (`#homePage[hidden]{display:none}`) because the
section's `display:flex` would otherwise beat the UA rule.

**4 · The homepage is kinetic now** (`index.html`, `app.js`, both CSS)

The presentation page — it is ONLY presentation — moves:

- **"apart" is literally taken apart**: the hero word is split into
  five letter tiles (by `armHomeFx()`, on top of plain-text markup)
  that sit slightly scattered (−8°, +5°, −4°, +7°, −6° and small
  vertical offsets), float forever on individual phases — the word
  never settles — and **spread further apart on hover**: pulling the
  title apart IS the method. Screen readers get one clean "apart"
  (`.sr-only` + `aria-hidden` tiles), crawlers get the full sentence;
- **drifting gradient blobs + floating code tokens** (for · import ·
  while · def · print() · in) fill the background at two parallax
  depths driven by the pointer (rAF-throttled, fine pointers only);
- **the four cards carry animated illustrations** instead of
  paragraphs: the code line that splits into micro-steps with
  lighting step dots (THE method, first card), a terminal that
  retypes `print("hello")` (black in every theme, like the app's),
  chart bars that grow with a hopping sprite, a progress ring that
  fills and checks. One-line, impactful copy — no walls of text;
- **one CTA**: ▶ Start learning (+ the contextual ↩ Resume) — the
  "☰ Browse the 199 exercises" button is gone; the primary button
  breathes with a soft glow and a light sweep crosses it on hover;
  the brand mark tips over on hover; the cards reveal with a
  stagger (IntersectionObserver) and their animations get more eager
  on hover.

Everything is gated behind `#homePage.hp-live` (added when the page
is on screen, re-added by `goHome()`): the static markup paints
first, no-JS visitors see the full content, `prefers-reduced-motion`
calms the page completely, and the cascade can replay at every
visit of the ⌂ button.

**5 · The requested copy changes** (`index.html`)

- removed: "— charts, games and zero installation." (hero) and the
  facts line "free · no installation · progress saved in your
  browser · optional free account to sync devices";
- replaced: "20 chapters · 199 exercises · works offline after the
  first load" → a plain site footer,
  "© 2024–2026 Tutor · Progressive Breakdown · All rights reserved.";
- the hero subtitle is one sentence; the cards carry ~8 words each;
  the decomposition of the exercises is the visual protagonist.

**6 · Footer clears the cookie notice** (`styles.css`)

`#homePage` gains 118 px of bottom padding: on a first visit the
fixed cookie banner can no longer cover the copyright line (the VLM
visual pass caught it; geometry re-verified: footer bottom 547 px vs
banner top 789 px at 1440×900).

**Housekeeping** — every specifier and tag bumped to `?v=21`
(character-for-character identical between `index.html` and the
imports, per the stale-service-worker rule), `sw.js` cache name is
`tutor-v21`, light-theme overrides for every new element live at the
end of `styles-light.css` (cream surfaces, white cards, deeper
letter gradient, slightly stronger token opacity for contrast).

**Verified in this round** — homepage: 5 scattered letter tiles with
individual rotations, 4 cards revealed with stagger, blobs/tokens
present, footer = copyright, no facts line, light theme correct ·
enter → 1 tab, 0 toasts on panel open/close, sidebar 232 px on hover
→ 46 px after click + mouse-away (blur verified on
`document.activeElement`) · ⌂ Home → presentation back with
animations replayed, session flag cleared; Start learning → app
state intact (3 tabs survived the round-trip) · fresh visit →
exactly ONE welcome toast · mobile: 1-column grid, 3 tokens, full
-width CTA, ⌂ in the header works · settings open/scroll/close:
header never hides (v20 regression pass) · no console errors, no
page errors, pixel-density sanity on dark/light/mobile screenshots.
