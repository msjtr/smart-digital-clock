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

    console.log(
        `🚀 بدء تشغيل النظام ${window.AppSystem.version}`
    );

    try {

        window.AppSystem.settings =
            await fetchJsonData(
                "settings"
            );

    } catch (error) {

        handleError(
            "Settings Init",
            error
        );

        window.AppSystem.settings = {};

    }

    // تشغيل الإعدادات أولاً
    await initSettings();

    const loadModule = async (
        path,
        initFnName,
        ...args
    ) => {

        try {

            const module =
                await import(path);

            if (
                typeof module[
                    initFnName
                ] === "function"
            ) {

                await module[
                    initFnName
                ](...args);

            }

        } catch (error) {

            console.warn(
                `⚠️ ${initFnName} غير جاهز`,
                error
            );

        }

    };

    // الثيمات والتخطيط

    loadModule(
        "./themes.js",
        "initThemes",
        window.AppSystem.settings
    );

    loadModule(
        "./layouts.js",
        "initLayouts",
        window.AppSystem.settings
    );

    loadModule(
        "./logos.js",
        "initLogos",
        window.AppSystem.settings
    );

    // الوقت والتاريخ

    loadModule(
        "./clock.js",
        "initClock",
        window.AppSystem.settings
    );

    loadModule(
        "./date.js",
        "initDate",
        window.AppSystem.settings
    );

    // البيانات الحية

    loadModule(
        "./weather.js",
        "initWeather"
    );

    loadModule(
        "./prayers.js",
        "initPrayers"
    );

    // المحتوى

    loadModule(
        "./messages.js",
        "initMessages"
    );

    loadModule(
        "./occasions.js",
        "initOccasions"
    );

    loadModule(
        "./countdown.js",
        "initCountdown"
    );

    loadModule(
        "./content.js",
        "initContent"
    );

    loadModule(
        "./viewer.js",
        "initViewer"
    );

    // النظام

    loadModule(
        "./dashboard.js",
        "initDashboard"
    );

    loadModule(
        "./fullscreen.js",
        "initFullscreen"
    );

    loadModule(
        "./projector.js",
        "initProjector"
    );

    loadModule(
        "./qr.js",
        "initQR"
    );

    // الإدارة

    loadModule(
        "./logs.js",
        "initLogs"
    );

    loadModule(
        "./notifications.js",
        "initNotifications"
    );

    loadModule(
        "./backup.js",
        "initBackup"
    );

    setupNetworkMonitoring();

    console.log(
        "✅ تم تشغيل جميع وحدات النظام"
    );

}

function setupNetworkMonitoring() {

    const updateStatus =
        (online) => {

            window.AppSystem.isOnline =
                online;

            const status =
                document.getElementById(
                    "connectionStatus"
                );

            if (!status) return;

            status.textContent =
                online
                    ? "متصل"
                    : "غير متصل (يعمل محلياً)";

            status.className =
                online
                    ? "status-online"
                    : "status-offline";

        };

    window.addEventListener(
        "online",
        () => updateStatus(true)
    );

    window.addEventListener(
        "offline",
        () => updateStatus(false)
    );

    updateStatus(
        navigator.onLine
    );

}

document.addEventListener(
    "DOMContentLoaded",
    bootstrapSystem
);
