// ============================================================================
// Settings Manager - مدير الإعدادات (محدث ليدعم السيرفر والتوافق الكامل)
// ============================================================================

import {
    getFromLocal,
    saveToLocal,
    fetchJsonData,
    saveJsonData
} from "./storage.js";

let currentSettings = null;

// ============================================================================
// Init Settings 
// ============================================================================
export async function initSettings() {
    console.log("⚙️ تم تشغيل نظام الإعدادات");

    try {
        // 1. محاولة جلب الإعدادات من السيرفر
        const data = await fetchJsonData("settings");
        
        // التحقق من أن البيانات صالحة (قد تكون كائن فارغ أو هيكل {list:[]})
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            currentSettings = data;
        } else {
            // 2. إذا فشل السيرفر أو كانت البيانات فارغة، جلب النسخة المحلية
            console.log("⚠️ تعذر جلب إعدادات صالحة من السيرفر، جاري استخدام النسخة المحلية.");
            currentSettings = getFromLocal("system_settings");
        }

        // 3. إذا لم توجد أي إعدادات (سيرفر أو محلي)، استخدام إعدادات افتراضية
        if (!currentSettings) {
            currentSettings = { 
                theme: "dark", 
                projectorMode: false,
                features: {
                    showClock: true, showDate: true, showWeather: true,
                    showPrayers: true, showMessages: true, showOccasions: true,
                    showCountdown: true, showContent: true, showNewsTicker: true,
                    showQR: true, showLogos: true
                }
            };
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

    // تطبيق الثيم (Theme)
    document.body.setAttribute("data-theme", settings.theme || "dark");

    // تطبيق وضع البروجيكتور
    document.body.classList.toggle("projector-mode", !!settings.projectorMode);

    // تطبيق الألوان المخصصة
    if (settings.bgColor) document.documentElement.style.setProperty('--bg-color', settings.bgColor);
    if (settings.cardColor) document.documentElement.style.setProperty('--card-bg', settings.cardColor);

    // التحقق من ظهور العناصر (نظام هجين يدعم الهيكلين)
    const getVisibility = (key) => {
        if (settings[key] !== undefined) return settings[key];
        if (settings.features && settings.features[key] !== undefined) return settings.features[key];
        return true;
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
            setTimeout(() => {
                el.style.display = visible ? "" : "none";
            }, 400);
        }
    });

    // إدارة الشعارات
    const logos = [document.getElementById("universityLogo"), document.getElementById("collegeLogo")];
    logos.forEach(logo => { if (logo) logo.style.display = getVisibility('showLogos') ? "" : "none"; });

    console.log("✅ تم تطبيق إعدادات العرض بنجاح");
}

// ============================================================================
// Exported Functions
// ============================================================================

export function getSettings() {
    return currentSettings;
}

export async function saveSettings(settings) {
    currentSettings = settings;
    saveToLocal("system_settings", settings);
    await saveJsonData("settings", settings);
    applySettings(settings);
}

export async function updateSetting(key, value) {
    if (!currentSettings) currentSettings = {};
    currentSettings[key] = value;
    await saveSettings(currentSettings);
}
