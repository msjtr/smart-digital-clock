/**
 * نظام الأدوات المساعدة للنظام - utils.js
 * جامعة حائل - كلية الشريعة والقانون
 */

// 1. دالة إضافة الصفر للأرقام الفردية (تم حمايتها من القيم الفارغة)
export function padZero(num) {
    if (num === undefined || num === null || isNaN(num)) return '00';
    return num.toString().padStart(2, '0');
}

// 2. دالة موحدة لمعالجة الأخطاء في النظام
export function handleError(moduleName, error) {
    console.error(`[نظام ${moduleName}]:`, error);
}

// 3. دالة تنسيق الوقت (تم حمايتها بتمرير الوقت الحالي افتراضياً)
export function formatTime(date, options = {}) {
    if (!date) date = new Date();
    return date.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        second: options.showSeconds ? '2-digit' : undefined,
        hour12: options.is12Hour || false
    });
}

// 4. دالة التأخير (لعمل أنيميشن أو انتظار)
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 5. دالة إنشاء معرفات فريدة (تم التحديث إلى slice لضمان التوافق مع كل المتصفحات)
export function generateId() {
    return '_' + Math.random().toString(36).slice(2, 11);
}

// 6. دالة تحديث الحالة في الواجهة
export function updateElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
}

// 7. التحقق من وجود عنصر
export function elementExists(id) {
    return !!document.getElementById(id);
}

// 8. دالة لتحويل التواريخ الهجرية (دعم تمرير تاريخ مخصص)
export function getHijriDate(date = new Date()) {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
}

// 9. دالة لتنظيف النصوص أمنياً (تمت حمايتها من النصوص الفارغة)
export function sanitize(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
