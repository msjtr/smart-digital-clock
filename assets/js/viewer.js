// ============================================================================
// Advanced Viewer
// ============================================================================

import { addLog } from "./logs.js";

let currentZoom = 1;

export function initViewer() {

    createViewer();

    console.log(
        "✅ تم تشغيل العارض الاحترافي"
    );

}

// ============================================================================
// إنشاء العارض
// ============================================================================

function createViewer() {

    if (
        document.getElementById(
            "mainViewer"
        )
    ) return;

    const viewer =
        document.createElement(
            "div"
        );

    viewer.id =
        "mainViewer";

    viewer.className =
        "fullscreen-viewer";

    viewer.innerHTML = `

        <div class="viewer-toolbar">

            <button id="viewerClose">
                ✖
            </button>

            <button id="viewerZoomIn">
                ➕
            </button>

            <button id="viewerZoomOut">
                ➖
            </button>

            <button id="viewerFullscreen">
                ⛶
            </button>

            <a
                id="viewerDownload"
                download>

                ⬇

            </a>

        </div>

        <div
            id="viewerContent"
            class="viewer-content">

        </div>

    `;

    document.body.appendChild(
        viewer
    );

    document
        .getElementById(
            "viewerClose"
        )
        .addEventListener(
            "click",
            closeViewer
        );

    document
        .getElementById(
            "viewerZoomIn"
        )
        .addEventListener(
            "click",
            zoomIn
        );

    document
        .getElementById(
            "viewerZoomOut"
        )
        .addEventListener(
            "click",
            zoomOut
        );

    document
        .getElementById(
            "viewerFullscreen"
        )
        .addEventListener(
            "click",
            enterFullscreen
        );

}

// ============================================================================
// فتح ملف
// ============================================================================

export function openViewer(
    fileUrl,
    fileType
) {

    const viewer =
        document.getElementById(
            "mainViewer"
        );

    const content =
        document.getElementById(
            "viewerContent"
        );

    const downloadBtn =
        document.getElementById(
            "viewerDownload"
        );

    if (
        !viewer ||
        !content
    ) return;

    viewer.style.display =
        "flex";

    content.innerHTML = "";

    downloadBtn.href =
        fileUrl;

    currentZoom = 1;

    switch (
        fileType
    ) {

        case "image":

        case "gif":

            content.innerHTML = `
                <img
                    src="${fileUrl}"
                    class="viewer-image"
                    id="viewerMedia">
            `;
            break;

        case "video":

            content.innerHTML = `
                <video
                    controls
                    autoplay
                    class="viewer-video">

                    <source
                        src="${fileUrl}">
                </video>
            `;
            break;

        case "pdf":

            content.innerHTML = `
                <iframe
                    src="${fileUrl}"
                    class="viewer-pdf">
                </iframe>
            `;
            break;

        case "ppt":

            content.innerHTML = `
                <iframe
                    src="${fileUrl}"
                    class="viewer-pdf">
                </iframe>
            `;
            break;

        case "excel":

            content.innerHTML = `
                <iframe
                    src="${fileUrl}"
                    class="viewer-pdf">
                </iframe>
            `;
            break;

        default:

            content.innerHTML = `
                <div class="viewer-error">

                    نوع الملف غير مدعوم

                </div>
            `;

    }

    addLog(
        "فتح ملف",
        fileUrl
    );

}

// ============================================================================
// إغلاق
// ============================================================================

export function closeViewer() {

    const viewer =
        document.getElementById(
            "mainViewer"
        );

    if (viewer) {

        viewer.style.display =
            "none";

    }

}

// ============================================================================
// تكبير
// ============================================================================

function zoomIn() {

    currentZoom += 0.1;

    applyZoom();

}

// ============================================================================
// تصغير
// ============================================================================

function zoomOut() {

    currentZoom -= 0.1;

    if (
        currentZoom < 0.5
    ) {

        currentZoom = 0.5;

    }

    applyZoom();

}

// ============================================================================
// تطبيق التكبير
// ============================================================================

function applyZoom() {

    const media =
        document.getElementById(
            "viewerMedia"
        );

    if (!media)
        return;

    media.style.transform =
        `scale(${currentZoom})`;

}

// ============================================================================
// ملء الشاشة
// ============================================================================

function enterFullscreen() {

    const viewer =
        document.getElementById(
            "mainViewer"
        );

    if (
        viewer.requestFullscreen
    ) {

        viewer.requestFullscreen();

    }

}
