// ============================================================================
// Countdown Manager - المحدث لدعم المزامنة اللحظية
// ============================================================================

import { fetchJsonData, saveJsonData } from "./storage.js";
import { addLog } from "./logs.js";
import { padZero } from "./utils.js";

let events = [];
let activeEvent = null;
let countdownTimer = null;

export async function initCountdown() {
    // جلب البيانات من السيرفر (ملف schedules.json)
    const data = await fetchJsonData("schedules");
    events = data?.events || [];
    
    findNextEvent();
    renderCountdown();
    startCountdown();
    console.log("✅ تم تشغيل نظام العد التنازلي");
}

// دالة لاستقبال التحديثات من لوحة الإدارة فوراً
export function updateEventList(newEvents) {
    events = newEvents;
    findNextEvent();
    renderCountdown();
}

function findNextEvent() {
    const now = Date.now();
    activeEvent = events
        .filter(event => new Date(event.date).getTime() > now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;
}

function startCountdown() {
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(renderCountdown, 1000);
}

function renderCountdown() {
    const section = document.getElementById("countdownSection");
    const container = document.getElementById("countdown");
    if (!section || !container) return;

    if (!activeEvent) {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";
    const title = section.querySelector("h2");
    if (title) title.textContent = `العد التنازلي: ${activeEvent.title}`;

    const diff = new Date(activeEvent.date).getTime() - Date.now();

    if (diff <= 0) {
        container.innerHTML = `<div class="countdown-finished">🎉 بدأت الفعالية</div>`;
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    container.innerHTML = `
        <div class="countdown-grid">
            <div class="countdown-item"><span>${days}</span><small>يوم</small></div>
            <div class="countdown-item"><span>${padZero(hours)}</span><small>ساعة</small></div>
            <div class="countdown-item"><span>${padZero(minutes)}</span><small>دقيقة</small></div>
            <div class="countdown-item countdown-seconds"><span>${padZero(seconds)}</span><small>ثانية</small></div>
        </div>
    `;
}

// ============================================================================
// الحفظ في السيرفر (API)
// ============================================================================
async function saveEvents() {
    await saveJsonData("schedules", { events });
}

export async function addEvent(event) {
    events.push(event);
    await saveEvents();
    addLog("إضافة حدث", event.title);
    findNextEvent();
    renderCountdown();
}

export async function deleteEvent(index) {
    const deleted = events.splice(index, 1);
    await saveEvents();
    addLog("حذف حدث", deleted[0].title);
    findNextEvent();
    renderCountdown();
}

export function getEvents() { return events; }
