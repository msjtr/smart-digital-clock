// ============================================================================
// Sync Engine - محرك المزامنة اللحظية
// ============================================================================

// فتح قناة اتصال محلية
const syncChannel = new BroadcastChannel('smart_clock_channel');

/**
 * دالة الإرسال (تُستخدم في لوحة الإدارة)
 * @param {string} action - نوع الحدث (مثلاً: TOGGLE_VISIBILITY)
 * @param {object} payload - البيانات المرسلة
 */
export function broadcastUpdate(action, payload) {
    syncChannel.postMessage({ action, payload });
    console.log(`📤 تم إرسال تحديث:`, action, payload);
}

/**
 * دالة الاستقبال (تُستخدم في شاشة العرض الرئيسية)
 * @param {Function} callback - الدالة التي ستتفاعل مع البيانات المستلمة
 */
export function listenForUpdates(callback) {
    syncChannel.onmessage = (event) => {
        console.log(`📥 تم استقبال تحديث:`, event.data.action);
        callback(event.data);
    };
}
