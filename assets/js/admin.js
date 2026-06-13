// ============================================================================
// Admin Master Controller - النسخة النهائية المتكاملة
// ============================================================================

import { fetchJsonData, saveJsonData } from "./storage.js";
import { broadcastUpdate } from "./sync.js";

// قاعدة بيانات النظام (قيم افتراضية)
let systemData = {
    settings: { city: "حائل", prayerMethod: "4", theme: "dark" },
    messages: ["أهلاً بكم في جامعة حائل"],
    content: []
};

export async function initAdmin() {
    console.log("🚀 جاري تهيئة لوحة الإدارة...");
    
    // 1. تحميل البيانات الفعلية من السيرفر
    await loadDataFromServer();

    // 2. تفعيل نظام التنقل
    setupTabs();

    // 3. حقن المحتوى في التبويبات
    renderAllTabs();
    
    console.log("✅ تم بناء الواجهة بالكامل.");
}

// ============================================================================
// نظام التنقل (Tabs)
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
// نظام بناء المحتوى (Render All)
// ============================================================================
function renderAllTabs() {
    const contentMap = {
        "mainDashboard": `<h2>📊 الإحصائيات العامة</h2>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:20px;">
                <div class="card" style="background:#1e293b; padding:20px; border-radius:10px;"><h3>رسائل النظام</h3><p style="font-size:24px;">${systemData.messages.length}</p></div>
                <div class="card" style="background:#1e293b; padding:20px; border-radius:10px;"><h3>عدد الشرائح</h3><p style="font-size:24px;">${systemData.content.length}</p></div>
                <div class="card" style="background:#1e293b; padding:20px; border-radius:10px;"><h3>حالة الاتصال</h3><p style="font-size:24px;">${navigator.onLine ? 'متصل' : 'غير متصل'}</p></div>
            </div>`,
            
        "displayManager": `<h2>📺 إدارة العرض</h2>
            <div id="displayControls"></div>
            <button class="btn-primary" style="margin-top:20px;">حفظ الإعدادات</button>`,
            
        "messagesSettings": `<h2>💬 إدارة الرسائل</h2>
            <div style="display:flex; gap:10px;">
                <input type="text" id="msgInput" placeholder="أدخل رسالة جديدة..." style="flex:1; padding:10px; border-radius:5px;">
                <button class="btn-primary" id="addMsg">إضافة</button>
            </div>
            <ul id="msgList" style="margin-top:20px;"></ul>`,
            
        "contentSettings": `<h2>📁 المحتوى</h2>
            <button class="btn-primary">رفع ملف جديد</button>
            <div style="margin-top:20px; border:2px dashed #475569; padding:40px; text-align:center;">اسحب الملفات هنا</div>`,
            
        "prayerWeatherSettings": `<h2>🌦️ الطقس والصلاة</h2>
            <input type="text" value="${systemData.settings.city || 'حائل'}" style="padding:10px; width:100%; margin-bottom:10px;">
            <button class="btn-primary">تحديث</button>`,
            
        "systemSettings": `<h2>⚙️ إعدادات النظام</h2>
            <p>إصدار النظام: 1.0.0</p>
            <button class="btn-danger">إعادة ضبط</button>`
    };

    Object.keys(contentMap).forEach(id => {
        const section = document.getElementById(id);
        if (section && id !== "mainDashboard") { // استثناء الداشبورد لتحديثه لاحقاً
            section.innerHTML = contentMap[id];
        }
    });

    // ربط الأزرار بعد البناء
    document.getElementById("addMsg")?.addEventListener("click", () => {
        const val = document.getElementById("msgInput").value;
        if(val) systemData.messages.push(val);
        saveJsonData("messages", systemData.messages);
        renderAllTabs();
    });
}

// ============================================================================
// جلب البيانات
// ============================================================================
async function loadDataFromServer() {
    try {
        const s = await fetchJsonData("settings");
        const m = await fetchJsonData("messages");
        const c = await fetchJsonData("content");
        if(s) systemData.settings = s;
        if(m) systemData.messages = m;
        if(c) systemData.content = c;
    } catch (e) {
        console.warn("استخدام البيانات الافتراضية");
    }
}
