// ============================================================================
// Admin Master Controller - النسخة المحدثة مع دعم المناسبات
// ============================================================================

import { fetchJsonData, saveJsonData } from "./storage.js";
import { broadcastUpdate } from "./sync.js";
import { initAuth } from "./auth.js"; 
import { showToast } from "./utils.js";
import { initOccasions, getOccasions, addOccasion, deleteOccasion } from "./occasions.js";

let systemData = {
    settings: { city: "حائل", prayerMethod: "4", theme: "dark" },
    messages: ["أهلاً بكم في جامعة حائل"],
    content: []
};

export async function initAdmin() {
    initAuth();
    await loadDataFromServer();
    await initOccasions(); // تهيئة بيانات المناسبات
    setupTabs();
    renderAllTabs();
}

function setupTabs() {
    const tabs = document.querySelectorAll(".sidebar-menu li[data-tab]");
    const panes = document.querySelectorAll(".tab-pane");
    
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => { p.classList.remove("active"); p.style.display = "none"; });
            tab.classList.add("active");
            const target = document.getElementById(tab.getAttribute("data-tab"));
            if (target) { target.classList.add("active"); target.style.display = "block"; }
        });
    });
}

function renderAllTabs() {
    const safeMessages = Array.isArray(systemData.messages) ? systemData.messages : [];
    const occasions = getOccasions();
    
    const contentMap = {
        "mainDashboard": `<h2>📊 الإحصائيات</h2><p>عدد المناسبات الحالية: ${occasions.length}</p>`,
        "messagesSettings": `<h2>💬 إدارة الرسائل</h2>
            <div style="display:flex; gap:10px;">
                <input type="text" id="msgInput" placeholder="رسالة جديدة..." style="flex:1; padding:10px;">
                <button class="btn-primary" id="addMsg">إضافة</button>
            </div>
            <ul id="msgList" style="margin-top:20px;">
                ${safeMessages.map((msg, index) => `<li>${msg} <button class="btn-danger delete-msg" data-index="${index}">حذف</button></li>`).join('')}
            </ul>`,
        "occasionsSettings": `<h2>🎉 إدارة المناسبات</h2>
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <input type="text" id="occTitle" placeholder="اسم المناسبة" style="flex:1; padding:10px;">
                <input type="date" id="occDate" style="padding:10px;">
                <button class="btn-primary" id="addOccasionBtn">إضافة</button>
            </div>
            <ul id="occList">
                ${occasions.map((o) => `<li>${o.title} (${o.date}) <button class="btn-danger delete-occ" data-id="${o.id}">حذف</button></li>`).join('')}
            </ul>`
    };

    Object.keys(contentMap).forEach(id => {
        const section = document.getElementById(id);
        if (section) section.innerHTML = contentMap[id];
    });

    bindButtonEvents();
}

function bindButtonEvents() {
    // أحداث الرسائل
    document.getElementById("addMsg")?.addEventListener("click", () => {
        const val = document.getElementById("msgInput")?.value.trim();
        if (val) {
            systemData.messages.push(val);
            saveJsonData("messages", systemData.messages);
            renderAllTabs();
            showToast("تمت الإضافة");
        }
    });

    // أحداث المناسبات
    document.getElementById("addOccasionBtn")?.addEventListener("click", async () => {
        const title = document.getElementById("occTitle").value;
        const date = document.getElementById("occDate").value;
        if (title && date) {
            await addOccasion(title, date);
            renderAllTabs();
            showToast("تمت إضافة المناسبة");
        }
    });

    document.querySelectorAll(".delete-occ").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = parseInt(e.target.getAttribute("data-id"));
            await deleteOccasion(id);
            renderAllTabs();
            showToast("تم الحذف");
        });
    });
}

async function loadDataFromServer() {
    const m = await fetchJsonData("messages");
    if (m) systemData.messages = Array.isArray(m) ? m : [];
}

document.addEventListener("DOMContentLoaded", initAdmin);
