// assets/js/weather.js
import { fetchLiveWeather } from './api.js';

export async function initWeather() {
    const weatherContainer = document.getElementById('weatherInfo');
    if (!weatherContainer) return;

    async function updateWeather() {
        const weatherData = await fetchLiveWeather();
        
        if (weatherData) {
            const temp = Math.round(weatherData.temperature);
            // تحديد أيقونة الطقس بناءً على ما إذا كان الوقت نهاراً أم ليلاً
            const isDay = weatherData.is_day === 1;
            const icon = isDay ? '☀️' : '🌙'; 
            
            weatherContainer.innerHTML = `
                <span>${icon}</span>
                <span dir="ltr">${temp}°C</span>
                <span>حائل</span>
            `;
        } else {
            // في حالة انقطاع الإنترنت أو فشل الجلب
            weatherContainer.innerHTML = `<span>--°C</span> <span>حائل</span>`;
        }
    }

    updateWeather();
    // تحديث الطقس كل 30 دقيقة
    setInterval(updateWeather, 1800000); 
    console.log("تم تفعيل نظام الطقس الحي.");
}
