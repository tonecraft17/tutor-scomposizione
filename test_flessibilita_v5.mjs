// Flexibility test for the FIXED regexes in v5 (besides 16-9, already
// covered by test_flessibilita.mjs): legitimate variants of the student
// code must pass; negative cases (missing lines / wrong content) must
// fail. Includes the `raw` steps (2-11), where the comment IS the step.
import { EX } from './data/exercises.js';
import { righeUtenteRaw, righeUtenteConCommenti, checkStep } from './engine/tutor.js';

function prep(raw, s) {
  return (s && s.raw ? righeUtenteConCommenti : righeUtenteRaw)(raw || '')
    .map(l => l.trim()).filter(Boolean);
}

let pass = 0, fail = 0;
function verify(id, stepIdx, code, label, mustPass = true) {
  const s = EX[id].steps[stepIdx];
  const res = checkStep(s, prep(code, s));
  const ok = (res.ok === mustPass);
  if (ok) pass++; else fail++;
  const note = mustPass ? '' : '  [expected: fail]';
  console.log(`${res.ok ? '✓ PASS' : '✗ FAIL  '} · ${id} p${stepIdx + 1} · ${label}${ok ? '' : note}`);
}

// ---- 2-11 · raw steps: the comment is the subject of the step ----
verify('2-11', 0, '# Any comment with a name and a date', 'free comment (raw)');
verify('2-11', 0, 'print("hello")', 'code instead of a comment', false);
verify('2-11', 1, '# Describe the program\nprint("Hello Python!")', 'comment + print (raw)');
verify('2-11', 1, 'print("Hello Python!")', 'print only, without a comment', false);

// ---- 6-3 p2 / 6-4 p3 · literal backslash-n in the print ----
verify('6-3', 1, 'for k, v in d.items():\n    print(f"{k}: {v}\\n")', 'different names + literal \\n');
verify('6-3', 1, 'for term, meaning in glossary.items():\n    print(f"{term}: {meaning}\\n")', 'identical to the parachute');

// ---- 8-1 p1 · docstring ----
verify('8-1', 0, 'def display_message():\n    """A different docstring."""\n    print("Functions!")', 'a different docstring');
verify('8-1', 0, 'def display_message():\n    print("Functions!")', 'without docstring (3 lines required)', false);

// ---- 8-7 p1 · value after the last dict key ----
verify('8-7', 0, 'def make_album(a, t, n_tracks=None):\n    record = {"artist": a, "album_title": t}\n    if n_tracks:\n        record["songs"] = n_tracks\n    return record', 'different variable names');

// ---- 9-3 p1 · method inside the f-string ----
verify('9-3', 0, `class Person:
    def __init__(self, name, surname, years, town):
        self.name = name
        self.surname = surname
        self.years = years
        self.town = town
    def describe(self):
        print(f"{self.name} {self.surname}, {self.years} years old, {self.town}")
    def hello(self):
        print(f"Hi {self.name.title()}!")`, 'different names + .title()');

// ---- 9-7 p2 · chain of 2 components ----
verify('9-7', 1, 'a = Admin("maria", "rossi", 30, "Rome")\na.show_privileges()', 'a.show_privileges()');

// ---- 15-6 p1 / 15-7 p2 · tab indentation and different names ----
verify('15-6', 0, 'from die import Die\nd1 = Die(8)\nd2 = Die(8)\nrolls = []\nfor i in range(1000):\n\ttotal = d1.roll() + d2.roll()\n\trolls.append(total)', 'tabs + different names');
verify('15-7', 1, 'results = []\nfor i in range(1000):\n    total = d1.roll() + d2.roll() + d3.roll()\n    results.append(total)', 'three dice, different names');

// ---- 16-1 p7 · set_xlabel and tick_params now verified ----
verify('16-1', 6, `ax.set_title("Daily rainfall, 2021", fontsize=24)
ax.set_xlabel('', fontsize=16)
fig.autofmt_xdate()
ax.set_ylabel("Precipitation (inches)", fontsize=16)
ax.tick_params(labelsize=16)
plt.show()`, 'identical to the parachute');
verify('16-1', 6, `ax.set_title("Title", fontsize=24)
ax.set_xlabel("Date", fontsize=16)
fig.autofmt_xdate()
ax.set_ylabel("Y", fontsize=16)
ax.tick_params(labelsize=16)
plt.show()`, 'different labels');

// ---- 16-2 p2/p3 · docstring + complete lines ----
verify('16-2', 1, `def get_weather_data(path, dates, highs, lows, di, hi, li):
    """Read the weather data."""
    lines = path.read_text().splitlines()
    reader = csv.reader(lines)
    header_row = next(reader)`, 'docstring + different index names');
