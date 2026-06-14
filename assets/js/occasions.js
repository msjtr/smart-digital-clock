// ============================================================================
// Occasions Manager - نظام إدارة المناسبات (النسخة النهائية)
// ============================================================================

import { fetchJsonData, saveToLocal, getFromLocal } from "./storage.js";
import { addLog } from "./logs.js";

let occasions = [];
let activeOccasion = null;

/**
 * تهيئة نظام المناسبات
 */
export async function initOccasions() {
    // محاولة الجلب من التخزين المحلي أولاً
    const localData = getFromLocal("occasions");

    if (localData && Array.isArray(localData) && localData.length > 0) {
        occasions = localData;
    } else {
        // إذا لم يوجد محلياً، جلب من السيرفر
        const jsonData = await fetchJsonData("occasions");
        occasions = jsonData?.list || [];
        saveToLocal("occasions", occasions);
    }

    selectActiveOccasion();
    renderOccasion();
    console.log("✅ تم تشغيل نظام المناسبات بنجاح.");
}

/**
 * اختيار المناسبة النشطة بناءً على التاريخ أو الحالة
 */
function selectActiveOccasion() {
    const today = new Date();
    
    // البحث عن مناسبة ضمن نطاق التاريخ ومفعلة
    activeOccasion = occasions.find(occ => {
        if (!occ.isActive) return false;
        const start = new Date(occ.startDate);
        const end = new Date(occ.endDate);
        return today >= start && today <= end;
    });

    // إذا لم توجد مناسبة في النطاق، نختار أول مناسبة مفعلة
    if (!activeOccasion) {
        activeOccasion = occasions.find(o => o.isActive);
    }
}

/**
 * عرض المناسبة في الواجهة
 */
function renderOccasion() {
    const box = document.getElementById("occasionBox");
    if (!box) return;

    if (!activeOccasion) {
        box.innerHTML = `
            <h2>🎉 مرحباً بكم</h2>
            <p>أهلاً بكم في كلية الشريعة والقانون</p>
        `;
        return;
    }

    box.innerHTML = `
        <h2>${activeOccasion.title}</h2>
        <p>${activeOccasion.description}</p>
    `;

    if (activeOccasion.imagePath) {
        const image = document.createElement("img");
        image.src = activeOccasion.imagePath;
        image.alt = activeOccasion.title;
        image.className = "occasion-image";
        image.onerror = () => image.remove();
        box.appendChild(image);
    }
}

// ============================================================================
// دوال إدارة البيانات (Admin API)
// ============================================================================

export function addOccasion(occasion) {
    occasions.push(occasion);
    saveOccasions();
    addLog("إضافة مناسبة", occasion.title);
    selectActiveOccasion();
    renderOccasion();
}

export function updateOccasion(index, data) {
    if (!occasions[index]) return;
    occasions[index] = { ...occasions[index], ...data };
    saveOccasions();
    addLog("تعديل مناسبة", occasions[index].title);
    selectActiveOccasion();
    renderOccasion();
}

export function deleteOccasion(index) {
    if (!occasions[index]) return;
    const deleted = occasions.splice(index, 1);
    saveOccasions();
    addLog("حذف مناسبة", deleted[0].title);
    selectActiveOccasion();
    renderOccasion();
}

export function activateOccasion(index) {
    occasions.forEach(o => o.isActive = false);
    if (occasions[index]) {
        occasions[index].isActive = true;
        addLog("تفعيل مناسبة", occasions[index].title);
    }
    saveOccasions();
    selectActiveOccasion();
    renderOccasion();
}

function saveOccasions() {
    saveToLocal("occasions", occasions);
}

export function getOccasions() {
    return occasions;
}

export function getActiveOccasion() {
    return activeOccasion;
}
