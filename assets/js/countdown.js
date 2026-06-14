// ============================================================================
// Countdown Manager - نظام العد التنازلي (الساعة والدقيقة والثانية)
// ============================================================================

import { getOccasions } from './occasions.js';
import { padZero } from './utils.js';

export function initCountdown() {
    const display = document.getElementById('countdownDisplay');
    if (!display) {
        console.warn("⚠️ لم يتم العثور على عنصر #countdownDisplay");
        return;
    }

    function update() {
        const list = getOccasions();
        const now = new Date();
        
        // جلب أقرب مناسبة قادمة
        const next = list
            .filter(o => new Date(o.date) > now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
        
        if (!next) { 
            display.textContent = "لا توجد فعاليات قادمة"; 
            return; 
        }
        
        const diff = new Date(next.date) - now;

        // حساب الوحدات الزمنية
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        // العرض بتنسيق: الأيام و الساعات:الدقائق:الثواني
        // نستخدم padZero لضمان ظهور 01 بدلاً من 1
        display.innerHTML = `
            <div class="countdown-label">باقي على ${next.title}</div>
            <div class="countdown-timer">
                ${days > 0 ? `${days} يوم - ` : ''}
                ${padZero(hours)}:${padZero(mins)}:${padZero(secs)}
            </div>
        `;
    }
    
    // تحديث كل ثانية لضمان حركة الثواني
    setInterval(update, 1000);
    update();
    console.log("⏳ نظام العد التنازلي (بالثواني) يعمل.");
}
