/* ==================================================================
   Gym Log — service worker (makes the app work offline in the gym)

   Strategy: "stale-while-revalidate"
     1. Answer every request from the cache immediately (fast, works offline).
     2. In the background, fetch the latest file and update the cache.
     → After you upload a new version, the app updates on the NEXT launch.

   When you change files, also bump CACHE_VERSION so old caches are deleted.
   ================================================================== */

/** Change this (v2, v3, ...) whenever you publish a new version. */
const CACHE_VERSION = 'gymlog-v2';

/** Files cached at install time: the whole app shell. Relative paths work on GitHub Pages sub-folders. */
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

// install: download the app shell into a new cache.
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();                       // activate the new worker without waiting for old tabs to close
});

// activate: delete caches from older versions.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())     // start controlling already-open pages
  );
});

// fetch: cache first, refresh in the background.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Only handle our own GET requests (never POSTs or other sites).
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // Start the network request now. clone() must happen before anyone reads the body.
  const network = fetch(req).then((res) => ({ res, copy: res.ok ? res.clone() : null }));

  // Background cache refresh; waitUntil keeps the worker alive until it is done.
  event.waitUntil(
    network
      .then(async ({ copy }) => {
        if (copy) await (await caches.open(CACHE_VERSION)).put(req, copy);
      })
      .catch(() => { /* offline: keep the cached copy */ })
  );

  event.respondWith(
    caches.match(req, { ignoreSearch: true })
      .then((cached) => cached || network.then(({ res }) => res))
      .catch(async () =>
        // Offline and not cached: for page loads fall back to the app itself.
        (req.mode === 'navigate' && (await caches.match('./index.html'))) ||
        new Response('Offline', { status: 503, statusText: 'Offline' }))
  );
});
