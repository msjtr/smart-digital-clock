// ============================================================================
// Logo Manager - إدارة الشعارات (يدعم التحديث اللحظي)
// ============================================================================

export function initLogos(settings = {}) {
    applyLogos(settings);
    console.log("تم تفعيل نظام إدارة الشعارات.");
}

/**
 * دالة مستقلة لتطبيق الشعارات (يمكن استدعاؤها من sync.js عند تلقي تحديث)
 */
export function applyLogos(settings = {}) {
    const uniLogo = document.getElementById('universityLogo');
    const colLogo = document.getElementById('collegeLogo');

    // 1. تحديث المصادر
    if (uniLogo) {
        if (settings.universityLogo) uniLogo.src = settings.universityLogo;
        uniLogo.style.display = 'block'; // إعادة الإظهار عند تغيير المصدر
        uniLogo.onerror = () => handleImageError(uniLogo, 'شعار الجامعة');
    }
    
    if (colLogo) {
        if (settings.collegeLogo) colLogo.src = settings.collegeLogo;
        colLogo.style.display = 'block';
        colLogo.onerror = () => handleImageError(colLogo, 'شعار الكلية');
    }
}

/**
 * معالجة الأخطاء بصرياً
 */
function handleImageError(imgElement, altText) {
    console.warn(`تعذر عرض ${altText} لتغيب المرفق أو خطأ في المسار.`);
    imgElement.style.display = 'none'; // إخفاء الأيقونة المكسورة
}
