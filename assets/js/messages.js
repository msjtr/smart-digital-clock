// ============================================================================
// Messages Manager - إدارة الرسائل (متوافق مع التحديث اللحظي)
// ============================================================================

import { fetchJsonData, saveJsonData } from "./storage.js";
import { addLog } from "./logs.js";

let messages = [];
let currentIndex = 0;
let rotationInterval = null;

// ============================================================================
// تشغيل النظام
// ============================================================================
export async function initMessages() {
    // جلب البيانات من السيرفر (ملف messages.json)
    const data = await fetchJsonData("messages");
    messages = data?.list || ["أهلاً بكم في جامعة حائل", "نظام الساعة الرقمية الذكية"];
    
    startMessages();
    updateTicker();
    console.log("✅ تم تشغيل نظام الرسائل");
}

// ============================================================================
// تحديث الرسائل (يُستدعى من sync.js عند أي تغيير من لوحة الإدارة)
// ============================================================================
export function refreshMessages(newList) {
    messages = newList;
    currentIndex = 0;
    updateTicker();
    showCurrentMessage();
    console.log("🔄 تم تحديث قائمة الرسائل لحظياً.");
}

// ============================================================================
// تشغيل تدوير الرسائل
// ============================================================================
export function startMessages() {
    if (rotationInterval) clearInterval(rotationInterval);
    showCurrentMessage();
    rotationInterval = setInterval(nextMessage, 10000);
}

function showCurrentMessage() {
    const container = document.getElementById("messageDisplay");
    if (!container || messages.length === 0) return;

    container.style.opacity = "0";
    setTimeout(() => {
        container.textContent = messages[currentIndex];
        container.style.opacity = "1";
    }, 300);
}

function nextMessage() {
    currentIndex = (currentIndex + 1) % messages.length;
    showCurrentMessage();
}

// ============================================================================
// العمليات الأساسية (الربط مع السيرفر)
// ============================================================================
async function saveMessagesToServer() {
    await saveJsonData("messages", { list: messages });
    updateTicker();
}

export async function addMessage(text) {
    if (!text) return;
    messages.push(text);
    await saveMessagesToServer();
    addLog("إضافة رسالة", text);
}

export async function deleteMessage(index) {
    if (!messages[index]) return;
    const deleted = messages.splice(index, 1);
    await saveMessagesToServer();
    addLog("حذف رسالة", deleted[0]);
}

export function updateTicker() {
    const ticker = document.querySelector(".ticker-content");
    if (ticker) ticker.textContent = messages.join(" ✦ ");
}

export function getAllMessages() { return messages; }
export function stopMessages() { clearInterval(rotationInterval); }
export function resumeMessages() { startMessages(); }
