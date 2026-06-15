// ============================================================================
// Admin Master Controller - المنسق الرئيسي للوحة التحكم
// ============================================================================

import { fetchJsonData } from "./storage.js";
import { initAuth } from "./auth.js"; 

// استدعاء الملفات التي أنشأناها فقط (البقية معطلة مؤقتاً لحين إنشائها)
// import { renderDashboardStats } from "./admin/dashboard.js"; // قم بإزالة التعليق عند إنشاء الملف
import { renderMessages } from "./admin/messages.js";
// import { renderOccasions } from "./admin/occasions.js"; // قم بإزالة التعليق عند إنشاء الملف
// import { renderDisplay } from "./admin/display.js";
// import { renderNews } from "./admin/news.js";
// import { renderContent } from "./admin/content.js";
// import { renderSlides } from "./admin/slides.js";
// import { renderCountdown } from "./admin/countdown.js";
// import { renderWeather } from "./admin/weather.js";
// import { renderPrayers } from "./admin/prayers.js";
// import { renderQR } from "./admin/qr.js";
// import { renderThemes } from "./admin/themes.js";
// import { renderUsers } from "./admin/users.js";
// import { renderLogs } from "./admin/logs.js";
// import { renderSettings } from "./admin/settings.js";

// الحالة المركزية للنظام (Shared State)
export const systemState = {
    messages: [],
    occasions: [],
    usersCount: 3
};

export async function initAdmin() {
    console.log("🛠️ جاري تهيئة لوحة التحكم بهيكلة المجلدات الشاملة...");
    
    // 1. تشغيل محرك المصادقة (هذا سيفعل زر الدخول)
    initAuth();
    
    // 2. التحقق من تسجيل الدخول قبل المتابعة
    if (sessionStorage.getItem("current_user_session") !== null) {
        await loadSystemData();
        setupTabs();
        
        // تشغيل الواجهات المتوفرة حالياً
        // if(typeof renderDashboardStats === "function") renderDashboardStats(systemState);
        if(typeof renderMessages === "function") renderMessages(systemState); 
        // if(typeof renderOccasions === "function") renderOccasions(systemState);
    }
}

async function loadSystemData() {
    try {
        const msgsData = await fetchJsonData("messages");
        systemState.messages = (msgsData && msgsData.list) ? msgsData.list : (Array.isArray(msgsData) ? msgsData : []);
        
        const occsData = await fetchJsonData("occasions");
        systemState.occasions = (occsData && occsData.list) ? occsData.list : (Array.isArray(occsData) ? occsData : []);
    } catch (error) {
        console.error("❌ خطأ في تحميل بيانات النظام:", error);
    }
}

function setupTabs() {
    const tabs = document.querySelectorAll(".sidebar-menu li[data-tab]");
    const panes = document.querySelectorAll(".tab-pane");
    
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            if (window.getComputedStyle(tab).display === "none") return;

            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => { 
                p.classList.remove("active"); 
                p.style.display = "none"; 
            });

            tab.classList.add("active");
            const targetId = tab.getAttribute("data-tab");
            const targetPane = document.getElementById(targetId);
            
            if (targetPane) {
                targetPane.classList.add("active");
                targetPane.style.display = "block";
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", initAdmin);
