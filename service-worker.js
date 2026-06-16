const CACHE_NAME = "hail-smart-clock-v33"; // تم تحديث الإصدار لتفعيل الكاش الجديد وتضمين الأخبار

// إضافة جميع ملفات النظام الحيوية لتجنب تعطل الشاشة أوفلاين
const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./admin.html",
    "./404.html",
    "./manifest.json",
    
    // ملفات التنسيق
    "./assets/css/style.css",
    "./assets/css/themes.css",
    "./assets/css/animations.css",
    "./assets/css/responsive.css",
    "./assets/css/admin.css",
    
    // ملفات الجافاسكريبت الأساسية
    "./assets/js/app.js",
    "./assets/js/admin.js",
    "./assets/js/utils.js",
    "./assets/js/storage.js",
    "./assets/js/sync.js",
    "./assets/js/auth.js",
    
    // ملفات المحتوى والعرض الرئيسية
    "./assets/js/clock.js",
    "./assets/js/date.js",
    "./assets/js/countdown.js",
    "./assets/js/messages.js",
    "./assets/js/occasions.js",
    "./assets/js/news.js", // ⬅️ إضافة محرك الشريط الإخباري للشاشة
    
    // ملفات لوحة الإدارة
    "./assets/admin/news.js", // ⬅️ إضافة محرك إدارة الأخبار
    "./assets/admin/messages.js",
    "./assets/admin/occasions.js",
    "./assets/admin/dashboard.js",
    
    // الصور والشعارات
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
    // تجاهل الطلبات التي ليست GET أو التي ليست من نفس البروتوكول
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
                // إذا فشل الاتصال (أوفلاين)، جلب النسخة من الكاش
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
