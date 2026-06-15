// ============================================================================
// Sync Engine - محرك المزامنة اللحظية (آمن وقوي)
// ============================================================================

// التحقق من دعم المتصفح للتقنية
const isSupported = typeof BroadcastChannel !== 'undefined';
const syncChannel = isSupported ? new BroadcastChannel('smart_clock_channel') : null;

/**
 * دالة الإرسال (تُستخدم في لوحة الإدارة)
 */
export function broadcastUpdate(action, payload) {
    if (!isSupported) {
        console.warn("⚠️ متصفحك لا يدعم المزامنة اللحظية.");
        return;
    }

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
    if (!isSupported) return;

    syncChannel.onmessage = (event) => {
        try {
            if (!event.data || !event.data.action) {
                console.warn("⚠️ تم استقبال رسالة فارغة أو بتنسيق غير مدعوم.");
                return;
            }

            console.log(`📥 تم استقبال تحديث:`, event.data.action);
            
            if (typeof callback === 'function') {
                callback(event.data);
            }
        } catch (error) {
            console.error(`❌ خطأ في معالجة الرسالة المستقبلة:`, error);
        }
    };
    
    console.log("📡 نظام المزامنة اللحظية جاهز للاستقبال.");
}

/**
 * تنظيف القناة (تُستخدم عند الخروج)
 */
export function closeSync() {
    if (syncChannel) {
        syncChannel.close();
        console.log("🔌 تم إغلاق قناة المزامنة.");
    }
}
