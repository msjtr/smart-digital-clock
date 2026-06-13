// assets/js/logos.js

export function initLogos(settings = {}) {
    const uniLogo = document.getElementById('universityLogo');
    const colLogo = document.getElementById('collegeLogo');

    // تحديث مسارات الشعارات إذا تم توفيرها في الإعدادات
    if (settings.universityLogo && uniLogo) {
        uniLogo.src = settings.universityLogo;
    }
    
    if (settings.collegeLogo && colLogo) {
        colLogo.src = settings.collegeLogo;
    }

    // حماية الواجهة: في حال فشل عرض الصورة بسبب عدم إرفاق الملف أو خطأ في المسار
    const handleImageError = (imgElement, altText) => {
        console.warn(`تعذر عرض ${altText} لتغيب المرفق. تم إخفاء العنصر لمنع التشويه البصري.`);
        imgElement.style.display = 'none'; // إخفاء الأيقونة المكسورة
    };

    if (uniLogo) {
        uniLogo.onerror = () => handleImageError(uniLogo, 'شعار الجامعة');
    }
    
    if (colLogo) {
        colLogo.onerror = () => handleImageError(colLogo, 'شعار الكلية');
    }

    console.log("تم تفعيل نظام إدارة الشعارات.");
}
