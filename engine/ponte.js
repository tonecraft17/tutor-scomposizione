/* ============================================================
   ENGINE/PONTE · the bridge between the exercise lines and the
   complete project («✎ Lines» panel, 'sol' mode)
   ------------------------------------------------------------
   Some exercises (those in 'sol' mode: 14-3 «Challenging Target
   Practice», the Ch. 12–14 games, the tests…) are fragments of a
   bigger project: the «exercise completed» lines are the
   conceptual TRACE, while the real program (the one that runs in
   the runtime) is the project from the local database, where the
   trace lives in full form (e.g. `speed_scale *= 1.1` →
   `self.speedup_scale = 2.1` in settings.py).

   The «✎ Lines» panel shows ONLY the trace lines; for editing
   them to really change the output, this bridge tells HOW each
   trace line/value maps onto the project.

   Three rule types (per exercise: PONTE[id] = [rule…]):
   - { tipo:'slot', riga, file, da, slot, nota }
       `riga` = the ORIGINAL trace line (string or array);
       `da`   = regex with ONE group capturing the value in the
                trace line (number, key, label…);
       `slot` = regex with ONE group capturing the same value
                in the project's `file`.
       If the user changes the value captured by `da`, the value
       captured by `slot` in the project is replaced with theirs.
       E.g. 14-3: `speed_scale *= 1.1` → `self.speedup_scale = 2.1`.
   - { tipo:'scala', riga, file, da, slot, nota }
       like `slot`, but the captured value is a FACTOR: the value
       in the project becomes original × factor. Used when the
       trace line is a speed factor that multiplies base values
       in the project: e.g. 14-3 `speed_scale = 10` → the starting
       speeds of initialize_dynamic_settings (ship 3.0, bullets
       12.0, target 1.5 → ×10). If the line appears more than
       once in the trace (start and reset), the first occurrence
       whose value changed drives it.
   - { tipo:'blocco', passo, file, cerca, rientro, nota }
       the edited block of step `passo` (index of the step in
       e.steps) replaces the block `cerca` in file `file`
       (re-indented by `rientro` spaces: traces are at column 0).
   - { tipo:'programma', file, nota }
       the whole trace (all edited steps, in order) IS a
       complete program: it replaces the project's `file`.

   The rules are DATA (serializable, verified by the
   test_righe_v12.mjs test: every regex must find the real file).
   An exercise without rules shows only the module reference:
   the trace stays conceptual (noted in the panel).
   ============================================================ */

