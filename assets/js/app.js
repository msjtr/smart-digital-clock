// ============================================================================
// النواة الرئيسية لنظام الساعة الرقمية الذكية
// جامعة حائل - كلية الشريعة والقانون
// ============================================================================

// 1. استيراد جميع المكونات (Modules)
import { fetchJsonData } from './storage.js';
import { handleError } from './utils.js';
import { initSettings, applySettings } from './settings.js';
import { initClock } from './clock.js';
import { initDate } from './date.js';
import { initWeather } from './weather.js';
import { initPrayers } from './prayers.js';
import { initMessages } from './messages.js';
import { initOccasions } from './occasions.js';
import { initCountdown } from './countdown.js';
import { initContent } from './content.js';
import { initDashboard } from './dashboard.js';
import { initLayouts } from './layouts.js';
import { initThemes } from './themes.js';
import { initLogos } from './logos.js';
import { initLogs } from './logs.js';
import { initNotifications } from './notifications.js';
import { initBackup } from './backup.js';
import { initQR } from './qr.js';
import { initFullscreen } from './fullscreen.js';
import { initProjector } from './projector.js';
import { initViewer } from './viewer.js';

// 2. كائن النظام المركزي (لحفظ الحالة والبيانات المشتركة)
window.AppSystem = {
    settings: null,
    isOnline: navigator.onLine,
    version: '1.0.0'
};

// 3. الدالة الرئيسية لتشغيل النظام
async function bootstrapSystem() {
    console.log(`🚀 بدء تشغيل نظام الساعة الذكية الإصدار ${window.AppSystem.version}`);

    // --- تهيئة الإعدادات أولاً (الأساس) ---
    try {
        window.AppSystem.settings = await fetchJsonData('settings');
        if (window.AppSystem.settings) {
            // تهيئة الثيمات والتخطيط بناءً على الإعدادات
            if (typeof initThemes === 'function') initThemes(window.AppSystem.settings);
            if (typeof initLayouts === 'function') initLayouts(window.AppSystem.settings);
            if (typeof initLogos === 'function') initLogos(window.AppSystem.settings);
        } else {
            console.warn("⚠️ لم يتم العثور على الإعدادات، سيتم استخدام القيم الافتراضية.");
        }
    } catch (e) { handleError('Settings Init', e); }

    // --- تهيئة الوقت والتاريخ (العمود الفقري) ---
    try { if (typeof initClock === 'function') initClock(window.AppSystem.settings); } catch (e) { handleError('Clock', e); }
    try { if (typeof initDate === 'function') initDate(window.AppSystem.settings); } catch (e) { handleError('Date', e); }

    // --- تهيئة البيانات الحية (الطقس والصلاة) ---
    try { if (typeof initWeather === 'function') initWeather(); } catch (e) { handleError('Weather', e); }
    try { if (typeof initPrayers === 'function') initPrayers(); } catch (e) { handleError('Prayers', e); }

    // --- تهيئة المحتوى المرئي (المناسبات، الرسائل، العروض) ---
    try { if (typeof initOccasions === 'function') initOccasions(); } catch (e) { handleError('Occasions', e); }
    try { if (typeof initMessages === 'function') initMessages(); } catch (e) { handleError('Messages', e); }
    try { if (typeof initCountdown === 'function') initCountdown(); } catch (e) { handleError('Countdown', e); }
    try { if (typeof initContent === 'function') initContent(); } catch (e) { handleError('Content', e); }
    try { if (typeof initViewer === 'function') initViewer(); } catch (e) { handleError('Viewer', e); }

    // --- تهيئة واجهة المستخدم والنظام (لوحة التحكم، الشاشة الكاملة، البروجكتور) ---
    try { if (typeof initDashboard === 'function') initDashboard(); } catch (e) { handleError('Dashboard', e); }
    try { if (typeof initFullscreen === 'function') initFullscreen(); } catch (e) { handleError('Fullscreen', e); }
    try { if (typeof initProjector === 'function') initProjector(); } catch (e) { handleError('Projector', e); }
    try { if (typeof initQR === 'function') initQR(); } catch (e) { handleError('QR Code', e); }

    // --- تهيئة أدوات الإدارة (السجلات، الإشعارات، النسخ الاحتياطي) ---
    try { if (typeof initLogs === 'function') initLogs(); } catch (e) { handleError('Logs', e); }
    try { if (typeof initNotifications === 'function') initNotifications(); } catch (e) { handleError('Notifications', e); }
    try { if (typeof initBackup === 'function') initBackup(); } catch (e) { handleError('Backup', e); }

    // 4. مراقبة حالة الاتصال بالإنترنت
    setupNetworkMonitoring();

    console.log("✅ تم اكتمال تهيئة جميع وحدات النظام بنجاح.");
}

// 5. مراقبة الإنترنت لتحديث الواجهة والخدمات
function setupNetworkMonitoring() {
    const updateStatus = (online) => {
        window.AppSystem.isOnline = online;
        const statusBox = document.getElementById('connectionStatus');
        if (statusBox) {
            statusBox.textContent = online ? 'متصل' : 'غير متصل (يعمل محلياً)';
            statusBox.className = online ? 'status-online' : 'status-offline';
        }
        console.log(`🌐 حالة الاتصال: ${online ? 'متصل بالإنترنت' : 'غير متصل'}`);
    };

    window.addEventListener('online', () => updateStatus(true));
    window.addEventListener('offline', () => updateStatus(false));
    
    // التحديث الأولي عند التحميل
    updateStatus(navigator.onLine);
}

// 6. تشغيل النظام عند اكتمال بناء هيكل HTML (DOM)
document.addEventListener('DOMContentLoaded', bootstrapSystem);
