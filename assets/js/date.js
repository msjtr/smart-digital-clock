// ============================================================================
// Date Manager - نظام التاريخ (ميلادي/هجري)
// ============================================================================

import { padZero } from './utils.js';

/**
 * تهيئة نظام عرض التاريخ
 */
export function initDate() {
    const dayElement = document.getElementById('dayName');
    const gregorianElement = document.getElementById('gregorianDate');
    const hijriElement = document.getElementById('hijriDate');

    // تخزين اليوم الحالي للمقارنة
    let lastDateString = "";

    function updateDate() {
        const now = new Date();
        const dateString = now.toDateString(); 

        // التحديث فقط إذا تغير اليوم فعلياً
        if (dateString !== lastDateString) {
            
            // 1. اليوم (اسم اليوم)
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

            // 3. التاريخ الهجري (مع معالجة استثنائية للمتصفحات)
            if (hijriElement) {
                try {
                    const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric'
                    });
                    hijriElement.textContent = hijriFormatter.format(now);
                } catch (e) {
                    console.warn("⚠️ تعذر تنسيق التاريخ الهجري، يتم استخدام التنسيق الاحتياطي.");
                    hijriElement.textContent = "التاريخ الهجري غير متاح";
                }
            }

            lastDateString = dateString;
            console.log("📅 تم تحديث التاريخ إلى: " + dateString);
        }
    }

    // التنفيذ الفوري
    updateDate();
    
    // التحقق كل دقيقة لضمان الدقة عند منتصف الليل
    setInterval(updateDate, 60000); 
    
    console.log("✅ نظام التاريخ مفعل ومربوط.");
}
