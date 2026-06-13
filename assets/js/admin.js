// ============================================================================
// Admin Master Controller - المنسق العام للوحة الإدارة
// ============================================================================

import { fetchJsonData, saveToLocal } from "./storage.js";
import { broadcastUpdate } from "./sync.js";
import { addLog } from "./logs.js";

// متغير عام لتخزين بيانات النظام أثناء التعديل
let systemData = {
    settings: {}, messages: [], occasions: [], news: [], weather: {}, prayers: {}
};

export async function initAdmin() {
    console.log("🚀 تهيئة محرك الإدارة الشامل...");
    
    // 1. تحميل كافة البيانات من ملفات JSON (أو LocalStorage إذا تم تعديلها)
    await loadAllData();

    // 2. تفعيل نظام التنقل
    setupTabs();

    // 3. بناء واجهات التحكم التفاعلية
    renderMainDashboard();
    renderDisplayManager();
    renderThemeManager();
    renderMessagesManager();
    renderPrayerWeatherManager();
    // (سيتم إضافة بناء باقي الأقسام مثل المحتوى والشرائح بنفس الطريقة)
}

// ============================================================================
// 1. جلب البيانات المركزية (Data Fetching)
// ============================================================================
async function loadAllData() {
    try {
        // الاعتماد على دوال storage.js لجلب البيانات من مجلد data/
        systemData.settings = await fetchJsonData("settings") || {};
        systemData.messages = await fetchJsonData("messages") || [];
        systemData.weather = await fetchJsonData("weather") || {};
        systemData.prayers = await fetchJsonData("prayers") || {};
    } catch (error) {
        console.error("❌ خطأ في تحميل البيانات:", error);
    }
}

// ============================================================================
// 2. نظام التبويبات (Tabs Manager)
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
            const target = document.getElementById(tab.dataset.tab);
            if (target) {
                target.classList.add("active");
                target.style.display = "block";
                pageTitle.textContent = tab.textContent.replace(/[^\u0600-\u06FF\s]/g, '').trim();
            }
        });
    });
}

// ============================================================================
// 3. واجهات التحكم (Renderers)
// ============================================================================

// --- أ. لوحة التحكم الرئيسية ---
function renderMainDashboard() {
    const section = document.getElementById("mainDashboard");
    if (!section) return;

    section.innerHTML = `
        <h2>📊 الإحصائيات الحية</h2>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div class="card" style="background:rgba(14, 165, 233, 0.1); padding:20px; border-radius:15px; border:1px solid rgba(255,255,255,0.1);">
                <h3>حالة النظام</h3>
                <p style="font-size:1.5rem; color:#0ea5e9;">${navigator.onLine ? 'متصل بالإنترنت 🌐' : 'يعمل محلياً ⚡'}</p>
            </div>
            <div class="card" style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; border:1px solid rgba(255,255,255,0.1);">
                <h3>الرسائل النشطة</h3>
                <p style="font-size:2rem;">${systemData.messages.length}</p>
            </div>
        </div>
    `;
}

// --- ب. إدارة العرض المباشر (التحديث اللحظي) ---
function renderDisplayManager() {
    const section = document.getElementById("displayManager");
    if (!section) return;

    // عناصر التحكم المطلوبة
    const controls = [
        { id: 'showClock', label: 'إظهار الساعة', default: true },
        { id: 'showDate', label: 'إظهار التاريخ', default: true },
        { id: 'showWeather', label: 'إظهار الطقس', default: true },
        { id: 'showPrayers', label: 'إظهار أوقات الصلاة', default: true },
        { id: 'showMessages', label: 'إظهار الرسائل', default: true },
        { id: 'showNewsTicker', label: 'إظهار الشريط الإخباري', default: true },
        { id: 'showLogos', label: 'إظهار الشعارات', default: true },
        { id: 'showQR', label: 'إظهار QR Code', default: true }
    ];

    let html = `<h2>📺 التحكم المباشر بعناصر الشاشة</h2><div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">`;
    controls.forEach(ctrl => {
        // جلب الحالة من الإعدادات أو استخدام الافتراضي
        const isChecked = systemData.settings[ctrl.id] !== undefined ? systemData.settings[ctrl.id] : ctrl.default;
        html += `
            <label style="background:rgba(255,255,255,0.05); padding:15px; border-radius:10px; cursor:pointer; display:flex; align-items:center;">
                <input type="checkbox" data-visibility="${ctrl.id}" ${isChecked ? 'checked' : ''} style="margin-left:10px; transform:scale(1.2);">
                ${ctrl.label}
            </label>
        `;
    });
    html += `</div>`;
    section.innerHTML = html;

    // تفعيل الإرسال اللحظي عند أي تغيير
    section.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const element = e.target.getAttribute('data-visibility');
            const isVisible = e.target.checked;
            
            // 1. إرسال للشاشة فوراً عبر sync.js
            broadcastUpdate("TOGGLE_VISIBILITY", { element, visible: isVisible });
            
            // 2. حفظ في الإعدادات المحلية (Storage)
            systemData.settings[element] = isVisible;
            saveToLocal("settings", systemData.settings);
            
            // 3. تسجيل العملية
            try { addLog(`تغيير حالة عرض: ${element}`, "Admin"); } catch(err){}
        });
    });
}

