const CACHE_NAME = "arko-1-v2";

const APP_ASSETS = [
    "/",
    "/index.html",
    "/css/app.css",
    "/js/app.js",

    "/js/storage/eventStore.js",
    "/js/domain/events.js",
    "/js/domain/drinkSummary.js",
    "/js/ui/appView.js",

    "/manifest.json",
    "/icons/icon-192.png",
    "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_ASSETS))
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                return cachedResponse || fetch(event.request);
            })
    );
});
