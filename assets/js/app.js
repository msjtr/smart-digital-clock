// ============================================================================
// النواة الرئيسية لنظام الساعة الرقمية الذكية
// جامعة حائل - كلية الشريعة والقانون
// ============================================================================

import { fetchJsonData } from "./storage.js";
import { handleError } from "./utils.js";
import { initSettings } from "./settings.js";

window.AppSystem = {
    settings: null,
    isOnline: navigator.onLine,
    version: "1.0.0"
};

async function bootstrapSystem() {
    console.log(`🚀 بدء تشغيل النظام ${window.AppSystem.version}`);

    // 1. تحميل الإعدادات أولاً
    try {
        window.AppSystem.settings = await fetchJsonData("settings");
    } catch (error) {
        handleError("Settings Init", error);
        window.AppSystem.settings = {};
    }

    await initSettings();

    // 2. قائمة الوحدات للتحميل (تم إضافة نظام الدخول والإدارة هنا)
    const modules = [
        // --- تمت إضافة هذين السطرين ليعمل زر الدخول ولوحة الإدارة ---
        { path: "./auth.js", fn: "initAuth" },
        { path: "./admin.js", fn: "initAdmin" },
        // --------------------------------------------------------------
        { path: "./themes.js", fn: "initThemes", args: [window.AppSystem.settings] },
        { path: "./layouts.js", fn: "initLayouts", args: [window.AppSystem.settings] },
        { path: "./logos.js", fn: "initLogos", args: [window.AppSystem.settings] },
        { path: "./clock.js", fn: "initClock", args: [window.AppSystem.settings] },
        { path: "./date.js", fn: "initDate", args: [window.AppSystem.settings] },
        { path: "./weather.js", fn: "initWeather" },
        { path: "./prayers.js", fn: "initPrayers" },
        { path: "./messages.js", fn: "initMessages" },
        { path: "./occasions.js", fn: "initOccasions" },
        { path: "./countdown.js", fn: "initCountdown" },
        { path: "./content.js", fn: "initContent" },
        { path: "./viewer.js", fn: "initViewer" },
        { path: "./dashboard.js", fn: "initDashboard" },
        { path: "./fullscreen.js", fn: "initFullscreen" },
        { path: "./projector.js", fn: "initProjector" },
        { path: "./qr.js", fn: "initQR" },
        { path: "./logs.js", fn: "initLogs" },
        { path: "./notifications.js", fn: "initNotifications" },
        { path: "./backup.js", fn: "initBackup" }
    ];

    // تحميل الوحدات بالتوازي لزيادة السرعة
    await Promise.allSettled(modules.map(async (mod) => {
        try {
            const module = await import(mod.path);
            if (typeof module[mod.fn] === "function") {
                await module[mod.fn](...(mod.args || []));
            }
        } catch (error) {
            console.warn(`⚠️ تعذر تحميل الوحدة: ${mod.path}`, error);
        }
    }));

    setupNetworkMonitoring();
    console.log("✅ تم تشغيل جميع وحدات النظام بنجاح.");
}

function setupNetworkMonitoring() {
    const updateStatus = (online) => {
        window.AppSystem.isOnline = online;
        const status = document.getElementById("connectionStatus");
        if (!status) return;

        status.textContent = online ? "متصل" : "غير متصل (يعمل محلياً)";
        status.className = online ? "status-online" : "status-offline";
    };

    window.addEventListener("online", () => updateStatus(true));
    window.addEventListener("offline", () => updateStatus(false));
    updateStatus(navigator.onLine);
}

document.addEventListener("DOMContentLoaded", bootstrapSystem);
