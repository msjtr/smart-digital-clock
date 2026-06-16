// ============================================================================
// 📰 وحدة الشريط الإخباري (شاشة العرض الرئيسية)
// ============================================================================

import { fetchJsonData } from "./storage.js";

let currentNewsData = null;

/**
 * دالة التهيئة الموحدة للشريط الإخباري
 */
export async function initNews() {
    console.log("📰 جاري تهيئة نظام الشريط الإخباري...");
    
    await loadAndRenderTicker();
    
    // المزامنة المباشرة: التحقق من التحديثات كل 10 ثوانٍ ليعكس الإدارة فوراً
    setInterval(loadAndRenderTicker, 10000);
}

/**
 * جلب البيانات وعرضها
 */
async function loadAndRenderTicker() {
    try {
        // يجلب البيانات من السيرفر أو من التخزين المؤقت (Offline)
        const data = await fetchJsonData("news");
        
        // منع إعادة الرسم إذا لم تتغير البيانات لتوفير موارد الشاشة (أداء 4K)
        if (JSON.stringify(data) === JSON.stringify(currentNewsData)) return;
        currentNewsData = data;

        if (!data || data.settings.status !== "نشط") {
            removeTicker();
            return;
        }

        const activeNews = data.list.filter(n => n.status === "نشط").sort((a, b) => a.order - b.order);
        if (activeNews.length === 0) {
            removeTicker();
            return;
        }

        buildTickerUI(activeNews, data.settings);
    } catch (error) {
        console.error("❌ خطأ في جلب بيانات الشريط الإخباري:", error);
    }
}

/**
 * بناء واجهة الشريط الإخباري (Glassmorphism & Branding)
 */
function buildTickerUI(newsArray, settings) {
    let container = document.getElementById("newsTickerContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "newsTickerContainer";
        document.body.appendChild(container);
    }

    // إعدادات التحكم الكاملة المطلوبة في المواصفات
    const speedMap = { "بطيئة": 45, "متوسطة": 30, "سريعة": 15 };
    const duration = speedMap[settings.speed] || 30;
    
    const fontSizeMap = { "صغير جداً": "1rem", "صغير": "1.5rem", "متوسط": "2rem", "كبير": "2.5rem", "كبير جداً": "3.5rem" };
    const fontSize = fontSizeMap[settings.fontSize] || "2rem";

    // تطبيق الهوية البصرية وتأثيرات الشفافية
    container.style.cssText = `
        position: fixed;
        ${settings.position === 'أعلى الشاشة' ? 'top: 0;' : 'bottom: 0;'}
        left: 0;
        width: 100%;
        background: ${settings.backgroundColor};
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-top: 1px solid rgba(20, 184, 166, 0.4);
        border-bottom: 1px solid rgba(20, 184, 166, 0.4);
        color: ${settings.textColor};
        font-family: '${settings.fontFamily}', sans-serif;
        font-size: ${fontSize};
        z-index: 9999;
        overflow: hidden;
        white-space: nowrap;
        direction: ${settings.direction};
        padding: 18px 0;
        box-shadow: 0 ${settings.position === 'أعلى الشاشة' ? '10px' : '-10px'} 30px rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
    `;

    // فاصل بصري بين الأخبار
    const separator = `<span style="color: #ffffff; margin: 0 40px; opacity: 0.5;"> • </span>`;
    const newsString = newsArray.map(n => `<span style="font-weight: 500;">${n.text}</span>`).join(separator);

    // الرسوم المتحركة اللانهائية (CSS Animation)
    container.innerHTML = `
        <div class="ticker-content" style="
            display: inline-block; 
            padding-right: 100%; 
            animation: marquee ${duration}s linear infinite;
        ">
            ${newsString}${separator}${newsString}
        </div>
        <style>
            @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(${settings.direction === 'rtl' ? '100%' : '-100%'}); }
            }
            .ticker-content:hover {
                animation-play-state: paused;
            }
        </style>
    `;
}

/**
 * إزالة الشريط من الشاشة
 */
function removeTicker() {
    const container = document.getElementById("newsTickerContainer");
    if (container) container.remove();
}
