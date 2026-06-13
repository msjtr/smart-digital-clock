// assets/js/layouts.js

export function initLayouts(settings = {}) {
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    // تطبيق تخطيط محدد من الإعدادات (مثلاً: grid, column, focus-clock)
    const layoutType = settings.layout || 'default';
    mainContainer.setAttribute('data-layout', layoutType);

    if (layoutType === 'focus-clock') {
        // إعطاء أولوية قصوى لقسم الساعة
        const clockSection = document.getElementById('clockSection');
        if (clockSection) {
            clockSection.style.order = '-1';
            clockSection.classList.add('highlighted-widget');
        }
    }

    console.log(`تم تطبيق التخطيط الهيكلي: ${layoutType}`);
}