export const PONTE = {
  /* ---- ch. 8 · functions ---- */
  '8-15': [
    { tipo: 'programma', file: 'printing_models.py',
      nota: 'your trace IS the program: it replaces printing_models.py (printing_functions.py stays from the project)' }
  ],

  /* ---- ch. 9 · classes ---- */
  '9-9': [
    { tipo: 'blocco', passo: 1, file: 'battery_upgrade.py', rientro: 4,
      cerca: 'def upgrade_battery\\(self\\):[\\s\\S]*?(?=\\nclass )',
      nota: 'your upgrade_battery replaces the method of the Battery class' }
  ],

  /* ---- ch. 11 · pytest ---- */
  '11-2': [
    { tipo: 'blocco', passo: 0, file: 'city_functions_pop_optional.py', rientro: 0,
      cerca: 'def city_country\\([\\s\\S]*$',
      nota: 'your city_country replaces the function in city_functions_pop_optional.py' },
    { tipo: 'blocco', passo: 1, file: 'test_cities.py', rientro: 0,
      cerca: 'def test_city_country_population\\(\\):[\\s\\S]*$',
      nota: 'your test replaces test_city_country_population in test_cities.py' }
  ],

  /* ---- ch. 12 · first windows ---- */
  '12-1': [
    { tipo: 'programma', file: 'blue_sky_game.py',
      nota: 'your trace IS the game: it replaces blue_sky_game.py' }
  ],
  '12-4': [
    { tipo: 'slot', file: 'settings.py',
      riga: ['self.rect.y -= 2', 'self.rect.y += 2', 'self.rect.x -= 2', 'self.rect.x += 2'],
      da: '[+\\-*]=\\s*([\\d.]+)',
      slot: 'self\\.rocket_speed\\s*=\\s*([\\d.]+)',
      nota: 'the rocket speed lives in settings.py (rocket_speed)' }
  ],
  '12-6': [
    { tipo: 'slot', file: 'settings.py',
      riga: 'self.rect.x += 2',
      da: '\\+=\\s*([\\d.]+)',
      slot: 'self\\.bullet_speed\\s*=\\s*([\\d.]+)',
      nota: 'the bullet speed lives in settings.py (bullet_speed)' }
  ],

  /* ---- ch. 13 · sprites ---- */
  '13-2': [
    { tipo: 'slot', file: 'stars_game.py',
      riga: ['x = column * star_width + randint(-10, 10)',
             'y = row * star_height + randint(-10, 10)'],
      da: 'randint\\(-\\d+,\\s*(\\d+)\\)',
      slot: 'offset_size\\s*=\\s*(\\d+)',
      nota: 'the star scatter lives in stars_game.py (offset_size: one value for x and y)' }
  ],
  '13-3': [
    { tipo: 'slot', file: 'settings.py',
      riga: 'self.rect.y += 1',
      da: '\\+=\\s*([\\d.]+)',
      slot: 'self\\.raindrop_speed\\s*=\\s*([\\d.]+)',
      nota: 'the rain speed lives in settings.py (raindrop_speed)' }
  ],
  '13-4': [
    { tipo: 'slot', file: 'settings.py',
      riga: 'self.rect.y += 1',
      da: '\\+=\\s*([\\d.]+)',
      slot: 'self\\.raindrop_speed\\s*=\\s*([\\d.]+)',
      nota: 'the rain speed lives in settings.py (raindrop_speed); the project repositions to the top on new lines' }
  ],
  '13-5': [
    { tipo: 'slot', file: 'settings.py',
      riga: 'self.rect.x -= 1',
      da: '-=\\s*([\\d.]+)',
      slot: 'self\\.alien_speed\\s*=\\s*([\\d.]+)',
      nota: 'the alien speed lives in settings.py (alien_speed)' }
  ],
  '13-6': [
    { tipo: 'slot', file: 'settings.py',
      riga: 'lives = 3',
      da: '=\\s*(\\d+)',
      slot: 'self\\.ship_limit\\s*=\\s*(\\d+)',
      nota: 'the lives live in settings.py (ship_limit); this project does not track the score yet' }
  ],

  /* ---- ch. 14 · alien invasion and target practice ---- */
  '14-1': [
    { tipo: 'slot', file: 'alien_invasion.py',
      riga: 'if event.key == pygame.K_p:',
      da: 'pygame\\.(K_\\w+)',
      slot: '\\(event\\.key == pygame\\.(K_p)\\)',
      nota: 'the play key lives in alien_invasion.py (the project listens for the other keys too: everything else stays as is)' }
  ],
  '14-2': [
    { tipo: 'slot', file: 'settings.py',
      riga: 'while miss < 3:',
      da: '<\\s*(\\d+)',
      slot: 'self\\.miss_limit\\s*=\\s*(\\d+)',
      nota: 'the allowed misses live in settings.py (miss_limit)' }
  ],
  '14-3': [
    { tipo: 'scala', file: 'settings.py',
      riga: 'speed_scale = 1.0',
      da: '=\\s*([\\d.]+)',
      slot: 'self\\.ship_speed\\s*=\\s*([\\d.]+)',
      nota: 'STARTING speed: your value multiplies the base speeds (ship 3.0, bullets 12.0, target 1.5) — start and Play-reset share the same method' },
    { tipo: 'scala', file: 'settings.py',
      riga: 'speed_scale = 1.0',
      da: '=\\s*([\\d.]+)',
      slot: 'self\\.bullet_speed\\s*=\\s*([\\d.]+)',
      nota: 'starting bullets: 12.0 × your value' },
    { tipo: 'scala', file: 'settings.py',
      riga: 'speed_scale = 1.0',
      da: '=\\s*([\\d.]+)',
      slot: 'self\\.target_speed\\s*=\\s*([\\d.]+)',
      nota: 'starting target: 1.5 × your value' },
    { tipo: 'slot', file: 'settings.py',
      riga: 'speed_scale *= 1.1',
      da: '\\*=\\s*([\\d.]+)',
      slot: 'self\\.speedup_scale\\s*=\\s*([\\d.]+)',
      nota: 'the per-level increase lives in speedup_scale (2.1) and kicks in after every 10 hits (levelup_hits): that is what makes the game speed up as it goes' }
  ],
  '14-4': [
    { tipo: 'slot', file: 'alien_invasion.py',
      riga: 'easy_button = Button(ai_game, "Easy")',
      da: '"([^"]*)"',
      slot: 'Button\\(self, "(Easy)"\\)',
      nota: 'the Easy button label lives in alien_invasion.py' },
    { tipo: 'slot', file: 'alien_invasion.py',
      riga: 'medium_button = Button(ai_game, "Medium")',
      da: '"([^"]*)"',
      slot: 'Button\\(self, "(Medium)"\\)',
      nota: 'the Medium button label lives in alien_invasion.py' },
    { tipo: 'slot', file: 'alien_invasion.py',
      riga: 'hard_button = Button(ai_game, "Hard")',
      da: '"([^"]*)"',
      slot: 'Button\\(self, "(Difficult)"\\)',
      nota: 'the Hard button label lives in alien_invasion.py (the project calls it Difficult)' }
  ],
  '14-6': [
    { tipo: 'blocco', passo: 0, file: 'alien_invasion.py', rientro: 4,
      cerca: '    def _start_new_level\\(self\\):[\\s\\S]*?(?=\\n    def |\\s*$)',
      nota: 'your _start_new_level replaces the method in alien_invasion.py' }
  ],
  '14-8': [
    { tipo: 'slot', file: 'sideways_shooter.py',
      riga: 'self.stats.score += 10',
      da: '\\+=\\s*(\\d+)',
      slot: 'self\\.stats\\.score \\+= (\\d+) \\* len\\(aliens\\)',
      nota: 'the points per destroyed alien live in sideways_shooter.py' },
    { tipo: 'slot', file: 'sideways_shooter.py',
      riga: 'self.play_button = Button(self, "Play")',
      da: '"([^"]*)"',
      slot: 'Button\\(self, "(Play)"\\)',
      nota: 'the Play button label lives in sideways_shooter.py' }
  ],

  /* ---- ch. 15 · matplotlib ---- */
  '15-5': [
    { tipo: 'blocco', passo: 0, file: 'random_walk_refactored.py', rientro: 4,
      cerca: '    def get_step\\(self\\):[\\s\\S]*$',
      nota: 'your get_step replaces the method in random_walk_refactored.py (the chart changes!)' }
  ],

  /* ---- ch. 17 · APIs and tests ---- */
  '17-1': [
    { tipo: 'slot', file: 'javascript_repos.py',
      riga: 'url = "https://api.github.com/search/repositories?q=language:javascript+sort:stars+stars:>10000"',
      da: 'language:(\\w+)',
      slot: 'language:(javascript)',
      nota: 'the searched language lives in the url of javascript_repos.py (the chart changes!)' },
    { tipo: 'slot', file: 'javascript_repos.py',
      riga: 'url = "https://api.github.com/search/repositories?q=language:javascript+sort:stars+stars:>10000"',
      da: 'stars:>(\\d+)',
      slot: 'stars:>(\\d+)',
      nota: 'the minimum stars live in the url of javascript_repos.py' }
  ]
};
