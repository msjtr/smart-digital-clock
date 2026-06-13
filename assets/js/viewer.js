// ============================================================================
// Advanced Viewer - العارض المتقدم
// ============================================================================

import { addLog } from "./logs.js";

let currentZoom = 1;

export function initViewer() {
    createViewer();
    console.log("✅ تم تشغيل العارض الاحترافي");
}

// ============================================================================
// إنشاء العارض
// ============================================================================
function createViewer() {
    // منع التكرار
    if (document.getElementById("mainViewer")) return;

    const viewer = document.createElement("div");
    viewer.id = "mainViewer";
    viewer.className = "fullscreen-viewer";
    viewer.style.display = "none"; // مخفي افتراضياً

    viewer.innerHTML = `
        <div class="viewer-toolbar">
            <button id="viewerZoomIn" title="تكبير">➕</button>
            <button id="viewerZoomOut" title="تصغير">➖</button>
            <button id="viewerFullscreen" title="ملء الشاشة">⛶</button>
            <a id="viewerDownload" download title="تحميل الملف">⬇</a>
            <button id="viewerClose" title="إغلاق">✖</button>
        </div>
        <div id="viewerContent" class="viewer-content"></div>
    `;

    document.body.appendChild(viewer);

    // ربط الأزرار بالأحداث
    document.getElementById("viewerClose").addEventListener("click", closeViewer);
    document.getElementById("viewerZoomIn").addEventListener("click", zoomIn);
    document.getElementById("viewerZoomOut").addEventListener("click", zoomOut);
    document.getElementById("viewerFullscreen").addEventListener("click", toggleFullscreen);
}

// ============================================================================
// فتح ملف
// ============================================================================
export function openViewer(fileUrl, fileType) {
    const viewer = document.getElementById("mainViewer");
    const content = document.getElementById("viewerContent");
    const downloadBtn = document.getElementById("viewerDownload");

    if (!viewer || !content) return;

    viewer.style.display = "flex";
    content.innerHTML = "";
    downloadBtn.href = fileUrl;
    currentZoom = 1;

    const cleanType = fileType ? fileType.toLowerCase() : "";

    switch (cleanType) {
        case "image":
        case "gif":
        case "png":
        case "jpg":
        case "jpeg":
            content.innerHTML = `
                <img src="${fileUrl}" class="viewer-image" id="viewerMedia" alt="معاينة الصورة">
            `;
            break;

        case "video":
        case "mp4":
        case "webm":
            content.innerHTML = `
                <video controls autoplay class="viewer-video" id="viewerMedia">
                    <source src="${fileUrl}">
                    المتصفح الخاص بك لا يدعم تشغيل الفيديو.
                </video>
            `;
            break;

        case "pdf":
            content.innerHTML = `
                <iframe src="${fileUrl}" class="viewer-pdf" id="viewerMedia"></iframe>
            `;
            break;

        case "ppt":
        case "pptx":
        case "excel":
        case "xls":
        case "xlsx":
        case "doc":
        case "docx":
            // استخدام عارض جوجل لضمان فتح ملفات الأوفيس داخل المتصفح
            const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
            content.innerHTML = `
                <iframe src="${googleViewerUrl}" class="viewer-pdf" id="viewerMedia"></iframe>
            `;
            break;

        default:
            content.innerHTML = `
                <div class="viewer-error">
                    نوع الملف غير مدعوم للمعاينه المباشرة
                </div>
            `;
    }

    try {
        addLog("فتح ملف في العارض", fileUrl);
    } catch (e) {
        console.warn("تعذر تسجيل العملية:", e);
    }
}

// ============================================================================
// إغلاق
// ============================================================================
export function closeViewer() {
    const viewer = document.getElementById("mainViewer");
    const content = document.getElementById("viewerContent");

    if (viewer) {
        viewer.style.display = "none";
    }
    
    // تفريغ المحتوى لإيقاف تشغيل الفيديو أو الصوت فوراً
    if (content) {
        content.innerHTML = "";
    }
    
    currentZoom = 1;
}

// ============================================================================
// تكبير وتصغير
// ============================================================================
function zoomIn() {
    currentZoom += 0.2;
    applyZoom();
}

function zoomOut() {
    currentZoom -= 0.2;
    if (currentZoom < 0.5) {
        currentZoom = 0.5;
    }
    applyZoom();
}

function applyZoom() {
    const media = document.getElementById("viewerMedia");
    if (!media) return;

    media.style.transform = `scale(${currentZoom})`;
    media.style.transition = "transform 0.3s ease";
}

// ============================================================================
// ملء الشاشة (تفعيل / إلغاء)
// ============================================================================
function toggleFullscreen() {
    const viewer = document.getElementById("mainViewer");
    
    if (!document.fullscreenElement) {
        if (viewer.requestFullscreen) {
            viewer.requestFullscreen();
        } else if (viewer.webkitRequestFullscreen) { /* Safari */
            viewer.webkitRequestFullscreen();
        } else if (viewer.msRequestFullscreen) { /* IE11 */
            viewer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
