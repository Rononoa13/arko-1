const CACHE_NAME = "arko-1-v4";

const APP_ASSETS = [
    "",
    "index.html",
    "groups.html",
    "about.html",
    "css/app.css",
    "css/group.css",
    "css/about.css",
    "css/games/games.css",
    "js/app.js",
    "js/group.js",
    "js/games/partyPrompts.js",
    "js/storage/eventStore.js",
    "js/domain/events.js",
    "js/domain/drinkSummary.js",
    "js/ui/appView.js",
    "js/games/core/gameRegistry.js",
    "js/games/core/gameEngine.js",
    "js/games/catalog/friendlyArguments/index.js",
    "js/games/catalog/friendlyArguments/data.js",
    "js/games/catalog/nepalTrivia/index.js",
    "js/games/catalog/nepalTrivia/data.js",
    "js/games/catalog/chungi/index.js",
    "js/games/catalog/chungi/styles.css",
    "js/games/catalog/chungi/chungi.svg",
    "manifest.json",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "icons/icon-512-maskable.png"
].map(path => new URL(path, self.registration.scope).href);

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_ASSETS))
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});
