/* ============================================================
   ENGINE/TUTOR · the pedagogical logic, with no DOM at all
   ------------------------------------------------------------
   - step checking: expected strings / regexes (multi-line too)
   - help statistics (3 levels: concept, syntax, line)
   - syntactic autonomy index
   - "soft" verification of the real output against the expected one
   Ported 1:1 from the monolith: the teaching messages are identical.
   ============================================================ */
import { EX, ORDER, TOTAL_EX } from '../data/exercises.js?v=18'; // ===== CHANGED v16.1 · versioned specifier (stale-ServiceWorker fix, see app.js) =====

/* ---------- per-exercise state (with stable defaults) ---------- */
export function stateFor(progress, id) {
  if (!progress[id]) progress[id] = { solved: 0, assist: {}, notes: {}, outputs: [] };
  const p = progress[id];
  if (!p.assist) p.assist = {}; if (!p.notes) p.notes = {}; if (!p.outputs) p.outputs = [];
  if (!p.lines) p.lines = {}; if (!p.runs) p.runs = [];
  return p;
}

/* ---------- normalization and checking ---------- */
function norm(l) { return l.replace(/\s+/g, ' ').replace(/'/g, '"').trim(); }
function stripComment(l) {
  let inS = false, q = '';
  for (let i = 0; i < l.length; i++) {
    const c = l[i];
    if (inS) { if (c === q) inS = false; }
    else { if (c === '"' || c === "'") { inS = true; q = c; } else if (c === '#') return l.slice(0, i); }
  }
  return l;
}
function trimEdges(lines) {
  let a = 0, b = lines.length - 1;
  while (a < lines.length && lines[a].trim() === '') a++;
  while (b >= a && lines[b].trim() === '') b--;
  return lines.slice(a, b + 1);
}
/* User lines already cleaned (tab→spaces, comments ignored, edges trimmed) */
export function righeUtente(raw) {
  return trimEdges((raw || '').replace(/\t/g, '    ').split('\n'))
    .map(l => stripComment(l).trim());
}
/** Like righeUtente but KEEPS the left indentation (for real execution). */
export function righeUtenteRaw(raw) {
  return trimEdges((raw || '').replace(/\t/g, '    ').split('\n'))
    .map(l => stripComment(l).replace(/\s+$/, ''));
}
/** Like righeUtenteRaw but KEEPS the comments: for steps with the option
 *  `raw: true` (e.g. 2-11 «Adding comments») the check targets the
 *  comment itself, so it must not be stripped before checkStep(). */
export function righeUtenteConCommenti(raw) {
  return trimEdges((raw || '').replace(/\t/g, '    ').split('\n'))
    .map(l => l.replace(/\s+$/, ''));
}
/** Applies the expected (canonical) line's indentation to the student's
 *  line: the acceptance comparison stays trimmed (as in the monolith),
 *  but the accumulated program runs with the correct indentation. */
export function conRientro(atteso, riga) {
  const ind = (String(atteso || '').match(/^ +/) || [''])[0];
  return ind + String(riga || '').trim();
}

/** Checks a step. Supports:
 *  - `c`: normalized line-by-line comparison (one single form)
 *  - `re`: JS patterns, in 3 forms:
 *      a) single string                     → 1 line
 *      b) array of strings                  → N lines, one form
 *      c) array of arrays of strings        → N lines, several alternative forms
 *  In form (c), every sub-array is a complete sequence of lines:
 *  if ONE variant matches (same number of lines + all regexes true),
 *  the step is valid.
 */
export function checkStep(s, userLines) {
  if (s.re) {
    // Normalize to "array of variants", each variant = array of strings
    let variants;
    if (typeof s.re === 'string') {
      variants = [[s.re]];
    } else if (Array.isArray(s.re)) {
      if (s.re.length === 0) variants = [[]];
      else if (Array.isArray(s.re[0])) {
        variants = s.re;                    // (c) several forms
      } else {
        variants = [s.re];                  // (b) one multi-line form
      }
    } else {
      variants = [[String(s.re)]];
    }

    // Try every variant
    for (const variant of variants) {
      if (variant.length !== userLines.length) continue;
      let allMatch = true;
      for (let i = 0; i < variant.length; i++) {
        if (!new RegExp(variant[i]).test(userLines[i])) { allMatch = false; break; }
      }
      if (allMatch) return { ok: true };
    }

    // Failed: useful diagnostic message
    const expectedLen = variants[0].length;
    if (userLines.length !== expectedLen) {
      return {
        ok: false,
        msg: `This step requires ${expectedLen} ${expectedLen > 1 ? 'lines' : 'line'} of code (you wrote ${userLines.length}). Note: comments (#) and empty lines do not count as code.`
      };
    }
    return {
      ok: false,
      msg: `The ${userLines.length} ${userLines.length > 1 ? 'lines are' : 'line is'} there, but the content does not match. Open the hint on the highlighted words for a clue, or check parentheses, quotes and names.`
    };
  }

  // Classic case: c + normalized comparison
  const exp = s.c.split('\n');
  if (userLines.length !== exp.length)
    return { ok: false, msg: `This step requires ${exp.length} ${exp.length > 1 ? 'lines' : 'line'} of code (you wrote ${userLines.length}).` };
  for (let i = 0; i < exp.length; i++) {
    if (norm(exp[i]) !== norm(userLines[i])) {
      let d = 0; const a = norm(exp[i]), b = norm(userLines[i]);
      while (d < Math.max(a.length, b.length) && a[d] === b[d]) d++;
      return { ok: false, msg: `Line ${i + 1} does not match (first difference around character ${d + 1}). Check parentheses, quotes and names.` };
    }
  }
  return { ok: true };
}
/* ---------- labels and help statistics ---------- */
export function assistLabel(l) {
  return l >= 3 ? '🪂 full hint' : l === 2 ? 'syntax hint' : l === 1 ? 'concept hint' : 'no hints';
}
export function assistSummary(st) {
  let l1 = 0, l2 = 0, l3 = 0;
  Object.values(st.assist).forEach(v => { if (v >= 3) l3++; else if (v === 2) l2++; else if (v === 1) l1++; });
  return `${l1}× concept · ${l2}× syntax · ${l3}× full`;
}
/** Syntactic autonomy: each step is worth 3 points (3 with no help… 0 with the full line). */
export function autonomiaOf(progress, id) {
  const e = EX[id]; const st = stateFor(progress, id);
  let tot = 0, sum = 0;
  e.steps.forEach((s, i) => { if (s.c && i < st.solved) { tot++; sum += 3 - (st.assist[i] || 0); } });
  return tot === 0 ? 100 : Math.round(sum / tot / 3 * 100);
}
export function globalStats(progress) {
  let solved = 0, done = 0, totAssist = 0, nAssist = 0, l3 = 0;
  ORDER.forEach(id => {
    const st = stateFor(progress, id); const e = EX[id];
    if (st.done) done++;
    solved += Math.min(st.solved, e.steps.length);
    Object.values(st.assist).forEach(v => { totAssist += v; nAssist++; if (v >= 3) l3++; });
  });
  return { done, solved, avgAssist: nAssist ? (totAssist / nAssist) : 0, l3, total: TOTAL_EX };
}
export function nextExercise(progress, fromId) {
  const i = ORDER.indexOf(fromId);
  for (let j = i + 1; j < ORDER.length; j++) if (!stateFor(progress, ORDER[j]).done) return ORDER[j];
  for (let j = 0; j < ORDER.length; j++) if (!stateFor(progress, ORDER[j]).done) return ORDER[j];
  return null;
}

/* ---------- soft verification of the real output ----------
   the dataset's `so` holds the expected output; now that the code
   really runs (Pyodide) we can compare. Lines with "…", "␣" or
   only spaces are prototype placeholders and are skipped.
   Returns null if the exercise cannot be verified. */
export function verificaOutput(soLines, output) {
  if (!Array.isArray(soLines) || !soLines.length) return null;
  const significative = soLines
    .flatMap(l => String(l).split('\n'))                 // lines with real \n
    .map(l => l.trim() ? l.trim() : '')                  // edge spaces ignored
    .filter(l => l && !l.includes('…') && !l.includes('␣'));
  if (!significative.length) return null;
  const mancanti = significative.filter(l => !output.includes(l));
  return { ok: mancanti.length === 0, mancanti };
}
