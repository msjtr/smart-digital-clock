// ============================================================================
// ⚙️ المحرك الشامل لإدارة الشريط الإخباري (نسخة المواصفات الكاملة)
// ============================================================================

import { fetchJsonData, saveJsonData } from "../js/storage.js";
import { showToast } from "../js/utils.js";

let newsData = { settings: {}, list: [] };
let editingId = null;

export async function initAdminNews() {
    console.log("⚙️ تهيئة مدير الشريط الإخباري الشامل...");
    await loadNewsData();
    populateGlobalSettingsUI();
    renderNewsTable();
    updateLivePreview();
}

async function loadNewsData() {
    const data = await fetchJsonData("news");
    if (data && data.settings) {
        newsData = data;
    } else {
        newsData.settings = { position: "أسفل الشاشة", speed: "متوسطة", textColor: "#14b8a6", bgColor: "#0f172a" };
    }
}

// ---------------------------------------------------------
// 🎨 إعدادات الشريط العالمية والمعاينة المباشرة
// ---------------------------------------------------------

window.toggleCustomInput = function(selectId, inputId) {
    const sel = document.getElementById(selectId);
    const inp = document.getElementById(inputId);
    if(inp) inp.style.display = sel.value === "custom" ? "block" : "none";
};

function populateGlobalSettingsUI() {
    const s = newsData.settings;
    for (const key in s) {
        const el = document.getElementById('g' + key.charAt(0).toUpperCase() + key.slice(1));
        if(el) el.value = s[key];
    }
}

window.updateGlobalSettings = async function() {
    newsData.settings = {
        position: document.getElementById("gPosition").value,
        height: document.getElementById("gHeight").value,
        width: document.getElementById("gWidth").value,
        displayMode: document.getElementById("gDisplayMode").value,
        fontFamily: document.getElementById("gFontFamily").value,
        fontSize: document.getElementById("gFontSize").value,
        fontWeight: document.getElementById("gFontWeight").value,
        fontStyle: document.getElementById("gFontStyle").value,
        letterSpacing: document.getElementById("gLetterSpacing").value,
        wordSpacing: document.getElementById("gWordSpacing").value,
        textColor: document.getElementById("gTextColor").value,
        iconColor: document.getElementById("gIconColor").value,
        bgType: document.getElementById("gBgType").value,
        bgColor: document.getElementById("gBgColor").value,
        borderColor: document.getElementById("gBorderColor").value,
        separator: document.getElementById("gSeparator").value,
        direction: document.getElementById("gDirection").value,
        speed: document.getElementById("gSpeed").value,
        effect: document.getElementById("gEffect").value,
        emergencySound: document.getElementById("gEmergencySound").value
    };
    updateLivePreview();
    await saveAndSync("تم تحديث تصميم الشريط بنجاح");
};

function updateLivePreview() {
    const s = newsData.settings;
    const ticker = document.getElementById("livePreviewTicker");
    if (!ticker) return;

    ticker.style.color = s.textColor;
    ticker.style.fontFamily = `'${s.fontFamily}', sans-serif`;
    
    const activeNews = newsData.list.filter(n => n.status === "نشط");
    ticker.innerHTML = activeNews.map(n => `<span>${n.iconVal || ''} ${n.text}</span>`).join(' | ');
}

// ---------------------------------------------------------
// 📝 إدارة الأخبار (CRUD) مع المرفقات والجدولة
// ---------------------------------------------------------

window.handleImageUpload = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById("nImageBase64").value = e.target.result;
        reader.readAsDataURL(file);
    }
};

window.saveFullNewsItem = async function() {
    const item = {
        id: editingId || "news_" + Date.now(),
        title: document.getElementById("nTitle").value,
        text: document.getElementById("nText").value,
        desc: document.getElementById("nDesc").value,
        link: document.getElementById("nLink").value,
        image: document.getElementById("nImageBase64").value,
        iconVal: document.getElementById("nIconVal").value,
        type: document.getElementById("nType").value,
        priority: document.getElementById("nPriority").value,
        startDate: document.getElementById("nStart").value,
        endDate: document.getElementById("nEnd").value,
        status: "نشط",
        dateAdded: new Date().toISOString()
    };

    if(editingId) {
        const idx = newsData.list.findIndex(n => n.id === editingId);
        newsData.list[idx] = item;
    } else {
        newsData.list.push(item);
    }

    document.getElementById("addNewsModal").style.display = "none";
    await saveAndSync("تم حفظ الخبر بنجاح");
};

function renderNewsTable() {
    const tbody = document.getElementById("adminNewsTableBody");
    if (!tbody) return;

    tbody.innerHTML = newsData.list.map((n, i) => `
        <tr style="border-bottom: 1px solid #334155;" draggable="true" ondragstart="dragStart(${i})" ondragover="dragOver(event)" ondrop="drop(${i})">
            <td><input type="checkbox" class="news-checkbox" value="${n.id}"></td>
            <td style="cursor: grab;">☰</td>
            <td><strong>${n.title}</strong><br><small>${n.text.substring(0,30)}</small></td>
            <td>${n.type} / ${n.priority}</td>
            <td>${n.startDate || 'مستمر'}</td>
            <td><span style="color:${n.status==='نشط'?'#10b981':'#ef4444'}">${n.status}</span></td>
            <td>
                <button onclick="editItem(${i})" style="background:transparent; color:#eab308; border:none; cursor:pointer;">✏️</button>
                <button onclick="deleteItem(${i})" style="background:transparent; color:#ef4444; border:none; cursor:pointer;">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ---------------------------------------------------------
// ⚙️ العمليات المتقدمة (النسخ، السحب، المزامنة)
// ---------------------------------------------------------

window.editItem = function(i) {
    const n = newsData.list[i]; editingId = n.id;
    document.getElementById("nTitle").value = n.title;
    document.getElementById("nText").value = n.text;
    document.getElementById("addNewsModal").style.display = "flex";
};

window.deleteItem = async function(i) {
    if(confirm("حذف نهائي؟")) { newsData.list.splice(i, 1); await saveAndSync("تم الحذف"); }
};

window.backupNewsData = function() {
    const a = document.createElement('a');
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newsData));
    a.download = "news_backup.json"; a.click();
};

window.restoreNewsData = function(e) {
    const r = new FileReader();
    r.onload = async ev => { newsData = JSON.parse(ev.target.result); await saveAndSync("تمت الاستعادة"); };
    r.readAsText(e.target.files[0]);
};

async function saveAndSync(msg) {
    await saveJsonData("news", newsData);
    showToast(msg, "success");
    renderNewsTable();
    updateLivePreview();
}

let draggedIdx = null;
window.dragStart = i => draggedIdx = i;
window.dragOver = e => e.preventDefault();
window.drop = async i => {
    const it = newsData.list.splice(draggedIdx, 1)[0];
    newsData.list.splice(i, 0, it);
    await saveAndSync("تم الترتيب بالسحب");
};
