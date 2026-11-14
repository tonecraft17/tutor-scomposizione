/* ============================================================
   SW · service worker — repeat-visit caching for GitHub Pages
   ------------------------------------------------------------
   Why: GitHub Pages pins `Cache-Control: max-age=600` on every
   asset and offers no way to change it, so each visit within
   10 minutes re-downloads ~184 kB of modules/CSS. This worker
   adds the "modern caching" layer the platform cannot provide.

   Strategy (deliberately minimal and stale-proof):
   · HTML navigations  → NETWORK-FIRST. A deploy is picked up
     immediately; the cached copy is only a fallback when the
     network is gone (the app keeps working offline).
   · Same-origin GET   → CACHE-FIRST. Modules, CSS, the solution
     chapter bundles (data/solutions/chNN.js) are served from the
     local Cache API with zero network.
   · Everything else   → untouched (browser). The Pyodide/Plotly
     CDNs keep their own HTTP caching; Supabase requests are
     cross-origin POSTs and are never intercepted.

   Staleness is impossible by construction:
   · app.js/styles.css are referenced with a `?v=` query that
     changes on every release: new URL → cache miss → fresh fetch;
   · the HTML is network-first, so a new deploy immediately
     references the new versioned URLs;
   · the cache NAME below is bumped on every release and the old
     cache is deleted on activate;
   · the page registers the worker with updateViaCache:'none', so
     sw.js itself is always revalidated, never served from the
     HTTP cache.

   Not intercepted: dedicated-worker script loads (the Python
   runtime, engine/python-worker.js) are fetched by the worker
   context, which a page's service worker does not control — they
   keep using the plain HTTP cache, which is fine as they sit
   outside the startup critical path.

   Deploy checklist (every release):
     1. bump ?v=16.0 (…) on app.js/styles.css in index.html;
     2. bump CACHE below to the same version;
     3. push — the next visit updates the worker, purges the old
        cache and re-caches the new assets on demand.
   ============================================================ */

const CACHE = 'tutor-v16';

self.addEventListener('install', () => {
  /* take over as soon as the new worker is ready: no stale window
     keeps serving from the previous cache name */
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // CDNs / Supabase: not ours

  if (req.mode === 'navigate') {
    /* HTML: network-first — a deploy must never be masked */
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (err) {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;
        return new Response(
          'Tutor · Progressive Breakdown — offline.\n\nReconnect to load the latest version.',
          { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
        );
      }
    })());
    return;
  }

  /* static assets: cache-first — instant on repeat visits */
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    const fresh = await fetch(req);
    if (fresh && fresh.ok) {
      const cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
    }
    return fresh;
  })());
});
