/* ============================================================
   SERVICE-WORKER.JS — offline caching for Student Planner PWA
   ============================================================ */

const CACHE_NAME = 'student-planner-v1';
const PRECACHE_URLS = [
  './',
  'index.html',
  'schedule.html',
  'calendar.html',
  'tasks.html',
  'grades.html',
  'attendance.html',
  'notes.html',
  'wallpaper.html',
  'settings.html',
  'css/style.css',
  'js/storage.js',
  'js/app.js',
  'js/dashboard.js',
  'js/schedule.js',
  'js/calendar.js',
  'js/tasks.js',
  'js/grades.js',
  'js/attendance.js',
  'js/notes.js',
  'js/wallpaper.js',
  'js/settings.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Network-first for external CDN, cache-first for local assets
  const url = new URL(req.url);
  const isLocal = url.origin === self.location.origin;

  if (isLocal) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  } else {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((networkRes) => {
        const clone = networkRes.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return networkRes;
      }).catch(() => cached))
    );
  }
});
