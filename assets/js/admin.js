// ============================================================================
// Admin Master Controller - النسخة المضادة للأعطال
// ============================================================================

// قاعدة بيانات محلية مؤقتة لضمان عمل الواجهة حتى لو فشل جلب الملفات
let systemData = {
    settings: JSON.parse(localStorage.getItem("admin_settings")) || {},
    messages: JSON.parse(localStorage.getItem("admin_messages")) || ["أهلاً بكم في جامعة حائل"],
    weather: {},
    prayers: {}
};

export async function initAdmin() {
    console.log("🚀 تهيئة محرك الإدارة (النسخة الآمنة)...");
    
    try {
        // 1. تفعيل نظام التنقل أولاً
        setupTabs();

        // 2. بناء واجهات التحكم فوراً لضمان عدم بقائها فارغة
        renderMainDashboard();
        renderDisplayManager();
        renderThemeManager();
        renderMessagesManager();
        renderPrayerWeatherManager();
        
        console.log("✅ تم بناء محتوى لوحة الإدارة بنجاح");
    } catch (error) {
        console.error("❌ حدث خطأ غير متوقع أثناء بناء الواجهة:", error);
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

// ============================================================================
// بناء الواجهات (Renderers) - يتم حقن الـ HTML مباشرة داخل التبويبات
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
        // إذا لم يكن الإعداد موجوداً، اعتبره true افتراضياً
        const isChecked = systemData.settings[ctrl.id] !== false; 
        html += `
            <label style="background:rgba(255,255,255,0.05); padding:15px; border-radius:10px; cursor:pointer; display:flex; align-items:center; border:1px solid rgba(255,255,255,0.1);">
                <input type="checkbox" data-visibility="${ctrl.id}" ${isChecked ? 'checked' : ''} style="margin-left:10px; transform:scale(1.3); cursor:pointer;">
                <span style="font-size:1.1rem;">${ctrl.label}</span>
            </label>
        `;
    });
    html += `</div>`;
    section.innerHTML = html;

    // تفعيل حفظ الإعدادات عند الضغط
    section.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const element = e.target.getAttribute('data-visibility');
            const isVisible = e.target.checked;
            
            // حفظ محلي لضمان بقائها
            systemData.settings[element] = isVisible;
            localStorage.setItem("admin_settings", JSON.stringify(systemData.settings));
            
            // محاولة الإرسال للشاشة إذا كان ملف المزامنة يعمل
            try {
                const syncChannel = new BroadcastChannel('smart_clock_channel');
                syncChannel.postMessage({ action: "TOGGLE_VISIBILITY", payload: { element, visible: isVisible } });
            } catch(e) {}
        });
    });
}

function renderThemeManager() {
    const section = document.getElementById("systemSettings");
    if (!section) return;

    section.innerHTML = `
        <h2>🎨 إدارة الألوان والثيمات</h2>
        <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; border:1px solid rgba(255,255,255,0.1);">
            <div style="display:flex; flex-direction:column; gap:20px; max-width:400px;">
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    لون الخلفية العامة: <input type="color" id="bgColorPicker" value="${systemData.settings.bgColor || '#0f172a'}" style="width:50px; height:40px; cursor:pointer;">
                </label>
                <label style="display:flex; justify-content:space-between; align-items:center;">
                    لون البطاقات: <input type="color" id="cardColorPicker" value="${systemData.settings.cardColor || '#1e293b'}" style="width:50px; height:40px; cursor:pointer;">
                </label>
            </div>
        </div>
    `;
}

function renderPrayerWeatherManager() {
    const section = document.getElementById("prayerWeatherSettings");
    if (!section) return;

    section.innerHTML = `
        <h2>🌦️ إعدادات الطقس والصلاة</h2>
        <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:15px; border:1px solid rgba(255,255,255,0.1); max-width:500px;">
            <label style="display:block; margin-bottom:15px;">المدينة المحددة: 
                <input type="text" id="cityInput" value="حائل" style="width:100%; padding:12px; margin-top:8px; border-radius:8px; border:none; background:rgba(0,0,0,0.2); color:white;">
            </label>
            <label style="display:block; margin-bottom:20px;">طريقة حساب الصلاة:
                <select id="prayerMethod" style="width:100%; padding:12px; margin-top:8px; border-radius:8px; border:none; background:var(--admin-primary); color:white; cursor:pointer;">
                    <option value="4">جامعة أم القرى، مكة المكرمة</option>
                    <option value="3">رابطة العالم الإسلامي</option>
                </select>
            </label>
            <button class="btn-primary" id="updateLocationBtn">تحديث وجلب البيانات اللحظية</button>
        </div>
    `;
}

function renderMessagesManager() {
    const section = document.getElementById("messagesSettings");
    if (!section) return;

    const renderList = () => {
        let listHtml = '';
        systemData.messages.forEach((msg, index) => {
            listHtml += `
                <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:10px; display:flex; justify-content:space-between; align-items:center; border:1px solid rgba(255,255,255,0.1);">
                    <span style="font-size:1.1rem;">${msg}</span>
                    <button class="btn-danger delete-msg" data-index="${index}">حذف</button>
                </div>
            `;
        });
        return listHtml;
    };

    section.innerHTML = `
        <h2>💬 إدارة الرسائل والشريط الإخباري</h2>
        <div style="display:flex; gap:10px; margin-bottom:20px;">
            <input type="text" id="newMsgInput" placeholder="اكتب رسالة جديدة هنا..." style="flex:1; padding:12px; border-radius:8px; border:none; background:rgba(0,0,0,0.2); color:white; font-size:1.1rem;">
            <button class="btn-primary" id="addMsgBtn" style="width:150px;">إضافة فورية</button>
        </div>
        <div id="messagesList" style="display:flex; flex-direction:column; gap:10px;">
            ${renderList()}
        </div>
    `;

    // تفعيل زر الإضافة
    section.querySelector('#addMsgBtn').addEventListener('click', () => {
        const input = section.querySelector('#newMsgInput');
        if (input.value.trim() !== '') {
            systemData.messages.push(input.value.trim());
            localStorage.setItem("admin_messages", JSON.stringify(systemData.messages));
            renderMessagesManager(); // إعادة بناء القسم لتحديث القائمة
            renderMainDashboard(); // تحديث الإحصائيات
        }
    });

    // تفعيل أزرار الحذف
    section.querySelectorAll('.delete-msg').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            systemData.messages.splice(idx, 1);
            localStorage.setItem("admin_messages", JSON.stringify(systemData.messages));
            renderMessagesManager();
            renderMainDashboard();
        });
    });
}
