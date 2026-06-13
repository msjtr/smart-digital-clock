// ============================================================================
// Clock Manager - محرك الساعة الذكي
// ============================================================================
import { padZero } from './utils.js';

/**
 * تهيئة الساعة الرقمية
 * @param {object} settings - إعدادات الساعة الأولية
 */
export function initClock(settings = {}) {
    const clockElement = document.getElementById('clock');
    
    if (!clockElement) {
        console.warn("⚠️ لم يتم العثور على عنصر الساعة (id='clock') في شاشة HTML.");
        return;
    }

    // دالة محرك الساعة المحدثة
    function updateClock() {
        // نستخدم الإعدادات الممررة، مع محاولة جلب التحديثات من المتغير العالمي (window.appSettings) إن وجد
        const currentSettings = window.appSettings || settings;
        
        const is12HourFormat = currentSettings?.clockFormat !== '24'; 
        const showSeconds = currentSettings?.showSeconds !== false;

        const now = new Date();
        let hours = now.getHours();
        const minutes = padZero(now.getMinutes());
        const seconds = padZero(now.getSeconds());
        
        let amPm = '';

        // نظام 12 ساعة وإضافة (ص/م)
        if (is12HourFormat) {
            amPm = hours >= 12 ? ' م' : ' ص';
            hours = hours % 12 || 12;
        }

        hours = padZero(hours);

        // تجميع النص النهائي
        const timeString = showSeconds 
            ? `${hours}:${minutes}:${seconds}${amPm}`
            : `${hours}:${minutes}${amPm}`;

        // عرض الوقت على الشاشة
        if (clockElement.textContent !== timeString) {
            clockElement.textContent = timeString;
        }
    }

    // تشغيل الساعة فوراً ثم تحديثها كل ثانية
    updateClock();
    setInterval(updateClock, 1000);
    
    console.log("⏱️ تم تفعيل الساعة الرقمية بنجاح.");
}

/**
 * دالة لتحديث إعدادات الساعة من الخارج (تُستخدم عند استقبال تحديث من لوحة الإدارة)
 * @param {object} newSettings 
 */
export function updateClockSettings(newSettings) {
    window.appSettings = { ...window.appSettings, ...newSettings };
    console.log("⏱️ تم تحديث إعدادات الساعة لحظياً.");
}
