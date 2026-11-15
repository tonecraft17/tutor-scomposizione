# Release v19 — tutor-scomposizione (English edition)

Date: 2026-11-16 · Based on: v18 (editors / names / Supabase round) · **v19.0**

## v19 · Side-by-side tabs · no Sandbox · quiet editors · motion pass · cookie notice + SEO · reset in Settings

Nine requests from the v18 test round. The pedagogical engine, the
solutions database and the performance work are untouched.

**1 · Tabs move SIDE BY SIDE only** (`engine/dock.js`, `styles.css`)

A dragged tab can now land only **left / center / right** of another
panel — never above or below it. The drop overlay lost its top and
bottom zones (one horizontal band of three, `.dk-drop` grid
`"l c r"`), `moveDrag()` decides the zone from the **horizontal
position of the pointer alone**, and `OPEN_ZONES` — the dock target of
a panel reopened from the activity bar — is `'right'` for everything
(no more automatic `'bottom'` insertions). No accidental column splits
while dragging anymore; the layout keeps a single horizontal rhythm.
The Guide documents the new rule.

**2 · The Sandbox is gone** (`engine/dock.js`, `app.js`,
`data/exercises.js`, `styles-light.css`)

The ⌨ **Code** editor already IS a free-program editor on the same
runtime (same Pyodide, same charts and games), so the Sandbox tab was
a duplicate writing surface. Removed: the activity-bar entry, the
mobile "⋯ More" item, the panel registry entry (`renderSandbox` +
`SANDBOX_SAMPLES`), the `#sbOut` light-theme overrides and the
`BODY_PRIO` slot. The status-bar Python chip now opens the **Console**
(was `data-act="sandbox"`). The two exercise hints that used the
Sandbox as an error-watching lab (2-11 IndexError, 6-… tuple
TypeError) now point at the ⌨ **Code** tab with the same paste-and-run
recipe; the shell note says "not in the browser" instead of "not in
the Python sandbox". Layouts saved by older versions are sanitized
automatically (unknown pid → tab dropped).

**3 · Quieter editors — the non-essential writing is gone** (`app.js`)

- The `.ed-out-note` ("last run: ✓ ok · output in the Console tab · 2
  runs in the history") **and** its "⌨ open Console" button are gone
  from the Code and Lines panels: `updateCodiceOut()` and `apriConsole()`
  were removed with them. The editors are pure writing space; the run
  status lives in the Console tab.
- The `Ctrl+Enter to run · edits are saved with your progress` status
  line is gone too. The Code editor has no footer note at all (the
  "⚠ modified" badge says everything); the Lines editor keeps an
  **empty, hidden** `#rgStatus` that appears only when the ⚙ bridge has
  something to say (a value that did not flow through, a structural
  change) — signal without the constant noise.
- Empty states reduced to one line each: Charts → *"No charts yet —
  run `plt.show()` or `fig.show()`."*, Game → *"No game yet — run a
  program with `pygame.display.flip()`."* (the playable/keyboard
  details stay in the game help and in the Guide).
- The Lines panel subtitles were rewritten the same way: one short
  line per mode ("Only the exercise lines (N passed so far) — the full
  program is in ⌨ Code."), the reference buttons (`📄 file · lines`)
  survive.

**4 · The left sidebar no longer fights the Modules drawer**
(`app.js`, `styles.css`)

`toggleDrawer()` now toggles **`body.drawer-open`**; while the drawer
is open the activity bar **does not expand on hover** (`:hover` /
`:focus-within` are re-pinned to the collapsed 46 px) — the expanded
labels used to slide under the drawer mid-animation, which was the
"non-fluid overlap" of the v18 round. The expansion itself was
re-tuned: fluid ease-out curve `cubic-bezier(.22,.86,.3,1)` (the old
overshoot `1.45` wobbled), a 50 ms **hover-intent delay** so brushing
the bar no longer pops it open, and a 70 ms staggered reveal of the
labels after the bar starts moving.

**5 · Motion pass — the site is alive** (`styles.css`)

A dedicated v19 section adds hover micro-interactions everywhere,
all transform/opacity only (GPU-cheap, killed by the global
`prefers-reduced-motion` switch):
- buttons (`.btn`, `.tl-btn`, `.btn-cl`, drawer/overlay ✕) lift on
  hover and press down on click;
- dock tabs nudge up, their × springs; activity-bar icons scale up;
- cards rise with an accent border (`.stat-card`, `.auth-card`,
  `.hint-card`, `.graph-card`, `.stg-sec`, `.user-chip`);
- the module tree leans into the pointer (`translateX(3px)`) and the
  chapter chevrons rotate open;
- **hover-revealed controls**: the Charts/Game toolbars and the
  drawer footer dim to ~55% at rest and come back to full opacity on
  hover of their area — the "comparsa tramite hover" the site lacked;
- every freshly rendered panel (`.dk-panel`, `.m-panel`) settles in
  with a 200 ms fade-rise;
- inputs warm their border on hover, hint keywords spring, status
  chips and the account chip lift.

**6 · "⚙ settings" — one word** (`app.js`)

The Account panel's bridge button lost its subtitle: it reads
**"⚙ settings"** (was "⚙ settings — credentials, privacy, theme").

**7 · The reset moved into Settings** (`app.js`, `index.html`)

The titlebar "⟲ Reset" button is gone (the titlebar keeps only
? Guide and the Account); the Progress panel lost its duplicate
"⟲ Reset all progress". Settings gained a **⟲ Reset** section with the
two operations: **reset the panel layout** (instant, progress
untouched — `dock.resetLayout()`) and **reset everything — progress
included** (confirm modal → `resetAll()`, which also deletes the cloud
row). One place owns every "start over".

**8 · Cookie notice** (`index.html`, `app.js`, `styles.css`)

The site is online, so the first visit shows a minimal, honest banner
at the bottom: **"🍪 No tracking cookies: your progress and
preferences stay in your browser."** — with **got it** (remembers the
choice in `localStorage.tutorCookieOk`) and **privacy** (opens the
Settings overlay). The app sets no cookies and runs no analytics, and
the Settings → Privacy list now states it as its first item. The
banner slides up with the v19 motion curve and is `[hidden]`-gated so
it never pollutes the a11y tree.

**9 · SEO for Google indexing** (`index.html`, `robots.txt`,
`sitemap.xml`, `assets/og-image.png`)

- `<link rel="canonical">` to the GitHub Pages URL, explicit
  `robots` meta, **Open Graph** + **Twitter card** tags with a new
  1200×630 `assets/og-image.png` (generated with
  `scripts/make_og_image.py`, same dark/blue identity as the app);
- **JSON-LD structured data**: the page is now a
  `schema.org/WebApplication` (EducationalApplication, free, feature
  list, keywords);
- `robots.txt` (allow all + sitemap pointer) and `sitemap.xml`
  (the app is a single URL) at the project root — deploy them with
  the site.

**Housekeeping** — cache-busting bumped to `?v=19` on every
stylesheet, script, modulepreload and ES-module import; service-worker
cache renamed `tutor-v19`; the Guide gained the side-by-side rule, the
reset location and lost the retired note sentence.
