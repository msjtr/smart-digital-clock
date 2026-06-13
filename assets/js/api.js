// ============================================================================
// API Manager - المحدث لدعم الكاش والاستقرار
// ============================================================================

import { handleError } from "./utils.js";

const DEFAULT_CITY = { name: "Hail", country: "Saudi Arabia", lat: 27.5219, lng: 41.6907 };
const CACHE_DURATION = 10 * 60 * 1000; // 10 دقائق

export async function fetchLiveWeather() {
    try {
        const cityData = JSON.parse(localStorage.getItem("selected_city")) || DEFAULT_CITY;
        const cacheKey = `weather_cache_${cityData.name}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) return data;
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,visibility,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&forecast_days=1&timezone=auto`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather API Error");
        const json = await response.json();

        const weatherData = {
            city: cityData.name,
            temperature: json.current.temperature_2m,
            humidity: json.current.relative_humidity_2m,
            wind_speed: json.current.wind_speed_10m,
            wind_direction: convertDirection(json.current.wind_direction_10m),
            visibility: json.current.visibility,
            pressure: json.current.pressure_msl,
            sunrise: json.daily.sunrise[0].split("T")[1],
            sunset: json.daily.sunset[0].split("T")[1],
            uv_index: json.daily.uv_index_max[0]
        };

        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: weatherData }));
        return weatherData;
    } catch (error) {
        handleError("Weather API", error);
        return null;
    }
}

export async function fetchLivePrayers(method = 4) {
    try {
        const cityData = JSON.parse(localStorage.getItem("selected_city")) || DEFAULT_CITY;
        const today = new Date();
        const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        
        const url = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${cityData.name}&country=${cityData.country}&method=${method}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Prayer API Error");
        const data = await response.json();
        return data.data.timings;
    } catch (error) {
        handleError("Prayer API", error);
        return null;
    }
}

function convertDirection(degrees) {
    const dirs = ["شمالي", "شمالي شرقي", "شرقي", "جنوبي شرقي", "جنوبي", "جنوبي غربي", "غربي", "شمالي غربي"];
    return dirs[Math.round(degrees / 45) % 8];
}

export const SAUDI_CITIES = [
    { name: "Hail", country: "Saudi Arabia", lat: 27.5219, lng: 41.6907 },
    { name: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lng: 46.6753 },
    { name: "Jeddah", country: "Saudi Arabia", lat: 21.5433, lng: 39.1728 },
    { name: "Makkah", country: "Saudi Arabia", lat: 21.3891, lng: 39.8579 },
    { name: "Madinah", country: "Saudi Arabia", lat: 24.5247, lng: 39.5692 }
];
