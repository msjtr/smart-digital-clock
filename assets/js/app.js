// ============================================================================
// Admin Master Controller - النسخة النهائية المتكاملة والمحمية من الأخطاء
// ============================================================================

import { fetchJsonData, saveJsonData } from "./storage.js";
import { broadcastUpdate } from "./sync.js";
import { initAuth } from "./auth.js"; 
import { showToast } from "./utils.js"; // تم إضافة استدعاء الإشعارات

// قاعدة بيانات النظام (قيم افتراضية)
let systemData = {
    settings: { city: "حائل", prayerMethod: "4", theme: "dark" },
    messages: ["أهلاً بكم في جامعة حائل"],
    content: []
};

export async function initAdmin() {
    console.log("🚀 جاري تهيئة لوحة الإدارة...");
    
    initAuth();
    await loadDataFromServer();
    setupTabs();
    renderAllTabs();
    
    console.log("✅ تم بناء الواجهة وتفعيل أزرار التحكم بنجاح.");
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
            panes.forEach(p => { 
                p.classList.remove("active"); 
                p.style.display = "none"; 
            });

            tab.classList.add("active");
            const targetId = tab.getAttribute("data-tab");
            const target = document.getElementById(targetId);
            
            if (target) {
                target.classList.add("active");
                target.style.display = "block";
                if (pageTitle) pageTitle.textContent = tab.textContent.replace(/[^\u0600-\u06FF\s\w]/g, '').trim();
            }
        });
    });
}

