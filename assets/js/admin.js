// ============================================================================
// Admin Master Controller - المنسق الرئيسي للوحة التحكم
// ============================================================================

import { fetchJsonData } from "./storage.js";
import { initAuth } from "./auth.js"; 

// ✅ استيراد الملفات الجاهزة فقط
import { renderDashboardStats } from "../admin/dashboard.js";
import { renderMessages } from "../admin/messages.js";
import { renderOccasions } from "../admin/occasions.js";

// الحالة المركزية
export const systemState = {
    messages: [],
    occasions: []
};

export async function initAdmin() {
    console.log("🛠️ جاري تهيئة لوحة التحكم...");
    initAuth();
    
    if (sessionStorage.getItem("current_user_session") !== null) {
        await loadSystemData();
        setupTabs();
        
        // تشغيل الدوال الجاهزة فقط
        if(typeof renderDashboardStats === "function") renderDashboardStats(systemState);
        if(typeof renderMessages === "function") renderMessages(systemState); 
        if(typeof renderOccasions === "function") renderOccasions(systemState);
    }
}

async function loadSystemData() {
    const msgs = await fetchJsonData("messages");
    systemState.messages = (msgs && msgs.list) ? msgs.list : [];
    
    const occs = await fetchJsonData("occasions");
    systemState.occasions = (occs && occs.list) ? occs.list : [];
}

function setupTabs() {
    const tabs = document.querySelectorAll(".sidebar-menu li[data-tab]");
    const panes = document.querySelectorAll(".tab-pane");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => { p.classList.remove("active"); p.style.display = "none"; });
            tab.classList.add("active");
            const targetPane = document.getElementById(tab.getAttribute("data-tab"));
            if (targetPane) { targetPane.classList.add("active"); targetPane.style.display = "block"; }
        });
    });
}

document.addEventListener("DOMContentLoaded", initAdmin);
