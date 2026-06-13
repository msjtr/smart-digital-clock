// ============================================================================
// API Manager
// جامعة حائل - الساعة الرقمية الذكية
// ============================================================================

import { handleError } from "./utils.js";

// المدينة الافتراضية
const DEFAULT_CITY = {
    name: "Hail",
    country: "Saudi Arabia",
    lat: 27.5219,
    lng: 41.6907
};

// ============================================================================
// جلب الطقس الحالي + التوقعات
// ============================================================================

export async function fetchLiveWeather() {

    try {

        const city =
            JSON.parse(
                localStorage.getItem(
                    "selected_city"
                )
            ) || DEFAULT_CITY;

        const url =

            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,visibility,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&forecast_days=7&timezone=auto`;

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Weather API Error"
            );

        }

        const data =
            await response.json();

        return {

            city: city.name,

            temperature:
                data.current.temperature_2m,

            humidity:
                data.current.relative_humidity_2m,

            wind_speed:
                data.current.wind_speed_10m,

            wind_direction:
                convertDirection(
                    data.current.wind_direction_10m
                ),

            visibility:
                data.current.visibility,

            pressure:
                data.current.pressure_msl,

            sunrise:
                data.daily.sunrise[0]
                    ?.split("T")[1],

            sunset:
                data.daily.sunset[0]
                    ?.split("T")[1],

            uv_index:
                data.daily.uv_index_max[0],

            is_day: 1,

            forecast:
                data.daily.time.map(
                    (
                        day,
                        index
                    ) => ({

                        day,

                        max:
                            data.daily
                                .temperature_2m_max[index],

                        min:
                            data.daily
                                .temperature_2m_min[index],

                        icon:
                            "☀️"

                    })
                )

        };

    } catch (error) {

        handleError(
            "Weather API",
            error
        );

        return null;

    }

}

// ============================================================================
// جلب مواقيت الصلاة
// ============================================================================

export async function fetchLivePrayers() {

    try {

        const city =
            JSON.parse(
                localStorage.getItem(
                    "selected_city"
                )
            ) || DEFAULT_CITY;

        const today =
            new Date();

        const date =

            `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

        const url =

            `https://api.aladhan.com/v1/timingsByCity/${date}?city=${city.name}&country=${city.country}&method=4`;

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Prayer API Error"
            );

        }

        const data =
            await response.json();

        return data.data.timings;

    } catch (error) {

        handleError(
            "Prayer API",
            error
        );

        return null;

    }

}

// ============================================================================
// تغيير المدينة
// ============================================================================

export function setCity(
    city
) {

    localStorage.setItem(
        "selected_city",
        JSON.stringify(
            city
        )
    );

}

// ============================================================================
// المدن الجاهزة
// ============================================================================

export const SAUDI_CITIES = [

    {
        name: "Hail",
        country: "Saudi Arabia",
        lat: 27.5219,
        lng: 41.6907
    },

    {
        name: "Riyadh",
        country: "Saudi Arabia",
        lat: 24.7136,
        lng: 46.6753
    },

    {
        name: "Jeddah",
        country: "Saudi Arabia",
        lat: 21.5433,
        lng: 39.1728
    },

    {
        name: "Makkah",
        country: "Saudi Arabia",
        lat: 21.3891,
        lng: 39.8579
    },

    {
        name: "Madinah",
        country: "Saudi Arabia",
        lat: 24.5247,
        lng: 39.5692
    }

];

// ============================================================================
// تحويل اتجاه الرياح
// ============================================================================

function convertDirection(
    degrees
) {

    const dirs = [

        "شمالي",
        "شمالي شرقي",
        "شرقي",
        "جنوبي شرقي",
        "جنوبي",
        "جنوبي غربي",
        "غربي",
        "شمالي غربي"

    ];

    return dirs[
        Math.round(
            degrees / 45
        ) % 8
    ];

}