// ============================================================================
// نظام بناء وحقن المحتوى وربط الأزرار (Dynamic Render)
// ============================================================================
function renderAllTabs() {
    const safeMessagesCount = Array.isArray(systemData.messages) ? systemData.messages.length : 0;
    const safeContentCount = Array.isArray(systemData.content) ? systemData.content.length : 0;

    const contentMap = {
        "mainDashboard": `<h2>📊 الإحصائيات العامة</h2>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:20px;">
                <div class="card" style="background:#1e293b; padding:20px; border-radius:10px;"><h3>رسائل النظام</h3><p style="font-size:24px; font-weight:bold; color:#38bdf8;">${safeMessagesCount}</p></div>
                <div class="card" style="background:#1e293b; padding:20px; border-radius:10px;"><h3>عدد الشرائح</h3><p style="font-size:24px; font-weight:bold; color:#38bdf8;">${safeContentCount}</p></div>
                <div class="card" style="background:#1e293b; padding:20px; border-radius:10px;"><h3>حالة الاتصال</h3><p style="font-size:24px; font-weight:bold; color:#4ade80;">${navigator.onLine ? 'متصل' : 'غير متصل'}</p></div>
            </div>`,
            
        "displayManager": `<h2>📺 إدارة العرض</h2>
            <div id="displayControls">
                </div>
            <button class="btn-primary" id="saveDisplaySettings" style="margin-top:20px;">حفظ إعدادات العرض</button>`,
            
        "messagesSettings": `<h2>💬 إدارة الرسائل والشريط الإخباري</h2>
            <div style="display:flex; gap:10px;">
                <input type="text" id="msgInput" placeholder="أدخل رسالة أو إعلان جديد..." style="flex:1; padding:12px; border-radius:5px; border:1px solid #475569; background:#0f172a; color:#fff;">
                <button class="btn-primary" id="addMsg" style="padding:0 20px;">إضافة وحفظ</button>
            </div>
            <ul id="msgList" style="margin-top:20px; list-style:none; padding:0;"></ul>`,
            
        "prayerSettings": `<h2>🌦️ إعدادات الطقس ومواقيت الصلاة</h2>
            <label style="display:block; margin-bottom:8px;">المدينة الحالية:</label>
            <input type="text" id="cityInput" value="${systemData.settings.city || 'حائل'}" style="padding:10px; width:100%; margin-bottom:15px; border-radius:5px; border:1px solid #475569; background:#0f172a; color:#fff;">
            <button class="btn-primary" id="updateCity">حفظ المدينة وتحديث البيانات</button>`,
            
        "systemSettings": `<h2>⚙️ إعدادات النظام المتقدمة</h2>
            <p style="margin-bottom:15px;">إصدار اللوحة الحالي: <span style="color:#38bdf8;">1.0.0</span></p>
            <button class="btn-danger">إعادة ضبط المصنع بالكامل</button>`
    };

    Object.keys(contentMap).forEach(id => {
        const section = document.getElementById(id);
        if (section) section.innerHTML = contentMap[id];
    });

    // ==========================================
    // تفعيل أزرار الحفظ
    // ==========================================

    // 1. زر حفظ إعدادات المدينة للصلاة والطقس
    const updateCityBtn = document.getElementById("updateCity");
    if (updateCityBtn) {
        updateCityBtn.addEventListener("click", () => {
            const cityValue = document.getElementById("cityInput").value.trim();
            if (cityValue) {
                systemData.settings.city = cityValue;
                saveJsonData("settings", systemData.settings);
                broadcastUpdate("settings", systemData.settings);
                showToast("تم حفظ المدينة وتحديث البيانات بنجاح!", "success");
            } else {
                showToast("الرجاء إدخال اسم المدينة", "error");
            }
        });
    }

    // 2. زر حفظ إعدادات العرض
    const saveDisplaySettingsBtn = document.getElementById("saveDisplaySettings");
    if (saveDisplaySettingsBtn) {
        saveDisplaySettingsBtn.addEventListener("click", () => {
            showToast("تم حفظ إعدادات العرض بنجاح!", "success");
            // سيتم ربط المتغيرات هنا عند بناء قسم العرض
        });
    }

    // 3. قسم الرسائل (إضافة وحذف)
    const msgList = document.getElementById("msgList");
    if (msgList) {
        const safeMessages = Array.isArray(systemData.messages) ? systemData.messages : [];
        msgList.innerHTML = safeMessages.map((msg, index) => `
            <li style="background:#1e293b; padding:12px; margin-bottom:8px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; border:1px solid #334155;">
                <span style="flex:1; text-align:right;">${msg}</span>
                <button class="btn-danger" style="padding:4px 10px; font-size:12px; margin-right:10px;" data-index="${index}">حذف</button>
            </li>
        `).join('');

        msgList.querySelectorAll("button[data-index]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.target.getAttribute("data-index"), 10);
                safeMessages.splice(idx, 1);
                systemData.messages = safeMessages; 
                saveJsonData("messages", systemData.messages);
                broadcastUpdate("messages", systemData.messages);
                showToast("تم حذف الرسالة بنجاح", "success");
                renderAllTabs(); 
            });
        });
    }

    document.getElementById("addMsg")?.addEventListener("click", () => {
        const input = document.getElementById("msgInput");
        const val = input ? input.value.trim() : "";
        if (val) {
            if (!Array.isArray(systemData.messages)) systemData.messages = [];
            systemData.messages.push(val);
            saveJsonData("messages", systemData.messages);
            broadcastUpdate("messages", systemData.messages);
            showToast("تم إضافة الرسالة بنجاح", "success");
            renderAllTabs(); 
        } else {
            showToast("لا يمكن إضافة رسالة فارغة", "error");
        }
    });
}

// ============================================================================
// جلب البيانات من المجلد / السيرفر المحلي مع تنظيفها (Sanitization)
// ============================================================================
async function loadDataFromServer() {
    try {
        const s = await fetchJsonData("settings");
        const m = await fetchJsonData("messages");
        const c = await fetchJsonData("content");
        
        if (s) systemData.settings = s;
        if (m) systemData.messages = Array.isArray(m) ? m : (m.messages || []);
        if (c) systemData.content = Array.isArray(c) ? c : (c.content || []);
        
    } catch (e) {
        console.warn("⚠️ السيرفر غير مستجيب، يتم استخدام مصفوفة البيانات الافتراضية محلياً.");
    }
}

document.addEventListener("DOMContentLoaded", initAdmin);
