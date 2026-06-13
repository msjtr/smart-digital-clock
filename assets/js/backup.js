// assets/js/backup.js
import { showNotification } from './notifications.js';
import { addLog } from './logs.js';

export function initBackup() {
    console.log("تم تفعيل نظام النسخ الاحتياطي.");
}

// تصدير الإعدادات والسجلات
export function exportBackup() {
    try {
        const backupData = {
            settings: JSON.parse(localStorage.getItem('system_settings')) || {},
            exportDate: new Date().toISOString()
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `backup_hail_clock_${new Date().getTime()}.json`);
        document.body.appendChild(downloadAnchorNode); // مطلوب للفايرفوكس
        downloadAnchorNode.click();
        downloadAnchorNode.remove();

        showNotification('تم تصدير النسخة الاحتياطية بنجاح');
        addLog('تصدير بيانات', 'تم إنشاء نسخة احتياطية للملفات');
    } catch (error) {
        showNotification('حدث خطأ أثناء التصدير', 'error');
        console.error("Backup Error:", error);
    }
}

// استيراد الإعدادات
export function importBackup(fileEvent) {
    const file = fileEvent.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            if (importedData.settings) {
                localStorage.setItem('system_settings', JSON.stringify(importedData.settings));
                showNotification('تم استيراد البيانات بنجاح، سيتم تحديث النظام');
                addLog('استيراد بيانات', 'تم استعادة نسخة احتياطية');
                
                // إعادة تحميل الصفحة لتطبيق التغييرات
                setTimeout(() => window.location.reload(), 2000);
            }
        } catch (error) {
            showNotification('ملف النسخة الاحتياطية غير صالح', 'error');
        }
    };
    reader.readAsText(file);
}
