// ============================================================================
// Admin Master Controller - النسخة النهائية المصلحة (فصل البناء عن الربط)
// ============================================================================

import { fetchJsonData, saveJsonData } from "./storage.js";
import { broadcastUpdate } from "./sync.js";
import { initAuth } from "./auth.js"; 
import { showToast } from "./utils.js";

let systemData = {
    settings: { city: "حائل", prayerMethod: "4", theme: "dark" },
    messages: ["أهلاً بكم في جامعة حائل"],
    content: []
};

export async function initAdmin() {
    initAuth();
    await loadDataFromServer();
    setupTabs();
    
    // بناء الواجهة لأول مرة
    renderAllTabs();
}

// ============================================================================
// نظام التنقل (Tabs)
// ============================================================================
function setupTabs() {
    const tabs = document.querySelectorAll(".sidebar-menu li[data-tab]");
    const panes = document.querySelectorAll(".tab-pane");
    
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
            }
        });
    });
}

// ============================================================================
// نظام البناء والربط (Render & Bind)
// ============================================================================
function renderAllTabs() {
    const safeMessages = Array.isArray(systemData.messages) ? systemData.messages : [];
    const safeContentCount = Array.isArray(systemData.content) ? systemData.content.length : 0;
    
    const contentMap = {
        "mainDashboard": `<h2>📊 الإحصائيات العامة</h2>
            <div class="card" style="background:#1e293b; padding:20px; border-radius:10px;">
                <h3>رسائل النظام</h3><p style="font-size:24px;">${safeMessages.length}</p>
            </div>`,
        "messagesSettings": `<h2>💬 إدارة الرسائل</h2>
            <div style="display:flex; gap:10px;">
                <input type="text" id="msgInput" placeholder="رسالة جديدة..." style="flex:1; padding:10px; border-radius:5px; background:#0f172a; color:#fff;">
                <button class="btn-primary" id="addMsg">إضافة</button>
            </div>
            <ul id="msgList" style="margin-top:20px;">
                ${safeMessages.map((msg, index) => `
                    <li style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #334155;">
                        <span>${msg}</span>
                        <button class="btn-danger delete-msg" data-index="${index}">حذف</button>
                    </li>
                `).join('')}
            </ul>`,
        "prayerSettings": `<h2>🌦️ إعدادات الطقس والصلاة</h2>
            <input type="text" id="cityInput" value="${systemData.settings.city || 'حائل'}" style="padding:10px; width:100%; margin-bottom:10px;">
            <button class="btn-primary" id="updateCity">حفظ المدينة</button>`
    };

    Object.keys(contentMap).forEach(id => {
        const section = document.getElementById(id);
        if (section) section.innerHTML = contentMap[id];
    });

    // استدعاء دالة الربط في كل مرة يتم فيها تحديث الواجهة
    bindButtonEvents();
}

// دالة منفصلة لربط الأحداث تضمن عمل الأزرار دائماً
function bindButtonEvents() {
    // 1. إضافة رسالة
    document.getElementById("addMsg")?.addEventListener("click", () => {
        const val = document.getElementById("msgInput")?.value.trim();
        if (val) {
            systemData.messages.push(val);
            saveJsonData("messages", systemData.messages);
            broadcastUpdate("messages", systemData.messages);
            showToast("تم إضافة الرسالة", "success");
            renderAllTabs();
        }
    });

    // 2. حذف رسالة
    document.querySelectorAll(".delete-msg").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"), 10);
            systemData.messages.splice(idx, 1);
            saveJsonData("messages", systemData.messages);
            showToast("تم الحذف", "success");
            renderAllTabs();
        });
    });

    // 3. تحديث المدينة
    document.getElementById("updateCity")?.addEventListener("click", () => {
        const city = document.getElementById("cityInput")?.value.trim();
        if (city) {
            systemData.settings.city = city;
            saveJsonData("settings", systemData.settings);
            showToast("تم حفظ المدينة", "success");
        }
    });
}

async function loadDataFromServer() {
    const m = await fetchJsonData("messages");
    if (m) systemData.messages = Array.isArray(m) ? m : [];
}

document.addEventListener("DOMContentLoaded", initAdmin);
