```javascript
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
// Init
// ============================================================================

export async function initSettings() {

    console.log(
        "⚙️ تم تشغيل نظام الإعدادات"
    );

    try {

        currentSettings =
            getFromLocal(
                "system_settings"
            );

        if (!currentSettings) {

            currentSettings =
                await fetchJsonData(
                    "settings"
                );

            if (currentSettings) {

                saveToLocal(
                    "system_settings",
                    currentSettings
                );

            }

        }

        if (currentSettings) {

            applySettings(
                currentSettings
            );

        }

    } catch (error) {

        console.error(
            "فشل تحميل الإعدادات",
            error
        );

    }

}

// ============================================================================
// Apply Settings
// ============================================================================

export function applySettings(
    settings
) {

    if (!settings)
        return;

    // Theme

    document.body.setAttribute(
        "data-theme",
        settings.theme || "dark"
    );

    // Projector Mode

    if (
        settings.projectorMode
    ) {

        document.body.classList.add(
            "projector-mode"
        );

    } else {

        document.body.classList.remove(
            "projector-mode"
        );

    }

    // Elements Visibility

    const elementsToToggle = {

        clockSection:
            settings.features?.showClock,

        dateSection:
            settings.features?.showDate,

        weatherSection:
            settings.features?.showWeather,

        prayerSection:
            settings.features?.showPrayers,

        messagesSection:
            settings.features?.showMessages,

        occasionBox:
            settings.features?.showOccasions,

        countdownSection:
            settings.features?.showCountdown,

        contentViewer:
            settings.features?.showContent,

        newsTicker:
            settings.features?.showNewsTicker,

        weatherDetailsSection:
            settings.features?.showWeatherDetails,

        nextPrayerSection:
            settings.features?.showNextPrayer,

        qrSection:
            settings.features?.showQR

    };

    Object.entries(
        elementsToToggle
    ).forEach(
        ([id, visible]) => {

            const el =
                document.getElementById(
                    id
                );

            if (!el)
                return;

            el.style.display =
                visible === false
                    ? "none"
                    : "";

        }
    );

    // Logos

    const universityLogo =
        document.getElementById(
            "universityLogo"
        );

    const collegeLogo =
        document.getElementById(
            "collegeLogo"
        );

    if (universityLogo) {

        universityLogo.style.display =
            settings.features?.showUniversityLogo === false
                ? "none"
                : "";

    }

    if (collegeLogo) {

        collegeLogo.style.display =
            settings.features?.showCollegeLogo === false
                ? "none"
                : "";

    }

    console.log(
        "✅ تم تطبيق الإعدادات"
    );

}

// ============================================================================
// Get Settings
// ============================================================================

export function getSettings() {

    return currentSettings;

}

// ============================================================================
// Save Settings
// ============================================================================

export function saveSettings(
    settings
) {

    currentSettings =
        settings;

    saveToLocal(
        "system_settings",
        settings
    );

    applySettings(
        settings
    );

}

// ============================================================================
// Update Setting
// ============================================================================

export function updateSetting(
    key,
    value
) {

    if (!currentSettings)
        return;

    currentSettings[key] =
        value;

    saveSettings(
        currentSettings
    );

}
```
