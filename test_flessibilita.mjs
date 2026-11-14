// Flexibility test for the FIXED regexes of 16-9 (steps 5 and 6):
// student code must pass even with different names, different quotes,
// tabs instead of spaces, comments and empty lines. Negative cases
// (incomplete code / missing line) must be REJECTED by checkStep.
import { EX } from './data/exercises.js';
import { righeUtenteRaw, checkStep } from './engine/tutor.js';

function prep(raw) { return righeUtenteRaw(raw || '').map(l => l.trim()).filter(Boolean); }
let successes = 0, total = 0;
function verify(stepIdx, code, label) {
  total++;
  const s = EX['16-9'].steps[stepIdx];
  const res = checkStep(s, prep(code));
  console.log(`${res.ok ? '✓ PASS' : '✗ FAIL  '} · ${label}${res.ok ? '' : ' → ' + res.msg}`);
  if (res.ok) successes++;
  return res.ok;
}
function verifyNeg(stepIdx, code, label, msgFragment) {
  total++;
  const s = EX['16-9'].steps[stepIdx];
  const res = checkStep(s, prep(code));
  const ok = !res.ok && (!msgFragment || String(res.msg || '').includes(msgFragment));
  console.log(`${ok ? '✓ PASS (rejected as expected)' : '✗ FAIL  '} · ${label}` +
    (res.ok ? ' → accepted, but it had to be rejected!' :
      (!ok ? ` → unexpected message: ${res.msg}` : ` → ${res.msg}`)));
  if (ok) successes++;
  return ok;
}

// ---------- STEP 5 ----------
console.log('── STEP 5 (coordinate extraction) ──');
const p5_parachute = `lats, lons, brights = [], [], []
for row in reader:
    try:
        lat = float(row[lat_idx])
        lon = float(row[lon_idx])
        bright = float(row[bright_idx])
    except ValueError:
        print(f"Invalid data for {row[5]}")
    else:
        lats.append(lat)
        lons.append(lon)
        brights.append(bright)`;

verify(4, p5_parachute, 'identical to the parachute');

verify(4, `xs, ys, bs = [], [], []
for r in rdr:
    try:
        x = float(r[i_lat])
        y = float(r[i_lon])
        b = float(r[i_bright])
    except ValueError:
        print("skipped row")
    else:
        xs.append(x)
        ys.append(y)
        bs.append(b)`, 'completely different names + different print');

verify(4, `lats, lons, brights = [], [], []   # three empty lists
for row in reader:

    try:
        lat = float(row[lat_idx])
        lon = float(row[lon_idx])
        bright = float(row[bright_idx])
    except ValueError:
        # invalid row: skip it
        print(f"Invalid data for {row[5]}")
    else:
        lats.append(lat)
        lons.append(lon)
        brights.append(bright)`, 'with comments and an inner empty line');

verify(4, p5_parachute.replace(/    /g, '\t'), 'tab indentation');

verify(4, `lats, lons, brights = [], [], []
for row in reader:
try:
lat = float(row[lat_idx])
lon = float(row[lon_idx])
bright = float(row[bright_idx])
except ValueError:
print(f"Invalid data for {row[5]}")
else:
lats.append(lat)
lons.append(lon)
brights.append(bright)`, 'no indentation (conRientro adds it on save)');

verifyNeg(4, `lats, lons, brights = [], [], []
for row in reader:
    try:
        lat = float(row[lat_idx])
        lon = float(row[lon_idx])
        bright = float(row[bright_idx])
    except ValueError:
        print(f"Invalid data for {row[5]}")
    else:`, 'INCOMPLETE version like the student one → must give the line-count error', 'lines of code');

// ---------- STEP 6 ----------
console.log('\n── STEP 6 (map creation) ──');
verify(5, `fig = px.scatter_geo(lat=lats, lon=lons, size=brights, color=brights, title="Global Fires",
        color_continuous_scale='YlOrRd')`, 'identical to the parachute');

verify(5, `chart = px.scatter_geo(lat=lats, lon=lons, size=brights, color=brights, title="Fires Around the World",
    color_continuous_scale="YlOrRd")`, 'different variable name + double quotes on the scale');

verify(5, `fig = px.scatter_geo(lat=lats, lon=lons, size=brights, color=brights, title="Global Fires",
        color_continuous_scale='Inferno')`, 'different scale (\\w+)');

verifyNeg(5, `fig = px.scatter_geo(lat=lats, lon=lons, size=brights, color=brights,
        title="Global Fires")`, 'without color_continuous_scale → must be rejected (line 2 missing)', 'content does not match');

console.log(`\n${successes} of ${total} · ${successes === total ? '✅ ALL CASES AS EXPECTED' : '❌ UNSATISFIED CASES'}`);
process.exit(successes === total ? 0 : 1);
