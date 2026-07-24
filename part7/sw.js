const CACHE_NAME = 'sonkkeut-static-v1';
const PRECACHE_URLS = [
  '/gnuboard5/',
  '/gnuboard5/theme/soapshop/css/default_shop.css',
  '/gnuboard5/theme/soapshop/css/custom_shop.css',
  '/gnuboard5/theme/soapshop/icons/icon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.mode === 'navigate') {
    // 페이지 이동: 네트워크 우선, 실패하면 캐시된 첫 화면 대신 사용
    event.respondWith(
      fetch(req).catch(() => caches.match('/gnuboard5/'))
    );
    return;
  }

  // 정적 자산: 캐시 우선, 없으면 네트워크
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || '',
    icon: '/gnuboard5/theme/soapshop/icons/icon-192.png',
    data: { url: data.url || '/gnuboard5/' }
  };
  event.waitUntil(
    self.registration.showNotification(data.title || '손끝공방', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});