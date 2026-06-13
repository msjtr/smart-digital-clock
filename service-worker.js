const CACHE_NAME = "hail-smart-clock-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./404.html",
  "./manifest.json",
  "./assets/css/style.css",
  "./assets/css/themes.css",
  "./assets/css/animations.css",
  "./assets/css/responsive.css",
  "./assets/js/app.js",
  "./assets/js/utils.js",
  "./assets/js/storage.js",
  "./assets/js/api.js",
  "./assets/js/clock.js",
  "./assets/js/date.js",
  "./data/settings.json",
  "./data/messages.json",
  "./data/occasions.json"
];

// تثبيت ملفات الكاش الأساسية
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("تم تخزين ملفات النظام الأساسية");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// مسح الكاش القديم عند تحديث التطبيق
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

// استراتيجية (Cache First ثم Network)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // إرجاع الملف من الكاش إذا وجد، وإلا جلب من الإنترنت
      return cachedResponse || fetch(event.request).catch(() => {
        // إذا فشل الاتصال بالإنترنت وكان الطلب صفحة HTML، يتم توجيهه للـ 404 أو الرئيسية
        if (event.request.mode === 'navigate') {
          return caches.match('./404.html');
        }
      });
    })
  );
});
