// assets/js/themes.js

export function initThemes(settings = {}) {
    // تطبيق الثيم من الإعدادات أو استخدام الداكن كافتراضي
    const currentTheme = settings.theme || 'dark';
    document.body.setAttribute('data-theme', currentTheme);

    // تطبيق الألوان المخصصة إذا وجدت
    if (settings.colors) {
        const root = document.documentElement;
        if (settings.colors.primary) {
            root.style.setProperty('--primary-color', settings.colors.primary);
        }
        if (settings.colors.accent) {
            root.style.setProperty('--accent-color', settings.colors.accent);
        }
    }

    console.log(`تم تطبيق المظهر: ${currentTheme}`);
}

// دالة لتغيير الثيم برمجياً
export function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    return newTheme;
}
