/* Test v12.1 · the "Lines" panel = the lines of the "Completed exercise" view
   + the PONTE bridge to the project (see CHANGELOG-v12.md)
   Run: node test_righe_v12.mjs (from this folder, Node >= 18)
   Replicates the logic of app.js (calcolaSlice + applicaPonte) on the real data:
   - EX/ORDER from data/exercises.js · SOLUTIONS/CHAPTER_FILES from data/solutions.js
     (getSolution = own ⊎ chapter; getSolutionRaw = own files only)
   - SOLUTIONS_INDEX from data/solutions-index.js · PONTE from engine/ponte.js
   Verifies:
   1. every 'sol' exercise has the STEPS (= the lines of "Completed exercise":
      for every step with code, the saved lines or the trace) and valid
      reference REGIONS (existing file, interval within the file, consistent text);
   2. PONTE: every rule finds its file in the project, every slot/block
      matches EXACTLY once, every trace line exists (normalized) in the
      cited step, every `da` captures a value;
   3. the bridge works:
      · 14-3 (the user's example, the WHOLE case): 1.1 → 3.5 ⇒ settings.py has
        self.speedup_scale = 3.5 and ONLY that line changes (the starting
        speeds stay 3.0/12.0/1.5); "everything at 10" ⇒ starting speeds ×10
        (30/120/15, immediately visible) + speedup_scale = 10; start = 5 ⇒
        15/60/7.5 with the speedup unchanged; reset = 2 ⇒ ×2 (the first
        changed occurrence); ×0.5 ⇒ 1.5/6/0.75; round-trip and repeated patches;
      · slot: 14-2 (miss 3→5 ⇒ miss_limit 5), 13-2 (10→40 ⇒ offset_size 40),
        14-1 (K_p→K_x), 14-8 (10→50), 17-1 (javascript→rust, 10000→50000),
        12-4/12-6/13-3/13-5 (speeds), 13-6 (lives), 14-4 (labels);
      · block: 14-6 (_start_new_level replaced, indented by 4),
        15-5 (get_step), 11-2 (function + test), 9-9 (method);
      · program: 8-15 and 12-1 (the trace replaces the whole entry);
      · no-rules (12-2, 13-1, 14-5, 17-3): no file, no crash;
      · changed structure (a line added) ⇒ slot skipped, structure flag. */
import { EX, ORDER } from './data/exercises.js';
import { SOLUTIONS, CHAPTER_FILES } from './data/solutions.js';
import { PONTE } from './engine/ponte.js';
import fs from 'fs';

const idxSrc = fs.readFileSync(new URL('./data/solutions-index.js', import.meta.url), 'utf8');
const SOLUTIONS_INDEX = JSON.parse(idxSrc.slice(idxSrc.indexOf('{'), idxSrc.lastIndexOf('}') + 1));

