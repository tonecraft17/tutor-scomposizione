# Release v18 — tutor-scomposizione (English edition)

Date: 2026-11-15 · Based on: v17 (sidebar/account/theme round) · **v18.0**

## v18 · Editors only (one console) · bigger Exercise code area · one name per sidebar button · slim header · online wording · Supabase wired for the deployed site

Six requests from the v17 test round. The pedagogical engine, the data
and the performance work are untouched.

**1 · The Code tab is an EDITOR ONLY — one console for the whole app**
(`app.js`, `styles.css`, `styles-light.css`)

The output terminal that lived below the textarea of the ⌨ **Code** and
✎ **Lines** panels is gone: those tabs are now pure writing space, and
the output of ▶ Run lands in the **Console** tab (the app's single
console — prompt, history, traceback, "clear"). In place of the terminal
sits a compact dashed note (`.ed-out-note`) that always tells where the
output went — "last run: ✓ ok · output in the **Console** tab · 3 runs
in the history" — refreshed by `updateCodiceOut()` after every run,
verify, solution run and history clear, plus a **⌨ open Console**
button (`apriConsole()`: activates the tab on desktop, switches the
mobile view). The "🧹 clear" button moved out of the editors with its
terminal: the run history is managed from the Console, which already had
its own clear command. The Guide and the toasts were updated to point at
the Console tab; `styles-light.css` drops the (now dead) `.codice-out`
overrides — the note is a normal light surface, the writing areas stay
black in both themes.

**2 · Bigger code area in the Exercise tab** (`app.js`, `styles.css`)

The step textarea of the Exercise panel starts at **4 rows minimum**
(was 2, sized on the expected lines only) and now uses the same type
scale as the ⌨ editor (**14px mono, 1.7 line height, 132px minimum**),
growing with what the student types via `armAutogrow()` — same treatment
as the v17 editors. The written-answer (reflection) textarea follows
(96px minimum, grows with the answer). More room to think, no more
cramped two-line box.

**3 · One name per sidebar button, matching the tab it opens**
(`engine/dock.js`, `app.js`)

Every activity-bar button has ONE unique name, no parentheses, no
double labels — and the name is EXACTLY the title of the tab/overlay
that opens: **Modules · Exercise · Code · Lines · Console · Charts ·
Game · Progress · Guide · Sandbox · Settings**. What you read on the
expanded sidebar is what lands in the tab bar. The drawer title ("Modules
· Python Crash Course" → "Modules"), the Guide overlay title ("Guide ·
how the Tutor works" → "Guide") and the Settings overlay title were
aligned to the same single names; the mobile header buttons (☰, ?, ☁, ⚙)
got the matching tooltips. Longer explanations survive only in the
`aria-label`, for screen readers.

**4 · Slim header** (`index.html`, `config.js`)

The titlebar sub-brand keeps only **"Python Crash Course"**: the
"Exercises Ch. 1–20 + Appendices D–E" enumeration is gone (the Modules
drawer already lists every chapter). `APP.subtitle` and the meta
description follow — the description now mentions the optional account
instead of "all local, no account needed".

**5 · "local only" → online wording** (`app.js`)

The site is deployed, so the sync labels now say what the user can do
instead of apologizing for a prototype: the status-bar chip reads
**"☁ sign in to sync"** (configured, signed out — was "☁ local mode"),
**"☁ cloud off"** (not configured — was "☁ local only"), and the account
popover/panel say "not signed in — sign in to sync your progress across
devices" / "Cloud accounts not configured". The top-right account button
tooltip says "Not signed in · …" instead of "Local mode · …".

**6 · Supabase wired for the online site** (`config.js`,
`engine/storage.js`, `app.js`, `README.md`)

The cloud pair is now treated as real deployment configuration:
- `config.js → SUPABASE` documents the exact three-step setup (project →
  `supabase/schema.sql` → paste URL + anon key) and adds `healthPath`;
- **health check on load**: when configured, `storage.init()` pings
  `GET {url}/auth/v1/health` with the anon key — a wrong URL or key sets
  the sync state to `error` (chip "sync ✗") and fires a
  `tutor:supabase-unreachable` event, which app.js turns into a toast
  naming the two fields to fix. Before, a typo failed silently as a fake
  "local mode";
- Settings → Access credentials, when not configured, shows a compact
  3-step setup list (`.stg-steps`) with the Site-URL reminder for the
  Supabase Auth emails;
- README § "Optional configuration: Supabase" gains the deploy-side
  checklist (Site URL in Authentication → URL Configuration, anon key
  only, health check).

**Housekeeping** — cache-busting bumped to `?v=18` on every stylesheet,
script, modulepreload and ES-module import (index.html, app.js,
`engine/*.js`), service-worker cache renamed `tutor-v18`, welcome tour
and Guide updated for the new editor behavior.
