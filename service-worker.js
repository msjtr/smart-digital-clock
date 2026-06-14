const CACHE_NAME = "hail-smart-clock-v26"; // تم تحديث الإصدار

// تم إضافة جميع الملفات والوحدات اللازمة لتجنب كسر النظام أوفلاين
const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./admin.html",
    "./404.html",
    "./manifest.json",
    "./assets/css/style.css",
    "./assets/css/themes.css",
    "./assets/css/animations.css",
    "./assets/css/responsive.css",
    "./assets/css/admin.css",
    "./assets/js/app.js",
    "./assets/js/utils.js",
    "./assets/js/storage.js",
    "./assets/js/clock.js",
    "./assets/js/countdown.js",
    "./assets/js/auth.js",
    "./assets/js/admin.js",
    "./assets/images/logos/university-logo.jpg",
    "./assets/images/logos/college-logo.jpg"
];

// 1. تثبيت الكاش
self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .catch(err => console.error('فشل في تخزين بعض الملفات:', err))
    );
});

// 2. حذف الكاش القديم
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

// 3. استراتيجية Network First مع معالجة الأخطاء
self.addEventListener("fetch", (event) => {
    // تجاهل الطلبات التي ليست GET (مثل حفظ الإعدادات) أو التي ليست من نفس البروتوكول
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // التأكد من استجابة صحيحة قبل التخزين
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseClone);
                    });

                return response;
            })
            .catch(() => {
                // إذا فشل الاتصال، جلب النسخة من الكاش
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // إذا كان الطلب لصفحة HTML ولم يجدها، يعرض صفحة 404
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('./404.html');
                    }
                });
            })
    );
});