// --- ج. إدارة الألوان والثيمات ---
function renderThemeManager() {
    const section = document.getElementById("systemSettings"); // أو أنشئ قسم خاص بالثيمات
    if (!section) return;

    section.innerHTML = `
        <h2>🎨 إدارة الألوان والثيمات</h2>
        <div style="display:flex; flex-direction:column; gap:15px;">
            <label>لون الخلفية العامة: <input type="color" id="bgColorPicker" value="#0f172a"></label>
            <label>لون البطاقات (الزجاجي): <input type="color" id="cardColorPicker" value="#1e293b"></label>
            <label>لون النصوص الأساسية: <input type="color" id="textColorPicker" value="#f8fafc"></label>
        </div>
    `;

    // ربط مغيرات الألوان بالإرسال اللحظي
    section.querySelectorAll('input[type="color"]').forEach(picker => {
        picker.addEventListener('input', (e) => {
            const property = e.target.id;
            const color = e.target.value;
            
            broadcastUpdate("UPDATE_THEME", { property, color });
            systemData.settings[property] = color;
            saveToLocal("settings", systemData.settings);
        });
    });
}

// --- د. إدارة الطقس والصلاة ---
function renderPrayerWeatherManager() {
    const section = document.getElementById("prayerWeatherSettings");
    if (!section) return;

    section.innerHTML = `
        <h2>🌦️ إعدادات الطقس والصلاة</h2>
        <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; margin-bottom:20px;">
            <label>المدينة المحددة: <input type="text" id="cityInput" value="حائل" style="padding:10px; border-radius:8px; margin-right:10px; border:none;"></label>
            <label style="display:block; margin-top:15px;">طريقة حساب الصلاة:
                <select id="prayerMethod" style="padding:10px; border-radius:8px; margin-right:10px; width:100%; margin-top:5px;">
                    <option value="4">جامعة أم القرى، مكة المكرمة</option>
                    <option value="3">رابطة العالم الإسلامي</option>
                </select>
            </label>
            <button class="btn-primary" id="updateLocationBtn" style="margin-top:20px;">تحديث وجلب البيانات اللحظية</button>
        </div>
    `;

    section.querySelector('#updateLocationBtn').addEventListener('click', () => {
        const city = section.querySelector('#cityInput').value;
        const method = section.querySelector('#prayerMethod').value;
        
        broadcastUpdate("UPDATE_LOCATION", { city, method });
        alert(`تم إرسال أمر تحديث بيانات مدينة: ${city} للشاشة الرئيسية.`);
    });
}

// --- هـ. إدارة الرسائل (إضافة وحذف لحظي) ---
function renderMessagesManager() {
    const section = document.getElementById("messagesSettings");
    if (!section) return;

    section.innerHTML = `
        <h2>💬 إدارة الرسائل والشريط الإخباري</h2>
        <div style="display:flex; gap:10px; margin-bottom:20px;">
            <input type="text" id="newMsgInput" placeholder="اكتب رسالة جديدة هنا..." style="flex:1; padding:12px; border-radius:8px; border:none;">
            <button class="btn-primary" id="addMsgBtn" style="width:150px;">إضافة فورية</button>
        </div>
        <div id="messagesList" style="display:flex; flex-direction:column; gap:10px;">
            </div>
    `;

    const renderList = () => {
        const list = section.querySelector('#messagesList');
        list.innerHTML = '';
        systemData.messages.forEach((msg, index) => {
            list.innerHTML += `
                <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
                    <span>${msg.text || msg}</span>
                    <button class="btn-danger delete-msg" data-index="${index}">حذف</button>
                </div>
            `;
        });

        // ربط أزرار الحذف
        section.querySelectorAll('.delete-msg').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                systemData.messages.splice(idx, 1);
                saveAndBroadcastMessages();
            });
        });
    };

    section.querySelector('#addMsgBtn').addEventListener('click', () => {
        const val = section.querySelector('#newMsgInput').value;
        if (val) {
            systemData.messages.push({ text: val, active: true });
            section.querySelector('#newMsgInput').value = '';
            saveAndBroadcastMessages();
        }
    });

    const saveAndBroadcastMessages = () => {
        saveToLocal("messages", systemData.messages);
        broadcastUpdate("UPDATE_MESSAGES", systemData.messages);
        renderList();
    };

    renderList();
}
