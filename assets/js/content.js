// ============================================================================
// Content Manager - النسخة النهائية المكتملة
// ============================================================================

import { fetchJsonData, saveJsonData } from "./storage.js";
import { addLog } from "./logs.js";

let contentItems = [];
let currentIndex = 0;
let rotationTimer = null;

/**
 * دالة تهيئة النظام
 */
export async function initContent() {
    // 1. جلب البيانات من السيرفر
    const contentData = await fetchJsonData("content");
    contentItems = Array.isArray(contentData) ? contentData : (contentData?.items || []);

    startRotation();
    console.log("✅ نظام المحتوى يعمل بكفاءة.");
}

/**
 * دالة مطلوبة من dashboard.js لاسترجاع قائمة المحتوى
 */
export function getContent() {
    return contentItems;
}

/**
 * تحديث القائمة (تُستخدم عند استقبال تحديث من لوحة الإدارة)
 */
export function updateContentList(newList) {
    contentItems = Array.isArray(newList) ? newList : [];
    currentIndex = 0;
    showContent();
}

/**
 * نظام التدوير التلقائي
 */
function startRotation() {
    if (contentItems.length === 0) { showEmpty(); return; }
    showContent();
    if (rotationTimer) clearInterval(rotationTimer);
    
    // التدوير كل 10 ثواني
    rotationTimer = setInterval(nextContent, 10000);
}

function nextContent() {
    if (contentItems.length === 0) return;
    currentIndex = (currentIndex + 1) % contentItems.length;
    showContent();
}

function showContent() {
    const area = document.getElementById("contentArea");
    if (!area) return;

    const item = contentItems[currentIndex];
    if (!item) { showEmpty(); return; }

    area.innerHTML = "";
    
    // عرض المحتوى بناءً على النوع
    switch (item.type) {
        case "image":
            area.innerHTML = `<img src="${item.url}" class="content-image" alt="Content">`;
            break;
        case "video":
            area.innerHTML = `<video autoplay muted loop class="content-video"><source src="${item.url}"></video>`;
            break;
        case "pdf":
            area.innerHTML = `<iframe src="${item.url}" class="content-pdf"></iframe>`;
            break;
        default:
            area.innerHTML = `<div class="text-content"><h3>${item.title || ""}</h3><p>${item.text || ""}</p></div>`;
    }
}

function showEmpty() {
    const area = document.getElementById("contentArea");
    if (area) area.innerHTML = `<div class="empty-content">لا يوجد محتوى حالياً</div>`;
}

// ============================================================================
// عمليات الحفظ والإدارة
// ============================================================================

async function saveContent() {
    await saveJsonData("content", contentItems);
}

export async function addContent(item) {
    contentItems.push(item);
    await saveContent();
    addLog("إضافة محتوى", item.title || item.type);
    showContent(); // تحديث فوري
}

export async function deleteContent(index) {
    const deleted = contentItems.splice(index, 1);
    await saveContent();
    addLog("حذف محتوى", deleted[0].title || "");
    showContent(); // تحديث فوري
}
