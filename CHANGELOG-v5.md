# Package v5 — tutor-scomposizione-esm-soluzioni

Date: 2026-11-08 · Based on: v4 (2026-11-07)

## Summary

- **36 steps fixed across 23 exercises**: all the ones the v4 audit flagged
  as inconsistent (no student could pass them, or only by writing code
  different from the displayed hint). Includes the previously prepared 16-9
  «Incendi nel mondo» fix, now integrated.
- New **`raw`** option in the engine: steps whose target is a comment
  (2-11 «Aggiungere commenti») now really verify comments, which were
  previously stripped before the check.
- Audit included, CI-ready: **199 exercises · 485 steps with code · 0
  inconsistent** (every official hint passes its own verifier).
- Flexibility tests: **31/31** cases as expected on the v5 fixes + 8 for 16-9.

## What changed compared to v4 (file by file)

| File | Status | What |
|---|---|---|
| `data/exercises.js` | ★ modified | 36 `re:` blocks rewritten and aligned with the hints |
| `engine/tutor.js` | ★ modified | new `righeUtenteConCommenti()` for the `raw` steps |
| `app.js` | ★ modified | `doVerify()` uses the non-stripped lines on `raw` steps |
| `audit_step_check.mjs` | new | CI-ready audit (exit 0/1), replicates `doVerify()` |
| `test_flessibilita.mjs` | new | 16-9 regex test, steps 5 and 6 |
| `test_flessibilita_v5.mjs` | new | 31 flexibility tests on the v5 fixes |
| `package.json` | new | only to run the audits (inert for the browser) |
| `CHANGELOG-v5.md` | new | this file |
| 11 other files | unchanged | byte-identical to v4 |

## The 5 classes of bugs fixed

**A · `^\s+` anchors incompatible with the trim.** `doVerify()` (app.js) trims
the indentation of every line before calling `checkStep()`: regexes that
started with `^\s+` never matched. Affected: 15-6, 15-7, 15-8, 16-2, 16-4,
16-6, 16-7, 16-9, 17-2. → Anchors removed.

**B · Hint lines without a regex.** The check requires the number of lines to
equal the number of regexes: wherever the hint had more lines than the
regexes (docstrings, `append`, matplotlib/plotly arguments, dictionaries
over multiple lines), the step was either unpassable or passable only
"halfway". Affected: 8-1, 16-1, 16-2, 16-4, 16-6, 16-7, 16-9, 17-2. → One
regex for each line of the hint.

**C · Steps that verify a comment.** `righeUtenteRaw()` strips comments:
steps whose target IS a comment (2-11 p1/p2) were unpassable, and 21-2 p1
counted one extra line. → New `raw: true` option on the step: `doVerify()`
uses `righeUtenteConCommenti()`; for 21-2 the comment line became optional
(regex removed, the hint still shows it).

**D · `\n` inside single-line regexes.** In 6-3 p2 and 6-4 p3 the regex
contained a `\n` (newline) instead of the literal backslash-n of the hint's
print. → Fixed the escaping (`\\\\n` at source level).

**E · Overly strict regexes.** Cases where the hint itself did not match:
value after the last key of the dictionary (8-7, 8-8, 8-14), method inside
the f-string `{self.x.title()}` (9-3), chains of 2 components instead of 3
(9-7, 22-4), Django property without parentheses (20-4), trailing comma
inside `urlpatterns` (18-6). → Generalized regexes (`(\.\w+)+`, `,?`,
`(\(\))?`, …).

The regexes remain deliberately flexible: any variable names (`\w+`),
single or double quotes, space or tab indentation, comments and blank lines
tolerated (via `righeUtenteRaw`).

## How to verify (Node ≥ 18)

```bash
npm run audit          # 199 exercises · 485 steps · 0 inconsistent (exit 0)
npm run audit:dettaglio
npm run test:16-9      # 16-9 fix (previous session)
npm run test:v5        # 31 flexibility tests on the v5 fixes
npm test               # everything together
```

In the flexibility tests the last cases of some sections are **negative by
design** (incomplete code or missing lines): the output shows the expected
`✗ FAIL`.

## Deployment notes

- `package.json`, `audit_step_check.mjs`, `test_flessibilita*.mjs` and this
  changelog are not needed by the browser app: they can be excluded from
  the deploy.
- If you unpack the package over a project that already has its own
  `package.json`, do not overwrite it: it is enough to add `"type": "module"`
  to run the audits.
- No learning content was rewritten: prompts, hints and tips are the same as
  in v4 (only the verifiers changed); the only content-level exceptions are
  minimal: 2-11 p1/p2 now also save the comment in the accumulated script,
  and 21-2 p1 no longer requires the `# .gitignore` comment.
