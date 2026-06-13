// ============================================================================
// Messages Manager
// ============================================================================

import {
    fetchJsonData,
    getMessages,
    saveMessages
} from "./storage.js";

import {
    addLog
} from "./logs.js";

let messages = [];

let currentIndex = 0;

let rotationInterval = null;

// ============================================================================
// تشغيل النظام
// ============================================================================

export async function initMessages() {

    const localMessages =
        getMessages();

    if (
        localMessages &&
        localMessages.length
    ) {

        messages =
            localMessages;

    } else {

        const jsonData =
            await fetchJsonData(
                "messages"
            );

        messages =
            jsonData?.list || [

                "أهلاً بكم في جامعة حائل",

                "كلية الشريعة والقانون ترحب بكم",

                "نظام الساعة الرقمية الذكية"

            ];

        saveMessages(
            messages
        );

    }

    startMessages();

    updateTicker();

    console.log(
        "✅ تم تشغيل الرسائل"
    );

}

// ============================================================================
// تشغيل تدوير الرسائل
// ============================================================================

export function startMessages() {

    if (
        rotationInterval
    ) {

        clearInterval(
            rotationInterval
        );

    }

    showCurrentMessage();

    rotationInterval =
        setInterval(
            nextMessage,
            10000
        );

}

// ============================================================================
// الرسالة الحالية
// ============================================================================

function showCurrentMessage() {

    const container =
        document.getElementById(
            "messageDisplay"
        );

    if (
        !container ||
        messages.length === 0
    ) return;

    container.style.opacity =
        "0";

    setTimeout(() => {

        container.textContent =
            messages[
                currentIndex
            ];

        container.style.opacity =
            "1";

    }, 300);

}

// ============================================================================
// الرسالة التالية
// ============================================================================

function nextMessage() {

    currentIndex++;

    if (
        currentIndex >=
        messages.length
    ) {

        currentIndex = 0;

    }

    showCurrentMessage();

}

// ============================================================================
// إضافة رسالة
// ============================================================================

export function addMessage(
    text
) {

    if (!text) return;

    messages.push(
        text
    );

    saveMessages(
        messages
    );

    updateTicker();

    addLog(
        "إضافة رسالة",
        text
    );

}

// ============================================================================
// تعديل رسالة
// ============================================================================

export function updateMessage(
    index,
    text
) {

    if (
        !messages[index]
    ) return;

    messages[index] =
        text;

    saveMessages(
        messages
    );

    updateTicker();

    addLog(
        "تعديل رسالة",
        text
    );

}

// ============================================================================
// حذف رسالة
// ============================================================================

export function deleteMessage(
    index
) {

    if (
        !messages[index]
    ) return;

    const deleted =
        messages[index];

    messages.splice(
        index,
        1
    );

    saveMessages(
        messages
    );

    updateTicker();

    addLog(
        "حذف رسالة",
        deleted
    );

}

// ============================================================================
// جلب الرسائل
// ============================================================================

export function getAllMessages() {

    return messages;

}

// ============================================================================
// تحديث الشريط الإخباري
// ============================================================================

export function updateTicker() {

    const ticker =
        document.querySelector(
            ".ticker-content"
        );

    if (!ticker)
        return;

    ticker.textContent =
        messages.join(
            " ✦ "
        );

}

// ============================================================================
// إيقاف الرسائل
// ============================================================================

export function stopMessages() {

    clearInterval(
        rotationInterval
    );

}

// ============================================================================
// تشغيل الرسائل
// ============================================================================

export function resumeMessages() {

    startMessages();

}
