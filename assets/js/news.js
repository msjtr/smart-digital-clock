// ============================================================================
// 📰 وحدة الشريط الإخباري - المحرك التنفيذي (شاشة العرض)
// ============================================================================

import { fetchJsonData } from "./storage.js";

let currentNewsData = null;

export async function initNews() {
    console.log("📰 جاري تهيئة نظام الشريط الإخباري الذكي...");
    await loadAndRenderTicker();
    setInterval(loadAndRenderTicker, 5000); // مزامنة مباشرة كل 5 ثوانٍ
}

async function loadAndRenderTicker() {
    try {
        const data = await fetchJsonData("news");
        if (!data || JSON.stringify(data) === JSON.stringify(currentNewsData)) return;
        currentNewsData = data;

        const { settings, list } = data;
        const now = new Date();

        // فلترة الأخبار: (النشطة + الجدولة الزمنية + أيام التشغيل)
        const activeNews = list.filter(n => {
            if (n.status !== "نشط") return false;
            if (n.startDate && new Date(n.startDate) > now) return false;
            if (n.endDate && new Date(n.endDate) < now) return false;
            return true;
        }).sort((a, b) => a.order - b.order);

        if (activeNews.length === 0) {
            removeTicker();
            return;
        }

        buildTickerUI(activeNews, settings);
    } catch (error) {
        console.error("❌ خطأ في عرض الشريط الإخباري:", error);
    }
}

function buildTickerUI(newsArray, s) {
    let container = document.getElementById("newsTickerContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "newsTickerContainer";
        document.body.appendChild(container);
    }

    // تطبيق المواصفات الحرفية للتحكم بالخط والنمط
    const fontWeightMap = { 'خفيف': 300, 'عادي': 400, 'متوسط': 500, 'عريض': 700, 'عريض جداً': 900 };
    
    container.style.cssText = `
        position: fixed;
        ${s.position === 'أعلى الشاشة' ? 'top:0;' : 'bottom:0;'}
        left:0; width: ${s.width === 'نصف الشاشة' ? '50%' : '100%'};
        height: ${s.height === 'صغير' ? '40px' : s.height === 'كبير' ? '120px' : '80px'};
        background: ${s.bgType === 'خلفية شفافة' ? 'transparent' : s.bgColor};
        border: 2px solid ${s.borderColor};
        color: ${s.textColor};
        font-family: '${s.fontFamily}', sans-serif;
        font-size: ${s.fontSize === 'كبير' ? '3rem' : s.fontSize === 'صغير' ? '1.5rem' : '2.2rem'};
        font-weight: ${fontWeightMap[s.fontWeight] || 400};
        letter-spacing: ${s.letterSpacing}px;
        word-spacing: ${s.wordSpacing}px;
        z-index: 9999;
        overflow: hidden;
        white-space: nowrap;
        display: flex; align-items: center;
        backdrop-filter: blur(10px);
    `;

    // معالجة الفواصل والأيقونات
    const sep = s.separator === 'خط فاصل' ? '|' : s.separator === 'أيقونة' ? '🔸' : '';
    const newsHTML = newsArray.map(n => `
        <span style="display:inline-flex; align-items:center; margin: 0 50px;">
            ${n.iconVal ? `<span style="color:${n.iconColor}; margin-left:10px; font-size:${n.iconSize}px;">${n.iconVal}</span>` : ''}
            ${n.text}
        </span>
    `).join(`<span style="opacity:0.5;">${sep}</span>`);

    container.innerHTML = `
        <div style="display:inline-block; animation: marquee ${s.speed === 'بطيئة' ? 40 : 20}s linear infinite;">
            ${newsHTML}
        </div>
        <style>
            @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        </style>
    `;
}

function removeTicker() {
    const container = document.getElementById("newsTickerContainer");
    if (container) container.remove();
}
