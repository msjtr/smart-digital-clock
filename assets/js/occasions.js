// ============================================================================
// 🎉 وحدة عرض المناسبات (شاشة العرض الرئيسية)
// ============================================================================

import { fetchJsonData } from "./storage.js";

/**
 * دالة التهيئة الموحدة (تطابق app.js)
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

    // الواجهة بتصميم حديث (Glassmorphism)
    container.innerHTML = `
        <div class="occasion-card" style="
            padding: 20px; 
            border-radius: 15px; 
            background: rgba(30, 41, 59, 0.7); 
            backdrop-filter: blur(12px); 
            -webkit-backdrop-filter: blur(12px); 
            border: 1px solid rgba(255, 255, 255, 0.1); 
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            text-align: center;
        ">
            <h2 style="margin: 0; color: #3b82f6; font-size: 1.8rem;">${occ.title}</h2>
            <div style="font-size: 1.5rem; margin-top: 12px; color: #f8fafc;">
                متبقي <span style="font-weight: bold; color: #10b981; font-size: 2rem;">${days}</span> يوم
            </div>
        </div>
    `;
}
