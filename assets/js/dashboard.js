// ============================================================================
// Dashboard Manager - النسخة النهائية المربوطة بمدير التخزين الموحد
// ============================================================================

import { fetchJsonData } from "./storage.js"; // الدالة الموحدة لجلب البيانات
import { getLogs } from "./logs.js";

export function initDashboard() {
    console.log("✅ تم تشغيل لوحة التحكم");
    initSidebar();
    initSettingsPanel();
    updateDashboard();

    // تحديث الإحصائيات كل 30 ثانية
    setInterval(updateDashboard, 30000);
}

// ============================================================================
// تحديث الإحصائيات والحالة (نظام غير متزامن)
// ============================================================================
async function updateDashboard() {
    await updateStatistics();
    updateSystemStatus();
}

async function updateStatistics() {
    // جلب البيانات مباشرة باستخدام fetchJsonData الموحدة
    const messages = await fetchJsonData("messages") || [];
    const occasions = await fetchJsonData("occasions") || [];
    const content = await fetchJsonData("content") || [];
    const events = await fetchJsonData("schedules") || []; // تم تعديل الاسم ليتوافق مع مجلد data
    const logs = getLogs() || [];

    setValue("statMessages", messages.length);
    setValue("statOccasions", occasions.length);
    setValue("statContent", content.length);
    setValue("statEvents", events.length);
    setValue("statLogs", logs.length);
}

function updateSystemStatus() {
    // حالة الإنترنت
    setValue("internetStatus", navigator.onLine ? "🟢 متصل" : "🔴 غير متصل");

    // جلب بيانات الطقس من التخزين المحلي
    try {
        const weather = JSON.parse(localStorage.getItem("admin_weather"));
        if (weather && weather.temperature) {
            setValue("currentWeather", `${weather.temperature}°C`);
        } else {
            setValue("currentWeather", "غير متاح");
        }
    } catch (e) {
        setValue("currentWeather", "غير متاح");
    }

    // جلب الصلاة القادمة
    const prayer = localStorage.getItem("next_prayer");
    setValue("nextPrayerStatus", prayer || "جاري التحديث...");
}

// ============================================================================
// الدوال المساعدة
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
