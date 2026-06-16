// ============================================================================
// ⚙️ وحدة إدارة الشريط الإخباري (لوحة التحكم)
// ============================================================================

import { fetchJsonData, saveJsonData } from "../js/storage.js";
import { showToast } from "../js/utils.js";

let newsData = { settings: {}, list: [] };

export async function initAdminNews() {
    console.log("⚙️ تهيئة مدير الشريط الإخباري...");
    await loadNewsData();
    renderNewsTable();
}

async function loadNewsData() {
    const data = await fetchJsonData("news");
    if (data) {
        newsData = data;
    }
}

/**
 * حفظ التعديلات وإرسال المزامنة
 */
async function saveAndSync() {
    try {
        newsData.lastUpdated = new Date().toISOString();
        await saveJsonData("news", newsData);
        showToast("تم حفظ التعديلات وتحديث الشاشة فوراً", "success");
        renderNewsTable();
    } catch (error) {
        showToast("فشل في حفظ البيانات", "error");
    }
}

/**
 * عرض جدول الأخبار في لوحة التحكم
 */
function renderNewsTable() {
    const tbody = document.getElementById("adminNewsTableBody");
    if (!tbody) return;

    tbody.innerHTML = newsData.list.map((news, index) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 15px; font-weight: bold;">${news.order}</td>
            <td style="padding: 15px;">${news.text}</td>
            <td style="padding: 15px;">
                <span style="
                    background: ${news.status === 'نشط' ? '#d1fae5' : '#fee2e2'}; 
                    color: ${news.status === 'نشط' ? '#065f46' : '#991b1b'};
                    padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold;
                ">
                    ${news.status}
                </span>
            </td>
            <td style="padding: 15px;">
                <button onclick="toggleNewsStatus(${index})" style="background: #14b8a6; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-left: 5px;">
                    ${news.status === 'نشط' ? 'تعطيل' : 'تفعيل'}
                </button>
                <button onclick="deleteNewsItem(${index})" style="background: #ef4444; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                    حذف
                </button>
            </td>
        </tr>
    `).join('');
}

// دوال التحكم العالمية المربوطة بـ HTML
window.toggleNewsStatus = async function(index) {
    const item = newsData.list[index];
    item.status = item.status === "نشط" ? "معطل" : "نشط";
    await saveAndSync();
};

window.deleteNewsItem = async function(index) {
    if(confirm("هل أنت متأكد من حذف هذا الخبر نهائياً؟")) {
        newsData.list.splice(index, 1);
        // إعادة ترتيب الأرقام التسلسلية
        newsData.list.forEach((n, i) => n.order = i + 1);
        await saveAndSync();
    }
};

window.addNewItem = async function(text) {
    const newItem = {
        id: "news_" + Date.now(),
        text: text,
        status: "نشط",
        order: newsData.list.length + 1
    };
    newsData.list.push(newItem);
    await saveAndSync();
};