verify('16-2', 2, `for row in reader:
    current_date = datetime.strptime(row[date_index], '%Y-%m-%d')
    try:
        high = int(row[tmax_index])
        low = int(row[tmin_index])
    except ValueError:
        print(f"Missing data for {current_date}")
    else:
        dates.append(current_date)
        highs.append(high)
        lows.append(low)`, '11 complete lines');

// ---- 16-4 p7 · different names ----
verify('16-4', 6, `try:
    hi = int(row[i_tmax])
    lo = int(row[i_tmin])
except ValueError:
    print(f"No data for {d}")
else:
    days.append(d)
    tmax.append(hi)
    tmin.append(lo)`, 'different names');

// ---- 16-6 p6 · labels now verified ----
verify('16-6', 5, `title = 'Global Earthquakes'
fig = px.scatter_geo(lat=lats, lon=lons, size=mags, title=title,
        color=mags,
        color_continuous_scale='Viridis',
        labels={'color': 'Magnitude'},
        projection='natural earth',
        hover_name=eq_titles,
    )
fig.show()`, 'identical to the parachute');
verify('16-6', 5, `fig = px.scatter_geo(lat=lats, lon=lons, size=mags, title=title,
        color=mags,
        color_continuous_scale='Viridis',
        projection='natural earth',
        hover_name=eq_titles,
    )
fig.show()`, 'without labels (9 lines required)', false);

// ---- 16-7 p6 · scale and labels ----
verify('16-7', 5, `fig = px.scatter_geo(lat=lats, lon=lons, size=mags, title=title,
        color=mags,
        color_continuous_scale='Inferno',
        labels={'color': 'Magnitude'},
        projection='natural earth',
        hover_name=eq_titles,
    )`, 'different scale + labels');

// ---- 17-2 p3/p6 · dictionary across several lines ----
verify('17-2', 2, `ids = r.json()
dicts = []
for sid in ids[:10]:
    url = f"https://hacker-news.firebaseio.com/v0/item/{sid}.json"
    r = requests.get(url)
    print(f"id: {sid} status: {r.status_code}")
    rd = r.json()
    try:
        sd = {
            'title': rd['title'],
            'hn_link': f"https://news.ycombinator.com/item?id={sid}",
            'comments': rd['descendants'],
        }
    except KeyError:
        continue
    else:
        dicts.append(sd)`, 'different names (17 lines)');
verify('17-2', 5, `fig.update_layout(title="Most Active Discussions on Hacker News",
        xaxis_title="Article", yaxis_title="Number of comments")
fig.update_traces(marker_color="SteelBlue", marker_opacity=0.6)
fig.show()`, 'identical to the parachute');

// ---- 18-6 p2 · optional trailing comma ----
verify('18-6', 1, 'urlpatterns = [\n    path("", views.index, name="index"),\n]', 'with trailing comma');
verify('18-6', 1, 'urlpatterns = [\n    path("", views.index, name="index")\n]', 'without trailing comma');

// ---- 20-4 p3 · is_authenticated is a property ----
verify('20-4', 2, `if request.user.is_authenticated:
    topics = Topic.objects.filter(owner=request.user).order_by("date_added")
else:
    topics = Topic.objects.filter(public=True).order_by("date_added")`, 'without parentheses (property)');
verify('20-4', 2, `if request.user.is_authenticated():
    topics = Topic.objects.filter(owner=request.user).order_by("date_added")
else:
    topics = Topic.objects.filter(public=True).order_by("date_added")`, 'with parentheses (tolerated)');

// ---- 21-2 p1 · the comment is now optional ----
verify('21-2', 0, '# .gitignore\n__pycache__/\n*.sqlite3', 'with comment');
verify('21-2', 0, '__pycache__/\n*.sqlite3', 'without comment');

// ---- 22-4 p1/p2 · config.is_valid_platform() ----
verify('22-4', 0, 'if config.is_valid_platform():\n    ALLOWED_HOSTS.append("platform.sh.site")', 'chain of 2 components');
verify('22-4', 1, 'if config.is_valid_platform():\n    ALLOWED_HOSTS.append("platform.sh.site")\n    DEBUG = False', 'three lines');

console.log(`\n${pass} of ${pass + fail} · ${fail === 0 ? '✅ ALL CASES AS EXPECTED' : '❌ ' + fail + ' case(s) out of expectation'}`);
process.exitCode = fail ? 1 : 0;
