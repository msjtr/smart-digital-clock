// assets/js/utils.js

// إضافة صفر للأرقام الأقل من 10 (مثل 09 بدلاً من 9 في الساعة)
export const padZero = (num) => String(num).padStart(2, '0');

// تحويل الأرقام الإنجليزية إلى عربية (اختياري، يمكن استخدامه لاحقاً)
export const toArabicNumbers = (str) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(str).replace(/[0-9]/g, w => arabicNumbers[+w]);
};

// التعامل مع الأخطاء برمجياً
export const handleError = (context, error) => {
    console.error(`[خطأ في ${context}]:`, error);
};
