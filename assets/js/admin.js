// ============================================================================
// Admin Master Controller - النسخة المتكاملة (السيرفر + المزامنة + إدارة المحتوى)
// ============================================================================

import { fetchJsonData, saveJsonData } from "./storage.js";
import { broadcastUpdate } from "./sync.js";

// قاعدة بيانات النظام
let systemData = {
    settings: {},
    messages: [],
    weather: {},
    prayers: {},
    content: [] // مصفوفة لتخزين الشرائح والمحتوى
};

export async function initAdmin() {
    console.log("🚀 تهيئة محرك الإدارة المتكامل...");
    
    // 1. جلب البيانات من السيرفر (مجلد data)
    await loadDataFromServer();

    // 2. تفعيل نظام التنقل
    setupTabs();

    // 3. بناء الواجهات بالبيانات الحقيقية
    renderMainDashboard();
    renderDisplayManager();
    renderThemeManager();
    renderMessagesManager();
    renderPrayerWeatherManager();
    renderContentManager(); // قسم إدارة المحتوى والشرائح
    
    console.log("✅ تم ربط لوحة الإدارة بالبيانات بنجاح");
}

// ============================================================================
// جلب البيانات الأساسية
// ============================================================================
async function loadDataFromServer() {
    const fetchedSettings = await fetchJsonData("settings");
    const fetchedMessages = await fetchJsonData("messages");
    const fetchedContent = await fetchJsonData("content");
    
    systemData.settings = fetchedSettings || {};
    systemData.messages = fetchedMessages || ["أهلاً بكم في الشاشة الرقمية الذكية"];
    systemData.content = fetchedContent || [];
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

// ============================================================================
// بناء الواجهات وتفعيل الحفظ اللحظي
// ============================================================================

function renderMainDashboard() {
    const section = document.getElementById("mainDashboard");
    if (!section) return;

    section.innerHTML = `
        <h2>📊 الإحصائيات الحية</h2>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div class="card" style="background:rgba(14, 165, 233, 0.1); padding:20px; border-radius:15px; border:1px solid rgba(255,255,255,0.1);">
                <h3 style="margin-top:0;">حالة النظام</h3>
                <p style="font-size:1.5rem; color:#0ea5e9; font-weight:bold; margin-bottom:0;">${navigator.onLine ? 'متصل بالإنترنت 🌐' : 'يعمل محلياً ⚡'}</p>
            </div>
            <div class="card" style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; border:1px solid rgba(255,255,255,0.1);">
                <h3 style="margin-top:0;">الرسائل النشطة</h3>
                <p style="font-size:2rem; font-weight:bold; margin-bottom:0;">${systemData.messages.length}</p>
            </div>
            <div class="card" style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; border:1px solid rgba(255,255,255,0.1);">
                <h3 style="margin-top:0;">الشرائح النشطة</h3>
                <p style="font-size:2rem; font-weight:bold; margin-bottom:0;">${systemData.content.length}</p>
            </div>
        </div>
    `;
}

function renderDisplayManager() {
    const section = document.getElementById("displayManager");
    if (!section) return;

    const controls = [
        { id: 'showClock', label: 'إظهار الساعة' },
        { id: 'showDate', label: 'إظهار التاريخ' },
        { id: 'showWeather', label: 'إظهار الطقس' },
        { id: 'showPrayers', label: 'إظهار أوقات الصلاة' },
        { id: 'showMessages', label: 'إظهار الرسائل' },
        { id: 'showLogos', label: 'إظهار الشعارات' },
        { id: 'showQR', label: 'إظهار QR Code' }
    ];

    let html = `<h2>📺 التحكم المباشر بعناصر الشاشة</h2><div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:15px;">`;
    
    controls.forEach(ctrl => {
