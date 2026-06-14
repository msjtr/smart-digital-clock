// ============================================================================
// App Master Controller - المحرك المركزي لربط جميع ملفات النظام
// ============================================================================

// استيراد كافة وحدات النظام
import { initClock } from "./clock.js";
import { initAuth } from "./auth.js";
import { initWeather } from "./weather.js";
import { initPrayers } from "./prayers.js";
import { initMessages } from "./messages.js";
import { initDashboard } from "./dashboard.js";
import { initContent } from "./content.js";
import { initCountdown } from "./countdown.js";
import { initOccasions } from "./occasions.js";
import { initQr } from "./qr.js";
import { initProjector } from "./projector.js";
import { initViewer } from "./viewer.js";
import { initThemes } from "./themes.js";
import { initFullscreen } from "./fullscreen.js";
import { initNotifications } from "./notifications.js";
import { showToast } from "./utils.js";

/**
 * دالة التهيئة الشاملة للنظام
 */
async function initApp() {
    console.log("🚀 جاري تهيئة النظام بالكامل...");

    // مصفوفة تحتوي على دوال التهيئة لجميع الملفات
    const modules = [
        { name: "Auth", init: initAuth },
        { name: "Clock", init: initClock },
        { name: "Weather", init: initWeather },
        { name: "Prayers", init: initPrayers },
        { name: "Messages", init: initMessages },
        { name: "Dashboard", init: initDashboard },
        { name: "Content", init: initContent },
        { name: "Countdown", init: initCountdown },
        { name: "Occasions", init: initOccasions },
        { name: "QR", init: initQr },
        { name: "Projector", init: initProjector },
        { name: "Viewer", init: initViewer },
        { name: "Themes", init: initThemes },
        { name: "Fullscreen", init: initFullscreen },
        { name: "Notifications", init: initNotifications }
    ];

    // تشغيل دوال التهيئة بالتوازي مع معالجة الأخطاء الفردية
    for (const module of modules) {
        try {
            if (typeof module.init === 'function') {
                await module.init();
                console.log(`✅ ${module.name} loaded.`);
            }
        } catch (err) {
            console.error(`❌ خطأ في تهيئة ${module.name}:`, err);
        }
    }

    showToast("تم تشغيل جميع خدمات النظام بنجاح", "success");
    console.log("🏁 تم الانتهاء من ربط كافة الملفات.");
}

// تنفيذ النظام عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
