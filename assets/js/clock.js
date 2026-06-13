/**
 * نظام الأدوات المساعدة للنظام - utils.js
 * جامعة حائل - كلية الشريعة والقانون
 */

// 1. دالة إضافة الصفر للأرقام الفردية (مطلوبة لعمل الساعة والعد التنازلي)
export function padZero(num) {
    return num.toString().padStart(2, '0');
}

// 2. دالة موحدة لمعالجة الأخطاء في النظام
export function handleError(moduleName, error) {
    console.error(`[نظام ${moduleName}]:`, error);
}

// 3. دالة تنسيق الوقت (تستخدم في أكثر من مكان)
export function formatTime(date, options = {}) {
    return date.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        second: options.showSeconds ? '2-digit' : undefined,
        hour12: options.is12Hour || false
    });
}

// 4. دالة التأخير (لعمل أنيميشن أو انتظار)
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 5. دالة إنشاء معرفات فريدة (تستخدم للمناسبات أو الرسائل المضافة)
export function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// 6. دالة تحديث الحالة في الواجهة
export function updateElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// 7. التحقق من وجود عنصر
export function elementExists(id) {
    return !!document.getElementById(id);
}

// 8. دالة لتحويل التواريخ الهجرية 
export function getHijriDate() {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date());
}

// 9. دالة لتنظيف النصوص (أمنياً)
export function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
