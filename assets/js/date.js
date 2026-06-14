// ============================================================================
// Date Manager - نظام التاريخ (ميلادي/هجري) - النسخة النهائية
// ============================================================================

import { padZero } from './utils.js';

/**
 * تهيئة نظام عرض التاريخ
 */
export function initDate() {
    console.log("📅 جاري تهيئة نظام التاريخ...");

    function updateDate() {
        const dayElement = document.getElementById('dayName');
        const gregorianElement = document.getElementById('gregorianDate');
        const hijriElement = document.getElementById('hijriDate');

        // إذا لم توجد العناصر، نخرج بسلام
        if (!dayElement && !gregorianElement && !hijriElement) {
            console.warn("⚠️ تحذير: لم يتم العثور على أي عنصر تاريخ (dayName, gregorianDate, hijriDate) في الصفحة.");
            return;
        }

        const now = new Date();
        
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
                console.error("❌ خطأ في تنسيق التاريخ الهجري:", e);
                hijriElement.textContent = "التاريخ الهجري غير متاح";
            }
        }
    }

    // التنفيذ الفوري
    updateDate();
    
    // التحقق كل دقيقة لضمان الدقة عند منتصف الليل
    setInterval(updateDate, 60000); 
    
    console.log("✅ نظام التاريخ مفعل ومربوط.");
}
