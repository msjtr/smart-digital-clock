// ============================================================================
// Date Manager - نظام التاريخ (ميلادي/هجري) - نسخة البحث المستمر
// ============================================================================

import { padZero } from './utils.js';

export function initDate() {
    console.log("📅 جاري تهيئة نظام التاريخ...");

    function updateDate() {
        const dayElement = document.getElementById('dayName');
        const gregorianElement = document.getElementById('gregorianDate');
        const hijriElement = document.getElementById('hijriDate');

        // فحص وجود العناصر
        if (!dayElement && !gregorianElement && !hijriElement) {
            console.warn("⚠️ التاريخ: العناصر غير موجودة في الصفحة حالياً. سأحاول لاحقاً.");
            return;
        }

        const now = new Date();
        
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

        // 3. التاريخ الهجري (مع fallback للمتصفحات التي لا تدعم التقويم المتقدم)
        if (hijriElement) {
            try {
                const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric'
                });
                hijriElement.textContent = hijriFormatter.format(now);
            } catch (e) {
                // محاولة عرض أي تاريخ هجري قياسي إذا فشل أم القرى
                hijriElement.textContent = now.toLocaleDateString('ar-u-ca-islamic', {
                    day: 'numeric', month: 'long', year: 'numeric'
                });
            }
        }
    }

    // التنفيذ الفوري
    updateDate();
    
    // التحديث كل دقيقة
    setInterval(updateDate, 60000); 
    
    console.log("✅ نظام التاريخ مفعل.");
}
