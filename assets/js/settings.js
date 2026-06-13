// ============================================================================
// Settings Manager
// ============================================================================

import {
    getFromLocal,
    saveToLocal,
    fetchJsonData
} from "./storage.js";

let currentSettings = null;

// ============================================================================
// Init Settings (تأكد أن هذا الاسم مطابق لما في app.js)
// ============================================================================

export async function initSettings() {
    console.log("⚙️ تم تشغيل نظام الإعدادات");

    try {
        // محاولة جلب الإعدادات من التخزين المحلي
        currentSettings = getFromLocal("system_settings");

        // إذا لم توجد، جلبها من ملف الـ JSON
        if (!currentSettings) {
            currentSettings = await fetchJsonData("settings");
            if (currentSettings) {
                saveToLocal("system_settings", currentSettings);
            }
        }

        // تطبيق الإعدادات إذا وجدت
        if (currentSettings) {
            applySettings(currentSettings);
        }
    } catch (error) {
        console.error("فشل تحميل الإعدادات:", error);
    }
}

// ============================================================================
// Apply Settings
// ============================================================================

export function applySettings(settings) {
    if (!settings) return;

    // Theme
    document.body.setAttribute("data-theme", settings.theme || "dark");

    // Projector Mode
    if (settings.projectorMode) {
        document.body.classList.add("projector-mode");
    } else {
        document.body.classList.remove("projector-mode");
    }

    // Elements Visibility
    const elementsToToggle = {
        clockSection: settings.features?.showClock,
        dateSection: settings.features?.showDate,
        weatherSection: settings.features?.showWeather,
        prayerSection: settings.features?.showPrayers,
        messagesSection: settings.features?.showMessages,
        occasionBox: settings.features?.showOccasions,
        countdownSection: settings.features?.showCountdown,
        contentViewer: settings.features?.showContent,
        newsTicker: settings.features?.showNewsTicker,
        weatherDetailsSection: settings.features?.showWeatherDetails,
        nextPrayerSection: settings.features?.showNextPrayer,
        qrSection: settings.features?.showQR
    };

    Object.entries(elementsToToggle).forEach(([id, visible]) => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = (visible === false) ? "none" : "";
        }
    });

    // Logos
    const universityLogo = document.getElementById("universityLogo");
    const collegeLogo = document.getElementById("collegeLogo");

    if (universityLogo) universityLogo.style.display = (settings.features?.showUniversityLogo === false) ? "none" : "";
    if (collegeLogo) collegeLogo.style.display = (settings.features?.showCollegeLogo === false) ? "none" : "";

    console.log("✅ تم تطبيق الإعدادات");
}

// ============================================================================
// Exported Functions
// ============================================================================

export function getSettings() {
    return currentSettings;
}

export function saveSettings(settings) {
    currentSettings = settings;
    saveToLocal("system_settings", settings);
    applySettings(settings);
}

export function updateSetting(key, value) {
    if (!currentSettings) return;
    currentSettings[key] = value;
    saveSettings(currentSettings);
}
