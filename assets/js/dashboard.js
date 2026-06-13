// assets/js/dashboard.js

export function initDashboard() {
    const settingsBtn = document.getElementById('openSettingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    
    if (!settingsBtn || !settingsPanel) return;

    // فتح وإغلاق لوحة الإعدادات
    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('active');
        
        // تغيير أيقونة/نص الزر عند الفتح والإغلاق
        if (settingsPanel.classList.contains('active')) {
            settingsBtn.innerHTML = '❌ إغلاق';
            settingsPanel.style.display = 'block'; // أو استخدام CSS لعمل Animation
        } else {
            settingsBtn.innerHTML = '⚙️ الإعدادات';
            settingsPanel.style.display = 'none';
        }
    });

    // إغلاق اللوحة عند النقر خارجها
    document.addEventListener('click', (event) => {
        if (!settingsPanel.contains(event.target) && event.target !== settingsBtn) {
            settingsPanel.classList.remove('active');
            settingsBtn.innerHTML = '⚙️ الإعدادات';
            settingsPanel.style.display = 'none';
        }
    });

    // ربط مفاتيح (Checkboxes) لإخفاء وإظهار الأقسام حياً
    const checkboxes = settingsPanel.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', (e) => {
            // مؤقتاً: ربط الترتيب بالأقسام (يمكن تحسينها بإضافة data-target للـ HTML)
            const targets = ['clockSection', 'dateSection', 'messagesSection', 'countdownSection'];
            const targetEl = document.getElementById(targets[index]);
            
            if (targetEl) {
                targetEl.style.display = e.target.checked ? 'block' : 'none';
            }
        });
    });

    console.log("تم تفعيل لوحة التحكم.");
}
