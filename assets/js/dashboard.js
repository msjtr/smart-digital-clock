// assets/js/dashboard.js

export function initDashboard() {
    console.log("جارٍ تهيئة لوحة التحكم والقوائم...");

    // 1. القائمة الجانبية (Sidebar)
    const sidebar = document.getElementById('sidebar');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');

    if (menuToggleBtn && sidebar) {
        menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.add('active');
        });
    }

    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // 2. لوحة الإعدادات
    const settingsBtn = document.getElementById('openSettingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    
    if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.classList.toggle('active');
            
            if (settingsPanel.classList.contains('active')) {
                settingsBtn.innerHTML = '❌ إغلاق';
                settingsPanel.style.display = 'block';
            } else {
                settingsBtn.innerHTML = '⚙️ الإعدادات';
                settingsPanel.style.display = 'none';
            }
        });

        // ربط Checkboxes الإعدادات
        const checkboxes = settingsPanel.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', (e) => {
                const targets = ['clockSection', 'dateSection', 'messagesSection', 'countdownSection'];
                const targetEl = document.getElementById(targets[index]);
                if (targetEl) {
                    targetEl.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        });
    }

    // إغلاق أي شيء عند النقر في أي مكان خارج العناصر
    document.addEventListener('click', (event) => {
        // إغلاق القائمة
        if (sidebar && sidebar.classList.contains('active') && !sidebar.contains(event.target) && event.target !== menuToggleBtn) {
            sidebar.classList.remove('active');
        }
        // إغلاق الإعدادات
        if (settingsPanel && settingsPanel.style.display === 'block' && !settingsPanel.contains(event.target) && event.target !== settingsBtn) {
            settingsPanel.classList.remove('active');
            settingsPanel.style.display = 'none';
            if(settingsBtn) settingsBtn.innerHTML = '⚙️ الإعدادات';
        }
    });

    console.log("تم تفعيل لوحة التحكم والقائمة الجانبية.");
}
