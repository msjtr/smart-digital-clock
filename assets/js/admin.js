// assets/js/admin.js

export function initAdmin() {
    const menuItems = document.querySelectorAll('.sidebar-menu li[data-tab]');
    const tabContents = document.querySelectorAll('.tab-pane');
    const pageTitle = document.querySelector('.page-title');

    // نظام التنقل بين التبويبات
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            item.classList.add('active');
            const targetId = item.getAttribute('data-tab');
            const targetTab = document.getElementById(targetId);
            
            if (targetTab) {
                targetTab.classList.add('active');
                if (pageTitle) {
                    pageTitle.textContent = item.textContent.replace(/[^\u0600-\u06FF\s]/g, '').trim();
                }
            }
        });
    });

    // تحديث الساعة الحية في لوحة الإدارة
    const timeDisplay = document.getElementById('adminCurrentTime');
    if (timeDisplay) {
        setInterval(() => {
            const now = new Date();
            timeDisplay.textContent = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        }, 1000);
    }

    console.log("تم تهيئة واجهة لوحة التحكم الإدارية.");
}
