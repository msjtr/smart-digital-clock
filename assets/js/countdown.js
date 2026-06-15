// ============================================================================
// ⏳ وحدة العد التنازلي (شاشة العرض الرئيسية)
// ============================================================================

// متغير لحفظ العداد وإيقافه عند الحاجة
let countdownInterval;

/**
 * دالة التهيئة الموحدة التي يستدعيها app.js
 */
export async function initCountdown() {
    console.log("⏳ جاري تهيئة نظام العد التنازلي...");

    // تشغيل التحديث فوراً لتجنب ظهور مساحة فارغة في الثانية الأولى
    updateCountdownDisplay();

    // مسح أي عداد سابق (إن وجد) لمنع تداخل التوقيت
    if (countdownInterval) clearInterval(countdownInterval);
    
    // تحديث العداد كل ثانية
    countdownInterval = setInterval(updateCountdownDisplay, 1000);
}

/**
 * وظيفة تحديث واجهة المستخدم للعد التنازلي
 */
function updateCountdownDisplay() {
    const container = document.getElementById("countdownSection");
    if (!container) return; // حماية من الأخطاء إذا كان العنصر غير موجود في HTML

    // تحديد تاريخ الهدف (مثال: بداية الاختبارات النهائية)
    const targetDate = new Date("2026-07-01T08:00:00").getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    // تصميم Glassmorphism المعتمد (خلفية كحلية شفافة مع تأثير الزجاج)
    const glassStyle = `
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 25px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        text-align: center;
        color: #ffffff;
        font-family: 'Tajawal', sans-serif;
    `;

    // إذا انتهى الوقت المجدول
    if (distance < 0) {
        container.innerHTML = `
            <div style="${glassStyle}">
                <h2 style="margin: 0; color: #14b8a6; font-size: 2rem;">تم انتهاء الوقت المجدول</h2>
            </div>
        `;
        if (countdownInterval) clearInterval(countdownInterval);
        return;
    }

    // الحسابات الزمنية
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // دالة مساعدة لإضافة صفر على اليسار إذا كان الرقم أقل من 10 (مثل: 09 بدلاً من 9)
    const formatTime = (time) => time < 10 ? `0${time}` : time;

    // تنسيقات المربعات الداخلية لكل وحدة زمنية
    const unitStyle = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 85px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 15px 10px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    `;

    // تنسيق الأرقام (باللون التركوازي #14b8a6)
    const numberStyle = `
        font-size: 2.5rem;
        font-weight: bold;
        color: #14b8a6;
        line-height: 1;
        margin-bottom: 8px;
    `;

    // تنسيق النصوص (يوم، ساعة، إلخ)
    const labelStyle = `
        font-size: 1rem;
        color: #94a3b8;
    `;

    // حقن كود HTML في العنصر
    container.innerHTML = `
        <div style="${glassStyle}">
            <h3 style="margin: 0 0 20px 0; font-size: 1.4rem; color: #e2e8f0; font-weight: 500;">العد التنازلي للاختبارات النهائية</h3>
            <div style="display: flex; gap: 15px; justify-content: center; direction: ltr;">
                <div style="${unitStyle}">
                    <span style="${numberStyle}">${formatTime(days)}</span>
                    <span style="${labelStyle}">يوم</span>
                </div>
                <div style="${unitStyle}">
                    <span style="${numberStyle}">${formatTime(hours)}</span>
                    <span style="${labelStyle}">ساعة</span>
                </div>
                <div style="${unitStyle}">
                    <span style="${numberStyle}">${formatTime(minutes)}</span>
                    <span style="${labelStyle}">دقيقة</span>
                </div>
                <div style="${unitStyle}">
                    <span style="${numberStyle}">${formatTime(seconds)}</span>
                    <span style="${labelStyle}">ثانية</span>
                </div>
            </div>
        </div>
    `;
}
