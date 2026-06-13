// ============================================================================
// Notifications Manager
// ============================================================================

import { addLog } from "./logs.js";

const activeNotifications =
    new Set();

export function initNotifications() {

    if (
        !document.getElementById(
            "notificationContainer"
        )
    ) {

        const container =
            document.createElement(
                "div"
            );

        container.id =
            "notificationContainer";

        container.className =
            "toast-container";

        document.body.appendChild(
            container
        );

    }

    console.log(
        "✅ تم تشغيل نظام الإشعارات"
    );

}

// ============================================================================
// إشعار عام
// ============================================================================

export function showNotification(
    message,
    type = "info",
    duration = 4000
) {

    const container =
        document.getElementById(
            "notificationContainer"
        );

    if (!container)
        return;

    const uniqueKey =
        `${type}-${message}`;

    if (
        activeNotifications.has(
            uniqueKey
        )
    ) {

        return;

    }

    activeNotifications.add(
        uniqueKey
    );

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        `toast toast-${type}`;

    const icon =
        getIcon(type);

    toast.innerHTML = `

        <div class="toast-icon">
            ${icon}
        </div>

        <div class="toast-message">
            ${message}
        </div>

        <button
            class="toast-close">

            ✕
        </button>

    `;

    container.appendChild(
        toast
    );

    playNotificationSound(
        type
    );

    addLog(
        "إشعار",
        message
    );

    const removeToast =
        () => {

            toast.style.opacity =
                "0";

            toast.style.transform =
                "translateX(100px)";

            setTimeout(
                () => {

                    toast.remove();

                    activeNotifications.delete(
                        uniqueKey
                    );

                },
                300
            );

        };

    toast
        .querySelector(
            ".toast-close"
        )
        ?.addEventListener(
            "click",
            removeToast
        );

    setTimeout(
        removeToast,
        duration
    );

}

// ============================================================================
// أنواع جاهزة
// ============================================================================

export function success(
    message
) {

    showNotification(
        message,
        "success"
    );

}

export function error(
    message
) {

    showNotification(
        message,
        "error"
    );

}

export function warning(
    message
) {

    showNotification(
        message,
        "warning"
    );

}

export function info(
    message
) {

    showNotification(
        message,
        "info"
    );

}

// ============================================================================
// تنبيه الصلاة
// ============================================================================

export function prayerNotification(
    prayerName
) {

    showNotification(
        `حان الآن موعد صلاة ${prayerName}`,
        "success",
        8000
    );

}

// ============================================================================
// تنبيه العد التنازلي
// ============================================================================

export function countdownNotification(
    eventName
) {

    showNotification(
        `اقترب موعد ${eventName}`,
        "warning",
        8000
    );

}

// ============================================================================
// أيقونات
// ============================================================================

function getIcon(
    type
) {

    switch (type) {

        case "success":
            return "✅";

        case "error":
            return "❌";

        case "warning":
            return "⚠️";

        default:
            return "ℹ️";

    }

}

// ============================================================================
// صوت التنبيه
// ============================================================================

function playNotificationSound(
    type
) {

    try {

        let frequency =
            500;

        if (
            type === "success"
        ) {

            frequency = 700;

        }

        if (
            type === "warning"
        ) {

            frequency = 400;

        }

        if (
            type === "error"
        ) {

            frequency = 250;

        }

        const audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.frequency.value =
            frequency;

        oscillator.connect(
            gain
        );

        gain.connect(
            audioContext.destination
        );

        oscillator.start();

        gain.gain.setValueAtTime(
            0.05,
            audioContext.currentTime
        );

        oscillator.stop(
            audioContext.currentTime +
            0.15
        );

    } catch {

        // تجاهل إذا لم يدعم المتصفح

    }

}
