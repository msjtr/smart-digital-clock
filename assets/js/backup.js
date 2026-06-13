// ============================================================================
// Backup Manager - نظام النسخ الاحتياطي المتكامل
// ============================================================================

import { showNotification } from "./notifications.js";
import { addLog } from "./logs.js";
import { fetchJsonData } from "./storage.js"; // جلب من السيرفر

export function initBackup() {
    console.log("✅ تم تشغيل نظام النسخ الاحتياطي");
}

// ============================================================================
// تصدير نسخة كاملة من السيرفر والمحلي
// ============================================================================
export async function exportBackup() {
    try {
        // جلب البيانات الفعلية من السيرفر لضمان دقة النسخة الاحتياطية
        const backupData = {
            version: "1.0.0",
            exportDate: new Date().toISOString(),
            settings: await fetchJsonData("settings") || {},
            messages: await fetchJsonData("messages") || [],
            occasions: await fetchJsonData("occasions") || [],
            content: await fetchJsonData("content") || [],
            logs: await fetchJsonData("logs") || [],
            countdown: await fetchJsonData("schedules") || [],
            weather: await fetchJsonData("weather") || {},
            prayers: await fetchJsonData("prayers") || {}
        };

        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.href = url;
        link.download = `smart-clock-backup-${new Date().toISOString().slice(0,10)}.json`;
        link.click();
        URL.revokeObjectURL(url);

        showNotification("تم إنشاء النسخة الاحتياطية بنجاح", "success");
        addLog("نسخة احتياطية", "تصدير نسخة كاملة");

    } catch (error) {
        console.error(error);
        showNotification("فشل إنشاء النسخة الاحتياطية", "error");
    }
}

// ============================================================================
// استيراد نسخة (تحديثات)
// ============================================================================
export function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            
            // تحديث التخزين المحلي فوراً
            const keys = ['settings', 'messages', 'occasions', 'content', 'logs', 'countdown', 'weather', 'prayers'];
            keys.forEach(key => {
                if (data[key]) localStorage.setItem(key, JSON.stringify(data[key]));
            });

            addLog("استعادة نسخة", "تم استيراد نسخة احتياطية");
            showNotification("تم استعادة النسخة الاحتياطية، جاري تحديث النظام...", "success");

            setTimeout(() => location.reload(), 2000);

        } catch {
            showNotification("ملف النسخة الاحتياطية غير صالح", "error");
        }
    };
    reader.readAsText(file);
}

// ============================================================================
// حذف جميع البيانات
// ============================================================================
export function clearSystemData() {
    if (!confirm("⚠️ تحذير: هل أنت متأكد من حذف جميع بيانات النظام؟ هذا الإجراء لا يمكن التراجع عنه.")) {
        return;
    }

    localStorage.clear();
    addLog("حذف البيانات", "تم مسح النظام بالكامل");
    showNotification("تم حذف البيانات، جاري إعادة تشغيل النظام...", "warning");

    setTimeout(() => location.reload(), 2000);
}
