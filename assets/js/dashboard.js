// ============================================================================
// Dashboard Manager
// ============================================================================

import { getLogs } from "./logs.js";
import { getMessages } from "./storage.js";
import { getOccasions } from "./occasions.js";
import { getContent } from "./content.js";
import { getEvents } from "./countdown.js";

export function initDashboard() {

    console.log(
        "✅ تم تشغيل لوحة التحكم"
    );

    initSidebar();

    initSettingsPanel();

    updateDashboard();

    setInterval(
        updateDashboard,
        30000
    );

}

// ============================================================================
// القائمة الجانبية
// ============================================================================

function initSidebar() {

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    const openBtn =
        document.getElementById(
            "menuToggleBtn"
        );

    const closeBtn =
        document.getElementById(
            "closeSidebarBtn"
        );

    if (
        openBtn &&
        sidebar
    ) {

        openBtn.addEventListener(
            "click",
            e => {

                e.stopPropagation();

                sidebar.classList.add(
                    "active"
                );

            }
        );

    }

    if (
        closeBtn &&
        sidebar
    ) {

        closeBtn.addEventListener(
            "click",
            () => {

                sidebar.classList.remove(
                    "active"
                );

            }
        );

    }

}

// ============================================================================
// لوحة الإعدادات
// ============================================================================

function initSettingsPanel() {

    const btn =
        document.getElementById(
            "openSettingsBtn"
        );

    const panel =
        document.getElementById(
            "settingsPanel"
        );

    if (
        !btn ||
        !panel
    ) return;

    btn.addEventListener(
        "click",
        () => {

            panel.classList.toggle(
                "active"
            );

        }
    );

}

// ============================================================================
// تحديث الإحصائيات
// ============================================================================

function updateDashboard() {

    updateStatistics();

    updateSystemStatus();

}

// ============================================================================
// الإحصائيات
// ============================================================================

function updateStatistics() {

    setValue(
        "statMessages",
        getMessages()?.length || 0
    );

    setValue(
        "statOccasions",
        getOccasions()?.length || 0
    );

    setValue(
        "statContent",
        getContent()?.length || 0
    );

    setValue(
        "statEvents",
        getEvents()?.length || 0
    );

    setValue(
        "statLogs",
        getLogs()?.length || 0
    );

}

// ============================================================================
// حالة النظام
// ============================================================================

function updateSystemStatus() {

    setValue(
        "internetStatus",
        navigator.onLine
            ? "🟢 متصل"
            : "🔴 غير متصل"
    );

    const weather =
        JSON.parse(
            localStorage.getItem(
                "weather_cache"
            )
        );

    if (weather) {

        setValue(
            "currentWeather",
            `${weather.temperature}°C`
        );

    }

    const prayer =
        localStorage.getItem(
            "next_prayer"
        );

    if (prayer) {

        setValue(
            "nextPrayerStatus",
            prayer
        );

    }

}

// ============================================================================
// مساعد
// ============================================================================

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );

    if (element) {

        element.textContent =
            value;

    }

}
