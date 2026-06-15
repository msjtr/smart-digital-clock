// ============================================================================
// ⏳ وحدة العد التنازلي - شاشة العرض الرئيسية
// ============================================================================

/**
 * دالة التهيئة الموحدة (يتم استدعاؤها بواسطة app.js)
 */
export async function initCountdown() {
    console.log("⏳ نظام العد التنازلي جاهز للعرض.");
    
    // تشغيل التحديث الأول فوراً
    updateCountdownDisplay();
    
    // تحديث العد التنازلي كل ثانية
    setInterval(updateCountdownDisplay, 1000);
}

/**
 * وظيفة تحديث واجهة المستخدم للعد التنازلي
 */
function updateCountdownDisplay() {
    const container = document.getElementById("countdownSection");
    if (!container) return; // تأمين ضد غياب العنصر في HTML

    // التاريخ المستهدف (تاريخ الاختبارات)
    const targetDate = new Date("2026-07-01T08:00:00").getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    // حالة انتهاء الوقت
    if (distance < 0) {
        container.innerHTML = `<div class="countdown-finished" style="text-align: center; font-size: 1.5rem;">انتهى الوقت المجدول</div>`;
        return;
    }

    // حساب الوحدات الزمنية
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // تحديث الواجهة بتنسيق نظيف
    container.innerHTML = `
        <div class="countdown-box" style="display: flex; gap: 15px; justify-content: center; font-family: sans-serif;">
            <div class="time-unit" style="text-align: center;"><span>${days}</span><br><small>يوم</small></div>
            <div class="time-unit" style="text-align: center;"><span>${hours}</span><br><small>ساعة</small></div>
            <div class="time-unit" style="text-align: center;"><span>${minutes}</span><br><small>دقيقة</small></div>
            <div class="time-unit" style="text-align: center;"><span>${seconds}</span><br><small>ثانية</small></div>
        </div>
    `;
}
