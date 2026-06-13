// assets/js/date.js
import { padZero } from './utils.js';

export function initDate() {
    const dayElement = document.getElementById('dayName');
    const gregorianElement = document.getElementById('gregorianDate');
    const hijriElement = document.getElementById('hijriDate');

    // تخزين اليوم الحالي للمقارنة
    let lastDateString = "";

    function updateDate() {
        const now = new Date();
        const dateString = now.toDateString(); // مثال: "Sun Jun 14 2026"

        // التحديث فقط إذا تغير اليوم فعلياً (لمنع التحديث غير الضروري)
        if (dateString !== lastDateString) {
            
            // 1. اليوم
            if (dayElement) {
                dayElement.textContent = now.toLocaleDateString('ar-SA', { weekday: 'long' });
            }

            // 2. التاريخ الميلادي
            if (gregorianElement) {
                gregorianElement.textContent = now.toLocaleDateString('ar-SA', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            }

            // 3. التاريخ الهجري
            if (hijriElement) {
                const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric'
                });
                hijriElement.textContent = hijriFormatter.format(now);
            }

            lastDateString = dateString;
            console.log("📅 تم تحديث التاريخ إلى: " + dateString);
        }
    }

    updateDate();
    // التحقق كل دقيقة بدلاً من ساعة لضمان الدقة المطلقة عند منتصف الليل
    setInterval(updateDate, 60000); 
    console.log("تم تفعيل نظام التاريخ (ميلادي/هجري).");
}
