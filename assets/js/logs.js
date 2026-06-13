// ============================================================================
// Logs Manager
// نظام السجلات المركزي
// ============================================================================

const LOG_KEY = "system_logs";

export function initLogs() {

    console.log(
        "✅ تم تفعيل نظام السجلات"
    );

    renderLogs();

}

// ============================================================================
// إضافة سجل جديد
// ============================================================================

export function addLog(
    action,
    details = "",
    user = "admin"
) {

    try {

        const logs =
            getLogs();

        const log = {

            id:
                Date.now(),

            user,

            action,

            details,

            timestamp:
                new Date()
                .toLocaleString(
                    "ar-SA"
                )

        };

        logs.unshift(
            log
        );

        if (
            logs.length > 500
        ) {

            logs.length = 500;

        }

        localStorage.setItem(
            LOG_KEY,
            JSON.stringify(logs)
        );

        renderLogs();

        console.log(
            `[LOG] ${action}`
        );

    } catch (error) {

        console.error(
            "فشل إضافة السجل",
            error
        );

    }

}

// ============================================================================
// جلب السجلات
// ============================================================================

export function getLogs() {

    try {

        return JSON.parse(

            localStorage.getItem(
                LOG_KEY
            )

        ) || [];

    } catch {

        return [];

    }

}

// ============================================================================
// حذف السجلات
// ============================================================================

export function clearLogs() {

    localStorage.removeItem(
        LOG_KEY
    );

    renderLogs();

}

// ============================================================================
// تصدير السجلات
// ============================================================================

export function exportLogs() {

    const logs =
        getLogs();

    const blob =
        new Blob(

            [
                JSON.stringify(
                    logs,
                    null,
                    2
                )
            ],

            {
                type:
                    "application/json"
            }

        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href = url;

    a.download =
        "system-logs.json";

    a.click();

    URL.revokeObjectURL(
        url
    );

}

// ============================================================================
// عرض السجلات
// ============================================================================

export function renderLogs() {

    const container =
        document.getElementById(
            "logsContainer"
        );

    if (!container)
        return;

    const logs =
        getLogs();

    if (
        logs.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-logs">
                لا توجد سجلات
            </div>
        `;

        return;

    }

    container.innerHTML =
        logs.map(log => `

        <div class="log-item">

            <div class="log-action">
                ${log.action}
            </div>

            <div class="log-details">
                ${log.details}
            </div>

            <div class="log-meta">
                ${log.user}
                |
                ${log.timestamp}
            </div>

        </div>

    `).join("");

}

// ============================================================================
// تسجيل تلقائي عند تشغيل النظام
// ============================================================================

addLog(
    "System Start",
    "تم تشغيل النظام"
);
