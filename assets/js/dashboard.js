// ============================================================================
// Dashboard Manager - المحدث (يدعم التحديث اللحظي من السيرفر)
// ============================================================================

import { getLogs } from "./logs.js";
import { getMessages } from "./storage.js"; // تأكد أن هذه الدالة تجلب آخر نسخة
import { getOccasions } from "./occasions.js";
import { getContent } from "./content.js";
import { getEvents } from "./countdown.js";

export function initDashboard() {
    console.log("✅ تم تشغيل لوحة التحكم");
    initSidebar();
    initSettingsPanel();
    updateDashboard();

    // تحديث الإحصائيات كل 30 ثانية
    setInterval(updateDashboard, 30000);
}

// ============================================================================
// تحديث الإحصائيات والحالة
// ============================================================================
function updateDashboard() {
    updateStatistics();
    updateSystemStatus();
}

function updateStatistics() {
    // نستخدم الدوال التي تجلب البيانات المحدثة من الذاكرة أو السيرفر
    setValue("statMessages", getMessages()?.length || 0);
    setValue("statOccasions", getOccasions()?.length || 0);
    setValue("statContent", getContent()?.length || 0);
    setValue("statEvents", getEvents()?.length || 0);
    setValue("statLogs", getLogs()?.length || 0);
}

function updateSystemStatus() {
    // حالة الإنترنت (مباشرة من المتصفح)
    setValue("internetStatus", navigator.onLine ? "🟢 متصل" : "🔴 غير متصل");

    // جلب الطقس (مع معالجة الأخطاء)
    try {
        const weather = JSON.parse(localStorage.getItem("weather_cache"));
        if (weather && weather.temperature) {
            setValue("currentWeather", `${weather.temperature}°C`);
        }
    } catch (e) {
        setValue("currentWeather", "غير متاح");
    }

    // جلب الصلاة القادمة
    const prayer = localStorage.getItem("next_prayer");
    setValue("nextPrayerStatus", prayer || "جاري التحديث...");
}

// ============================================================================
// الدوال المساعدة (تم الحفاظ عليها كما هي)
// ============================================================================
function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const openBtn = document.getElementById("menuToggleBtn");
    const closeBtn = document.getElementById("closeSidebarBtn");

    if (openBtn && sidebar) {
        openBtn.addEventListener("click", e => { e.stopPropagation(); sidebar.classList.add("active"); });
    }
    if (closeBtn && sidebar) {
        closeBtn.addEventListener("click", () => sidebar.classList.remove("active"));
    }
}

function initSettingsPanel() {
    const btn = document.getElementById("openSettingsBtn");
    const panel = document.getElementById("settingsPanel");
    if (btn && panel) btn.addEventListener("click", () => panel.classList.toggle("active"));
}

function setValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}
