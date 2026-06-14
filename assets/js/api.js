// ============================================================================
// API Manager - المحدث لدعم الكاش والاستقرار (النسخة النهائية والمحمية)
// ============================================================================

// تم تحديد الأسماء العربية للمدن لتعزيز العرض في الشاشة الرئيسية
const DEFAULT_CITY = { name: "Hail", country: "Saudi Arabia", lat: 27.5219, lng: 41.6907, arName: "حائل" };
const CACHE_DURATION = 10 * 60 * 1000; // 10 دقائق لتحديث الطقس

// 1. دالة مساعدة لقراءة المدينة بأمان من التخزين المحلي
function getSelectedCity() {
    try {
        const stored = localStorage.getItem("selected_city");
        return stored ? JSON.parse(stored) : DEFAULT_CITY;
    } catch (e) {
        console.warn("⚠️ تعذر قراءة المدينة من التخزين، تم استخدام المدينة الافتراضية.");
        return DEFAULT_CITY;
    }
}

// ============================================================================
// نظام جلب الطقس (Weather API)
// ============================================================================
export async function fetchLiveWeather() {
    try {
        const cityData = getSelectedCity();
        const cacheKey = `weather_cache_${cityData.name}`;

        // محاولة قراءة الكاش بأمان
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const { timestamp, data } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_DURATION) return data;
            }
        } catch (e) {
            console.warn("⚠️ كاش الطقس معطوب، سيتم جلب بيانات جديدة.");
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,visibility,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&forecast_days=1&timezone=auto`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Weather API Error: ${response.status}`);
        const json = await response.json();

        // تجميع البيانات مع حماية (Optional Chaining) لتجنب الأخطاء
        const weatherData = {
            city: cityData.arName || cityData.name,
            temperature: json.current.temperature_2m,
            humidity: json.current.relative_humidity_2m,
            wind_speed: json.current.wind_speed_10m,
            wind_direction: convertDirection(json.current.wind_direction_10m),
            visibility: json.current.visibility,
            pressure: json.current.pressure_msl,
            sunrise: json.daily?.sunrise?.[0]?.split("T")[1] || "--:--",
            sunset: json.daily?.sunset?.[0]?.split("T")[1] || "--:--",
            uv_index: json.daily?.uv_index_max?.[0] || 0
        };

        // حفظ البيانات الجديدة في الكاش
        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: weatherData }));
        return weatherData;
        
    } catch (error) {
        console.error("❌ خطأ في جلب بيانات الطقس:", error);
        return null; // إرجاع null ليتعامل معها النظام بسلاسة بدلاً من الانهيار
    }
}

// ============================================================================
// نظام جلب أوقات الصلاة (Prayer Times API)
// ============================================================================
export async function fetchLivePrayers(method = 4) { // 4 = أم القرى (مكة المكرمة)
    try {
        const cityData = getSelectedCity();
        const today = new Date();
        const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        
        const url = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${cityData.name}&country=${cityData.country}&method=${method}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Prayer API Error: ${response.status}`);
        
        const data = await response.json();
        return data.data.timings;
        
    } catch (error) {
        console.error("❌ خطأ في جلب أوقات الصلاة:", error);
        return null;
    }
}

// ============================================================================
// دوال مساعدة
// ============================================================================
function convertDirection(degrees) {
    if (degrees === undefined || degrees === null) return "غير محدد";
    const dirs = ["شمالي", "شمالي شرقي", "شرقي", "جنوبي شرقي", "جنوبي", "جنوبي غربي", "غربي", "شمالي غربي"];
    return dirs[Math.round(degrees / 45) % 8];
}

// قائمة المدن السعودية المعتمدة للنظام
export const SAUDI_CITIES = [
    { name: "Hail", country: "Saudi Arabia", lat: 27.5219, lng: 41.6907, arName: "حائل" },
    { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753, arName: "الرياض" },
    { name: "Jeddah", country: "Saudi Arabia", lat: 21.5433, lng: 39.1728, arName: "جدة" },
    { name: "Makkah", country: "Saudi Arabia", lat: 21.3891, lng: 39.8579, arName: "مكة المكرمة" },
    { name: "Madinah", country: "Saudi Arabia", lat: 24.5247, lng: 39.5692, arName: "المدينة المنورة" },
    { name: "Dammam", country: "Saudi Arabia", lat: 26.4207, lng: 50.0888, arName: "الدمام" }
];
