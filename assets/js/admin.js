// assets/js/admin.js
export function initAdmin() {
    // 1. نظام التنقل بين التبويبات (Tabs)
    const menuItems = document.querySelectorAll('.sidebar-menu li[data-tab]');
    const tabContents = document.querySelectorAll('.tab-pane');
    const pageTitle = document.querySelector('.page-title');

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

    // 2. تحديث الساعة الحية في لوحة الإدارة
    const timeDisplay = document.getElementById('adminCurrentTime');
    if (timeDisplay) {
        setInterval(() => {
            const now = new Date();
            timeDisplay.textContent = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        }, 1000);
    }

    // 3. تهيئة زر القائمة الجانبية (للموبايل)
    const toggleSidebar = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    if (toggleSidebar && sidebar) {
        toggleSidebar.addEventListener('click', () => {
            sidebar.style.display = sidebar.style.display === 'none' ? 'flex' : 'none';
        });
    }

    console.log("تم تهيئة نظام الإدارة.");
}
