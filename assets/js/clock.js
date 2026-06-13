// assets/js/clock.js
import { padZero } from './utils.js';

export function initClock(settings = {}) {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;

    // قراءة الإعدادات (إذا لم تكن متوفرة نضع قيماً افتراضية)
    const is12HourFormat = settings.clockFormat === '12';
    const showSeconds = settings.showSeconds !== false;

    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = padZero(now.getMinutes());
        const seconds = padZero(now.getSeconds());
        
        let amPm = '';

        if (is12HourFormat) {
            amPm = hours >= 12 ? ' م' : ' ص';
            hours = hours % 12 || 12; // تحويل الصفر إلى 12
        }

        hours = padZero(hours);

        const timeString = showSeconds 
            ? `${hours}:${minutes}:${seconds}${amPm}`
            : `${hours}:${minutes}${amPm}`;

        clockElement.textContent = timeString;
    }

    // تحديث كل ثانية
    setInterval(updateClock, 1000);
    updateClock(); // تشغيل فوري
    console.log("تم تفعيل الساعة الرقمية.");
}
