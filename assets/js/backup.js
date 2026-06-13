// ============================================================================
// Backup Manager
// ============================================================================

import {
    showNotification
} from "./notifications.js";

import {
    addLog
} from "./logs.js";

export function initBackup() {

    console.log(
        "✅ تم تشغيل النسخ الاحتياطي"
    );

}

// ============================================================================
// تصدير نسخة كاملة
// ============================================================================

export function exportBackup() {

    try {

        const backupData = {

            version: "1.0.0",

            exportDate:
                new Date()
                .toISOString(),

            settings:
                JSON.parse(
                    localStorage.getItem(
                        "settings"
                    )
                ) || {},

            messages:
                JSON.parse(
                    localStorage.getItem(
                        "messages"
                    )
                ) || [],

            occasions:
                JSON.parse(
                    localStorage.getItem(
                        "occasions"
                    )
                ) || [],

            content:
                JSON.parse(
                    localStorage.getItem(
                        "content"
                    )
                ) || [],

            logs:
                JSON.parse(
                    localStorage.getItem(
                        "system_logs"
                    )
                ) || [],

            countdown:
                JSON.parse(
                    localStorage.getItem(
                        "countdown_events"
                    )
                ) || [],

            weather:
                JSON.parse(
                    localStorage.getItem(
                        "weather_cache"
                    )
                ) || {},

            prayers:
                JSON.parse(
                    localStorage.getItem(
                        "prayer_cache"
                    )
                ) || {}

        };

        const blob =
            new Blob(

                [
                    JSON.stringify(
                        backupData,
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

        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            `smart-clock-backup-${Date.now()}.json`;

        link.click();

        URL.revokeObjectURL(
            url
        );

        showNotification(
            "تم إنشاء النسخة الاحتياطية بنجاح",
            "success"
        );

        addLog(
            "نسخة احتياطية",
            "تصدير نسخة كاملة"
        );

    } catch (error) {

        console.error(
            error
        );

        showNotification(
            "فشل إنشاء النسخة الاحتياطية",
            "error"
        );

    }

}

// ============================================================================
// استيراد نسخة
// ============================================================================

export function importBackup(
    event
) {

    const file =
        event.target.files[0];

    if (!file)
        return;

    const reader =
        new FileReader();

    reader.onload =
        e => {

            try {

                const data =
                    JSON.parse(
                        e.target.result
                    );

                if (
                    data.settings
                ) {

                    localStorage.setItem(
                        "settings",
                        JSON.stringify(
                            data.settings
                        )
                    );

                }

                if (
                    data.messages
                ) {

                    localStorage.setItem(
                        "messages",
                        JSON.stringify(
                            data.messages
                        )
                    );

                }

                if (
                    data.occasions
                ) {

                    localStorage.setItem(
                        "occasions",
                        JSON.stringify(
                            data.occasions
                        )
                    );

                }

                if (
                    data.content
                ) {

                    localStorage.setItem(
                        "content",
                        JSON.stringify(
                            data.content
                        )
                    );

                }

                if (
                    data.logs
                ) {

                    localStorage.setItem(
                        "system_logs",
                        JSON.stringify(
                            data.logs
                        )
                    );

                }

                if (
                    data.countdown
                ) {

                    localStorage.setItem(
                        "countdown_events",
                        JSON.stringify(
                            data.countdown
                        )
                    );

                }

                if (
                    data.weather
                ) {

                    localStorage.setItem(
                        "weather_cache",
                        JSON.stringify(
                            data.weather
                        )
                    );

                }

                if (
                    data.prayers
                ) {

                    localStorage.setItem(
                        "prayer_cache",
                        JSON.stringify(
                            data.prayers
                        )
                    );

                }

                addLog(
                    "استعادة نسخة",
                    "تم استيراد نسخة احتياطية"
                );

                showNotification(
                    "تم استعادة النسخة الاحتياطية",
                    "success"
                );

                setTimeout(
                    () => {

                        location.reload();

                    },
                    2000
                );

            } catch {

                showNotification(
                    "ملف النسخة الاحتياطية غير صالح",
                    "error"
                );

            }

        };

    reader.readAsText(
        file
    );

}

// ============================================================================
// حذف جميع البيانات
// ============================================================================

export function clearSystemData() {

    if (
        !confirm(
            "هل تريد حذف جميع البيانات؟"
        )
    ) {

        return;

    }

    localStorage.clear();

    addLog(
        "حذف البيانات",
        "تم مسح النظام"
    );

    showNotification(
        "تم حذف البيانات",
        "warning"
    );

    setTimeout(
        () => {

            location.reload();

        },
        2000
    );

}
