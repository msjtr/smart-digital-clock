// assets/js/weather.js

import {
    fetchLiveWeather
} from "./api.js";

import {
    saveToLocal,
    getFromLocal
} from "./storage.js";

import {
    addLog
} from "./logs.js";

const WEATHER_KEY =
    "weather_cache";

export async function initWeather() {

    const container =
        document.getElementById(
            "weatherInfo"
        );

    if (!container)
        return;

    await updateWeather();

    setInterval(
        updateWeather,
        1800000
    );

    console.log(
        "✅ تم تشغيل نظام الطقس"
    );

}

async function updateWeather() {

    const container =
        document.getElementById(
            "weatherInfo"
        );

    try {

        const weather =
            await fetchLiveWeather();

        if (weather) {

            saveToLocal(
                WEATHER_KEY,
                weather
            );

            renderWeather(
                weather,
                container
            );

            return;

        }

        throw new Error(
            "No Data"
        );

    } catch {

        const cached =
            getFromLocal(
                WEATHER_KEY
            );

        if (cached) {

            renderWeather(
                cached,
                container
            );

        }

    }

}

function renderWeather(
    weather,
    container
) {

    const temp =
        Math.round(
            weather.temperature || 0
        );

    const humidity =
        weather.humidity || "--";

    const windSpeed =
        weather.wind_speed || "--";

    const windDirection =
        weather.wind_direction || "--";

    const visibility =
        weather.visibility || "--";

    const pressure =
        weather.pressure || "--";

    const uv =
        weather.uv_index || "--";

    const sunrise =
        weather.sunrise || "--";

    const sunset =
        weather.sunset || "--";

    const forecast =
        weather.forecast || [];

    const icon =
        weather.is_day === 1
            ? "☀️"
            : "🌙";

    container.innerHTML = `

        <div class="weather-main">

            <div class="weather-temp">
                ${icon}
                ${temp}°C
            </div>

            <div class="weather-city">
                حائل
            </div>

        </div>

        <div class="weather-details">

            <div>
                💧 الرطوبة:
                ${humidity}%
            </div>

            <div>
                🌬 الرياح:
                ${windSpeed} كم/س
            </div>

            <div>
                🧭 الاتجاه:
                ${windDirection}
            </div>

            <div>
                👁 الرؤية:
                ${visibility} كم
            </div>

            <div>
                📈 الضغط:
                ${pressure}
            </div>

            <div>
                ☀ UV:
                ${uv}
            </div>

            <div>
                🌅 الشروق:
                ${sunrise}
            </div>

            <div>
                🌇 الغروب:
                ${sunset}
            </div>

        </div>

        <div class="weather-forecast">

            ${forecast
                .slice(0, 5)
                .map(
                    day => `
                    <div class="forecast-item">

                        <div>
                            ${day.day}
                        </div>

                        <div>
                            ${day.icon || "☀️"}
                        </div>

                        <div>
                            ${day.max}°
                            /
                            ${day.min}°
                        </div>

                    </div>
                `
                )
                .join("")}

        </div>

    `;

    addLog(
        "تحديث الطقس",
        "تم تحديث بيانات الطقس"
    );

}
