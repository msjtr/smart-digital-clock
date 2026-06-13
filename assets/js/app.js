// ============================================================================
// النواة الرئيسية لنظام الساعة الرقمية الذكية
// جامعة حائل - كلية الشريعة والقانون
// ============================================================================

// 1. استيراد الأدوات الأساسية والضرورية فقط
import { fetchJsonData } from './storage.js';
import { handleError } from './utils.js';

// 2. كائن النظام المركزي (لحفظ الحالة والبيانات المشتركة)
window.AppSystem = {
    settings: null,
    isOnline: navigator.onLine,
    version: '1.0.0'
};

// 3. الدالة الرئيسية لتشغيل النظام (الاستيراد الديناميكي الذكي)
async function bootstrapSystem() {
    console.log(`🚀 بدء تشغيل نظام الساعة الذكية الإصدار ${window.AppSystem.version}`);

    // --- تهيئة الإعدادات أولاً (الأساس) ---
    try {
        window.AppSystem.settings = await fetchJsonData('settings');
    } catch (e) { 
        handleError('Settings Init', e); 
        console.warn("⚠️ لم يتم العثور على الإعدادات، سيتم استخدام القيم الافتراضية.");
    }

    // دالة مساعدة ذكية لتحميل الملفات بشكل مستقل
    // إذا تعطل ملف، لن تتأثر باقي الشاشة!
    const loadModule = async (path, initFnName, ...args) => {
        try {
            const module = await import(path);
            if (typeof module[initFnName] === 'function') {
                module[initFnName](...args);
            }
        } catch (error) {
            console.warn(`⏳ جاري تجاوز [${initFnName}]: الملف غير جاهز أو قيد التطوير.`);
        }
    };

    // --- تهيئة الثيمات والتخطيط ---
    if (window.AppSystem.settings) {
        loadModule('./themes.js', 'initThemes', window.AppSystem.settings);
        loadModule('./layouts.js', 'initLayouts', window.AppSystem.settings);
        loadModule('./logos.js', 'initLogos', window.AppSystem.settings);
    }

    // --- تهيئة الوقت والتاريخ (العمود الفقري) ---
    loadModule('./clock.js', 'initClock', window.AppSystem.settings);
    loadModule('./date.js', 'initDate', window.AppSystem.settings);

    // --- تهيئة البيانات الحية (الطقس والصلاة) ---
    loadModule('./weather.js', 'initWeather');
    loadModule('./prayers.js', 'initPrayers');

    // --- تهيئة المحتوى المرئي (المناسبات، الرسائل، العروض) ---
    loadModule('./occasions.js', 'initOccasions');
    loadModule('./messages.js', 'initMessages');
    loadModule('./countdown.js', 'initCountdown');
    loadModule('./content.js', 'initContent');
    loadModule('./viewer.js', 'initViewer');

    // --- تهيئة واجهة المستخدم والنظام ---
    loadModule('./dashboard.js', 'initDashboard');
    loadModule('./fullscreen.js', 'initFullscreen');
    loadModule('./projector.js', 'initProjector');
    loadModule('./qr.js', 'initQR');

    // --- تهيئة أدوات الإدارة ---
    loadModule('./logs.js', 'initLogs');
    loadModule('./notifications.js', 'initNotifications');
    loadModule('./backup.js', 'initBackup');

    // 4. مراقبة حالة الاتصال بالإنترنت
    setupNetworkMonitoring();

    console.log("✅ تم إرسال أوامر التشغيل لجميع وحدات النظام.");
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
    };

    window.addEventListener('online', () => updateStatus(true));
    window.addEventListener('offline', () => updateStatus(false));
    
    // التحديث الأولي عند التحميل
    updateStatus(navigator.onLine);
}

// 6. تشغيل النظام عند اكتمال بناء هيكل HTML (DOM)
document.addEventListener('DOMContentLoaded', bootstrapSystem);
