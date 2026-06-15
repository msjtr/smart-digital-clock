// ============================================================================
// Admin Master Controller - المنسق الرئيسي للوحة التحكم
// ============================================================================

import { fetchJsonData } from "./storage.js";
import { initAuth } from "./auth.js"; 

// استيراد جميع الوحدات (Modules) من مجلد admin الجديد
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

// الحالة المركزية للنظام (Shared State) - تمرر لجميع الوحدات
export const systemState = {
    messages: [],
    occasions: [],
    usersCount: 3 // سيتم ربطها لاحقاً بقاعدة بيانات المستخدمين
};

export async function initAdmin() {
    console.log("🛠️ جاري تهيئة لوحة التحكم بهيكلة المجلدات الشاملة...");
    
    // 1. تشغيل محرك المصادقة
    initAuth();
    
    // 2. التحقق من تسجيل الدخول قبل المتابعة
    if (sessionStorage.getItem("current_user_session") !== null) {
        // تحميل البيانات الأساسية
        await loadSystemData();
        
        // تفعيل التنقل بين التبويبات
        setupTabs();
        
        // 3. تشغيل واجهات الأقسام المنفصلة وتمرير البيانات لها
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

// ============================================================================
// تحميل البيانات الأساسية من ملفات JSON
// ============================================================================
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

// ============================================================================
// نظام التنقل بين التبويبات (Tabs Navigation)
// ============================================================================
function setupTabs() {
    const tabs = document.querySelectorAll(".sidebar-menu li[data-tab]");
    const panes = document.querySelectorAll(".tab-pane");
    
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // منع النقر إذا كان التبويب مخفياً بسبب الصلاحيات
            if (window.getComputedStyle(tab).display === "none") return;

            // إخفاء الجميع
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => { 
                p.classList.remove("active"); 
                p.style.display = "none"; 
            });

            // تفعيل التبويب المختار
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

// تشغيل النظام عند اكتمال تحميل الصفحة
document.addEventListener("DOMContentLoaded", initAdmin);
