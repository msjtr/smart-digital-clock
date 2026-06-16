// ============================================================================
// App Master Controller - المحرك المركزي لربط جميع ملفات النظام
// ============================================================================

import { showToast } from "./utils.js?v=3";

// استيراد كافة وحدات النظام (تم التحديث إلى v=3 لضمان جلب أحدث الأكواد وتخطي الكاش)
import { initClock } from "./clock.js?v=3";
import { initDate } from "./date.js?v=3";
import { initAuth } from "./auth.js?v=3";
import { initWeather } from "./weather.js?v=3";
import { initPrayers } from "./prayers.js?v=3";
import { initMessages } from "./messages.js?v=3";
import { initDashboard } from "./dashboard.js?v=3";
import { initContent } from "./content.js?v=3";
import { initCountdown } from "./countdown.js?v=3";
import { initOccasions } from "./occasions.js?v=3";
import { initNews } from "./news.js?v=3"; // ⬅️ إضافة استيراد الشريط الإخباري
import { initQr } from "./qr.js?v=3";
import { initProjector } from "./projector.js?v=3";
import { initViewer } from "./viewer.js?v=3";
import { initThemes } from "./themes.js?v=3";
import { initFullscreen } from "./fullscreen.js?v=3";
import { initNotifications } from "./notifications.js?v=3";

/**
 * دالة التهيئة الشاملة للنظام (محدثة لتكون أكثر أماناً)
 */
async function initApp() {
    console.log("🚀 جاري تهيئة النظام بالكامل (النسخة المحدثة v3)...");

    const modules = [
        { name: "Auth", init: initAuth },
        { name: "Clock", init: initClock },
        { name: "Date", init: initDate },
        { name: "Weather", init: initWeather },
        { name: "Prayers", init: initPrayers },
        { name: "Messages", init: initMessages },
        { name: "Dashboard", init: initDashboard },
        { name: "Content", init: initContent },
        { name: "Countdown", init: initCountdown },
        { name: "Occasions", init: initOccasions },
        { name: "News", init: initNews }, // ⬅️ تسجيل وحدة الشريط الإخباري للتشغيل
        { name: "QR", init: initQr },
        { name: "Projector", init: initProjector },
        { name: "Viewer", init: initViewer },
        { name: "Themes", init: initThemes },
        { name: "Fullscreen", init: initFullscreen },
        { name: "Notifications", init: initNotifications }
    ];

    for (const module of modules) {
        try {
            // التحقق من أن الـ init هي دالة فعلاً قبل استدعائها
            if (module.init && typeof module.init === 'function') {
                await module.init();
                console.log(`✅ ${module.name} loaded.`);
            } else {
                console.warn(`⚠️ الوحدة ${module.name} غير معرفة أو ليست دالة.`);
            }
        } catch (err) {
            console.error(`❌ خطأ في تهيئة ${module.name}:`, err);
        }
    }

    showToast("تم تشغيل خدمات النظام بنجاح", "success");
}

// تنفيذ النظام
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
