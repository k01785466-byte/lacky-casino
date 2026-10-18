const CACHE_NAME = 'hamster-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './hamster.png'
];

// Установка: кэшируем файлы
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Активируем новый SW сразу
});

// Активация: удаляем старые кэши
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Берём контроль над страницей сразу
});

// Запросы: отдаём из кэша, если есть
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});