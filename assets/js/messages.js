// ============================================================================
// Messages Manager - نظام عرض الرسائل في الشاشة الرئيسية
// ============================================================================

import { fetchJsonData } from './storage.js';
import { listenForUpdates } from './sync.js'; // استيراد محرك المزامنة للاستقبال

export async function initMessages() {
    console.log("💬 جاري تهيئة نظام الرسائل...");
    
    // البحث عن مكان العرض في index.html
    const display = document.getElementById('messageDisplay');
    if (!display) {
        console.warn("⚠️ لم يتم العثور على عنصر #messageDisplay في الصفحة.");
        return;
    }

    // دالة جلب وعرض الرسائل
    async function loadAndDisplayMessages() {
        try {
            const msgs = await fetchJsonData("messages");
            
            if (msgs && msgs.length > 0) {
                // عرض الرسائل كشريط متحرك (Marquee) أو نص عادي
                // دمج الرسائل مع فاصل جمالي بينها
                const combinedMessages = msgs.join(' &nbsp;&nbsp;&nbsp; 🟢 &nbsp;&nbsp;&nbsp; ');
                display.innerHTML = `<div style="font-size: 2.5rem; line-height: 1.5; color: var(--text-main); text-align: center;">${combinedMessages}</div>`;
            } else {
                display.innerHTML = `<div style="font-size: 2rem; color: #94a3b8;">أهلاً بكم في الشاشة الرقمية الذكية</div>`;
            }
        } catch (error) {
            console.error("❌ خطأ في جلب الرسائل:", error);
        }
    }

    // التشغيل لأول مرة عند فتح الشاشة
    await loadAndDisplayMessages();

    // 📡 الاستماع اللحظي لأي أوامر تأتي من لوحة الإدارة
    listenForUpdates((data) => {
        // إذا كان الأمر القادم هو تحديث الرسائل، أعد تحميلها فوراً
        if (data.action === "UPDATE_MESSAGES") {
            console.log("🔄 تم رصد تغيير في الرسائل، جاري التحديث...");
            loadAndDisplayMessages();
        }
    });
    
    console.log("✅ نظام الرسائل مفعل ومربوط بالمزامنة.");
}
