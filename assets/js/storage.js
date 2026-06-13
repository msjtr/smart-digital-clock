// ============================================================================
// Storage Manager
// إدارة التخزين المحلي والملفات
// ============================================================================

import { handleError } from "./utils.js";

// جلب ملف JSON

export async function fetchJsonData(
    fileName
) {

    try {

        const response =
            await fetch(
                `./data/${fileName}.json`
            );

        if (!response.ok) {

            console.warn(
                `تعذر تحميل ${fileName}.json`
            );

            return null;

        }

        const data =
            await response.json();

        return data;

    } catch (error) {

        handleError(
            `fetchJsonData:${fileName}`,
            error
        );

        return null;

    }

}

// حفظ محلي

export function saveToLocal(
    key,
    data
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

        return true;

    } catch (error) {

        handleError(
            "saveToLocal",
            error
        );

        return false;

    }

}

// قراءة محلية

export function getFromLocal(
    key
) {

    try {

        const item =
            localStorage.getItem(
                key
            );

        return item
            ? JSON.parse(item)
            : null;

    } catch (error) {

        handleError(
            "getFromLocal",
            error
        );

        return null;

    }

}

// حذف عنصر

export function removeFromLocal(
    key
) {

    try {

        localStorage.removeItem(
            key
        );

        return true;

    } catch (error) {

        handleError(
            "removeFromLocal",
            error
        );

        return false;

    }

}

// حفظ الإعدادات

export function saveSettings(
    settings
) {

    return saveToLocal(
        "settings",
        settings
    );

}

// قراءة الإعدادات

export function getSettings() {

    return getFromLocal(
        "settings"
    );

}

// حفظ الرسائل

export function saveMessages(
    messages
) {

    return saveToLocal(
        "messages",
        messages
    );

}

// قراءة الرسائل

export function getMessages() {

    return getFromLocal(
        "messages"
    );

}

// حفظ المناسبات

export function saveOccasions(
    occasions
) {

    return saveToLocal(
        "occasions",
        occasions
    );

}

// قراءة المناسبات

export function getOccasions() {

    return getFromLocal(
        "occasions"
    );

}

// حفظ السجلات

export function saveLogs(
    logs
) {

    return saveToLocal(
        "logs",
        logs
    );

}

// قراءة السجلات

export function getLogs() {

    return getFromLocal(
        "logs"
    );

}

// مزامنة الإعدادات

export async function syncSettings() {

    let settings =
        getSettings();

    if (!settings) {

        settings =
            await fetchJsonData(
                "settings"
            );

        if (settings) {

            saveSettings(
                settings
            );

        }

    }

    return settings;

}
