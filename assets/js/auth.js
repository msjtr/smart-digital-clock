// assets/js/admin.js

export function initAdmin() {
    // 1. نظام التنقل بين التبويبات (Tabs)
    const menuItems = document.querySelectorAll('.sidebar-menu li[data-tab]');
    const tabContents = document.querySelectorAll('.tab-pane');
    const pageTitle = document.querySelector('.page-title');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // إزالة التفعيل من جميع الأزرار والتبويبات
            menuItems.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));

            // تفعيل الزر والتبويب المطلوب
            item.classList.add('active');
            const targetId = item.getAttribute('data-tab');
            const targetTab = document.getElementById(targetId);
            
            if (targetTab) {
                targetTab.classList.add('active');
                // تحديث عنوان الصفحة العلوية (وتنظيفه من الإيموجي)
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
        updateAdminTime(); // تشغيل فوري لتجنب تأخير ثانية
        setInterval(updateAdminTime, 1000);
    }

    // 3. تهيئة زر القائمة الجانبية (للموبايل والشاشات الصغيرة)
    const toggleSidebar = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.admin-sidebar');
    if (toggleSidebar && sidebar) {
        toggleSidebar.addEventListener('click', () => {
            sidebar.style.display = (sidebar.style.display === 'none' || sidebar.style.display === '') ? 'flex' : 'none';
        });
    }

    // 4. (إضافة جديدة) إدارة العرض المباشر (حفظ عناصر الشاشة)
    const saveDisplayBtn = document.querySelector('#displayManager .btn-primary');
    if (saveDisplayBtn) {
        saveDisplayBtn.addEventListener('click', () => {
            // جمع قيم خيارات العرض (Checkboxes)
            const checkboxes = document.querySelectorAll('#displayManager input[type="checkbox"]');
            let displaySettings = {};
            
            checkboxes.forEach((cb) => {
                const label = cb.nextElementSibling.textContent.trim();
                displaySettings[label] = cb.checked;
            });

            console.log('تم حفظ إعدادات العرض:', displaySettings);
            
            // تغيير شكل الزر مؤقتاً لتأكيد الحفظ للمستخدم
            const originalText = saveDisplayBtn.textContent;
            saveDisplayBtn.textContent = '✅ تم الحفظ والتطبيق';
            saveDisplayBtn.style.background = '#10b981'; // لون أخضر للنجاح
            
            setTimeout(() => {
                saveDisplayBtn.textContent = originalText;
                saveDisplayBtn.style.background = ''; // العودة للون الأساسي
            }, 2000);

            // تحديث نافذة المعاينة المباشرة (iframe) لرؤية التغييرات
            const previewFrame = document.getElementById('livePreviewFrame');
            if (previewFrame) {
                previewFrame.contentWindow.location.reload();
            }
        });
    }

    console.log("✅ تم تهيئة نظام الإدارة بالكامل.");
}
