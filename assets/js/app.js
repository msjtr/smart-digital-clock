// ============================================================================
// App Master Controller - المحرك المركزي لربط جميع ملفات النظام
// ============================================================================

import { showToast } from "./utils.js";

// استيراد كافة وحدات النظام (مع ملاحظة: يجب التأكد أن جميع هذه الملفات موجودة في assets/js/)
import { initClock } from "./clock.js";
import { initDate } from "./date.js";
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

/**
 * دالة التهيئة الشاملة للنظام (محدثة لتكون أكثر أماناً)
 */
async function initApp() {
    console.log("🚀 جاري تهيئة النظام بالكامل...");

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
