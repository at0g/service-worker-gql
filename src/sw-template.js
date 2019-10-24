self.__precacheManifest = [].concat(self.__precacheManifest || []);

workbox.core.skipWaiting();
workbox.core.clientsClaim();

// precache and route assets built by webpack
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// return app shell for all navigation requests
workbox.routing.registerNavigationRoute(
    '/app-shell',
    new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
    /^https:\/\/unpkg\.com/,
    new workbox.strategies.CacheFirst({
        cacheName: 'pwa-externals-cache'
    })
);

workbox.routing.setCatchHandler(({ event }) => {
    switch (event.request.destination) {
        case 'document':
            return caches.match('/app-shell');
            break;
        default:
            // If we don't have a fallback, just return an error response.
            return Response.error();
    }
})
