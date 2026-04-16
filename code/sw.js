const CACHE_NAME = 'stracare-v1';
const ASSETS_TO_CACHE = [
    './stracaremain.html',
    './stracareadmin.html',
    './styles.css',
    './manifest.json',
    './logo-stracare.svg',
    './logoname-stracare.svg'
];

// Install event: Cache files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Fetch event: Serve from cache if available, else network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            return response || fetch(event.request);
        })
    );
});

// Activate event: Clear old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
