// ============================================================================
// Date Manager - نظام التاريخ (ميلادي/هجري) - متوافق مع HTML
// ============================================================================

import { padZero } from './utils.js';

export function initDate() {
    console.log("📅 جاري تهيئة نظام التاريخ...");

    function updateDate() {
        // البحث عن الحاوية الرئيسية
        const container = document.getElementById('dateSection');
        
        // التحقق من وجود الحاوية (في حال لم يتم تحميلها بعد)
        if (!container) return;

        const now = new Date();

        // تحديث المحتوى داخل الحاوية ديناميكياً
        // نستخدم innerHTML هنا لأننا نتعامل مع حاوية dateSection
        const dayName = now.toLocaleDateString('ar-SA', { weekday: 'long' });
        const gregDate = now.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
        
        let hijriDate = "التاريخ الهجري غير متاح";
        try {
            hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
                day: 'numeric', month: 'long', year: 'numeric'
            }).format(now);
        } catch (e) {
            console.warn("تعذر تنسيق الهجري");
        }

        container.innerHTML = `
            <div id="dayName" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 5px;">${dayName}</div>
            <div id="gregorianDate" style="font-size: 1.2rem; margin-bottom: 5px;">${gregDate}</div>
            <div id="hijriDate" style="font-size: 1.2rem;">${hijriDate}</div>
        `;
    }

    // التنفيذ الفوري
    updateDate();
    
    // التحديث كل دقيقة
    setInterval(updateDate, 60000); 
    
    console.log("✅ نظام التاريخ مفعل ومربوط.");
}
