// ============================================================================
// Main Application Controller - المحرك الرئيسي للشاشة الرقمية
// ============================================================================

import { initClock } from "./clock.js";
import { fetchLiveWeather, fetchLivePrayers } from "./api.js";
import { fetchJsonData } from "./storage.js";

async function initApp() {
    console.log("🚀 جاري تهيئة الشاشة الرئيسية...");

    try {
        // 1. تهيئة الساعة فوراً
        initClock();

        // 2. تحميل البيانات التفاعلية
        await loadDynamicData();

        // 3. تفعيل نظام التبديل بين الـ Widgets (الذي أنشأناه في index.html)
        setupSlider();

        console.log("✅ تم بناء الشاشة الرئيسية بنجاح.");
    } catch (error) {
        console.error("❌ خطأ أثناء تهيئة التطبيق:", error);
    }
}

// ============================================================================
// جلب البيانات من API و LocalStorage
// ============================================================================
async function loadDynamicData() {
    // جلب الطقس
    const weather = await fetchLiveWeather();
    if (weather) {
        const weatherEl = document.getElementById("weatherInfo");
        if (weatherEl) weatherEl.innerHTML = `${weather.city}: ${weather.temperature}°C`;
    }

    // جلب أوقات الصلاة
    const prayers = await fetchLivePrayers();
    if (prayers) {
        const prayerEl = document.getElementById("prayerTimes");
        if (prayerEl) {
            prayerEl.innerHTML = `الفجر: ${prayers.Fajr} | الظهر: ${prayers.Dhuhr}`;
        }
    }

    // جلب الرسائل من ملف JSON المحلي
    const messages = await fetchJsonData("messages");
    if (messages && Array.isArray(messages)) {
        const msgEl = document.getElementById("messageDisplay");
        if (msgEl) msgEl.textContent = messages[0] || "أهلاً بكم في جامعة حائل";
    }
}

// ============================================================================
// نظام التنقل بين الشرائح (Slider System)
// ============================================================================
function setupSlider() {
    const widgets = document.querySelectorAll('.widget');
    if (widgets.length === 0) return;

    let index = 0;
    setInterval(() => {
        widgets[index].classList.remove('active');
        index = (index + 1) % widgets.length;
        widgets[index].classList.add('active');
    }, 8000); // 8 ثوانٍ لكل شريحة
}

// ============================================================================
// التشغيل عند جاهزية المتصفح
// ============================================================================
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
