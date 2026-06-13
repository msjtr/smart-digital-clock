// ============================================================================
// Admin Master Controller - النسخة المتكاملة والمحمية ضد الأعطال
// ============================================================================

import { fetchJsonData, saveJsonData } from "./storage.js";
import { broadcastUpdate } from "./sync.js";

// قاعدة بيانات النظام (تأمين قيم افتراضية لكي لا تتعطل الواجهة أبداً)
let systemData = {
    settings: { city: "حائل", prayerMethod: "4", theme: "dark" },
    messages: ["رسالة ترحيبية تجريبية"],
    weather: {},
    prayers: {},
    content: []
};

export async function initAdmin() {
    console.log("🚀 جاري بدء تشغيل لوحة الإدارة...");
    
    // 1. تشغيل التنقل فوراً حتى تعمل الأزرار الجانبية دائماً
    setupTabs();

    // 2. بناء الواجهات بالقيم الافتراضية أولاً (لكي لا تظهر فارغة أبداً)
    buildAllInterfaces();

    // 3. محاولة جلب البيانات الحقيقية من السيرفر في الخلفية
    await loadDataFromServerSafely();
}

// ============================================================================
// نظام الرسم الآمن
// ============================================================================
function buildAllInterfaces() {
    try {
        renderMainDashboard();
        renderDisplayManager();
        renderThemeManager();
        renderPrayerWeatherManager();
        renderMessagesManager();
        if (typeof renderContentManager === 'function') {
            renderContentManager();
        }
        console.log("✅ تم رسم جميع واجهات لوحة الإدارة بنجاح.");
    } catch (error) {
        console.error("❌ حدث خطأ أثناء رسم الواجهات الداخلية:", error);
    }
}

// ============================================================================
// جلب البيانات المحمي
// ============================================================================
async function loadDataFromServerSafely() {
    try {
        console.log("⏳ جاري سحب البيانات المحفوظة من السيرفر...");
        const fetchedSettings = await fetchJsonData("settings");
        const fetchedMessages = await fetchJsonData("messages");
        const fetchedContent = await fetchJsonData("content");
        
        if (fetchedSettings && Object.keys(fetchedSettings).length > 0) {
            systemData.settings = { ...systemData.settings, ...fetchedSettings };
        }
        if (fetchedMessages && Array.isArray(fetchedMessages)) {
            systemData.messages = fetchedMessages;
        }
        if (fetchedContent && Array.isArray(fetchedContent)) {
            systemData.content = fetchedContent;
        }

        // إعادة تحديث الشاشة بالبيانات الحقيقية بعد جلبها
        buildAllInterfaces();
        console.log("✅ تم تحديث الواجهات بالبيانات الفعلية من السيرفر.");
    } catch (error) {
        console.warn("⚠️ لم يتم العثور على بيانات سابقة في السيرفر، تم الإبقاء على الواجهة الافتراضية.");
    }
}

// ============================================================================
// نظام التبويبات
// ============================================================================
function setupTabs() {
    const tabs = document.querySelectorAll(".sidebar-menu li[data-tab]");
    const panes = document.querySelectorAll(".tab-pane");
    const pageTitle = document.querySelector(".page-title");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => { p.classList.remove("active"); p.style.display = "none"; });

            tab.classList.add("active");
            const targetId = tab.getAttribute("data-tab");
            const target = document.getElementById(targetId);
            
            if (target) {
                target.classList.add("active");
                target.style.display = "block";
                if (pageTitle) pageTitle.textContent = tab.textContent.replace(/[^\u0600-\u06FF\s]/g, '').trim();
            }
        });
    });
}

// ----------------------------------------------------------------------------
// (اترك باقي الدوال كما هي: renderMainDashboard, renderDisplayManager ... إلخ)
// ----------------------------------------------------------------------------
