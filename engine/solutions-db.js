/* ============================================================
   ENGINE/SOLUTIONS-DB · local database of solution files
   ------------------------------------------------------------
   The official solutions (Python Crash Course, 3rd ed.) live in a
   browser IndexedDB database, seeded on first launch from the
   data/solutions.js bundle (generated from the solutions zip).

   - LOCAL-FIRST: no network, no account; the seed runs only once
     (or whenever SOLUTIONS_INDEX_VERSION changes);
   - data/solutions-index.js (lightweight, static import) exposes
     the metadata (mode, entry, file list) for the UI;
   - data/solutions.js (~7 MB) is imported ONLY during the
     seed: file contents are then read from IndexedDB;
   - if IndexedDB is unavailable (private mode etc.), there is
     a transparent fallback to the in-memory bundle.

   Spoiler policy: the solution code is NEVER shown in the UI;
   it is used only by the runtime to provide the correct output
   of multi-file exercises.
   ============================================================ */
import { SOLUTIONS_INDEX, SOLUTIONS_INDEX_VERSION } from '../data/solutions-index.js';
import { SOLUTIONS as CFG } from '../config.js';

let db = null;            // IDBDatabase
let bundleCache = null;   // in-memory fallback (no IndexedDB)
const cache = new Map();  // id -> merged solution (or null)
let initPromise = null;
let seedInfo = { done: false, count: 0, reseeded: false, fallback: false };

/* ---------- small promise layer over IndexedDB ---------- */
function idbOpen() {
  return new Promise((res, rej) => {
    if (!('indexedDB' in self)) { rej(new Error('IndexedDB not available')); return; }
    const req = indexedDB.open(CFG.idbName, CFG.idbVersion);
    req.onupgradeneeded = () => {
      const d = req.result;
      if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta');
      if (!d.objectStoreNames.contains('chapters')) d.createObjectStore('chapters');
      if (!d.objectStoreNames.contains('solutions')) d.createObjectStore('solutions');
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error || new Error('DB open failed'));
    req.onblocked = () => rej(new Error('DB blocked by another tab'));
  });
}
function idbGet(store, key) {
  return new Promise((res, rej) => {
    const tx = db.transaction(store, 'readonly');
    const r = tx.objectStore(store).get(key);
    r.onsuccess = () => res(r.result ?? null);
    r.onerror = () => rej(r.error);
  });
}
function txDone(tx) {
  return new Promise((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); tx.onabort = () => rej(tx.error); });
}

/* ---------- seed from the bundle ---------- */
async function loadBundle() {
  // dynamic import: the heavy bundle (~7 MB) is downloaded/parsed only here
  return await import('../data/solutions.js');
}
async function seedFromBundle(bundle) {
  const tx = db.transaction(['meta', 'chapters', 'solutions'], 'readwrite');
  tx.objectStore('meta').clear();
  tx.objectStore('chapters').clear();
  tx.objectStore('solutions').clear();
  const osCh = tx.objectStore('chapters');
  for (const [n, files] of Object.entries(bundle.CHAPTER_FILES)) {
    osCh.put({ id: 'ch' + n, n: Number(n), files }, 'ch' + n);
  }
  const osSol = tx.objectStore('solutions');
  for (const [id, rec] of Object.entries(bundle.SOLUTIONS)) {
    osSol.put({ id, ch: rec.ch, entry: rec.entry, mode: rec.mode, reason: rec.reason || null, files: rec.files }, id);
  }
  tx.objectStore('meta').put({ version: bundle.SOLUTIONS_VERSION, indexVersion: SOLUTIONS_INDEX_VERSION, seededAt: new Date().toISOString() }, 'seed');
  await txDone(tx);
}

/* ---------- public API ---------- */

/** Initializes (and seeds if needed) the database. Idempotent. */
export function init() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      db = await idbOpen();
      const meta = await idbGet('meta', 'seed');
      if (!meta || meta.indexVersion !== SOLUTIONS_INDEX_VERSION) {
        const bundle = await loadBundle();
        await seedFromBundle(bundle);
        seedInfo = { done: true, count: Object.keys(bundle.SOLUTIONS).length, reseeded: !!meta, fallback: false };
        cache.clear();
      } else {
        seedInfo = { done: true, count: Object.keys(SOLUTIONS_INDEX).length, reseeded: false, fallback: false };
      }
    } catch (e) {
      // fallback: no database, everything is served from the in-memory bundle
      try {
        bundleCache = await loadBundle();
        db = null;
        seedInfo = { done: true, count: Object.keys(bundleCache.SOLUTIONS).length, reseeded: false, fallback: true };
      } catch (e2) {
        seedInfo = { done: false, count: 0, reseeded: false, fallback: false };
      }
    }
    return seedInfo;
  })();
  return initPromise;
}

/** Synchronous metadata (from the lightweight index): null if the exercise has no solution. */
export function indexFor(id) { return SOLUTIONS_INDEX[id] || null; }

/** Number of exercises with a solution in the database. */
export function indexCount() { return Object.keys(SOLUTIONS_INDEX).length; }

/** ===== NEW v12 · all ids with a solution (to find chains of exercises
 *  that share the same program). ===== */
export function indexIds() { return Object.keys(SOLUTIONS_INDEX); }

/** Seed status (for statusbar/diagnostics). */
export function seedStatus() { return Object.assign({}, seedInfo); }

/**
 * Returns the exercise ready for execution:
 *   { id, ch, entry, mode ('run'|'pytest'|'none'), reason, files }
 * `files` = the chapter's support files ⊎ the exercise's own files,
 * with relative paths; values are UTF-8 strings or
 * { b64 } for binary files (images…). null if not present.
 */
export async function getSolution(id) {
  if (cache.has(id)) return cache.get(id);
  const idx = SOLUTIONS_INDEX[id];
  if (!idx) { cache.set(id, null); return null; }
  await init();
  let rec = null, chFiles = {};
  if (db) {
    rec = await idbGet('solutions', id);
    if (rec) {
      const chRec = await idbGet('chapters', 'ch' + rec.ch);
      if (chRec) chFiles = chRec.files || {};
    }
  } else if (bundleCache) {
    rec = bundleCache.SOLUTIONS[id] || null;
    chFiles = (bundleCache.CHAPTER_FILES || {})[idx.ch] || {};
  }
  if (!rec) { cache.set(id, null); return null; }
  const files = Object.assign({}, chFiles, rec.files || {});
  const sol = { id, ch: idx.ch, entry: rec.entry, mode: rec.mode, reason: rec.reason || null, files };
  cache.set(id, sol);
  return sol;
}

/** ===== NEW v12 · RAW solution record: ONLY the exercise's own
 *  files (without the chapter's support files), to tell which files
 *  the exercise actually writes/modifies («Lines» panel). ===== */
export async function getSolutionRaw(id) {
  const idx = SOLUTIONS_INDEX[id];
  if (!idx) return null;
  await init();
  let rec = null;
  if (db) rec = await idbGet('solutions', id);
  else if (bundleCache) rec = bundleCache.SOLUTIONS[id] || null;
  if (!rec) return null;
  return { id, ch: idx.ch, entry: rec.entry, mode: rec.mode, reason: rec.reason || null, files: rec.files || {} };
}
