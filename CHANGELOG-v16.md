# Release v16.0 — tutor-scomposizione (English edition)

Date: 2026-11-14 · Based on: v15.0 (performance) · **v16.0.0**

## v16.0 · UX: slide-out Modules, Guide overlay, icon toggles, mobile tab management and on-screen game pad

A UI review of the published v15 produced six requests. This release
implements all of them; the pedagogical engine, the data (199
exercises, 485 steps), the solutions database, the Python runtime and
the v15 performance work (parallel module preloads, progressive dock
rendering, zero-CLS toasts, service worker) are untouched.

**1 · The activity-bar icons are toggles** (`engine/dock.js`)

Clicking the icon of a panel that is already the visible tab of its
group now **closes** it (second click = first click's undo); a
background tab is activated; a closed panel opens as before. The × on
each tab keeps its own close + toast; the icon toggle closes silently.
Programmatic opens (`activateOrInsert` from the status bar, from a
chart or a game frame) are unaffected — they always open, never toggle.

**2 · The Guide is an overlay** (`app.js`, `styles.css`)

The Guide is reference material you read occasionally, not a panel to
keep docked: it now opens as a **floating overlay** (centered card on
desktop, bottom sheet on mobile) from the activity-bar icon, the
"? Guide" titlebar button or the ? button of the mobile header. Esc,
backdrop click and ✕ close it; focus returns to the invoker; Tab is
trapped inside (same a11y pattern as the confirm dialogs).

**3 · Charts and Game join the navigation bar** (`engine/dock.js`)

The Charts (Matplotlib/Plotly) and Game (Pygame) panels had **no icon
in the activity bar**: once their tab was closed there was no way back
except running a new program — and on mobile they were missing from
the bottom bar entirely (a chart switched the tab and the student had
no button to return). Both are now first-class citizens of the left
navigation bar (and of the mobile bottom bar, see §5).

**4 · Modules is a side-sliding menu** (`app.js`, `styles.css`)

The 199-exercise tree no longer occupies a permanent slice of the work
area: it lives in a **drawer that slides in from the left** (activity
bar icon on desktop, ☰ in the header on mobile), with its own filter
box — which finally gives the phone a working exercise search, since
the titlebar search is hidden below 1100 px. Picking an exercise
closes the drawer; Esc, backdrop and ✕ close it too. The default
layout loses its left column and starts full-width; layouts saved by
older versions are **sanitized on load** (unknown pids are stripped),
so upgrading users keep every other panel where they had it.

**5 · Mobile: tab management, no pop-up feel, game buttons** (`engine/dock.js`, `app.js`, `styles.css`)

- **Bottom bar**: five primary tabs (Exercise, Walkthrough, Console,
  Charts, Game) + a **"⋯ More" drop-up menu** (Code, Lines, Progress,
  Sandbox, Account) — replacing the flat list of eight buttons that
  overflowed on small phones and lacked the media panels. Below 390 px
  the labels collapse to icons.
- **Dialogs**: the centered confirm pop-ups become **bottom sheets**
  (native mobile pattern), with a stronger scrim and safe-area padding.
- **Onboarding**: the six-toast cascade over 23 s is reduced to **two
  compact toasts** on a phone (desktop keeps the full tour, updated
  for the new UI).
- **Game pad**: a phone has no keyboard, so the games were watchable
  but not playable. While a game runs, an **on-screen pad** appears
  under the canvas — D-pad (◀ ▲ ▼ ▶), ␣ fire and q — and sends the
  same KEYDOWN/KEYUP pygame events the canvas keyboard handler sends
  (pointer events, so touch/pen/mouse share one code path; the finger
  sliding off a button releases the key). The pad hides itself when
  the game ends, and the canvas sits directly above it with no dead
  space. The game-start toast is mobile-specific.

**6 · The Code panel says it in one line** (`app.js`)

The three-line explanation under the Code title ("This is the program
that ▶ Run actually runs. Feel free to modify it: from that moment…
Terminal: Ctrl+Enter…") repeated on every exercise. Each mode now has
**one short sentence** plus a "? how it works" link that opens the
Guide overlay, where the full explanation moved (new "⌨ The Code
editor, in full" section: fragments of larger programs, multi-file
exercises, support modules, terminal behavior, restore original).
A "🧭 Finding your way around" section documents the new drawer,
overlay, toggles and More menu.

**Version marker**: `?v=16.0` on `app.js`/`styles.css`; `sw.js` cache
`tutor-v16`; `package.json` → `16.0.0`.

**What did NOT change**: the tutor engine, the exercise data, the
solutions database and its lazy chapter bundles, storage/Supabase
sync, the Python runtime, the v15 load path (modulepreload graph,
progressive panel rendering, reserved-height toasts, service worker).
Verified end-to-end on 1440×900 and 390×844: toggle close/reopen,
drawer open/filter/select/close, guide overlay open/Esc-close from
titlebar, activity bar, code-panel link and mobile header, More menu
navigation, bottom-sheet dialogs, and a real Pygame run on mobile with
the on-screen pad (visible while running, hidden after ■ Stop).
