// assets/js/admin.js

export function initAdmin() {
    const menuItems = document.querySelectorAll('.admin-menu li');
    const tabContents = document.querySelectorAll('.tab-content');

    // نظام التنقل بين التبويبات (Tabs)
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // 1. إزالة كلاس active من جميع الأزرار والتبويبات
            menuItems.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            // 2. تفعيل الزر الحالي والتبويب المرتبط به
            item.classList.add('active');
            const targetTab = document.getElementById(item.dataset.tab);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    console.log("تم تهيئة نظام لوحة التحكم.");
}
