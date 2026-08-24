const CACHE_NAME = 'rps-planner-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-16.png',
    './icon-32.png',
    './icon-192.png',
    './icon-512.png'
];

// Install event – cache core assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event – clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        )).then(() => self.clients.claim())
    );
});

// Fetch event – network-first, fallback to cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const resClone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
                return response;
            })
            .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
    );
});