/* ---------- replica of the app.js algorithm ---------- */
const OUT_RE = /\bprint\s*\(|\.show\s*\(|\binput\s*\(/;
function draftProgram(e, seen) {
  seen = seen || new Set();
  if (seen.has(e.id)) return '';
  seen.add(e.id);
  const out = [];
  const pre = Array.isArray(e.prereq) ? e.prereq : (e.prereq ? [e.prereq] : []);
  pre.forEach(pid => { if (EX[pid]) out.push(draftProgram(EX[pid], seen)); });
  out.push(e.steps.filter(s => s.c).map(s => s.c).join('\n'));
  return out.filter(Boolean).join('\n');
}
function solIdxOk(id) {
  const si = SOLUTIONS_INDEX[id];
  return !!si && (si.mode === 'run' || si.mode === 'pytest') && !!si.entry;
}
function normLine(l) { return String(l).replace(/\s+/g, ' ').trim(); }
function findBlock(lines, block, hint) {
  const n = block.length;
  if (!n || lines.length < n) return -1;
  let best = -1, bestD = Infinity;
  for (let i = 0; i + n <= lines.length; i++) {
    let ok = true;
    for (let j = 0; j < n; j++) if (lines[i + j] !== block[j]) { ok = false; break; }
    if (!ok) continue;
    const d = hint >= 0 ? Math.abs(i - hint) : 0;
    if (d < bestD) { best = i; bestD = d; if (d === 0) break; }
  }
  return best;
}
function mergeRuns(idx, gap) {
  const runs = [];
  if (!idx.length) return runs;
  let a = idx[0], b = idx[0];
  for (let k = 1; k < idx.length; k++) {
    if (idx[k] - b - 1 <= gap) b = idx[k];
    else { runs.push([a, b]); a = b = idx[k]; }
  }
  runs.push([a, b]);
  return runs;
}
function countShared(a, b) {
  const setB = new Set(String(b).split('\n').map(normLine).filter(Boolean));
  return String(a).split('\n').filter(l => { const n = normLine(l); return n && setB.has(n); }).length;
}
function getSolution(id) {
  const rec = SOLUTIONS[id]; if (!rec) return null;
  return { id, entry: rec.entry, mode: rec.mode, files: Object.assign({}, CHAPTER_FILES[rec.ch] || {}, rec.files || {}) };
}
function getSolutionRaw(id) {
  const rec = SOLUTIONS[id]; if (!rec) return null;
  return { id, entry: rec.entry, mode: rec.mode, files: rec.files || {} };
}
const indexIds = () => Object.keys(SOLUTIONS_INDEX);
/* calcSolSlice — the 'sol' branch of app.js calcolaSlice (progress at zero: current = trace) */
function calcSolSlice(e) {
  const sol = getSolution(e.id);
  if (!sol || !sol.entry || (sol.mode !== 'run' && sol.mode !== 'pytest') || typeof sol.files[sol.entry] !== 'string')
    return { mode: 'sol-missing' };
  const raw = getSolutionRaw(e.id);
  const names = (raw && raw.files && Object.keys(raw.files).length ? Object.keys(raw.files) : Object.keys(sol.files))
    .filter(n => n.endsWith('.py') && n !== 'main.py');
  const myPos = ORDER.indexOf(e.id);
  let prev = null;
  if (myPos > 0) {
    for (const id of indexIds()) {
      if (id === e.id) continue;
      const si = SOLUTIONS_INDEX[id];
      if (!si || si.entry !== sol.entry || (si.mode !== 'run' && si.mode !== 'pytest')) continue;
      const pos = ORDER.indexOf(id);
      if (pos < 0 || pos >= myPos) continue;
      const s2 = getSolution(id);
      if (!s2 || typeof s2.files[sol.entry] !== 'string') continue;
      const cond = countShared(sol.files[sol.entry], s2.files[sol.entry]);
      if (!prev || cond > prev.cond) prev = { id, cond, sol: s2, t: EX[id] ? EX[id].t : id };
    }
  }
  const regions = {};
  const addRegion = (fn, from, to, text) => { (regions[fn] = regions[fn] || []).push({ file: fn, from, to, orig: text }); };
  if (prev) {
    for (const fn of names) {
      const cur = sol.files[fn];
      if (typeof cur !== 'string') continue;
      const lines = cur.split('\n');
      if (typeof prev.sol.files[fn] !== 'string') { addRegion(fn, 1, lines.length, cur); continue; }
      const prevSet = new Set(prev.sol.files[fn].split('\n').map(normLine).filter(Boolean));
      const changed = [];
      lines.forEach((l, i) => { const nl = normLine(l); if (nl && !prevSet.has(nl)) changed.push(i); });
      if (!changed.length) continue;
      let runs = mergeRuns(changed, 4);
      for (const gap of [10, 20, 40]) { if (runs.length <= 6) break; runs = mergeRuns(changed, gap); }
      const tot = lines.filter(l => normLine(l)).length;
      const covered = runs.reduce((a, [x, y]) => a + (y - x + 1), 0);
      if (runs.length > 6 || covered >= tot * 0.85) runs = [[0, lines.length - 1]];
      runs.forEach(([a, b]) => addRegion(fn, a + 1, b + 1, lines.slice(a, b + 1).join('\n')));
    }
  }
  const nRegions = () => Object.values(regions).reduce((a, r) => a + r.length, 0);
  if (!prev || !nRegions()) {
    const seen = new Set();
    for (const id of indexIds()) {
      if (ORDER.indexOf(id) >= 0 && ORDER.indexOf(id) >= myPos) continue;
      const s2 = getSolution(id);
      if (s2) Object.keys(s2.files).forEach(n => seen.add(n));
    }
    for (const fn of names) {
      if (seen.has(fn) || typeof sol.files[fn] !== 'string') continue;
      addRegion(fn, 1, String(sol.files[fn]).split('\n').length, String(sol.files[fn]));
    }
    for (const s of e.steps) {
      if (!s.c) continue;
      const rawBlk = s.c.replace(/\t/g, '    ').split('\n');
      let a = 0, b = rawBlk.length - 1;
      while (a <= b && !normLine(rawBlk[a])) a++;
      while (b >= a && !normLine(rawBlk[b])) b--;
      if (a > b) continue;
      const block = rawBlk.slice(a, b + 1).map(normLine);
      for (const fn of Object.keys(sol.files).sort()) {
        if (!fn.endsWith('.py') || fn === 'main.py' || regions[fn]) continue;
        if (typeof sol.files[fn] !== 'string') continue;
        const lines = String(sol.files[fn]).split('\n');
        const pos = findBlock(lines.map(normLine), block, -1);
        if (pos >= 0) { addRegion(fn, pos + 1, pos + block.length, lines.slice(pos, pos + block.length).join('\n')); break; }
      }
    }
    if (!nRegions()) { const cur = String(sol.files[sol.entry]); addRegion(sol.entry, 1, cur.split('\n').length, cur); }
  }
  const supports = Object.keys(sol.files).filter(n => n.endsWith('.py') && n !== 'main.py' && !regions[n]).sort();
  /* ===== v12.1 · the steps: the lines of "Completed exercise" ===== */
  const st = { lines: {} };   // progress at zero: current = the step trace
  const steps = [];
  e.steps.forEach((s, i) => {
    if (!s.c) return;
    steps.push({ step: i, original: s.c, current: (st.lines && st.lines[i]) ? st.lines[i] : s.c });
  });
  return {
    mode: 'sol', entry: sol.entry, main: sol.entry, steps, regions, supports,
    prev: prev ? { id: prev.id, t: prev.t } : null,
    nPy: Object.keys(sol.files).filter(n => n.endsWith('.py')).length, orig: sol.files,
    rules: Array.isArray(PONTE[e.id]) ? PONTE[e.id] : []
  };
}
/* applyPonte — replicates app.js applicaPonte
   (PONTE rule fields tipo/riga/da/slot/passo/cerca/rientro come from engine/ponte.js) */
function indentBlock(text, n) {
  if (!n) return text;
  return String(text).split('\n').map(l => l.trim() ? ' '.repeat(n) + l : l).join('\n');
}
function applyPonte(e, steps, texts, origFiles) {
  const rules = Array.isArray(PONTE[e.id]) ? PONTE[e.id] : [];
  const out = { files: {}, applied: [], notApplied: [], structure: false };
  const baseOf = fn => out.files[fn] != null ? out.files[fn] : String(origFiles[fn] != null ? origFiles[fn] : '');
  const linesOf = k => ({ orig: String(steps[k].original).split('\n'), cur: String(texts[k]).replace(/\r/g, '').split('\n') });
  for (const reg of rules) {
    if (reg.tipo === 'programma') {
      const mine = texts.map(t => String(t).replace(/\r/g, '')).join('\n');
      const trace = steps.map(p => String(p.original)).join('\n');
      if (mine === trace) continue;
      out.files[reg.file] = mine;
      out.applied.push({ reg });
      continue;
    }
    if (reg.tipo === 'blocco') {
      const k = steps.findIndex(p => p.step === reg.passo);
      if (k < 0) continue;
      const { orig, cur } = linesOf(k);
      if (orig.join('\n') === cur.join('\n')) continue;
      const base = baseOf(reg.file);
      const m = new RegExp(reg.cerca).exec(base);
      if (!m) { out.notApplied.push({ reg, why: 'block not found in ' + reg.file }); continue; }
      out.files[reg.file] = base.slice(0, m.index) + indentBlock(cur.join('\n'), reg.rientro || 0) + base.slice(m.index + m[0].length);
      out.applied.push({ reg });
      continue;
    }
    if (reg.tipo === 'scala') {
      const lines = Array.isArray(reg.riga) ? reg.riga : [reg.riga];
      for (const line of lines) {
        for (let k = 0; k < steps.length; k++) {
          const { orig, cur } = linesOf(k);
          if (cur.length !== orig.length) { out.structure = true; continue; }
          let j = -1, mo = null, mu = null;
          for (let x = 0; x < orig.length; x++) {
            if (normLine(orig[x]) !== normLine(line)) continue;
            const o = new RegExp(reg.da).exec(orig[x]);
            const u = new RegExp(reg.da).exec(cur[x]);
            if (!o || o[1] == null || !u || u[1] == null) continue;
            if (o[1] !== u[1]) { j = x; mo = o; mu = u; break; }
          }
          if (j < 0) continue;
          const factor = parseFloat(mu[1]);
          if (!isFinite(factor)) continue;
          const base = baseOf(reg.file);
          const ms = new RegExp(reg.slot, 'd').exec(base);
          if (!ms || !ms.indices || !ms.indices[1]) { out.notApplied.push({ reg, why: 'value not found in ' + reg.file }); continue; }
          const baseVal = parseFloat(ms[1]);
          if (!isFinite(baseVal)) continue;
          const newVal = Math.round(baseVal * factor * 100) / 100;
          const [from, to] = ms.indices[1];
          out.files[reg.file] = base.slice(0, from) + newVal + base.slice(to);
          out.applied.push({ reg, line: String(orig[j]).trim(), from: '×' + mu[1], to: String(newVal) });
        }
      }
      continue;
    }
    const lines = Array.isArray(reg.riga) ? reg.riga : [reg.riga];
    for (const line of lines) {
      for (let k = 0; k < steps.length; k++) {
        const { orig, cur } = linesOf(k);
        const j = orig.findIndex(l => normLine(l) === normLine(line));
        if (j < 0) continue;
        if (cur.length !== orig.length) { out.structure = true; continue; }
        const mo = new RegExp(reg.da).exec(orig[j]);
        const mu = new RegExp(reg.da).exec(cur[j]);
        if (!mo || mo[1] == null || !mu || mu[1] == null) continue;
        if (mo[1] === mu[1]) continue;
        const base = baseOf(reg.file);
        const ms = new RegExp(reg.slot, 'd').exec(base);
        if (!ms || !ms.indices || !ms.indices[1]) { out.notApplied.push({ reg, why: 'value not found in ' + reg.file }); continue; }
        const [from, to] = ms.indices[1];
        out.files[reg.file] = base.slice(0, from) + mu[1] + base.slice(to);
        out.applied.push({ reg, line: String(orig[j]).trim(), from: mo[1], to: mu[1] });
      }
    }
  }
  return out;
}

/* ---------- tests ---------- */
let fail = 0, warn = 0;
const check = (cond, msg) => { if (!cond) { console.log('✗ ' + msg); fail++; } };
const soft = (cond, msg) => { if (!cond) { console.log('⚠ ' + msg); warn++; } };

const SOL_IDS = ORDER.filter(id => {
  const e = EX[id];
  if (e.noRun || (Array.isArray(e.files) && e.files.length)) return false;
  if (!solIdxOk(id)) return false;
  return !OUT_RE.test(draftProgram(e));
});
console.log(`'sol' mode exercises: ${SOL_IDS.length}`);

const slices = {};
for (const id of SOL_IDS) slices[id] = calcSolSlice(EX[id]);

/* 1 · steps (= "Completed exercise") + valid reference regions */
for (const id of SOL_IDS) {
  const sl = slices[id];
  const e = EX[id];
  const fullCode = e.steps.map((s, i) => s.c ? s.c : null).filter(Boolean).join('\n');   // as in finalCard (progress at zero)
  check(sl.steps.length > 0, `${id}: no step with code`);
  const joined = sl.steps.map(p => p.original).join('\n');
  check(joined === fullCode, `${id}: the steps do not match "Completed exercise"`);
  check(sl.steps.every(p => p.current === p.original), `${id}: current ≠ trace with progress at zero`);
  const nReg = Object.values(sl.regions).reduce((a, r) => a + r.length, 0);
  check(nReg > 0, `${id}: no reference region computed`);
  for (const [fn, regs] of Object.entries(sl.regions)) {
    const file = String(sl.orig[fn] || '');
    const nLines = file.split('\n').length;
    regs.forEach(reg => {
      check(reg.from >= 1 && reg.to <= nLines && reg.from <= reg.to, `${id}: interval outside the file ${fn} (${reg.from}–${reg.to} of ${nLines})`);
      check(reg.orig === file.split('\n').slice(reg.from - 1, reg.to).join('\n'), `${id}: the text of region ${fn}:${reg.from}–${reg.to} does not match the file lines`);
    });
  }
  console.log(`  ${id.padEnd(6)} ${EX[id].t.padEnd(30)} → ${sl.steps.length} steps · lives in ${Object.keys(sl.regions).join(', ')}${sl.prev ? '  (extends ' + sl.prev.id + ')' : ''}`);
}

/* 2 · PONTE: integrity of the rules on the real data */
for (const [id, rules] of Object.entries(PONTE)) {
  const sl = slices[id];
  check(!!sl && sl.mode === 'sol', `${id}: bridge rules on a non-'sol' exercise`);
  if (!sl || sl.mode !== 'sol') continue;
  const e = EX[id];
  for (const reg of rules) {
    const file = sl.orig[reg.file];
    check(typeof file === 'string', `${id}: file ${reg.file} missing from the project`);
    if (typeof file !== 'string') continue;
    if (reg.tipo === 'slot') {
      const lines = Array.isArray(reg.riga) ? reg.riga : [reg.riga];
      for (const line of lines) {
        const nFound = sl.steps.reduce((a, p) => a + p.original.split('\n').filter(l => normLine(l) === normLine(line)).length, 0);
        check(nFound === 1, `${id}: trace line "${line}" found ${nFound} times (need 1)`);
        const md = new RegExp(reg.da).exec(line);
        check(!!md && md[1] != null, `${id}: the 'da' regex does not capture on "${line}"`);
      }
      const n = (String(file).match(new RegExp(reg.slot, 'g')) || []).length;
      check(n === 1, `${id}: slot /${reg.slot}/ in ${reg.file}: ${n} matches (need 1)`);
    } else if (reg.tipo === 'blocco') {
      const p = sl.steps.find(pp => pp.step === reg.passo);
      check(!!p, `${id}: step ${reg.passo} cited by the block rule has no code`);
      const n = (String(file).match(new RegExp(reg.cerca, 'g')) || []).length;
      check(n === 1, `${id}: block in ${reg.file}: ${n} matches (need 1)`);
    } else if (reg.tipo === 'programma') {
      check(sl.rules.some(r => r.tipo === 'programma' && r.file === sl.entry) || true, '');
    }
  }
  soft(rules.length > 0 || ['12-2', '13-1', '14-5', '17-3'].includes(id), `${id}: no bridge rules (expected only for conceptual traces)`);
}

/* helper: edited texts = the trace with one line replaced (the original
   line's indentation is kept, as a user would do in the editor) */
const withLine = (id, line, newLine) => {
  const sl = slices[id];
  return sl.steps.map(p => {
    const lines = p.original.split('\n');
    const j = lines.findIndex(l => normLine(l) === normLine(line));
    if (j < 0) return p.original;
    const ind = (lines[j].match(/^\s*/) || [''])[0];
    return lines.slice(0, j).concat([ind + newLine]).concat(lines.slice(j + 1)).join('\n');
  });
};
const diffLines = (a, b) => {
  const A = String(a).split('\n'), B = String(b).split('\n');
  const d = [];
  const n = Math.max(A.length, B.length);
  for (let i = 0; i < n; i++) if (A[i] !== B[i]) d.push(`"${A[i]}" → "${B[i]}"`);
  return d;
};

/* 3 · the bridge works */
{
  /* --- 14-3, the user's example: ALL lines at 10 — the starting speed
     ×10 (immediately visible!) AND the scale-up factor 10 --- */
  const sl = slices['14-3'];
  check(sl.steps.length === 1 && sl.steps[0].original === 'speed_scale = 1.0\nspeed_scale *= 1.1\nspeed_scale = 1.0', '14-3: the trace is not the 3 speed_scale lines');
  const res143 = applyPonte(EX['14-3'], sl.steps, withLine('14-3', 'speed_scale *= 1.1', 'speed_scale *= 3.5'), sl.orig);
  check(res143.applied.length === 1, '14-3: one rule must apply');
  check(res143.files['settings.py'] && /self\.speedup_scale = 3\.5\b/.test(res143.files['settings.py']), '14-3: settings.py must have speedup_scale = 3.5');
  const d = diffLines(sl.orig['settings.py'], res143.files['settings.py']);
  check(d.length === 1 && /2\.1/.test(d[0]) && /3\.5/.test(d[0]), '14-3: ONLY the speedup_scale line must change, changed: ' + d.length);
  /* only the *= changed: the starting speeds are NOT touched */
  check(/self\.ship_speed = 3\.0\b/.test(res143.files['settings.py']) && /self\.bullet_speed = 12\.0\b/.test(res143.files['settings.py']) && /self\.target_speed = 1\.5\b/.test(res143.files['settings.py']), '14-3: with only the *= changed the starting speeds stay 3.0/12.0/1.5');
  /* the case reported by the user: speed_scale = 10 everywhere */
  const texts10 = ['speed_scale = 10\nspeed_scale *= 10\nspeed_scale = 10'];
  const all10 = applyPonte(EX['14-3'], sl.steps, texts10, sl.orig);
  check(all10.applied.length === 4, '14-3 (everything at 10): 4 rules must apply (3 scala + 1 slot), applied: ' + all10.applied.length);
  const s10 = all10.files['settings.py'];
  check(/self\.ship_speed = 30\b/.test(s10) && /self\.bullet_speed = 120\b/.test(s10) && /self\.target_speed = 15\b/.test(s10), '14-3 (everything at 10): the starting speeds must become 30/120/15');
  check(/self\.speedup_scale = 10\b/.test(s10), '14-3 (everything at 10): speedup_scale = 10');
  /* only the starting line (the first one) changed: ×5, speedup unchanged */
  const start5 = applyPonte(EX['14-3'], sl.steps, ['speed_scale = 5\nspeed_scale *= 1.1\nspeed_scale = 1.0'], sl.orig);
  check(/self\.ship_speed = 15\b/.test(start5.files['settings.py']) && /self\.bullet_speed = 60\b/.test(start5.files['settings.py']) && /self\.target_speed = 7\.5\b/.test(start5.files['settings.py']), '14-3 (start = 5): speeds 15/60/7.5');
  check(/self\.speedup_scale = 2\.1\b/.test(start5.files['settings.py']), '14-3 (start = 5): speedup_scale stays 2.1');
  /* only the reset line (the third one) changed: the first changed occurrence drives the scale */
  const reset2 = applyPonte(EX['14-3'], sl.steps, ['speed_scale = 1.0\nspeed_scale *= 1.1\nspeed_scale = 2'], sl.orig);
  check(/self\.target_speed = 3\b/.test(reset2.files['settings.py']) && /self\.ship_speed = 6\b/.test(reset2.files['settings.py']), '14-3 (reset = 2): the first changed occurrence drives the scale (×2)');
  /* fractional factor: ×0.5 */
  const half = applyPonte(EX['14-3'], sl.steps, ['speed_scale = 0.5\nspeed_scale *= 1.1\nspeed_scale = 0.5'], sl.orig);
  check(/self\.ship_speed = 1\.5\b/.test(half.files['settings.py']) && /self\.bullet_speed = 6\b/.test(half.files['settings.py']) && /self\.target_speed = 0\.75\b/.test(half.files['settings.py']), '14-3 (×0.5): speeds 1.5/6/0.75');
  /* round-trip: the original trace ⇒ no file */
  const roundTrip = applyPonte(EX['14-3'], sl.steps, sl.steps.map(p => p.original), sl.orig);
  check(Object.keys(roundTrip.files).length === 0 && roundTrip.applied.length === 0, '14-3: the original trace must not arm anything');
  /* a second patch from scratch: 1.1 → 9.9, then (from scratch) → 4.4 ⇒ 4.4 */
  const e99 = applyPonte(EX['14-3'], sl.steps, withLine('14-3', 'speed_scale *= 1.1', 'speed_scale *= 9.9'), sl.orig);
  const e44 = applyPonte(EX['14-3'], sl.steps, withLine('14-3', 'speed_scale *= 1.1', 'speed_scale *= 4.4'), sl.orig);
  check(/self\.speedup_scale = 4\.4\b/.test(e44.files['settings.py']) && !/9\.9/.test(e44.files['settings.py']), '14-3: the second patch restarts from the original (4.4, not 9.9)');

  /* --- slot: 14-2 miss 3→5 ⇒ miss_limit 5 --- */
  const sl2 = slices['14-2'];
  const miss5 = applyPonte(EX['14-2'], sl2.steps, withLine('14-2', 'while miss < 3:', 'while miss < 5:'), sl2.orig);
  check(miss5.applied.length === 1 && /self\.miss_limit = 5\b/.test(miss5.files['settings.py']), '14-2: miss 3→5 must give miss_limit = 5');

  /* --- slot: 13-2 10→40 ⇒ offset_size 40 (x and y point to the same slot) --- */
  const sl13 = slices['13-2'];
  const scatter40 = applyPonte(EX['13-2'], sl13.steps, withLine('13-2', 'x = column * star_width + randint(-10, 10)', 'x = column * star_width + randint(-40, 40)'), sl13.orig);
  check(scatter40.applied.length === 1 && /offset_size = 40\b/.test(scatter40.files['stars_game.py']), '13-2: randint 10→40 must give offset_size = 40');

  /* --- slot: 14-1 K_p → K_x --- */
  const sl14 = slices['14-1'];
  const keyX = applyPonte(EX['14-1'], sl14.steps, withLine('14-1', 'if event.key == pygame.K_p:', 'if event.key == pygame.K_x:'), sl14.orig);
  check(keyX.applied.length === 1 && /event\.key == pygame\.K_x\)/.test(keyX.files['alien_invasion.py']) && !/K_p\b/.test(keyX.files['alien_invasion.py']), '14-1: K_p→K_x must replace the key in the project');

  /* --- slot: 14-8 points 10→50 --- */
  const sl18 = slices['14-8'];
  const points50 = applyPonte(EX['14-8'], sl18.steps, withLine('14-8', 'self.stats.score += 10', 'self.stats.score += 50'), sl18.orig);
  check(points50.applied.length === 1 && /self\.stats\.score \+= 50 \* len\(aliens\)/.test(points50.files['sideways_shooter.py']), '14-8: 10→50 must give score += 50 * len(aliens)');

  /* --- slot: 17-1 language and stars --- */
  const sl17 = slices['17-1'];
  const langStars = applyPonte(EX['17-1'], sl17.steps, withLine('17-1', 'url = "https://api.github.com/search/repositories?q=language:javascript+sort:stars+stars:>10000"', 'url = "https://api.github.com/search/repositories?q=language:rust+sort:stars+stars:>50000"'), sl17.orig);
  check(langStars.applied.length === 2, '17-1: two rules must apply (language + stars), applied: ' + langStars.applied.length);
  check(/language:rust/.test(langStars.files['javascript_repos.py']) && !/language:javascript/.test(langStars.files['javascript_repos.py']), '17-1: javascript→rust in the url');
  check(/stars:>50000/.test(langStars.files['javascript_repos.py']) && !/stars:>10000/.test(langStars.files['javascript_repos.py']), '17-1: 10000→50000 in the url');

  /* --- slot: speeds (12-4, 12-6, 13-3, 13-5) and lives (13-6) --- */
  const cases = [
    ['12-4', 'self.rect.y -= 2', 'self.rect.y -= 7', 'settings.py', /self\.rocket_speed = 7\b/],
    ['12-6', 'self.rect.x += 2', 'self.rect.x += 8', 'settings.py', /self\.bullet_speed = 8\b/],
    ['13-3', 'self.rect.y += 1', 'self.rect.y += 4', 'settings.py', /self\.raindrop_speed = 4\b/],
    ['13-5', 'self.rect.x -= 1', 'self.rect.x -= 9', 'settings.py', /self\.alien_speed = 9\b/],
    ['13-6', 'lives = 3', 'lives = 7', 'settings.py', /self\.ship_limit = 7\b/]
  ];
  for (const [id, line, newLine, file, re] of cases) {
    const sl = slices[id];
    const out = applyPonte(EX[id], sl.steps, withLine(id, line, newLine), sl.orig);
    check(out.applied.length >= 1 && re.test(out.files[file] || ''), `${id}: "${newLine}" must reach ${file} (${re})`);
  }

  /* --- slot: 14-4 labels Easy→Beginner ⇒ Button(self, "Beginner") ---
     (the "Easy" trace label targets the project's Easy button; the "Hard"
     trace label targets the project's Difficult button) --- */
  const sl4 = slices['14-4'];
  const easyOut = applyPonte(EX['14-4'], sl4.steps, withLine('14-4', 'easy_button = Button(ai_game, "Easy")', 'easy_button = Button(ai_game, "Beginner")'), sl4.orig);
  check(easyOut.applied.length === 1 && /Button\(self, "Beginner"\)/.test(easyOut.files['alien_invasion.py']) && !/Button\(self, "Easy"\)/.test(easyOut.files['alien_invasion.py']), '14-4: the Easy→Beginner label must reach the project\'s Easy button');
  const hardOut = applyPonte(EX['14-4'], sl4.steps, withLine('14-4', 'hard_button = Button(ai_game, "Hard")', 'hard_button = Button(ai_game, "Beginner")'), sl4.orig);
  check(hardOut.applied.length === 1 && /Button\(self, "Beginner"\)/.test(hardOut.files['alien_invasion.py']) && !/Button\(self, "Difficult"\)/.test(hardOut.files['alien_invasion.py']), '14-4: the Hard→Beginner label must reach the project\'s Difficult button');

  /* --- block: 14-6 _start_new_level (indented by 4, a single line changes) --- */
  const sl6 = slices['14-6'];
  const texts6 = withLine('14-6', 'self.stats.level += 1', 'self.stats.level += 2');
  const out6 = applyPonte(EX['14-6'], sl6.steps, texts6, sl6.orig);
  check(out6.applied.length === 1, '14-6: the block must apply');
  const ai6 = out6.files['alien_invasion.py'];
  check(/    def _start_new_level\(self\):/.test(ai6), '14-6: the replaced method must stay indented by 4');
  check(/        self\.stats\.level \+= 2/.test(ai6), '14-6: stats.level += 2 must be in the project (indented)');
  const method6 = /    def _start_new_level\(self\):[\s\S]*?(?=\n    def |\s*$)/.exec(ai6)[0];
  check(method6.includes('self.bullets.empty()') && method6.includes('self._create_fleet()') && method6.includes('self.settings.increase_speed()') && method6.includes('self.sb.prep_level()'), '14-6: the user block must contain all its lines');

  /* --- block: 15-5 get_step (choice([0,1,2,3,4]) → [0,1,2,3,4,5]) --- */
  const sl5 = slices['15-5'];
  const out5 = applyPonte(EX['15-5'], sl5.steps, withLine('15-5', 'distance = choice([0, 1, 2, 3, 4])', 'distance = choice([0, 1, 2, 3, 4, 5])'), sl5.orig);
  check(out5.applied.length === 1 && /    def get_step\(self\):/.test(out5.files['random_walk_refactored.py']), '15-5: get_step replaced (indented by 4)');
  check(/distance = choice\(\[0, 1, 2, 3, 4, 5\]\)/.test(out5.files['random_walk_refactored.py']), '15-5: the edited distances must be in the project');
  check(/x_step = self\.get_step\(\)/.test(out5.files['random_walk_refactored.py']), '15-5: the rest of the file must stay intact');

  /* --- block: 11-2 function + test --- */
  const sl11 = slices['11-2'];
  const texts11 = sl11.steps.map(p => p.original === sl11.steps[0].original
    ? p.original.replace('population=None', 'population=None')   // unchanged
    : p.original.replace('5000000', '9000000'));
  const out11 = applyPonte(EX['11-2'], sl11.steps, texts11, sl11.orig);
  check(out11.applied.length === 1, '11-2: only the edited test must apply');
  check(/9000000/.test(out11.files['test_cities.py']) && !/9000000/.test(out11.files['city_functions_pop_optional.py'] || ''), '11-2: the edited test goes into test_cities.py');
  check(/from city_functions_pop_optional import city_country/.test(out11.files['test_cities.py']), '11-2: the imports of the test file must stay');

  /* --- block: 9-9 upgrade_battery --- */
  const sl9 = slices['9-9'];
  const texts9 = withLine('9-9', 'self.battery_size = 65', 'self.battery_size = 100');
  const out9 = applyPonte(EX['9-9'], sl9.steps, texts9, sl9.orig);
  check(out9.applied.length === 1, '9-9: the method must apply');
  check(/    def upgrade_battery\(self\):/.test(out9.files['battery_upgrade.py']) && /self\.battery_size = 100\b/.test(out9.files['battery_upgrade.py']), '9-9: the method indented with the edit');
  check(/class ElectricCar\(Car\):/.test(out9.files['battery_upgrade.py']), '9-9: the rest of the class must stay');

  /* --- program: 8-15 and 12-1 --- */
  const sl8 = slices['8-15'];
  const texts8 = withLine('8-15', 'unprinted_designs = ["phone case", "robot pendant"]', 'unprinted_designs = ["phone case", "robot pendant", "wallet"] ');
  const out8 = applyPonte(EX['8-15'], sl8.steps, texts8, sl8.orig);
  check(out8.applied.length === 1 && out8.files['printing_models.py'] === texts8.join('\n'), '8-15: the edited program replaces printing_models.py in full');
  const sl1 = slices['12-1'];
  const texts1 = withLine('12-1', 'screen.fill((0, 0, 255))', 'screen.fill((255, 0, 0))');
  const out1 = applyPonte(EX['12-1'], sl1.steps, texts1, sl1.orig);
  check(out1.applied.length >= 1 && out1.files['blue_sky_game.py'] === texts1.join('\n'), '12-1: the edited game replaces blue_sky_game.py in full');

  /* --- no-rules: 12-2, 13-1, 14-5, 17-3 --- */
  for (const id of ['12-2', '13-1', '14-5', '17-3']) {
    const sl = slices[id];
    check(sl.rules.length === 0, `${id}: expected NO rules (conceptual trace)`);
    const out = applyPonte(EX[id], sl.steps, sl.steps.map((p, k) => p.original + (k === 0 ? '\n# a touch' : '')), sl.orig);
    check(Object.keys(out.files).length === 0, `${id}: no edit may apply without rules`);
  }

  /* --- changed structure: a line added ⇒ slot skipped + flag --- */
  const textsStr = sl.steps.map((p, k) => k === 0 ? p.original + '\nspeed_scale = 2.0' : p.original);
  const outStr = applyPonte(EX['14-3'], sl.steps, textsStr, sl.orig);
  check(outStr.structure === true && Object.keys(outStr.files).length === 0, '14-3: a line added ⇒ structure true, slot skipped, no file');

  /* --- slot not found in the project (a different file) ⇒ notApplied, no crash --- */
  const savedOrig = sl.orig['settings.py'];
  sl.orig['settings.py'] = 'print("other")';
  const outNP = applyPonte(EX['14-3'], sl.steps, withLine('14-3', 'speed_scale *= 1.1', 'speed_scale *= 3.5'), sl.orig);
  check(outNP.notApplied.length === 1 && Object.keys(outNP.files).length === 0, '14-3: slot not found ⇒ notApplied, no file, no crash');
  sl.orig['settings.py'] = savedOrig;
}

console.log(fail === 0 ? `\n✅ LINES + BRIDGE OK (${SOL_IDS.length} 'sol' exercises, ${Object.keys(PONTE).length} with a bridge, ${Object.values(PONTE).reduce((a, r) => a + r.length, 0)} rules${warn ? `, ${warn} warnings` : ''})` : `\n❌ ${fail} problems (${warn} warnings)`);
process.exit(fail === 0 ? 0 : 1);
