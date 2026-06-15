// ============================================================================
// 🎉 وحدة عرض المناسبات (شاشة العرض الرئيسية)
// ============================================================================

import { fetchJsonData } from "./storage.js";

/**
 * دالة التهيئة الموحدة (يجب أن يكون اسمها initOccasions لتطابق app.js)
 */
export async function initOccasions() {
    console.log("📅 جاري تحميل المناسبات لشاشة العرض...");
    
    try {
        // جلب البيانات من السيرفر
        const data = await fetchJsonData("occasions");
        const occasions = (data && data.list) ? data.list : [];

        if (occasions.length > 0) {
            // ترتيب المناسبات لعرض القادم فقط
            const upcoming = occasions
                .filter(occ => new Date(occ.date) > new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            if (upcoming.length > 0) {
                displayNextOccasion(upcoming[0]);
            }
        }
    } catch (error) {
        console.error("خطأ في جلب المناسبات:", error);
    }
}

/**
 * دالة تحديث واجهة المستخدم
 */
function displayNextOccasion(occ) {
    const container = document.getElementById("occasion-container");
    if (!container) return;

    // حساب الأيام المتبقية
    const diff = new Date(occ.date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    container.innerHTML = `
        <div class="occasion-card" style="padding: 20px; border-radius: 15px; background: rgba(30, 41, 59, 0.8);">
            <h2 style="margin: 0; color: #3b82f6;">${occ.title}</h2>
            <div style="font-size: 1.5rem; margin-top: 10px;">
                <span style="font-weight: bold; color: #10b981;">${days}</span> يوم متبقي
            </div>
        </div>
    `;
}
