// ============================================================================
// Settings Manager - مدير الإعدادات (محدث ليدعم السيرفر)
// ============================================================================

import {
    getFromLocal,
    saveToLocal,
    fetchJsonData,
    saveJsonData // تمت إضافة الاستيراد الجديد للحفظ في السيرفر
} from "./storage.js";

let currentSettings = null;

// ============================================================================
// Init Settings 
// ============================================================================
export async function initSettings() {
    console.log("⚙️ تم تشغيل نظام الإعدادات");

    try {
        // 1. الأولوية لجلب الإعدادات من السيرفر (ملف JSON)
        currentSettings = await fetchJsonData("settings");

        // 2. إذا فشل السيرفر، جلبها من التخزين المحلي (Offline Fallback)
        if (!currentSettings || Object.keys(currentSettings).length === 0) {
            console.log("⚠️ تعذر جلب الإعدادات من السيرفر، جاري استخدام النسخة المحلية.");
            currentSettings = getFromLocal("system_settings");
        }

        // 3. إذا لم توجد أي إعدادات، استخدام إعدادات افتراضية
        if (!currentSettings) {
            currentSettings = { theme: "dark" };
            saveToLocal("system_settings", currentSettings);
        }

        // تطبيق الإعدادات فوراً
        applySettings(currentSettings);
        
    } catch (error) {
        console.error("❌ فشل تحميل الإعدادات:", error);
    }
}

// ============================================================================
// Apply Settings (تطبيق الإعدادات على الشاشة)
// ============================================================================
export function applySettings(settings) {
    if (!settings) return;

    // 1. تطبيق الثيم (Theme)
    document.body.setAttribute("data-theme", settings.theme || "dark");

    // 2. وضع البروجيكتور
    if (settings.projectorMode) {
        document.body.classList.add("projector-mode");
    } else {
        document.body.classList.remove("projector-mode");
    }

    // 3. الألوان المخصصة (إذا تم تعديلها من لوحة الإدارة)
    if (settings.bgColor) document.documentElement.style.setProperty('--bg-color', settings.bgColor);
    if (settings.cardColor) document.documentElement.style.setProperty('--card-bg', settings.cardColor);

    // 4. إظهار/إخفاء العناصر (يدعم النظام المسطح من admin.js والنظام المتداخل القديم)
    const getVisibility = (key) => {
        if (settings[key] !== undefined) return settings[key];
        if (settings.features && settings.features[key] !== undefined) return settings.features[key];
        return true; // الافتراضي إظهار
    };

    const elementsToToggle = {
        clockSection: getVisibility('showClock'),
        dateSection: getVisibility('showDate'),
        weatherSection: getVisibility('showWeather'),
        prayerSection: getVisibility('showPrayers'),
        messagesSection: getVisibility('showMessages'),
        occasionBox: getVisibility('showOccasions'),
        countdownSection: getVisibility('showCountdown'),
        contentViewer: getVisibility('showContent'),
        newsTicker: getVisibility('showNewsTicker'),
        qrSection: getVisibility('showQR')
    };

    Object.entries(elementsToToggle).forEach(([id, visible]) => {
        const el = document.getElementById(id);
        if (el) {
            el.style.transition = "opacity 0.4s ease-in-out";
            el.style.opacity = visible ? "1" : "0";
            // استخدام setTimeout لضمان انتهاء تأثير الشفافية قبل إخفاء العنصر بالكامل
            setTimeout(() => {
                el.style.display = visible ? "" : "none";
            }, visible ? 0 : 400);
        }
    });

    // 5. الشعارات
    const universityLogo = document.getElementById("universityLogo");
    const collegeLogo = document.getElementById("collegeLogo");

    if (universityLogo) universityLogo.style.display = getVisibility('showLogos') ? "" : "none";
    if (collegeLogo) collegeLogo.style.display = getVisibility('showLogos') ? "" : "none";

    console.log("✅ تم تطبيق إعدادات العرض بنجاح");
}

// ============================================================================
// Exported Functions (دوال الاستخدام الخارجي)
// ============================================================================

export function getSettings() {
    return currentSettings;
}

/**
 * حفظ الإعدادات محلياً وفي السيرفر وتطبيقها
 */
export async function saveSettings(settings) {
    currentSettings = settings;
    
    // حفظ محلي لضمان العمل Offline
    saveToLocal("system_settings", settings);
    
    // حفظ في السيرفر الفعلي
    await saveJsonData("settings", settings);
    
    // تطبيق التغييرات
    applySettings(settings);
}

/**
 * تحديث إعداد معين وحفظه
 */
export async function updateSetting(key, value) {
    if (!currentSettings) currentSettings = {};
    
    currentSettings[key] = value;
    await saveSettings(currentSettings);
}
