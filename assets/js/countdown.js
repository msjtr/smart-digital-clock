// ============================================================================
// Countdown Manager
// ============================================================================

import {
    fetchJsonData,
    saveToLocal,
    getFromLocal
} from "./storage.js";

import {
    addLog
} from "./logs.js";

import {
    padZero
} from "./utils.js";

let events = [];

let activeEvent = null;

let countdownTimer = null;

// ============================================================================
// تشغيل النظام
// ============================================================================

export async function initCountdown() {

    const localEvents =
        getFromLocal(
            "countdown_events"
        );

    if (
        localEvents &&
        localEvents.length
    ) {

        events = localEvents;

    } else {

        const schedules =
            await fetchJsonData(
                "schedules"
            );

        events =
            schedules?.events || [];

        saveEvents();

    }

    findNextEvent();

    renderCountdown();

    startCountdown();

    console.log(
        "✅ تم تشغيل العد التنازلي"
    );

}

// ============================================================================
// أقرب حدث
// ============================================================================

function findNextEvent() {

    const now =
        Date.now();

    activeEvent =
        events

        .filter(
            event =>
                new Date(
                    event.date
                ).getTime() > now
        )

        .sort(
            (a, b) =>

                new Date(
                    a.date
                ) -

                new Date(
                    b.date
                )
        )[0] || null;

}

// ============================================================================
// بدء العد
// ============================================================================

function startCountdown() {

    if (
        countdownTimer
    ) {

        clearInterval(
            countdownTimer
        );

    }

    countdownTimer =
        setInterval(
            renderCountdown,
            1000
        );

}

// ============================================================================
// عرض العداد
// ============================================================================

function renderCountdown() {

    const section =
        document.getElementById(
            "countdownSection"
        );

    const container =
        document.getElementById(
            "countdown"
        );

    if (
        !section ||
        !container
    ) return;

    if (
        !activeEvent
    ) {

        section.style.display =
            "none";

        return;

    }

    section.style.display =
        "block";

    const title =
        section.querySelector(
            "h2"
        );

    if (title) {

        title.textContent =
            `العد التنازلي: ${activeEvent.title}`;

    }

    const now =
        Date.now();

    const target =
        new Date(
            activeEvent.date
        ).getTime();

    const diff =
        target - now;

    if (
        diff <= 0
    ) {

        container.innerHTML = `

            <div class="countdown-finished">

                🎉 بدأت الفعالية

            </div>

        `;

        addLog(
            "انتهاء العد التنازلي",
            activeEvent.title
        );

        clearInterval(
            countdownTimer
        );

        return;

    }

    const days =
        Math.floor(
            diff /
            (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (
                diff %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );

    const minutes =
        Math.floor(
            (
                diff %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );

    const seconds =
        Math.floor(
            (
                diff %
                (1000 * 60)
            ) / 1000
        );

    container.innerHTML = `

        <div class="countdown-grid">

            <div class="countdown-item">

                <span>${days}</span>

                <small>يوم</small>

            </div>

            <div class="countdown-item">

                <span>${padZero(hours)}</span>

                <small>ساعة</small>

            </div>

            <div class="countdown-item">

                <span>${padZero(minutes)}</span>

                <small>دقيقة</small>

            </div>

            <div class="countdown-item countdown-seconds">

                <span>${padZero(seconds)}</span>

                <small>ثانية</small>

            </div>

        </div>

    `;

}

// ============================================================================
// إضافة حدث
// ============================================================================

export function addEvent(
    event
) {

    events.push(
        event
    );

    saveEvents();

    addLog(
        "إضافة حدث",
        event.title
    );

    findNextEvent();

    renderCountdown();

}

// ============================================================================
// تعديل حدث
// ============================================================================

export function updateEvent(
    index,
    event
) {

    if (
        !events[index]
    ) return;

    events[index] =
        event;

    saveEvents();

    addLog(
        "تعديل حدث",
        event.title
    );

    findNextEvent();

    renderCountdown();

}

// ============================================================================
// حذف حدث
// ============================================================================

export function deleteEvent(
    index
) {

    if (
        !events[index]
    ) return;

    const deleted =
        events[index];

    events.splice(
        index,
        1
    );

    saveEvents();

    addLog(
        "حذف حدث",
        deleted.title
    );

    findNextEvent();

    renderCountdown();

}

// ============================================================================
// حفظ
// ============================================================================

function saveEvents() {

    saveToLocal(
        "countdown_events",
        events
    );

}

// ============================================================================
// جلب الأحداث
// ============================================================================

export function getEvents() {

    return events;

}

// ============================================================================
// الحدث الحالي
// ============================================================================

export function getActiveEvent() {

    return activeEvent;

}
