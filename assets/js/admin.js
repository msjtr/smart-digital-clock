// assets/js/admin.js

export function initAdmin() {
    // 1. نظام التنقل بين التبويبات (Tabs)
    const menuItems = document.querySelectorAll('.sidebar-menu li[data-tab]');
    const tabContents = document.querySelectorAll('.tab-pane');
    const pageTitle = document.querySelector('.page-title');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // إزالة التفعيل من جميع الأزرار
            menuItems.forEach(btn => btn.classList.remove('active'));
            
            // إخفاء جميع التبويبات برمجياً وتنسيقياً
            tabContents.forEach(tab => {
                tab.classList.remove('active');
                tab.style.display = 'none'; 
            });

            // تفعيل الزر المختار
            item.classList.add('active');
            
            // إظهار التبويب المطلوب
            const targetId = item.getAttribute('data-tab');
            const targetTab = document.getElementById(targetId);
            
            if (targetTab) {
                targetTab.classList.add('active');
                targetTab.style.display = 'block'; // فرض الإظهار
                
                // تحديث العنوان العلوي
                if (pageTitle) {
                    pageTitle.textContent = item.textContent.replace(/[^\u0600-\u06FF\s]/g, '').trim();
                }
            }
        });
    });

    // 2. تحديث الساعة الحية في لوحة الإدارة
    const timeDisplay = document.getElementById('adminCurrentTime');
    if (timeDisplay) {
        const updateAdminTime = () => {
            const now = new Date();
            timeDisplay.textContent = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        };
        updateAdminTime(); // تشغيل فوري
        setInterval(updateAdminTime, 1000);
    }

    // 3. تهيئة زر القائمة الجانبية (للموبايل والشاشات الصغيرة)
    const toggleSidebar = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    if (toggleSidebar && sidebar) {
        toggleSidebar.addEventListener('click', () => {
            const isHidden = window.getComputedStyle(sidebar).display === 'none';
            sidebar.style.display = isHidden ? 'flex' : 'none';
        });
    }

    // 4. إدارة العرض المباشر (إضافة حماية لتجنب الأخطاء إذا لم يوجد الزر)
    const saveDisplayBtn = document.querySelector('#displayManager .btn-primary');
    if (saveDisplayBtn) {
        saveDisplayBtn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('#displayManager input[type="checkbox"]');
            let displaySettings = {};
            checkboxes.forEach((cb) => {
                const label = cb.parentElement.querySelector('.control-label').textContent.trim();
                displaySettings[label] = cb.checked;
            });

            console.log('تم حفظ إعدادات العرض:', displaySettings);
            
            // تغيير شكل الزر مؤقتاً للتأكيد
            const originalText = saveDisplayBtn.textContent;
            saveDisplayBtn.textContent = '✅ تم الحفظ';
            setTimeout(() => { saveDisplayBtn.textContent = originalText; }, 2000);

            // تحديث المعاينة المباشرة
            const previewFrame = document.getElementById('livePreviewFrame');
            if (previewFrame) {
                previewFrame.contentWindow.location.reload();
            }
        });
    }

    console.log("✅ تم تهيئة نظام الإدارة بالكامل.");
}
