// assets/js/settings.js

export function initSettings() {
    console.log("تم تهيئة وحدة الإعدادات.");
    // سيتم ربط أزرار لوحة التحكم من هنا لاحقاً
}

export function applySettings(settings) {
    if (!settings) return;

    // تطبيق الثيم (داكن / فاتح)
    if (settings.theme) {
        document.body.setAttribute('data-theme', settings.theme);
    }

    // إظهار أو إخفاء العناصر بناءً على الإعدادات
    const elementsToToggle = {
        'clockSection': settings.features?.showClock,
        'dateSection': settings.features?.showDate,
        'weatherSection': settings.features?.showWeather,
        'prayerSection': settings.features?.showPrayers,
        'messagesSection': settings.features?.showMessages
    };

    for (const [id, show] of Object.entries(elementsToToggle)) {
        const el = document.getElementById(id);
        if (el && show !== undefined) {
            el.style.display = show ? 'block' : 'none';
        }
    }
}
