// ============================================================================
// Content Manager - النسخة المحدثة (دعم السيرفر + المزامنة)
// ============================================================================

import { fetchJsonData, saveJsonData } from "./storage.js";
import { addLog } from "./logs.js";

let contentItems = [];
let currentIndex = 0;
let rotationTimer = null;

export async function initContent() {
    // 1. جلب البيانات من السيرفر (مع استخدام المحلي كاحتياطي)
    const contentData = await fetchJsonData("content");
    contentItems = Array.isArray(contentData) ? contentData : (contentData?.items || []);

    startRotation();
    console.log("✅ تم تشغيل نظام المحتوى");
}

// 2. تحديث المحتوى من الخارج (عند استقبال أمر من الإدارة)
export function updateContentList(newList) {
    contentItems = newList;
    currentIndex = 0; // إعادة الضبط عند تغيير القائمة
    showContent();
}

function startRotation() {
    if (contentItems.length === 0) { showEmpty(); return; }
    showContent();
    if (rotationTimer) clearInterval(rotationTimer);
    
    // التدوير كل 10 ثواني
    rotationTimer = setInterval(nextContent, 10000);
}

function nextContent() {
    currentIndex = (currentIndex + 1) % contentItems.length;
    showContent();
}

function showContent() {
    const area = document.getElementById("contentArea");
    if (!area) return;

    const item = contentItems[currentIndex];
    if (!item) { showEmpty(); return; }

    area.innerHTML = "";
    
    // دعم أنواع الملفات المرفوعة عبر السيرفر
    switch (item.type) {
        case "image":
            area.innerHTML = `<img src="${item.url}" class="content-image">`;
            break;
        case "video":
            area.innerHTML = `<video autoplay muted loop class="content-video"><source src="${item.url}"></video>`;
            break;
        case "pdf":
            area.innerHTML = `<iframe src="${item.url}" class="content-pdf"></iframe>`;
            break;
        default:
            area.innerHTML = `<h3>${item.title || ""}</h3><p>${item.text || ""}</p>`;
    }
}

function showEmpty() {
    const area = document.getElementById("contentArea");
    if (area) area.innerHTML = `<div class="empty-content">لا يوجد محتوى حالياً</div>`;
}

// ============================================================================
// عمليات الحفظ (مرتبطة الآن بالسيرفر)
// ============================================================================

async function saveContent() {
    // حفظ في السيرفر (ملف content.json)
    await saveJsonData("content", contentItems);
}

export async function addContent(item) {
    contentItems.push(item);
    await saveContent();
    addLog("إضافة محتوى", item.title || item.type);
}

export async function deleteContent(index) {
    const deleted = contentItems.splice(index, 1);
    await saveContent();
    addLog("حذف محتوى", deleted[0].title || "");
}
