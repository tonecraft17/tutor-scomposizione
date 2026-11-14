/* ============================================================
   ENGINE/PYTHON-WORKER · the Python runtime inside a Web Worker
   ------------------------------------------------------------
   Phase 1 (Matplotlib, Plotly, input) + Phase 2 (Pygame)
   + Phase 3 (multi-file solutions: nested paths, binary files,
   pytest mode, HTTP requests via pyodide-http).

   ===== NEW (traceback fix + playable pygame) =====
   · safe auto-import: if the code uses Path/json/pygame/…
     without having imported them, the import is prepended automatically
     (eliminates NameErrors like «name 'Path' is not defined» in
     programs assembled from exercise steps);
   · INTERACTIVE Pygame: games keep running until the
     student closes them (■ stop / q key), with keyboard and
     mouse input relayed in real time by the Game panel. The
     synchronous «while True:» loops are made cooperative with an
     AST transformation (injects «await _tutor_yield()» and makes
     the functions containing the loop async): only this way can
     the worker receive input messages during execution;
   · idle watchdog: a stalled game (no frames and no input
     for 25 s) gets closed; the absolute limit goes from 8 s
     to 10 min for games.

   Protocol:
     ← {type:'run', id, code, virtualFiles, stdin, timeoutS, mode?, entry?}
        · virtualFiles: {path: UTF8-string | {b64}} (binary)
        · mode: 'main' (default) | 'pytest'
        · entry: file name to run in pytest mode
     ← {type:'pg-event', e}            game input (keyboard/mouse)
     ← {type:'pg-quit'}                request to close the game
     → {type:'status', status, detail, version}
     → {type:'execstart', id, timeoutS}  (effective run timeout)
     → {type:'result', id, ok, output, durataMs, error?}
     → {type:'matplotlib-image', b64}
     → {type:'plotly-figure', json}
     → {type:'pygame-frame', buf|b64, w, h, gw, gh}   (w/h = downscaled frame, gw/gh = native screen)
   ============================================================ */
import { PYODIDE } from '../config.js';

const STDOUT_LIMIT = 200000;
// Absolute limit for interactive Pygame games (seconds).
const GAME_HARD_LIMIT_S = 600;
// A stalled game (no frames AND no input) for more than N seconds gets closed.
const GAME_IDLE_S = 25;

let pyodide = null, loadPromise = null, pyVersion = '';
let outBuf = '', errBuf = '';
let loadedPackages = new Set();

/* ---------- game input: queue filled by the main thread ---------- */
const pgQueue = [];
let pgQuit = false;

function post(msg, transfer){ if(transfer) self.postMessage(msg, transfer); else self.postMessage(msg); }
function postStatus(status, detail){ post({ type:'status', status, detail, version: pyVersion }); }

/* ---------- emitting charts/frames to the main thread ---------- */
function emitMatplotlib(b64){
  try { post({ type:'matplotlib-image', b64 }); } catch(e){}
}
function emitPlotly(jsonStr){
  try { post({ type:'plotly-figure', json: jsonStr }); } catch(e){}
}
function emitPygameFrame(data, w, h, gw, gh){
  /* FIX v8 · gw/gh = NATIVE game screen dimensions (before the
     downscale to 800 px width): the main thread needs them to map
     mouse coordinates back into the game coordinate space. Without
     them, every click in games wider than 800 px (Alien Invasion and
     the side-scrolling shooter: 1200×800) landed at the wrong spot:
     the Play button was unclickable. */
  const nativi = { gw: gw || w, gh: gh || h };
  // data arrives as a PyProxy of bytes: toJs() → Uint8Array → zero-copy transfer
  try{
    if(data && typeof data.toJs === 'function'){
      const u8 = data.toJs();
      try{ data.destroy(); }catch(e){}
      post({ type:'pygame-frame', buf: u8.buffer, w, h, ...nativi }, [u8.buffer]);
      return;
    }
  }catch(e){}
  // fallback (should never be needed): base64 already encoded by the caller
  try { post({ type:'pygame-frame', b64: String(data), w, h, ...nativi }); } catch(e){}
}

/* ---------- JS↔Python bridge for game input ---------- */
try{
  self._tutor_pg_take_json = () => JSON.stringify(pgQueue.splice(0, pgQueue.length));
  self._tutor_pg_quit_requested = () => pgQuit;
  self._tutor_emit_matplotlib = emitMatplotlib;
  self._tutor_emit_plotly = emitPlotly;
  self._tutor_emit_pygame = emitPygameFrame;
}catch(e){ /* context without self */ }

