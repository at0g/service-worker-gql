
workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.core.setCacheNameDetails({ prefix: 'pwa', suffix: '' })

self.__precacheManifest = [
    'https://unpkg.com/react@16.11.0/umd/react.development.js',
    // 'https://unpkg.com/react-dom@16.10.2/umd/react-dom.development.js',
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

// Workbox with custom handler to use IndexedDB for cache.
workbox.routing.registerRoute(
    new RegExp('/graphql(/)?'),
    ({event}) => {
        console.log('/graphql request', event)
        event.respondWith(networkFirst(event))
    },
    'POST'
);

workbox.routing.setCatchHandler(({ event }) => {
    switch (event.request.destination) {
        case 'document':
            return caches.match('/app-shell');
        default:
            console.warn('no fallback handler for ', event.request.destination)
            // If we don't have a fallback, just return an error response.
            return Response.error('Failed to handle request ' + event.request.url);
    }
})






// Initialise the IndexedDB cache (useing Dexie to simplify IndexedDB)
importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js');
importScripts('https://unpkg.com/dexie@2.0.4/dist/dexie.js');
var db = new Dexie("graphql_queries");
db.version(1).stores({
    graphql_queries: 'key,response,timestamp'
})

function cacheFirst(event) {
    return cacheMatch(event.request.clone(), db.graphql_queries)
        .then(result => {
            if (result) {
                return result.clone()
            }
            return fetch(event.request.clone())
        })
        .then(response => {
            if (!response.clone().ok) {
                console.warn(response.status, response.statusText)
                throw new Error('Failed to load', event.request.url)
            }

            console.log('res was ok')
            // If it works, put the response into IndexedDB
            return cachePut(event.request.clone(), response.clone(), db.graphql_queries)
                .then(() => response.clone())
        })

}

function networkFirst(event) {
    return fetch(event.request.clone())
        .then((response) => {
            if (!response.clone().ok) {
                console.warn(response.status, response.statusText)
                throw new Error('Failed to load', event.request.url)
            }
            return cachePut(event.request.clone(), response.clone(), db.graphql_queries)
                .then(() => response.clone())
        })
        .catch(() => {
            // If it does not work, return the cached response. If the cache does not
            // contain a response for our request, it will give us a 503-response
            return cacheMatch(event.request.clone(), db.graphql_queries);
        })
}

/**
 * Serializes a Request into a plain JS object.
 *
 * @param request
 * @returns Promise
 */
function serializeRequest(request) {
    var serialized = {
        url: request.url,
        headers: serializeHeaders(request.headers),
        method: request.method,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        redirect: request.redirect,
        referrer: request.referrer
    };

    // Only if method is not `GET` or `HEAD` is the request allowed to have body.
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        return request.clone().text().then(function(body) {
            serialized.body = body;
            return Promise.resolve(serialized);
        });
    }
    return Promise.resolve(serialized);
}

/**
 * Serializes a Response into a plain JS object
 *
 * @param response
 * @returns Promise
 */
function serializeResponse(response) {
    var serialized = {
        headers: serializeHeaders(response.headers),
        status: response.status,
        statusText: response.statusText
    };

    return response.clone().text().then(function(body) {
        serialized.body = body;
        return Promise.resolve(serialized);
    });
}

/**
 * Serializes headers into a plain JS object
 *
 * @param headers
 * @returns object
 */
function serializeHeaders(headers) {
    var serialized = {};
    // `for(... of ...)` is ES6 notation but current browsers supporting SW, support this
    // notation as well and this is the only way of retrieving all the headers.
    for (var entry of headers.entries()) {
        serialized[entry[0]] = entry[1];
    }
    return serialized;
}

/**
 * Creates a Response from it's serialized version
 *
 * @param data
 * @returns Promise
 */
function deserializeResponse(data) {
    return Promise.resolve(new Response(data.body, data));
}

/**
 * Saves the response for the given request eventually overriding the previous version
 *
 * @param data
 * @returns Promise
 */
function cachePut(request, response, store) {
    var key, data;
    return getPostId(request.clone())
        .then(function(id){
            key = id;
            return serializeResponse(response.clone());
        }).then(function(serializedResponse) {
            data = serializedResponse;
            var entry = {
                key: key,
                response: data,
                timestamp: Date.now()
            };
            store
                .add(entry)
                .catch(function(error){
                    if (error.message === "Key already exists in the object store.") {
                        return store.update(entry.key, entry);
                    }

                    throw error
                });
    });
}

/**
 * Returns a string identifier for our POST request.
 *
 * @param request
 * @return string
 */
function getPostId(request) {
    return serializeRequest(request.clone())
        .then((result) => JSON.parse(result.body))
        .then(json => CryptoJS.MD5(json.query).toString())
}

/**
 * Returns the cached response for the given request or an empty 503-response  for a cache miss.
 *
 * @param request
 * @return Promise
 */
function cacheMatch(request, store) {
    return getPostId(request.clone())
        .then((id) => {
            console.log('get id', id)
            return store.get(id);
        }).then((data) => {
            if (data) {
                console.debug('cache match', data.response)
                return deserializeResponse(data.response);
            } else {
                return null;
            }
        });
}
