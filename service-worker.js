const CACHE_NAME =
    "smart-digital-clock-v1";

const urlsToCache = [

    "/",

    "/index.html",

    "/assets/css/style.css",

    "/assets/css/themes.css",

    "/assets/css/animations.css",

    "/assets/css/responsive.css",

    "/assets/js/app.js"

];

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            ).then(cache => {

                return cache.addAll(
                    urlsToCache
                );

            })

        );

    }
);

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            ).then(response => {

                return (
                    response ||
                    fetch(
                        event.request
                    )
                );

            })

        );

    }
);
