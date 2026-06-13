// assets/js/layouts.js

/**
 * تهيئة التخطيطات وتطبيقها
 * @param {object} settings 
 */
export function initLayouts(settings = {}) {
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    applyLayout(settings.layout || 'default');
    console.log(`تم تطبيق التخطيط الهيكلي: ${settings.layout || 'default'}`);
}

/**
 * دالة مستقلة لتطبيق التخطيط (يمكن استدعاؤها في أي وقت)
 */
export function applyLayout(layoutType) {
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    // تغيير الـ attribute لتفعيل الـ CSS الخاص بهذا التخطيط
    mainContainer.setAttribute('data-layout', layoutType);

    // معالجة حالة "الساعة المركزة"
    const clockSection = document.getElementById('clockSection');
    if (clockSection) {
        if (layoutType === 'focus-clock') {
            clockSection.style.order = '-1';
            clockSection.classList.add('highlighted-widget');
        } else {
            clockSection.style.order = '';
            clockSection.classList.remove('highlighted-widget');
        }
    }
}
