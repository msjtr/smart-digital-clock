// ============================================================================
// Smart Digital Clock - Main Application Controller
// File: assets/js/app.js
// ============================================================================

import { initClock } from "./clock.js";

// سيتم تفعيل هذه الوحدات تلقائياً إذا كانت موجودة
let initDate = null;
let initWeather = null;
let initPrayers = null;
let initMessages = null;
let initCountdown = null;
let initOccasions = null;
let initContent = null;

// تحميل الوحدات بشكل آمن
async function loadModules() {

```
try {
    const dateModule = await import("./date.js");
    initDate = dateModule.initDate || null;
} catch (e) {
    console.warn("⚠️ date.js غير متوفر أو يحتوي على خطأ");
}

try {
    const weatherModule = await import("./weather.js");
    initWeather = weatherModule.initWeather || null;
} catch (e) {
    console.warn("⚠️ weather.js غير متوفر أو يحتوي على خطأ");
}

try {
    const prayersModule = await import("./prayers.js");
    initPrayers = prayersModule.initPrayers || null;
} catch (e) {
    console.warn("⚠️ prayers.js غير متوفر أو يحتوي على خطأ");
}

try {
    const messagesModule = await import("./messages.js");
    initMessages = messagesModule.initMessages || null;
} catch (e) {
    console.warn("⚠️ messages.js غير متوفر أو يحتوي على خطأ");
}

try {
    const countdownModule = await import("./countdown.js");
    initCountdown = countdownModule.initCountdown || null;
} catch (e) {
    console.warn("⚠️ countdown.js غير متوفر أو يحتوي على خطأ");
}

try {
    const occasionsModule = await import("./occasions.js");
    initOccasions = occasionsModule.initOccasions || null;
} catch (e) {
    console.warn("⚠️ occasions.js غير متوفر أو يحتوي على خطأ");
}

try {
    const contentModule = await import("./content.js");
    initContent = contentModule.initContent || null;
} catch (e) {
    console.warn("⚠️ content.js غير متوفر أو يحتوي على خطأ");
}
```

}

// مراقبة حالة الاتصال
function monitorConnection() {

```
window.addEventListener("online", () => {
    console.log("🟢 تم استعادة الاتصال بالإنترنت");
});

window.addEventListener("offline", () => {
    console.log("🔴 تم فقد الاتصال بالإنترنت");
});
```

}

// تشغيل الوحدات
async function startModules() {

```
try {

    // الساعة
    if (typeof initClock === "function") {
        initClock();
        console.log("✅ Clock Started");
    }

    // التاريخ
    if (typeof initDate === "function") {
        initDate();
        console.log("✅ Date Started");
    }

    // الطقس
    if (typeof initWeather === "function") {
        await initWeather();
        console.log("✅ Weather Started");
    }

    // الصلاة
    if (typeof initPrayers === "function") {
        await initPrayers();
        console.log("✅ Prayer Times Started");
    }

    // الرسائل
    if (typeof initMessages === "function") {
        initMessages();
        console.log("✅ Messages Started");
    }

    // العد التنازلي
    if (typeof initCountdown === "function") {
        initCountdown();
        console.log("✅ Countdown Started");
    }

    // المناسبات
    if (typeof initOccasions === "function") {
        initOccasions();
        console.log("✅ Occasions Started");
    }

    // المحتوى
    if (typeof initContent === "function") {
        initContent();
        console.log("✅ Content Started");
    }

} catch (error) {

    console.error("❌ خطأ أثناء تشغيل الوحدات", error);

}
```

}

// التهيئة الرئيسية
async function initApp() {

```
console.log("🚀 بدء تشغيل الشاشة الرقمية الذكية");

try {

    monitorConnection();

    await loadModules();

    await startModules();

    console.log("🎉 تم تشغيل النظام بنجاح");

} catch (error) {

    console.error("❌ فشل تشغيل التطبيق", error);

}
```

}

document.addEventListener("DOMContentLoaded", initApp);
