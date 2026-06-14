// ============================================================================
// Sync Engine - محرك المزامنة اللحظية (آمن وقوي)
// ============================================================================

// فتح قناة اتصال موحدة للنظام
const syncChannel = new BroadcastChannel('smart_clock_channel');

/**
 * دالة الإرسال (تُستخدم في لوحة الإدارة)
 */
export function broadcastUpdate(action, payload) {
    try {
        syncChannel.postMessage({ action, payload, timestamp: Date.now() });
        console.log(`📤 تم إرسال تحديث:`, action);
    } catch (error) {
        console.error(`❌ فشل إرسال التحديث عبر محرك المزامنة:`, error);
    }
}

/**
 * دالة الاستقبال (تُستخدم في شاشة العرض الرئيسية)
 */
export function listenForUpdates(callback) {
    syncChannel.onmessage = (event) => {
        try {
            if (!event.data || !event.data.action) {
                console.warn("⚠️ تم استقبال رسالة فارغة أو بتنسيق غير مدعوم.");
                return;
            }

            console.log(`📥 تم استقبال تحديث:`, event.data.action);
            
            // تنفيذ الـ callback مع التأكد أنه دالة
            if (typeof callback === 'function') {
                callback(event.data);
            }
        } catch (error) {
            console.error(`❌ خطأ في معالجة الرسالة المستقبلة:`, error);
        }
    };
    
    console.log("📡 نظام المزامنة اللحظية جاهز للاستقبال.");
}
