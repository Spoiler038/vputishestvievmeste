const CACHE = 'vputi-v1';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// Push уведомления (для будущей интеграции)
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'Новая заявка', body: '' };
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icons/android/192.png',
    badge: '/icons/android/72.png',
  }));
});
