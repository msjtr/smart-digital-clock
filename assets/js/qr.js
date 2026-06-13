// ============================================================================
// QR Manager
// ============================================================================

import { addLog } from "./logs.js";
import { showNotification } from "./notifications.js";

export function initQR() {

    console.log(
        "✅ تم تشغيل نظام QR"
    );

}

// ============================================================================
// إنشاء QR
// ============================================================================

export function generateQR(
    data,
    targetElementId,
    size = 200
) {

    const container =
        document.getElementById(
            targetElementId
        );

    if (
        !container ||
        !data
    ) return;

    container.innerHTML = "";

    const qrUrl =

        `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;

    const img =
        document.createElement(
            "img"
        );

    img.src = qrUrl;

    img.alt =
        "QR Code";

    img.className =
        "qr-code-image";

    img.onerror =
        () => {

            container.innerHTML = `

                <div class="qr-error">

                    تعذر إنشاء رمز QR

                </div>

            `;

        };

    container.appendChild(
        img
    );

    addDownloadButton(
        container,
        qrUrl
    );

    addLog(
        "توليد QR",
        data
    );

}

// ============================================================================
// QR للرابط الحالي
// ============================================================================

export function generateCurrentPageQR(
    targetId
) {

    generateQR(
        window.location.href,
        targetId
    );

}

// ============================================================================
// QR للواي فاي
// ============================================================================

export function generateWifiQR(
    ssid,
    password,
    targetId
) {

    const wifiData =

        `WIFI:T:WPA;S:${ssid};P:${password};;`;

    generateQR(
        wifiData,
        targetId
    );

}

// ============================================================================
// QR للبريد
// ============================================================================

export function generateEmailQR(
    email,
    targetId
) {

    generateQR(
        `mailto:${email}`,
        targetId
    );

}

// ============================================================================
// QR للهاتف
// ============================================================================

export function generatePhoneQR(
    phone,
    targetId
) {

    generateQR(
        `tel:${phone}`,
        targetId
    );

}

// ============================================================================
// تنزيل QR
// ============================================================================

function addDownloadButton(
    container,
    imageUrl
) {

    const button =
        document.createElement(
            "a"
        );

    button.href =
        imageUrl;

    button.download =
        "qr-code.png";

    button.target =
        "_blank";

    button.className =
        "qr-download-btn";

    button.textContent =
        "⬇ تحميل QR";

    container.appendChild(
        button
    );

}

// ============================================================================
// QR للمحتوى الحالي
// ============================================================================

export function generateContentQR(
    contentUrl,
    targetId
) {

    generateQR(
        contentUrl,
        targetId,
        250
    );

}

// ============================================================================
// QR لصفحة العرض الرئيسية
// ============================================================================

export function generateDisplayQR(
    targetId
) {

    const displayUrl =

        `${window.location.origin}/index.html`;

    generateQR(
        displayUrl,
        targetId,
        250
    );

}
