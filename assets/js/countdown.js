// ============================================================================
// Countdown Manager - نظام العد التنازلي (الساعة والدقيقة والثانية)
// ============================================================================

import { getOccasions } from './occasions.js';
import { padZero } from './utils.js';

export function initCountdown() {
    // 1. تصحيح الـ ID ليتطابق مع ملف الـ HTML الخاص بك
    const display = document.getElementById('countdown') || document.getElementById('countdownDisplay');
    
    if (!display) {
        console.warn("⚠️ لم يتم العثور على عنصر العد التنازلي في الصفحة");
        return;
    }

    function update() {
        const list = getOccasions() || [];
        const now = new Date();
        
        // 2. دعم خاصية startDate بدلاً من date فقط لتتوافق مع ملف occasions.js
        const next = list
            .filter(o => {
                const targetDate = new Date(o.startDate || o.date);
                return targetDate > now;
            })
            .sort((a, b) => new Date(a.startDate || a.date) - new Date(b.startDate || b.date))[0];
        
        if (!next) { 
            display.innerHTML = '<div style="font-size: 2rem; color: #94a3b8;">لا توجد فعاليات قادمة</div>'; 
            return; 
        }
        
        const diff = new Date(next.startDate || next.date) - now;

        // حساب الوحدات الزمنية
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        // العرض بتنسيق: الأيام و الساعات:الدقائق:الثواني
        display.innerHTML = `
            <div class="countdown-label" style="font-size: 1.5rem; margin-bottom: 10px;">باقي على ${next.title}</div>
            <div class="countdown-timer" style="font-size: 3.5rem; font-weight: bold; direction: ltr; color: var(--primary, #3b82f6);">
                ${days > 0 ? `<span style="font-size: 2rem;">${days} يوم و </span>` : ''}
                ${padZero(hours)}:${padZero(mins)}:${padZero(secs)}
            </div>
        `;
    }
    
    // تحديث كل ثانية لضمان حركة الثواني
    setInterval(update, 1000);
    update();
    console.log("✅ نظام العد التنازلي مفعل.");
}
