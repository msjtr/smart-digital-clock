// ================================
// Smart Digital Clock
// جامعة حائل - كلية الشريعة والقانون
// ================================

document.addEventListener("DOMContentLoaded", () => {
    startClock();
    updateDates();
    startMessages();
    loadSettings();
});

// ================================
// الساعة
// ================================

function startClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const clock = document.getElementById("clock");

    if (!clock) return;

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// ================================
// التاريخ
// ================================

function updateDates() {
    const now = new Date();

    const dayName = document.getElementById("dayName");
    const gregorianDate = document.getElementById("gregorianDate");
    const hijriDate = document.getElementById("hijriDate");

    const days = [
        "الأحد",
        "الإثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
        "السبت"
    ];

    if (dayName) {
        dayName.textContent = days[now.getDay()];
    }

    if (gregorianDate) {
        gregorianDate.textContent =
            now.toLocaleDateString("ar-SA");
    }

    if (hijriDate) {
        hijriDate.textContent =
            new Intl.DateTimeFormat(
                "ar-SA-u-ca-islamic",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ).format(now);
    }
}

// ================================
// الرسائل المتغيرة
// ================================

const messages = [
    "أهلاً بكم في كلية الشريعة والقانون",
    "نتمنى لكم يوماً موفقاً",
    "الرجاء المحافظة على الهدوء",
    "موعد المحاضرة القادمة الساعة 10:00 صباحاً",
    "جامعة حائل ترحب بكم"
];

let currentMessage = 0;

function startMessages() {

    const messageBox =
        document.getElementById("messageDisplay");

    if (!messageBox) return;

    messageBox.textContent = messages[0];

    setInterval(() => {

        currentMessage++;

        if (currentMessage >= messages.length) {
            currentMessage = 0;
        }

        messageBox.textContent =
            messages[currentMessage];

    }, 5000);
}

// ================================
// حفظ الإعدادات
// ================================

function saveSettings(settings) {
    localStorage.setItem(
        "smartClockSettings",
        JSON.stringify(settings)
    );
}

// ================================
// تحميل الإعدادات
// ================================

function loadSettings() {

    const saved =
        localStorage.getItem("smartClockSettings");

    if (!saved) return;

    const settings = JSON.parse(saved);

    applySettings(settings);
}

// ================================
// تطبيق الإعدادات
// ================================

function applySettings(settings) {

    if (settings.backgroundColor) {
        document.body.style.backgroundColor =
            settings.backgroundColor;
    }

    if (settings.textColor) {
        document.body.style.color =
            settings.textColor;
    }
}

// ================================
// إظهار وإخفاء العناصر
// ================================

function toggleElement(id, show) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.style.display =
        show ? "block" : "none";
}

// ================================
// ملء الشاشة
// ================================

function enterFullscreen() {

    const doc =
        document.documentElement;

    if (doc.requestFullscreen) {
        doc.requestFullscreen();
    }
}

// ================================
// الخروج من ملء الشاشة
// ================================

function exitFullscreen() {

    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}