/* ---------- import detection in user code ---------- */
function detectImports(code){
  return {
    matplotlib: /\bimport\s+matplotlib\b/.test(code) || /\bfrom\s+matplotlib\b/.test(code),
    plotly:     /\bimport\s+plotly\b/.test(code) || /\bfrom\s+plotly\b/.test(code),
    pygame:     /\bimport\s+pygame\b/.test(code) || /\bfrom\s+pygame\b/.test(code),
    requests:   /\bimport\s+requests\b/.test(code) || /\bfrom\s+requests\b/.test(code),
    input:      /\binput\s*\(/.test(code),
  };
}

/* ---------- safe AUTO-IMPORT ----------
   If the student's code (assembled from steps) uses a name
   without having imported it, the missing import is prepended.
   It kicks in ONLY when the name is used and the import appears
   nowhere: when the exercise truly includes the «import» step,
   the correct code already contains it and nothing gets injected. */
const AUTO_IMPORTS = [
  { use: /\bPath\s*[.(]/,          imp: 'from pathlib import Path',  have: /from\s+pathlib\s+import[^\n]*\bPath\b|\bimport\s+pathlib\b/ },
  { use: /\bjson\s*[.]/,           imp: 'import json',               have: /\bimport\s+json\b|\bfrom\s+json\b/ },
  { use: /\bpygame\s*[.]/,         imp: 'import pygame',             have: /\bimport\s+pygame\b|\bfrom\s+pygame\b/ },
  { use: /\brequests\s*[.]/,       imp: 'import requests',           have: /\bimport\s+requests\b|\bfrom\s+requests\b/ },
  { use: /\brandom\s*[.]/,         imp: 'import random',             have: /\bimport\s+random\b|\bfrom\s+random\b/ },
  { use: /\bmath\s*[.]/,           imp: 'import math',               have: /\bimport\s+math\b|\bfrom\s+math\b/ },
  { use: /\bdatetime\s*[.]/,       imp: 'import datetime',           have: /\bimport\s+datetime\b|\bfrom\s+datetime\b/ },
  { use: /\bcsv\s*[.]/,            imp: 'import csv',                have: /\bimport\s+csv\b|\bfrom\s+csv\b/ },
  { use: /\bstatistics\s*[.]/,     imp: 'import statistics',         have: /\bimport\s+statistics\b|\bfrom\s+statistics\b/ },
  { use: /\bsys\s*[.]/,            imp: 'import sys',                have: /\bimport\s+sys\b|\bfrom\s+sys\b/ },
  { use: /\bre\s*[.]/,             imp: 'import re',                 have: /\bimport\s+re\b|\bfrom\s+re\b/ },
  { use: /\bchoice\s*\(/,          imp: 'from random import choice', have: /from\s+random\s+import[^\n]*\bchoice\b|\bimport\s+random\b/ },
  { use: /\brandint\s*\(/,         imp: 'from random import randint', have: /from\s+random\s+import[^\n]*\brandint\b|\bimport\s+random\b/ },
  { use: /\buniform\s*\(/,         imp: 'from random import uniform', have: /from\s+random\s+import[^\n]*\buniform\b|\bimport\s+random\b/ },
  { use: /\bsqrt\s*\(/,            imp: 'from math import sqrt',     have: /from\s+math\s+import[^\n]*\bsqrt\b|\bimport\s+math\b/ },
  // ===== NEW · plotly and matplotlib: snippets that use px./plt. without
  // the import (exercises «modify the chapter's program») no longer crash
  // with a NameError before the student writes the import line =====
  { use: /\bpx\s*\./,              imp: 'import plotly.express as px', have: /import\s+plotly\.express\s+as\s+px|\bfrom\s+plotly\b|\bimport\s+plotly\b/ },
  { use: /\bplt\s*\./,             imp: 'import matplotlib.pyplot as plt', have: /import\s+matplotlib\.pyplot\s+as\s+plt|\bfrom\s+matplotlib\b|\bimport\s+matplotlib\b/ },
];
function autoImportPass(code){
  const missing = [];
  for(const a of AUTO_IMPORTS){
    if(a.use.test(code) && !a.have.test(code)) missing.push(a.imp);
  }
  if(!missing.length) return code;
  return missing.join('\n') + '\n' + code;
}

/* ---------- runtime + package loading ---------- */
async function ensurePyodide(){
  if(pyodide) return pyodide;
  if(!loadPromise){
    loadPromise = (async ()=>{
      postStatus('loading', 'Downloading Python runtime (~10 MB)…');
      const { loadPyodide } = await import(PYODIDE.indexURL + 'pyodide.mjs');
      const py = await loadPyodide();
      py.setStdout({ batched: s => { if(outBuf.length < STDOUT_LIMIT) outBuf += s + '\n'; } });
      py.setStderr({ batched: s => { if(errBuf.length < STDOUT_LIMIT) errBuf += s + '\n'; } });
      pyodide = py;
      try{ pyVersion = String(await py.runPythonAsync('import sys; sys.version.split()[0]')); }catch(e){ pyVersion=''; }

      // Expose the emit functions both in the Python __main__ namespace
      // and on the worker's globalThis: from Python they are visible both
      // as globals and via «import js; js._tutor_emit_…».
      py.globals.set('_tutor_emit_matplotlib', emitMatplotlib);
      py.globals.set('_tutor_emit_plotly', emitPlotly);
      py.globals.set('_tutor_emit_pygame', emitPygameFrame);

      postStatus('ready', 'Ready');
      return py;
    })();
    loadPromise.catch(e => { loadPromise = null; postStatus('error', 'Runtime loading error: ' + e.message); });
  }
  return loadPromise;
}

async function loadPackage(kind){
  if(loadedPackages.has(kind)) return;
  const py = await ensurePyodide();
  const spec = PYODIDE.packages[kind];
  if(!spec) return;
  postStatus('loading', `Downloading package ${kind}…`);
  const names = Array.isArray(spec.name) ? spec.name : [spec.name];
  if(spec.native){
    // Pyodide native package (matplotlib, pygame-ce, pytest): uses loadPackage
    try{
      await Promise.all(names.map(n=>py.loadPackage(n)));
      loadedPackages.add(kind);
    }catch(e){
      // some packages may only be available via micropip on certain versions
      await py.loadPackage('micropip');
      const micropip = py.pyimport('micropip');
      await Promise.all(names.map(n=>micropip.install(n)));
      loadedPackages.add(kind);
    }
  } else {
    // Package via micropip (plotly, requests+pyodide-http, dependencies…)
    // ===== FIX v6 · native dependencies: the plotly wheel on PyPI declares
    // only narwhals+packaging, but plotly.express on first import requires
    // numpy («Plotly Express requires numpy…») and with list input (no
    // dataframe) it also requires pandas («Pandas installation is
    // required…») → the «▶ run» of 16-9 failed. micropip cannot install
    // binary wheels from PyPI: numpy and pandas must be loaded as NATIVE
    // packages of the Pyodide distribution, BEFORE installing plotly via
    // micropip. =====
    const nativi = Array.isArray(spec.nativeDeps) ? spec.nativeDeps : [];
    if(nativi.length) await Promise.all(nativi.map(n=>py.loadPackage(n)));
    await py.loadPackage('micropip');
    const micropip = py.pyimport('micropip');
    await Promise.all(names.map(n=>micropip.install(n)));
    loadedPackages.add(kind);
  }
  postStatus('ready', 'Ready');
}

/* ---------- Python prelude: input/matplotlib/plotly/pygame patches ---------- */
function buildPrelude(moduliVirtuali, stdinQueue, timeoutS, needInput, needMatplotlib, needPlotly, needPygame, needRequests){
  const moduli = JSON.stringify(moduliVirtuali);
  const coda   = JSON.stringify(stdinQueue || []);
  const lines = [
    'import sys as _sys, builtins as _b, time as _time, io as _io, base64 as _b64',
    "_sys.path.insert(0, '/home/pyodide')",
    `for _m in ${moduli}:`,
    '    _sys.modules.pop(_m, None)',
    `_STDIN_QUEUE = ${coda}`,
  ];

  if(needInput){
    lines.push(
      'if not hasattr(_b, "_tutor_orig_input"):',
      '    _tutor_orig_input = _b.input',
      'def _tutor_input(prompt=""):',
      '    import js',
      '    try:',
      '        v = js.prompt(str(prompt)) if prompt else js.prompt("Input required:")',
      '    except Exception:',
      '        v = None',
      '    if v is None:',
      '        v = ""',
      '    print(v)',
      '    return str(v)',
      '_b.input = _tutor_input'
    );
  } else {
    lines.push(
      'if not hasattr(_b, "_tutor_orig_input"):',
      '    _tutor_orig_input = _b.input',
      'def _tutor_input(prompt=""):',
      '    print(prompt, end="")',
      '    if _STDIN_QUEUE:',
      '        _v = _STDIN_QUEUE.pop(0)',
      '        print(_v)',
      '        return _v',
      '    print("(simulated input exhausted: no value in the queue)")',
      '    return ""',
      '_b.input = _tutor_input'
    );
  }

  if(needMatplotlib){
    lines.push(
      'try:',
      '    import matplotlib as _mpl; _mpl.use("AGG")',
      '    import matplotlib.pyplot as _plt',
      '    def _tutor_show(*a, **kw):',
      '        import js',
      '        try:',
      '            for _n in _plt.get_fignums():',
      '                _f = _plt.figure(_n)',
      '                _buf = _io.BytesIO()',
      '                _f.savefig(_buf, format="png", bbox_inches="tight", dpi=80)',
      '                _buf.seek(0)',
      '                js._tutor_emit_matplotlib(_b64.b64encode(_buf.read()).decode())',
      '            _plt.close("all")',
      '        except Exception as _e:',
      '            print(f"[chart error: {_e}]", file=_sys.stderr)',
      '    _plt.show = _tutor_show',
      'except ImportError:',
      '    pass'
    );
  }

  if(needPlotly){
    lines.push(
      'try:',
      '    import plotly.graph_objects as _pgo',
      '    import js',
      '    def _tutor_fig_show(self, *a, **kw):',
      '        try:',
      '            js._tutor_emit_plotly(self.to_json())',
      '        except Exception as _e:',
      '            print(f"[plotly error: {_e}]", file=_sys.stderr)',
      '    _pgo.Figure.show = _tutor_fig_show',
      'except ImportError:',
      '    pass'
    );
  }

  if(needPygame){
    // ===== INTERACTIVE PYGAME (software rendering + real input) =====
    // There is no DOM in a Web Worker: the SDL/emscripten video driver hangs.
    // Therefore:
    //   · dummy SDL drivers → pygame.init() is fast and lock-free;
    //   · set_mode returns a pure software Surface;
    //   · flip/update emit the frame to the Game panel (max ~30 fps,
    //     downscaled to 800 px if the screen is wider);
    //   · event.get/poll/wait fetch the REAL events (keyboard/mouse)
    //     relayed by the Game panel via postMessage;
    //   · the game stays alive until the student closes it (■ stop
    //     in the panel, q key, or 25 s of complete inactivity);
    //   · convert()/convert_alpha() stay the real ones (the dummy
    //     display exists), mouse.set_visible is a no-op.
    // To receive input during execution, the code's «while True:» loops
    // are made cooperative by _tutor_asyncify() (see execution).
    lines.push(
      'try:',
      '    import os as _os',
      '    _os.environ["SDL_VIDEODRIVER"] = "dummy"',
      '    _os.environ["SDL_AUDIODRIVER"] = "dummy"',
      'except Exception:',
      '    pass',
      // watchdog constants: ALWAYS defined (column 0!), even if the pygame import fails
      '_T0 = _time.monotonic()',
      `_IDLE = float(${GAME_IDLE_S})`,
      `_HARD = float(${GAME_HARD_LIMIT_S})`,
      '_ACTIVE = [_time.monotonic()]',
      '_LINES = [0]',
      'import js',
      'try:',
      '    import pygame as _pg',
      '    import time as _ttime, json as _json, asyncio as _asyncio',
      '    _MOUSE = [0, 0]',
      '    _DT = [1.0/60]',
      '    _NEXT = [_ttime.monotonic()]',
      '    _SCREEN = [None]',
      '    _QUIT_SENT = [False]',
      '    def _tutor_set_mode(size=(0, 0), flags=0, depth=0, display=0, vsync=0):',
      '        _s = _pg.Surface(size, 0, 32)',
      '        _SCREEN[0] = _s',
      '        return _s',
      '    def _tutor_get_surface():',
      '        return _SCREEN[0]',
      '    def _tutor_noop(*a, **kw):',
      '        pass',
      '    _pg.display.set_mode = _tutor_set_mode',
      '    _pg.display.get_surface = _tutor_get_surface',
      '    _pg.display.set_caption = _tutor_noop',
      '    _pg.display.set_icon = _tutor_noop',
      '    _pg.mouse.set_visible = _tutor_noop',
      '    _pg.mouse.get_pos = lambda *a, **kw: tuple(_MOUSE)',
      // Replacement Clock: the real pacing is done by _tutor_yield (which can wait),
      // tick() returns the elapsed milliseconds like the original.
      '    class _TutorClock:',
      '        def __init__(self):',
      '            self._last = _ttime.monotonic()',
      '        def tick(self, framerate=60):',
      '            if framerate:',
      '                _DT[0] = 1.0/float(framerate)',
      '            _now = _ttime.monotonic()',
      '            _dt = (_now - self._last) * 1000.0',
      '            self._last = _now',
      '            return _dt',
      '        def tick_busy_loop(self, framerate=60):',
      '            return self.tick(framerate)',
      '    _pg.time.Clock = _TutorClock',
      // building events from the JS bridge
      '    def _mk_ev(d):',
      '        _t = d.get("t")',
      '        if _t == "KEYDOWN":',
      '            return _pg.event.Event(_pg.KEYDOWN, key=getattr(_pg, d.get("key", "K_UNKNOWN"), 0), unicode=str(d.get("ch", "")))',
      '        if _t == "KEYUP":',
      '            return _pg.event.Event(_pg.KEYUP, key=getattr(_pg, d.get("key", "K_UNKNOWN"), 0))',
      '        if _t == "MOUSEMOTION":',
      '            return _pg.event.Event(_pg.MOUSEMOTION, pos=(d.get("x", 0), d.get("y", 0)), rel=(0, 0))',
      '        if _t == "MOUSEBUTTONDOWN":',
      '            return _pg.event.Event(_pg.MOUSEBUTTONDOWN, pos=(d.get("x", 0), d.get("y", 0)), button=d.get("button", 1))',
      '        if _t == "MOUSEBUTTONUP":',
      '            return _pg.event.Event(_pg.MOUSEBUTTONUP, pos=(d.get("x", 0), d.get("y", 0)), button=d.get("button", 1))',
      '        return _pg.event.Event(_pg.NOEVENT)',
      '    def _tutor_take():',
      '        _evs = []',
      '        _raw = js._tutor_pg_take_json()',
      '        if _raw:',
      '            for _d in _json.loads(_raw):',
      '                _ACTIVE[0] = _ttime.monotonic()',
      '                if _d.get("t") == "MOUSEMOTION":',
      '                    _MOUSE[0] = _d.get("x", 0)',
      '                    _MOUSE[1] = _d.get("y", 0)',
      '                _evs.append(_mk_ev(_d))',
      '        return _evs',
      '    def _tutor_event_get(*a, **kw):',
      '        _evs = _tutor_take()',
      '        _now = _ttime.monotonic()',
      '        _want_quit = False',
      '        _idle = (_now - _ACTIVE[0]) > _IDLE',
      '        if js._tutor_pg_quit_requested() or _idle:',
      '            _want_quit = True',
      '        if _want_quit and not _QUIT_SENT[0]:',
      '            _QUIT_SENT[0] = True',
      '            if _idle and not js._tutor_pg_quit_requested():',
      '                print("[game closed by tutor: no activity for " + str(int(_IDLE)) + " s]")',
      '            _evs.append(_pg.event.Event(_pg.QUIT))',
      '        return _evs',
      '    _pg.event.get = _tutor_event_get',
      '    def _tutor_event_poll(*a, **kw):',
      '        _evs = _tutor_event_get()',
      '        return _evs[0] if _evs else _pg.event.Event(_pg.NOEVENT)',
      '    _pg.event.poll = _tutor_event_poll',
      '    def _tutor_event_wait(*a, **kw):',
      '        _ttime.sleep(0.05)',
      '        _evs = _tutor_event_get()',
      '        return _evs[0] if _evs else _pg.event.Event(_pg.NOEVENT)',
      '    _pg.event.wait = _tutor_event_wait',
      '    _last_flip = [0.0]',
      '    def _tutor_flip(*a, **kw):',
      '        _now = _ttime.monotonic()',
      '        _ACTIVE[0] = _now',
      '        if _now - _last_flip[0] < 0.033:',
      '            return',
      '        _last_flip[0] = _now',
      '        try:',
      '            _s = _SCREEN[0] or _pg.display.get_surface()',
      '            if _s is None: return',
      '            _w, _h = _s.get_size()',
      '            _gw, _gh = _w, _h',
      '            if _w > 800:',
      '                _k = 800.0 / _w',
      '                _s = _pg.transform.smoothscale(_s, (800, int(_h*_k)))',
      '                _w, _h = _s.get_size()',
      '            _data = _pg.image.tobytes(_s, "RGBA")',
      '            js._tutor_emit_pygame(_data, _w, _h, _gw, _gh)',
      '        except Exception:',
      '            pass',
      '    _pg.display.flip = _tutor_flip',
      '    _pg.display.update = _tutor_flip',
      // cooperation point: called once per loop iteration
      '    async def _tutor_yield():',
      '        _now = _ttime.monotonic()',
      '        _target = max(_NEXT[0], _now - 0.001) + _DT[0]',
      '        _delay = _target - _now',
      '        _NEXT[0] = _target',
      '        if _delay > 0.0005:',
      '            await _asyncio.sleep(_delay)',
      '        else:',
      '            _NEXT[0] = _now',
      'except ImportError:',
      '    pass'
    );
  }

  if(needRequests){
    // HTTP requests go through the browser's fetch() (CORS permitting)
    lines.push(
      'try:',
      '    import pyodide_http',
      '    pyodide_http.patch_all()',
      'except Exception:',
      '    pass'
    );
  }

  // Watchdog
  if(needPygame){
    // For games: long absolute limit + forced close on explicit
    // request (■ stop) if the game doesn't exit on its own within ~2 s.
    lines.push(
      'def _tutor_watch(frame, event, arg):',
      '    _LINES[0] += 1',
      '    _now = _time.monotonic()',
      '    if _now - _T0 > _HARD:',
      '        raise TimeoutError("TutorWatchdog: time limit exceeded")',
      '    if _now - _ACTIVE[0] > _IDLE:',
      '        raise TimeoutError("TutorWatchdog: game stalled (inactivity)")',
      '    try:',
      '        if _LINES[0] % 3000 == 0 and js._tutor_pg_quit_requested():',
      '            raise SystemExit(0)',
      '    except SystemExit:',
      '        raise',
      '    except Exception:',
      '        pass',
      '    return _tutor_watch',
      '_sys.settrace(_tutor_watch)'
    );
  } else {
    lines.push(
      '_T0 = _time.monotonic()',
      'def _tutor_watch(frame, event, arg):',
      `    if _time.monotonic() - _T0 > ${timeoutS}:`,
      '        raise TimeoutError("TutorWatchdog: time limit exceeded")',
      '    return _tutor_watch',
      '_sys.settrace(_tutor_watch)'
    );
  }

  return lines.join('\n');
}

/* ---------- AST transformer: makes game loops cooperative ----------
   A synchronous «while True:» loop would block the worker: no message
   would be delivered and the game would receive no input. The transformation:
     · every «while True:» (in an async context or at module level) gets
       «await _tutor_yield()» as its first statement;
     · functions containing a «while True:» become «async def»;
     · their calls (used as statements) become «await …()».
   The steps'/solutions' code stays conceptually identical: only the points
   where control returns to the browser for a frame change. */
const ASYNCIFY_PY = `
import ast as _ast

def _tutor_has_while_true(node):
    for _n in _ast.walk(node):
        if isinstance(_n, _ast.While) and isinstance(_n.test, _ast.Constant) and _n.test.value is True:
            return True
    return False

def _tutor_asyncify(src):
    _tree = _ast.parse(src)
    _names = set()
    for _n in _ast.walk(_tree):
        if isinstance(_n, _ast.FunctionDef) and _tutor_has_while_true(_n):
            _names.add(_n.name)
    # NB: no early return: even a module-level «while True:»
    # (with no function containing it) must be made cooperative, otherwise
    # the worker stays blocked and the game receives no input.
    class _T(_ast.NodeTransformer):
        def __init__(self):
            self.stack = [True]
        def visit_FunctionDef(self, node):
            _hit = node.name in _names
            self.stack.append(_hit)
            self.generic_visit(node)
            self.stack.pop()
            if _hit:
                return _ast.copy_location(_ast.AsyncFunctionDef(
                    name=node.name, args=node.args, body=node.body,
                    decorator_list=node.decorator_list, returns=node.returns,
                    type_comment=getattr(node, "type_comment", None)), node)
            return node
        def visit_AsyncFunctionDef(self, node):
            self.stack.append(True)
            self.generic_visit(node)
            self.stack.pop()
            return node
        def visit_While(self, node):
            self.generic_visit(node)
            if isinstance(node.test, _ast.Constant) and node.test.value is True and self.stack[-1]:
                _y = _ast.Expr(value=_ast.Await(_ast.Call(
                    func=_ast.Name(id="_tutor_yield", ctx=_ast.Load()), args=[], keywords=[])))
                _ast.copy_location(_y, node)
                _ast.fix_missing_locations(_y)
                node.body.insert(0, _y)
            return node
        def visit_Expr(self, node):
            self.generic_visit(node)
            if self.stack[-1] and isinstance(node.value, _ast.Call):
                _f = node.value.func
                _nm = _f.attr if isinstance(_f, _ast.Attribute) else (_f.id if isinstance(_f, _ast.Name) else None)
                if _nm in _names:
                    node.value = _ast.copy_location(_ast.Await(node.value), node.value)
            return node
    _T().visit(_tree)
    _ast.fix_missing_locations(_tree)
    return _ast.unparse(_tree)
`;

const POSTLUDE = [
  'import sys as _sys, builtins as _b',
  '_sys.settrace(None)',
  'if hasattr(_b, "_tutor_orig_input"):',
  '    _b.input = _b._tutor_orig_input',
].join('\n');

/* ---------- traceback → friendly message ---------- */
const HINTS = [
  [/TutorWatchdog/i, '⏱ Time limit exceeded: likely a loop that never terminates. Check the while (or for) condition and try again.'],
  [/NameError: name '(.+?)' is not defined/i, (m)=>`You used the name «${m[1]}» before defining it (or with different capitalization). If it's a module, check the import; if the step modifies a larger program, the fragment alone cannot run: below you'll see the full solution in action.`],
  [/IndentationError|TabError/i, '⚠ Inconsistent indentation: the body of if/for/while/def must be indented by 4 spaces.'],
  [/SyntaxError/i, '⚠ Invalid syntax: check the colons, quotes, and parentheses.'],
  [/ModuleNotFoundError: No module named '(.+?)'/i, (m)=>`The module «${m[1]}» does not exist: check the name.`],
  [/ImportError/i, '⚠ Import failed.'],
  [/ZeroDivisionError/i, '⚠ Division by zero: guard the denominator.'],
  [/TypeError: can only concatenate str/i, '⚠ You are adding a string and a number: use str(n) or an f-string.'],
  [/TypeError/i, '⚠ Incompatible types in the operation.'],
  [/ValueError: invalid literal for int/i, '⚠ int() received text that is not a number.'],
  [/ValueError/i, '⚠ Unacceptable value for the operation.'],
  [/AttributeError: '(.+?)' object has no attribute '(.+?)'/i, (m)=>`«${m[1]}» has no method «${m[2]}».`],
  [/IndexError/i, '⚠ Index out of range: indices start at 0 and len-1 is the last valid one.'],
  [/KeyError/i, '⚠ Key not found in the dictionary.'],
  [/FileNotFoundError/i, '⚠ File not found: the chapter\'s support files (CSV, JSON, images, modules) are already in the runtime — see the exercise\'s «Files already loaded» banner. Check that the file name is exactly the one given in the step, including the folder (e.g. weather_data/san_francisco_2021.csv).'],
  [/RecursionError/i, '⚠ Recursion with no way out.'],
];
function amico(ex){
  /* FIX v8 · Pygame games run via eval_code_async: their frames are
     named File "<exec>", line N — and the filter below threw them away,
     leaving a traceback in the console with NO file lines at all (e.g. 14-8:
     «Traceback … : NameError: name 'Button' is not defined» and nothing more).
     The source of <exec> IS main.py (with the loop transformation the line
     numbers may shift slightly — comments/blank lines — but the number
     remains a good reference, often exact). */
  const raw0 = ex && ex.message ? ex.message : String(ex);
  const raw = raw0.replace(/File "<exec>", line (\d+)/g, 'File "/home/pyodide/main.py", line $1');
  const lines = raw.split('\n').map(l=>l.trim());
  const last = lines.filter(Boolean).pop() || 'Error';
  let tipo='Error', messaggio=last, hint='';
  const mLine = last.match(/^([\w.]+(?:Error|Exception|Warning|Interrupt))\s*(?::\s*(.*))?$/);
  if(mLine){ tipo=mLine[1]; if(mLine[2]) messaggio=mLine[2]; }
  for(const [re, h] of HINTS){
    const m = raw.match(re);
    if(m){ hint = typeof h==='function' ? h(m) : h; break; }
  }
  const tb = raw.split('\n').filter(l =>
      l.includes('/home/pyodide/') ||
      (/^\s*(File|Traceback|[A-Za-z]+(?:Error|Exception))/.test(l) && !l.includes('_pyodide/') && !l.includes('runpy.py') && !l.includes('<frozen'))
    ).map(l=>l.replace('/home/pyodide/',''))
    .slice(-14);
  const frTutti = [...raw.matchAll(/File "\/home\/pyodide\/([^"]+)", line (\d+)/g)];
  // FIX v8 · the INNERMOST frame's line (the last one in the traceback):
  // that's where the error occurred, not the execution wrapper.
  const fr = frTutti.length ? frTutti[frTutti.length - 1] : null;
  return { tipo, messaggio, hint, traceback: tb.join('\n') || raw, file: fr?fr[1]:null, riga: fr?+fr[2]:null };
}

/* ---------- writing virtual files (nested paths + binary) ---------- */
function scriviVirtualFiles(py, files){
  const voci = Object.entries(files || {});
  for(const [nome, contenuto] of voci){
    const full = '/home/pyodide/' + nome;
    const dir = full.slice(0, full.lastIndexOf('/'));
    try{ py.FS.mkdirTree(dir); }catch(e){ /* already exists */ }
    if(contenuto && typeof contenuto === 'object' && typeof contenuto.b64 === 'string'){
      const bin = atob(contenuto.b64);
      const bytes = new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
      py.FS.writeFile(full, bytes);
    } else {
      py.FS.writeFile(full, String(contenuto), { encoding:'utf8' });
    }
  }
}

/* ---------- execution ---------- */
async function run(msg){
  const t0 = performance.now();
  outBuf=''; errBuf='';
  pgQueue.length = 0; pgQuit = false;    // new run: reset game input
  try{
    const py = await ensurePyodide();
    // ===== NEW · safe auto-import on the main code =====
    const code = autoImportPass(msg.code || '');
    const files = Object.assign({ 'main.py': code }, msg.virtualFiles || {});

    // Import detection considers ALL .py sources (not just main.py):
    // multi-file solutions import support modules.
    const pySources = Object.entries(files)
      .filter(([n,c]) => n.endsWith('.py') && typeof c === 'string')
      .map(([,c]) => c).join('\n');
    const imports = detectImports(code + '\n' + pySources);
    const isGame = imports.pygame && msg.mode !== 'pytest';

    // Load the needed packages (in order: matplotlib → plotly → pygame → pytest → requests)
    if(imports.matplotlib) await loadPackage('matplotlib');
    if(imports.plotly)     await loadPackage('plotly');
    if(imports.pygame)     await loadPackage('pygame');
    if(msg.mode === 'pytest') await loadPackage('pytest');
    if(imports.requests)   await loadPackage('requests');

    scriviVirtualFiles(py, files);
    const moduliVirtuali = Object.keys(msg.virtualFiles || {}).filter(n=>n.endsWith('.py'))
      .map(n=>n.replace(/\.py$/,'').replace(/\//g,'.'));
    try{ await py.loadPackagesFromImports(pySources); }catch(e){ /* the error will surface from the import */ }

    // ===== NEW · reset the output buffers: package download messages
    // («Loading micropip», «Loaded narwhals, packaging»…) must not
    // appear in the student's program output =====
    outBuf = ''; errBuf = '';

    // Effective timeout: interactive games need a long limit.
    // ===== CHANGED · exercises with HTTP requests (ch. 17:
    // python_repos, Hacker News) also make several network calls in a row:
    // a budget as generous as for games, otherwise the watchdog cuts them off =====
    const effectiveTimeoutS = isGame ? GAME_HARD_LIMIT_S
      : (msg.timeoutS || (imports.requests ? 25 : PYODIDE.timeoutS));

    await py.runPythonAsync(buildPrelude(moduliVirtuali, msg.stdin, effectiveTimeoutS,
                                          imports.input, imports.matplotlib, imports.plotly, imports.pygame, imports.requests));
    // defines the loop transformer (used only in game mode)
    if(isGame) await py.runPythonAsync(ASYNCIFY_PY);

    // ===== NEW · tell the runner that actual execution starts now,
    // with the effective timeout (package download time doesn't count).
    post({ type:'execstart', id: msg.id, timeoutS: effectiveTimeoutS });
    try{
      if(msg.mode === 'pytest' && msg.entry){
        // Test chapter solutions: runs pytest on the test file
        await py.runPythonAsync(`import pytest; pytest.main(['-v', ${JSON.stringify(msg.entry)}])`);
      } else if(isGame){
        // ===== INTERACTIVE GAME =====
        // 1. makes the program's «while True:» loops cooperative;
        // 2. runs it as a coroutine (await at module top level is allowed
        //    with eval_code_async): this way the worker receives the Game
        //    panel's input while the loop runs;
        // 3. SystemExit (q key, ■ stop, close on inactivity) exits
        //    cleanly, with no traceback.
        await py.runPythonAsync([
          'try:',
          '    _src = _tutor_asyncify(open("/home/pyodide/main.py", encoding="utf-8").read())',
          '    import pyodide.code',
          '    _g = dict(globals())',
          '    _g["__name__"] = "__main__"',
          '    await pyodide.code.eval_code_async(_src, _g)',
          'except SystemExit:',
          '    pass',
        ].join('\n'));
      } else {
        // ===== CHANGED · SystemExit caught: Pygame games exit with
        // sys.exit() upon receiving the synthetic QUIT → clean termination.
        await py.runPythonAsync(
          'import runpy\n' +
          'try:\n' +
          "    runpy.run_path('/home/pyodide/main.py', run_name='__main__')\n" +
          'except SystemExit:\n' +
          '    pass'
        );
      }
    } finally {
      try{ await py.runPythonAsync(POSTLUDE); }catch(e){}
    }
    const output = (outBuf + (errBuf ? '\n[stderr]\n'+errBuf : '')).replace(/\n{3,}/g,'\n\n').trimEnd();
    post({ type:'result', id:msg.id, ok:true, output, durataMs: Math.round(performance.now()-t0) });
  }catch(ex){
    const err = amico(ex);
    try{ await pyodide.runPythonAsync(POSTLUDE); }catch(e){}
    post({ type:'result', id:msg.id, ok:false, output: outBuf.trim(),
           durataMs: Math.round(performance.now()-t0), error:err });
  }
}

self.addEventListener('message', ev => {
  const msg = ev.data;
  if(!msg) return;
  if(msg.type === 'run') run(msg);
  if(msg.type === 'load') ensurePyodide().catch(()=>{});
  // ===== NEW · game input and close request =====
  if(msg.type === 'pg-event' && msg.e){ if(pgQueue.length < 240) pgQueue.push(msg.e); }
  if(msg.type === 'pg-quit') pgQuit = true;
});
