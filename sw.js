const CACHE_NAME = 'ttt-game-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap',
  'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => {
    return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
  }));
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('peerjs.com') && !e.request.url.includes('peerjs.min.js')) return;
  e.respondWith(caches.match(e.request).then((res) => {
    return res || fetch(e.request).catch(() => caches.match('./index.html'));
  }));
});
