// ============================================================================
// ⏳ وحدة العد التنازلي - شاشة العرض الرئيسية
// ============================================================================

/**
 * دالة التهيئة الرئيسية التي يستدعيها app.js
 */
export async function initCountdown() {
    console.log("⏳ نظام العد التنازلي جاهز للعرض.");
    
    // تشغيل العد التنازلي عند تحميل الصفحة
    updateCountdownDisplay();
    
    // تحديث العد التنازلي كل ثانية
    setInterval(updateCountdownDisplay, 1000);
}

/**
 * وظيفة تحديث واجهة العرض
 */
function updateCountdownDisplay() {
    const container = document.getElementById("countdownSection");
    if (!container) return;

    // التاريخ المستهدف (مثلاً تاريخ انتهاء الاختبارات - يمكنك تغييره لاحقاً)
    const targetDate = new Date("2026-07-01T08:00:00").getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        container.innerHTML = `<div class="countdown-finished">انتهى الوقت المجدول</div>`;
        return;
    }

    // حساب الأيام والساعات والدقائق والثواني
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // تحديث الواجهة (باستخدام تنسيق Glassmorphism المتناسب مع تصميمك)
    container.innerHTML = `
        <div class="countdown-box" style="display: flex; gap: 15px; justify-content: center; font-family: sans-serif;">
            <div class="time-unit"><span>${days}</span><small>يوم</small></div>
            <div class="time-unit"><span>${hours}</span><small>ساعة</small></div>
            <div class="time-unit"><span>${minutes}</span><small>دقيقة</small></div>
            <div class="time-unit"><span>${seconds}</span><small>ثانية</small></div>
        </div>
    `;
}
