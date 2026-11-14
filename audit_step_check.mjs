#!/usr/bin/env node
/* ============================================================
 * audit_step_check.mjs — step-checker consistency audit
 * ------------------------------------------------------------
 * Invariant under test: the official parachute of every step
 * (field `c` in data/exercises.js) must pass its own
 * checkStep() (field `re`, or normalized comparison against `c`).
 * If the parachute itself does not pass, no student can pass
 * the step "by transcribing the parachute".
 *
 * Usage (from the tutor project root):
 *   node audit_step_check.mjs            → summary + list of broken steps
 *   node audit_step_check.mjs --dettaglio → also show the failing line/regex
 *   (the --dettaglio flag is the one wired in the package.json scripts)
 *
 * Exit code: 0 = all consistent · 1 = some steps are inconsistent (CI-ready).
 *
 * Note: importing ES modules with a .js extension requires the root
 * to contain a package.json with { "type": "module" } (inert for the
 * browser app).
 * ============================================================ */
import { EX } from './data/exercises.js';
import { righeUtenteRaw, righeUtenteConCommenti, checkStep } from './engine/tutor.js';

const detail = process.argv.includes('--dettaglio');

/* Replicates exactly the preparation of the user lines used by
 * doVerify() in app.js: tab→4 spaces, comments stripped, empty lines
 * excluded from the edges, left indentation trimmed. */
function prep(raw, s) {
  return (s && s.raw ? righeUtenteConCommenti : righeUtenteRaw)(raw || '')
    .map(l => l.trim()).filter(Boolean);
}

const problems = [];
let totalSteps = 0, totalExercises = 0;

for (const [id, e] of Object.entries(EX)) {
  totalExercises++;
  (e.steps || []).forEach((s, i) => {
    if (!s.c) return;               // exploratory steps: no code to verify
    totalSteps++;
    const lines = prep(s.c, s);
    const res = checkStep(s, lines);
    if (!res.ok) {
      const entry = { id, step: i + 1, lines: lines.length, msg: res.msg };
      if (detail) {
        // First line / regex that does not match (single variant only)
        let variants = [];
        if (typeof s.re === 'string') variants = [[s.re]];
        else if (Array.isArray(s.re)) variants = Array.isArray(s.re[0]) ? s.re : [s.re];
        const v = variants[0] || [];
        for (let k = 0; k < Math.min(v.length, lines.length); k++) {
          if (!new RegExp(v[k]).test(lines[k])) {
            entry.line = k + 1;
            entry.code = lines[k];
            entry.regex = v[k];
            break;
          }
        }
      }
      problems.push(entry);
    }
  });
}

console.log(`Exercises: ${totalExercises} · Steps with code: ${totalSteps} · Broken steps: ${problems.length}\n`);
for (const p of problems) {
  console.log(`❌ ${p.id} step ${p.step} (${p.lines} parachute lines) → ${p.msg}`);
  if (p.line) {
    console.log(`     line ${p.line}: ${JSON.stringify(p.code)}`);
    console.log(`     regex: ${p.regex}`);
  }
}
if (!problems.length) console.log('✅ Every official parachute passes its own checker.');

process.exitCode = problems.length ? 1 : 0;
