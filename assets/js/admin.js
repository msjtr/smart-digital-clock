// ============================================================================
// Admin Master Controller - المنسق الرئيسي للوحة التحكم
// ============================================================================

import { fetchJsonData } from "./storage.js";
import { initAuth } from "./auth.js"; 

// ✅ استيراد الملفات الجاهزة
import { renderDashboardStats } from "../admin/dashboard.js";
import { renderMessages } from "../admin/messages.js";
import { renderOccasions } from "../admin/occasions.js";
import { initAdminNews } from "../admin/news.js"; // ⬅️ إضافة الشريط الإخباري

// الحالة المركزية (تمت إضافة الأخبار)
export const systemState = {
    messages: [],
    occasions: [],
    news: [] // ⬅️ إضافة مصفوفة الأخبار
};

export async function initAdmin() {
    console.log("🛠️ جاري تهيئة لوحة التحكم...");
    initAuth();
    
    if (sessionStorage.getItem("current_user_session") !== null) {
        await loadSystemData();
        setupTabs();
        
        // تشغيل الدوال الجاهزة
        if(typeof renderDashboardStats === "function") renderDashboardStats(systemState);
        if(typeof renderMessages === "function") renderMessages(systemState); 
        if(typeof renderOccasions === "function") renderOccasions(systemState);
        if(typeof initAdminNews === "function") initAdminNews(); // ⬅️ تشغيل وحدة إدارة الأخبار
    }
}

/**
 * جلب جميع بيانات النظام من السيرفر
 */
async function loadSystemData() {
    // جلب الرسائل
    const msgs = await fetchJsonData("messages");
    systemState.messages = (msgs && msgs.list) ? msgs.list : [];
    
    // جلب المناسبات
    const occs = await fetchJsonData("occasions");
    systemState.occasions = (occs && occs.list) ? occs.list : [];

    // ⬅️ جلب الأخبار
    const newsData = await fetchJsonData("news");
    systemState.news = (newsData && newsData.list) ? newsData.list : [];
}

/**
 * نظام التنقل بين التبويبات (Tabs) في لوحة الإدارة
 */
function setupTabs() {
    const tabs = document.querySelectorAll(".sidebar-menu li[data-tab]");
    const panes = document.querySelectorAll(".tab-pane");
    
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // إزالة التفعيل عن جميع التبويبات
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => { 
                p.classList.remove("active"); 
                p.style.display = "none"; 
            });
            
            // تفعيل التبويب المختار
            tab.classList.add("active");
            const targetPane = document.getElementById(tab.getAttribute("data-tab"));
            if (targetPane) { 
                targetPane.classList.add("active"); 
                targetPane.style.display = "block"; 
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", initAdmin);
