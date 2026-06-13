const CACHE_NAME = "hail-smart-clock-v2";

const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./404.html",
    "./manifest.json",
    "./assets/css/style.css",
    "./assets/css/themes.css",
    "./assets/css/animations.css",
    "./assets/css/responsive.css",
    "./assets/js/app.js"
];

// تثبيت الكاش
self.addEventListener("install", (event) => {

    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );

});

// حذف الكاش القديم
self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys().then((cacheNames) => {

            return Promise.all(

                cacheNames.map((cache) => {

                    if (cache !== CACHE_NAME) {

                        return caches.delete(cache);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

// Network First
self.addEventListener("fetch", (event) => {

    event.respondWith(

        fetch(event.request)

            .then((response) => {

                const responseClone =
                    response.clone();

                caches.open(CACHE_NAME)
                    .then((cache) => {

                        cache.put(
                            event.request,
                            responseClone
                        );

                    });

                return response;

            })

            .catch(() => {

                return caches.match(
                    event.request
                );

            })

    );

});
