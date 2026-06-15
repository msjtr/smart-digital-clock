// ============================================================================
// Admin Master Controller - المنسق الرئيسي للوحة التحكم
// ============================================================================

import { fetchJsonData } from "./storage.js";
import { initAuth } from "./auth.js"; 

// استيراد كافة الوحدات من مجلد admin
import { renderDashboardStats } from "./admin/dashboard.js";
import { renderDisplay } from "./admin/display.js";
import { renderMessages } from "./admin/messages.js";
import { renderOccasions } from "./admin/occasions.js";
import { renderNews } from "./admin/news.js";
import { renderContent } from "./admin/content.js";
import { renderSlides } from "./admin/slides.js";
import { renderCountdown } from "./admin/countdown.js";
import { renderWeather } from "./admin/weather.js";
import { renderPrayers } from "./admin/prayers.js";
import { renderQR } from "./admin/qr.js";
import { renderThemes } from "./admin/themes.js";
import { renderUsers } from "./admin/users.js";
import { renderLogs } from "./admin/logs.js";
import { renderSettings } from "./admin/settings.js";

// الحالة المركزية
export const systemState = {
    messages: [],
    occasions: []
};

export async function initAdmin() {
    console.log("🛠️ جاري تهيئة لوحة التحكم (النسخة النهائية)...");
    
    initAuth();
    
    if (sessionStorage.getItem("current_user_session") !== null) {
        await loadSystemData();
        setupTabs();
        
        // ربط كافة الوحدات
        renderDashboardStats(systemState);
        renderDisplay(systemState);
        renderMessages(systemState); 
        renderOccasions(systemState);
        renderNews(systemState);
        renderContent(systemState);
        renderSlides(systemState);
        renderCountdown(systemState);
        renderWeather(systemState);
        renderPrayers(systemState);
        renderQR(systemState);
        renderThemes(systemState);
        renderUsers(systemState);
        renderLogs(systemState);
        renderSettings(systemState);
    }
}

async function loadSystemData() {
    // جلب البيانات مع دعم التخزين المحلي التلقائي داخل fetchJsonData
    const msgs = await fetchJsonData("messages");
    systemState.messages = (msgs && msgs.list) ? msgs.list : (Array.isArray(msgs) ? msgs : []);
    
    const occs = await fetchJsonData("occasions");
    systemState.occasions = (occs && occs.list) ? occs.list : (Array.isArray(occs) ? occs : []);
}

function setupTabs() {
    const tabs = document.querySelectorAll(".sidebar-menu li[data-tab]");
    const panes = document.querySelectorAll(".tab-pane");
    
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            if (window.getComputedStyle(tab).display === "none") return;
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => { p.classList.remove("active"); p.style.display = "none"; });
            tab.classList.add("active");
            const targetPane = document.getElementById(tab.getAttribute("data-tab"));
            if (targetPane) { targetPane.classList.add("active"); targetPane.style.display = "block"; }
        });
    });
}

document.addEventListener("DOMContentLoaded", initAdmin);
