// assets/js/logs.js

export function initLogs() {
    console.log("تم تفعيل نظام السجلات (Logs).");
}

// دالة قابلة للاستدعاء من أي مكان لتسجيل حدث جديد
export function addLog(action, details = "") {
    try {
        const now = new Date();
        const timeString = now.toLocaleString('ar-SA');
        
        const newLog = {
            timestamp: timeString,
            action: action,
            details: details
        };

        // جلب السجلات القديمة من التخزين المحلي
        let logs = JSON.parse(localStorage.getItem('system_logs')) || [];
        
        // إضافة السجل الجديد في البداية (الأحدث أولاً)
        logs.unshift(newLog);
        
        // الاحتفاظ بآخر 100 سجل فقط لعدم استهلاك الذاكرة
        if (logs.length > 100) logs.pop();

        localStorage.setItem('system_logs', JSON.stringify(logs));
        console.log(`[سجل النظام]: ${action} - ${details}`);
        
    } catch (error) {
        console.error("فشل في حفظ السجل:", error);
    }
}
