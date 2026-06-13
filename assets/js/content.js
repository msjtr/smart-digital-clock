// ============================================================================
// Content Manager
// ============================================================================

import {
    fetchJsonData,
    saveToLocal,
    getFromLocal
} from "./storage.js";

import {
    addLog
} from "./logs.js";

let contentItems = [];

let currentIndex = 0;

let rotationTimer = null;

// ============================================================================
// تشغيل المحتوى
// ============================================================================

export async function initContent() {

    const localContent =
        getFromLocal(
            "content"
        );

    if (
        localContent &&
        localContent.length
    ) {

        contentItems =
            localContent;

    } else {

        const contentData =
            await fetchJsonData(
                "content"
            );

        contentItems =
            contentData?.items || [];

        saveToLocal(
            "content",
            contentItems
        );

    }

    startRotation();

    console.log(
        "✅ تم تشغيل نظام المحتوى"
    );

}

// ============================================================================
// تدوير المحتوى
// ============================================================================

function startRotation() {

    if (
        contentItems.length === 0
    ) {

        showEmpty();

        return;

    }

    showContent();

    if (rotationTimer) {

        clearInterval(
            rotationTimer
        );

    }

    rotationTimer =
        setInterval(
            nextContent,
            10000
        );

}

// ============================================================================
// التالي
// ============================================================================

function nextContent() {

    currentIndex++;

    if (
        currentIndex >=
        contentItems.length
    ) {

        currentIndex = 0;

    }

    showContent();

}

// ============================================================================
// عرض المحتوى
// ============================================================================

function showContent() {

    const area =
        document.getElementById(
            "contentArea"
        );

    if (!area) return;

    const item =
        contentItems[
            currentIndex
        ];

    if (!item) {

        showEmpty();

        return;

    }

    area.innerHTML = "";

    switch (
        item.type
    ) {

        case "text":

            area.innerHTML = `
                <h3>${item.title || ""}</h3>
                <p>${item.text || ""}</p>
            `;

            break;

        case "image":

            area.innerHTML = `
                <img
                    src="${item.url}"
                    alt="${item.title || ''}"
                    class="content-image">
            `;

            break;

        case "video":

            area.innerHTML = `
                <video
                    controls
                    autoplay
                    muted
                    loop
                    class="content-video">

                    <source
                        src="${item.url}">
                </video>
            `;

            break;

        case "pdf":

            area.innerHTML = `
                <iframe
                    src="${item.url}"
                    class="content-pdf">
                </iframe>
            `;

            break;

        case "excel":

            area.innerHTML = `
                <div class="excel-placeholder">
                    📊 ملف Excel
                    <br>
                    ${item.title || ""}
                </div>
            `;

            break;

        case "gif":

            area.innerHTML = `
                <img
                    src="${item.url}"
                    class="content-gif">
            `;

            break;

        default:

            area.innerHTML = `
                <p>
                    نوع المحتوى غير مدعوم
                </p>
            `;

    }

}

// ============================================================================
// لا يوجد محتوى
// ============================================================================

function showEmpty() {

    const area =
        document.getElementById(
            "contentArea"
        );

    if (!area) return;

    area.innerHTML = `
        <div class="empty-content">
            لا يوجد محتوى حالياً
        </div>
    `;

}

// ============================================================================
// إضافة محتوى
// ============================================================================

export function addContent(
    item
) {

    contentItems.push(
        item
    );

    saveContent();

    addLog(
        "إضافة محتوى",
        item.title || item.type
    );

}

// ============================================================================
// تعديل محتوى
// ============================================================================

export function updateContent(
    index,
    item
) {

    if (
        !contentItems[index]
    ) return;

    contentItems[index] =
        item;

    saveContent();

    addLog(
        "تعديل محتوى",
        item.title || ""
    );

}

// ============================================================================
// حذف محتوى
// ============================================================================

export function deleteContent(
    index
) {

    if (
        !contentItems[index]
    ) return;

    const deleted =
        contentItems[index];

    contentItems.splice(
        index,
        1
    );

    saveContent();

    addLog(
        "حذف محتوى",
        deleted.title || ""
    );

}

// ============================================================================
// تثبيت محتوى
// ============================================================================

export function pinContent(
    index
) {

    if (
        !contentItems[index]
    ) return;

    currentIndex =
        index;

    showContent();

}

// ============================================================================
// حفظ
// ============================================================================

function saveContent() {

    saveToLocal(
        "content",
        contentItems
    );

}

// ============================================================================
// جلب جميع المحتويات
// ============================================================================

export function getContent() {

    return contentItems;

}
