// ============================================================================
// Admin Master Controller - النسخة النهائية المتكاملة والمصلحة
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

    // 2. تفعيل نظام التنقل بين الأقسام
    setupTabs();

    // 3. حقن المحتوى في التبويبات بالكامل
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

    if (tabs.length === 0) {
        console.warn("⚠️ تحذير: لم يتم العثور على أي عناصر قائمة جانبية تحتوي على data-tab");
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // 1. إخفاء وإلغاء تنشيط جميع الأقسام والتبويبات
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => { 
                p.classList.remove("active"); 
                p.style.display = "none"; 
            });

            // 2. تنشيط التبويب الذي تم الضغط عليه
            tab.classList.add("active");
            const targetId = tab.getAttribute("data-tab");
            const target = document.getElementById(targetId);
            
            // 3. إظهار الشاشة المقابلة للتبويب
            if (target) {
                target.classList.add("active");
                target.style.display = "block";
                
                // تحديث عنوان اللوحة العلوي بناءً على اسم التبويب المختار
                if (pageTitle) {
                    pageTitle.textContent = tab.textContent.replace(/[^\u0600-\u06FF\s\w]/g, '').trim();
                }
            } else {
                console.error(`❌ خطأ: لم يتم العثور على حاوية (div) في الـ HTML تحمل المعرف: id="${targetId}"`);
            }
        });
    });
}

// ============================================================================
// نظام بناء وحقن المحتوى (Dynamic Render)
// ============================================================================
function renderAllTabs() {
    const contentMap = {
        "mainDashboard": `<h2>📊 الإحصائيات العامة</h2>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:20px;">
                <div class="card" style="background:#1e293b; padding:20px; border-radius:10px;"><h3>رسائل النظام</h3><p style="font-size:24px; font-weight:bold; color:#38bdf8;">${systemData.messages.length}</p></div>
                <div class="card" style="background:#1e293b; padding:20px; border-radius:10px;"><h3>عدد الشرائح</h3><p style="font-size:24px; font-weight:bold; color:#38bdf8;">${systemData.content.length}</p></div>
                <div class="card" style="background:#1e293b; padding:20px; border-radius:10px;"><h3>حالة الاتصال</h3><p style="font-size:24px; font-weight:bold; color:#4ade80;">${navigator.onLine ? 'متصل' : 'غير متصل'}</p></div>
            </div>`,
            
        "displayManager": `<h2>📺 إدارة العرض</h2>
            <div id="displayControls"></div>
            <button class="btn-primary" style="margin-top:20px;">حفظ الإعدادات</button>`,
            
        "messagesSettings": `<h2>💬 إدارة الرسائل والشريط الإخباري</h2>
            <div style="display:flex; gap:10px;">
                <input type="text" id="msgInput" placeholder="أدخل رسالة أو إعلان جديد..." style="flex:1; padding:12px; border-radius:5px; border:1px solid #475569; background:#0f172a; color:#fff;">
                <button class="btn-primary" id="addMsg" style="padding:0 20px;">إضافة</button>
            </div>
            <ul id="msgList" style="margin-top:20px; list-style:none; padding:0;"></ul>`,
            
        "contentSettings": `<h2>📁 إدارة المحتوى والوسائط</h2>
            <button class="btn-primary">رفع ملف جديد</button>
            <div style="margin-top:20px; border:2px dashed #475569; padding:40px; text-align:center; border-radius:8px;">اسحب وأفلت الملفات هنا</div>`,
            
        "prayerWeatherSettings": `<h2>🌦️ إعدادات الطقس ومواقيت الصلاة</h2>
            <label style="display:block; margin-bottom:8px;">المدينة الحالية:</label>
            <input type="text" id="cityInput" value="${systemData.settings.city || 'حائل'}" style="padding:10px; width:100%; margin-bottom:15px; border-radius:5px; border:1px solid #475569; background:#0f172a; color:#fff;">
            <button class="btn-primary" id="updateCity">تحديث البيانات</button>`,
            
        "systemSettings": `<h2>⚙️ إعدادات النظام المتقدمة</h2>
            <p style="margin-bottom:15px;">إصدار اللوحة الحالي: <span style="color:#38bdf8;">1.0.0</span></p>
            <button class="btn-danger">إعادة ضبط المصنع بالكامل</button>`
    };

    // 1. حقن محتويات الـ HTML في كافة الشاشات والتبويبات
    Object.keys(contentMap).forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.innerHTML = contentMap[id];
        }
    });

    // 2. تحديث وعرض قائمة الرسائل ديناميكياً مع زر الحذف لكل رسالة
    const msgList = document.getElementById("msgList");
    if (msgList) {
        msgList.innerHTML = systemData.messages.map((msg, index) => `
            <li style="background:#1e293b; padding:12px; margin-bottom:8px; border-radius:6px; display:flex; justify-content:between; align-items:center; border:1px solid #334155;">
                <span style="flex:1; text-align:right;">${msg}</span>
                <button class="btn-danger" style="padding:4px 10px; font-size:12px; margin-right:10px;" data-index="${index}">حذف</button>
            </li>
        `).join('');

        // ربط أحداث الحذف للرسائل
        msgList.querySelectorAll("button[data-index]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.target.getAttribute("data-index");
                systemData.messages.splice(idx, 1);
                saveJsonData("messages", systemData.messages);
                broadcastUpdate("messages", systemData.messages);
                renderAllTabs(); // إعادة بناء لتحديث الداشبورد والقائمة معاً
            });
        });
    }

    // 3. ربط حدث إضافة رسالة جديدة
    document.getElementById("addMsg")?.addEventListener("click", () => {
        const input = document.getElementById("msgInput");
        const val = input ? input.value.trim() : "";
        if (val) {
            systemData.messages.push(val);
            saveJsonData("messages", systemData.messages);
            broadcastUpdate("messages", systemData.messages);
            renderAllTabs(); // إعادة البناء لتظهر فوراً في القائمة وتتحدث البطاقات بالداشبورد
        }
    });
}

// ============================================================================
// جلب البيانات من المجلد / السيرفر المحلي
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
        console.warn("⚠️ السيرفر غير مستجيب، يتم استخدام مصفوفة البيانات الافتراضية محلياً.");
    }
}

// ============================================================================
// تشغيل لوحة التحكم تلقائياً بمجرد تحميل المتصفح لملف الـ HTML
// ============================================================================
document.addEventListener("DOMContentLoaded", initAdmin);
