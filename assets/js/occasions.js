// ============================================================================
// 🎉 وحدة عرض المناسبات على الشاشة الرقمية (Display Module)
// ============================================================================

import { fetchJsonData } from "./storage.js";

/**
 * وظيفة جلب وعرض المناسبات على شاشة العرض الرئيسية
 */
export async function initOccasionsDisplay() {
    console.log("📅 جاري تحميل المناسبات لشاشة العرض...");
    
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
}

function displayNextOccasion(occ) {
    // افترض أن لديك عنصر في index.html يحمل id="occasion-container"
    const container = document.getElementById("occasion-container");
    if (!container) return;

    const diff = new Date(occ.date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    container.innerHTML = `
        <div class="occasion-card">
            <h2 class="occ-title">${occ.title}</h2>
            <div class="occ-countdown">
                <span class="days-left">${days}</span> أيام متبقية
            </div>
        </div>
    `;
}

// تشغيل الوظيفة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", initOccasionsDisplay);
