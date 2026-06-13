// assets/js/clock.js
import { padZero } from './utils.js';

export function initClock(settings = {}) {
    // 1. البحث عن مكان الساعة في الشاشة
    const clockElement = document.getElementById('clock');
    
    // إذا لم يكن العنصر موجوداً، سنطبع رسالة لمعرفة السبب
    if (!clockElement) {
        console.warn("⚠️ لم يتم العثور على عنصر الساعة (id='clock') في شاشة HTML.");
        return;
    }

    // 2. ضبط الإعدادات: جعل نظام 12 ساعة (ص/م) هو الافتراضي
    const is12HourFormat = settings?.clockFormat !== '24'; 
    const showSeconds = settings?.showSeconds !== false;

    // 3. محرك الساعة
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = padZero(now.getMinutes());
        const seconds = padZero(now.getSeconds());
        
        let amPm = '';

        // نظام 12 ساعة وإضافة (ص/م)
        if (is12HourFormat) {
            amPm = hours >= 12 ? ' م' : ' ص'; // م للمساء، ص للصباح
            hours = hours % 12 || 12; // تحويل الصفر (منتصف الليل) إلى 12
        }

        hours = padZero(hours); // إضافة الصفر قبل الساعات الفردية

        // تجميع النص النهائي
        const timeString = showSeconds 
            ? `${hours}:${minutes}:${seconds}${amPm}`
            : `${hours}:${minutes}${amPm}`;

        // عرض الوقت على الشاشة
        clockElement.textContent = timeString;
    }

    // 4. تشغيل الساعة فورا ثم تحديثها كل ثانية
    updateClock();
    setInterval(updateClock, 1000);
    
    console.log("⏱️ تم تفعيل الساعة الرقمية بنجاح مع نظام (ص/م).");
}
