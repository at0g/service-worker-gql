workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.core.setCacheNameDetails({ prefix: 'pwa', suffix: '' })

self.__precacheManifest = [
    'https://unpkg.com/react@16.10.2/umd/react.development.js',
    'https://unpkg.com/react-dom@16.10.2/umd/react-dom.development.js',
    ...(self.__precacheManifest || [])
]

self.addEventListener('install', (event) => {
    const urls = ['/app-shell'];
    const cacheName = workbox.core.cacheNames.runtime;
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(urls)));
});

// precache and route assets built by webpack
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// return app shell for all navigation requests
workbox.routing.registerNavigationRoute(
    '/app-shell',
    new workbox.strategies.CacheFirst({
        cacheName: 'static-docs'
    })
);

workbox.routing.registerRoute(
    /\.([^\/]+)^/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'documents'
    })
)

workbox.routing.setCatchHandler(({ event }) => {
    switch (event.request.destination) {
        case 'document':
            return caches.match('/app-shell');
        default:
            // If we don't have a fallback, just return an error response.
            return Response.error();
    }
})
