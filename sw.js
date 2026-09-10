// Minimal service worker — its only job is to satisfy Chrome/Android's installability
// requirement (a registered service worker with a fetch handler) so the browser offers
// the "Add to Home Screen" / install prompt. It also gives basic offline access to the
// page shell once it has been visited at least once.
const CACHE_NAME = "weekly-schedule-shell-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(self.registration.scope))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Network-first, falling back to the cached page shell if offline.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
