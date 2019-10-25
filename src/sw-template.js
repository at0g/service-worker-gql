self.__precacheManifest = [].concat(self.__precacheManifest || []);

self.addEventListener('install', (event) => {
    const urls = ['/app-shell'];
    const cacheName = workbox.core.cacheNames.runtime;
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(urls)));
});

workbox.core.setCacheNameDetails({
    prefix: 'pwa',
    suffix: ''
})

workbox.core.skipWaiting();
workbox.core.clientsClaim();

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
