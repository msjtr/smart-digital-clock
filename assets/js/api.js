// assets/js/api.js
import { handleError } from './utils.js';

// إحداثيات حائل الافتراضية للطقس
const HAIL_COORDS = { lat: 27.5218, lng: 41.6907 };

export async function fetchLiveWeather() {
    try {
        // نستخدم Open-Meteo API (مجاني ومفتوح)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${HAIL_COORDS.lat}&longitude=${HAIL_COORDS.lng}&current_weather=true`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('فشل الاتصال بخدمة الطقس');
        
        const data = await response.json();
        return data.current_weather; 
    } catch (error) {
        handleError('API/Weather', error);
        return null;
    }
}

export async function fetchLivePrayers() {
    try {
        // نستخدم Aladhan API (دقيق ويدعم تقويم أم القرى - method 4)
        const date = new Date();
        const url = `https://api.aladhan.com/v1/timingsByCity/${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}?city=Hail&country=Saudi Arabia&method=4`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('فشل الاتصال بخدمة أوقات الصلاة');
        
        const data = await response.json();
        return data.data.timings;
    } catch (error) {
        handleError('API/Prayers', error);
        return null;
    }
}
