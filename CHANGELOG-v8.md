# Package v8 — tutor-scomposizione-esm-soluzioni

Date: 2026-11-12 · Based on: v7 (2026-11-11)

## Summary

- **The Game panel was invisible and the mouse did not work**: after the
  «▶ esegui» of **14-8 (Sparatutto laterale, versione finale)** the
  complete solution — the game — really started, but it ended up in a
  **strip of ~100 px** at the bottom of the dock (a gray band was
  visible, not the game) and in any case **no click ever landed**, because
  the mouse coordinates were badly remapped. The **Play** button was
  never clickable: no game could ever start.
- Now the dock group **widens by itself** (like the charts in v7), the
  canvas **adapts to the space** while keeping its aspect ratio, and the
  mouse coordinates map back to the **game's native screen**
  (1200×800): Play is clickable, you play with arrows/space, and you
  exit with q.
- The console recognizes games closed cleanly («🎮 gioco eseguito» with
  the instructions), the Game panel reopens on every new game even after
  closing it with the «×», and game tracebacks show file and line again
  (`main.py, riga N`).

Everything verified end-to-end in the browser (real interface + Pyodide
runtime from the CDN): 14-8 completed → ▶ esegui → fragment: NameError
explained + traceback with line → the complete solution starts on its own →
Game panel open and **visible** with the green Play button → click on the
canvas: **the game starts** (the button disappears, the aliens appear, the
score scrolls) → arrows and space respond → `q` exits cleanly → console:
«🎮 gioco eseguito», zero JS errors.

## The context: what happened with 14-8

Exercise 14-8 is a fragment of a larger program (the lines
`self.play_button = Button(self, "Play")` and `self.stats.score += 10`):
on their own they cannot run — this is by design, and the console explains
it («il frammento da solo non può girare: sotto trovi la soluzione completa
in azione»). The tutor then automatically runs the official solution
`sideways_shooter.py` (multi-file project with `button.py`, `settings.py`,
`ship.py`, `bullet.py`, `alien.py`, `game_stats.py` and the images)
**from the local database**.

The game really did start (frames at ~25 fps, Play button drawn in the
center) but two defects lay buried in it, making it unusable:

1. **Invisible**: the Game panel opened in a slice of the dock ~100 px
   tall, with the canvas clipped (`max-width` without `max-height`).
   The student saw a gray strip; after 25 s without input the watchdog
   closed the game and the console was left with only an incomprehensible
   «output della soluzione» with the pygame banner.
2. **Not playable**: to save bandwidth the worker downsizes frames from
   1200×800 to 800×533 px before sending them, but the main thread
   remapped the mouse coordinates onto the downsized frame: every click
   landed at ⅔ of the real position. The Play button (at the native
   center 600, 400) was never reachable: even seeing the game, it could
   not be played. This applies to all games wider than 800 px (the
   book's Alien Invasion and Sparatutto laterale).

## The fixes (4 files)

| File | Change |
|---|---|
| `engine/python-worker.js` | `_tutor_flip` also sends the **native dimensions** (`gw`, `gh`) alongside those of the downsized frame; `emitPygameFrame` propagates them. `amico()`: the `File "<exec>"` frames (the games' path via `eval_code_async`) are remapped to `main.py` so the traceback keeps file and line (previously empty), and the displayed line is the **innermost** frame's (where the error occurred) |
| `app.js` | `onPygameFrame`: the Game panel (re)opens on every **new game** (`primoFrameRun`), calls `dock.ensurePanelSpace('gioco', 420)` to widen the group, and records the native dimensions (`GAME.meta`, `dataset.gw/gh`) that `gameCanvasPos()` uses for the mouse. `renderGioco`: the canvas lives in a flexible `.game-stage`. `eseguiEsercizio`/`eseguiSoluzione`: `run.game = true` also for games closed cleanly (frames received = game played) → the console says «🎮 gioco eseguito» with the help; adapted toast («era il gioco: rivedilo nel pannello Gioco — per rigiocare premi di nuovo ▶ esegui»); on mobile it opens the Game tab directly |
| `styles.css` | `.game-stage` (flex, `min-height:0`, centers the canvas) and `.game-canvas` with `max-width:100%; max-height:100%; width/height:auto; object-fit:contain`: the canvas resizes keeping its aspect ratio instead of being clipped |
| `package.json` | version 8.0.0 |

New test file: `test_input_pygame.html` — like `test_runtime_plotly.html`
but for game input: a Pygame loop prints every event received and the
page sends it KEYDOWN/MOUSEMOTION/MOUSEBUTTONDOWN via `sendPygameEvent`
(the same messages as the Game panel). It verifies in ~3 s that the chain
worker → queue → `pygame.event.get()` → `pygame.mouse.get_pos()` works.

Note: the line indicated in the game tracebacks may shift by a few units
compared to the original (the `_tutor_asyncify` loop transformation
regenerates the source without comments/blank lines); for errors on the
first fragment (the common case, e.g. the 14-8 NameError) the number is
exact.

## How to verify

```bash
# audit and tests (Node ≥ 18) — unchanged and green
npm run audit            # 199 exercises · 485 steps · 0 inconsistent
npm run test:v5          # 31/31

# game input (worker → pygame chain) — new
# open test_input_pygame.html via http: it must print the EVs and «SUPERATO»

# interface (browser, needs http):
python3 -m http.server 8000
# open http://localhost:8000 → exercise 14-8 → complete the step → ▶ Esegui
# → the fragment gives a NameError (explained: it is a piece of a larger program)
#   with «↳ main.py, riga 1» in the traceback;
# → the complete solution starts on its own: Game panel open and VISIBLE,
#   green Play button in the center;
# → click the canvas: the game starts (green aliens from the right, score
#   at the top right); up/down arrows move the rocket, space shoots;
# → q to exit: console → «🎮 gioco eseguito», no errors.
```

## Deployment notes

- As with v5/v6/v7: `package.json`, the audit/test scripts, the test
  pages and the changelogs are not needed by the browser app (they remain
  for developers).
- Those who had already opened the app with v7 see the new dock layout
  only when the Game panel widens by itself (or by dragging the gutter);
  the saved layout is not touched in other cases.
- Full history: `CHANGELOG-v5.md` (36 steps verified),
  `CHANGELOG-v6.md` (native numpy+pandas for plotly), `CHANGELOG-v7.md`
  (Charts panel repaired + individual chart closing).
