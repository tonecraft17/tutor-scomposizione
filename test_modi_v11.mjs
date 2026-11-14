/* Test v11 · classification of the Code editor modes (see CHANGELOG-v11.md)
   Run: node test_modi_v11.mjs (from this folder, Node >= 18) */
/* Test v11 · classification of the Code editor modes
   Replicates EXACTLY the logic of app.js (modoCodice) using the real data:
   - EX/ORDER/codiceEsercizio from data/exercises.js
   - SOLUTIONS_INDEX from data/solutions-index.js
   Verifies:
   1. the mode table for all the exercises (with counts);
   2. the explicit expectations: the 12-x/13-x/14-x games and the fragments = 'sol',
      the standalone exercises = 'step', the multi-file ones = 'files';
   3. no 'sol' exercise without an entry/file in the database. */
import { EX, ORDER, codiceEsercizio } from './data/exercises.js';
import fs from 'fs';

const idxSrc = fs.readFileSync(new URL('./data/solutions-index.js', import.meta.url), 'utf8');
const SOLUTIONS_INDEX = JSON.parse(idxSrc.slice(idxSrc.indexOf('{'), idxSrc.lastIndexOf('}') + 1));

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
function solIdxOk(e) {
  const si = SOLUTIONS_INDEX[e.id];
  return !!si && (si.mode === 'run' || si.mode === 'pytest') && !!si.entry;
}
function armedCode(st) {
  if (typeof st.customCode === 'string') return true;
  return !!(st.customFiles && Object.keys(st.customFiles).length);
}
/* codeMode — replicates app.js modoCodice */
function codeMode(e, st, progress) {
  if (Array.isArray(e.files) && e.files.length) return 'files';
  if (armedCode(st)) return st.customMode === 'sol' ? 'sol' : 'step';
  if (st.studentOut === true) return 'step';
  if (!solIdxOk(e)) return 'step';
  const draft = draftProgram(e);
  const passed = codiceEsercizio(e, st, { progress, includePrereq: st.prereq !== false });
  return (OUT_RE.test(draft) || OUT_RE.test(passed)) ? 'step' : 'sol';
}

const progress = {};
const st0 = () => ({ solved: 0, assist: {}, notes: {}, outputs: [], lines: {}, runs: [] });
const modes = {};
let fail = 0;
const check = (id, expected, why) => {
  const e = EX[id];
  const m = codeMode(e, st0(), progress);
  if (m !== expected) { console.log(`✗ ${id}: mode '${m}', expected '${expected}' — ${why}`); fail++; }
};
ORDER.forEach(id => {
  const m = codeMode(EX[id], st0(), progress);
  (modes[m] = modes[m] || []).push(id);
});
Object.entries(modes).forEach(([m, ids]) => console.log(`mode '${m}': ${ids.length} → ${ids.join(' ')}`));

// --- explicit expectations ---
// Pygame games and project fragments → 'sol'
['12-1','12-2','12-4','12-6','13-1','13-2','13-3','13-4','13-5','13-6','14-1','14-2','14-3','14-4','14-5','14-6','14-8','9-9','11-2','15-5','17-1','17-3','8-15'].forEach(id => check(id, 'sol', 'fragment of a bigger program'));
// standalone exercises (the step program prints on its own) → 'step'
['2-1','3-1','4-1','5-1','6-1','7-1','8-1','9-1','10-1','12-5','15-1','15-2','16-1','16-9','17-2'].forEach(id => check(id, 'step', 'standalone program'));
// multi-file → 'files'
['9-10','9-11','9-12','11-1','11-3'].forEach(id => check(id, 'files', 'multi-file exercise'));
// noRun → no editor (in renderCodice): verified only indirectly

// every 'sol' must have a valid entry in the index
modes.sol.forEach(id => {
  const si = SOLUTIONS_INDEX[id];
  if (!si || !si.entry) { console.log(`✗ ${id}: mode 'sol' but no entry in the database`); fail++; }
  else if (si.mode !== 'run' && si.mode !== 'pytest') { console.log(`✗ ${id}: mode 'sol' but database mode '${si.mode}'`); fail++; }
});

// armed override in 'sol' mode → stays 'sol' (freeze)
{
  const st = Object.assign(st0(), { customFiles: { 'settings.py': 'x = 1' }, customMode: 'sol' });
  if (codeMode(EX['14-3'], st, progress) !== 'sol') { console.log('✗ freeze: a sol override must stay sol'); fail++; }
  const st2 = Object.assign(st0(), { customCode: 'print(1)', customMode: 'step' });
  if (codeMode(EX['14-3'], st2, progress) !== 'step') { console.log('✗ freeze: a step override must stay step'); fail++; }
}
// learned studentOut → 'step' even for an idle 'sol' exercise
{
  const st = Object.assign(st0(), { studentOut: true });
  if (codeMode(EX['14-3'], st, progress) !== 'step') { console.log('✗ studentOut=true must give step'); fail++; }
}

console.log(fail === 0 ? `\n✅ MODE CLASSIFICATION OK (${ORDER.length} exercises: ${modes.step?.length || 0} step, ${modes.files?.length || 0} files, ${modes.sol?.length || 0} sol)` : `\n❌ ${fail} problems`);
process.exit(fail === 0 ? 0 : 1);
