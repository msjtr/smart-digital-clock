/**

* =====================================================================
* Smart Digital Clock - Main Application Controller
* File: assets/js/app.js
* =====================================================================
  */

console.log("🚀 بدء تشغيل الشاشة الرقمية الذكية...");

// تحميل الوحدات بشكل آمن
async function initModules() {

```
const modules = [
    "./clock.js",
    "./date.js",
    "./weather.js",
    "./prayers.js",
    "./messages.js",
    "./countdown.js",
    "./occasions.js",
    "./content.js"
];

for (const modulePath of modules) {

    try {

        const module = await import(modulePath);

        const initFunction =
            module.initClock ||
            module.initDate ||
            module.initWeather ||
            module.initPrayers ||
            module.initMessages ||
            module.initCountdown ||
            module.initOccasions ||
            module.initContent;

        if (typeof initFunction === "function") {
            await initFunction();
            console.log(`✅ تم تشغيل ${modulePath}`);
        }

    } catch (error) {
        console.warn(`⚠️ تعذر تشغيل ${modulePath}`, error);
    }
}
```

}

// تحديث حالة الاتصال
function monitorConnection() {

```
window.addEventListener("online", () => {
    console.log("🟢 عاد الاتصال بالإنترنت");
});

window.addEventListener("offline", () => {
    console.log("🔴 انقطع الاتصال بالإنترنت");
});
```

}

// بدء النظام
async function initApp() {

```
try {

    monitorConnection();

    await initModules();

    console.log("✅ تم تشغيل الشاشة الرقمية بنجاح");

} catch (error) {

    console.error("❌ فشل تشغيل النظام", error);

}
```

}

document.addEventListener("DOMContentLoaded", initApp);
