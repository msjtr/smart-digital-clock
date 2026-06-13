// assets/js/prayers.js

import {
    fetchLivePrayers
} from "./api.js";

import {
    fetchJsonData,
    saveToLocal,
    getFromLocal
} from "./storage.js";

import {
    addLog
} from "./logs.js";

const PRAYER_KEY =
    "prayer_cache";

export async function initPrayers() {

    const container =
        document.getElementById(
            "prayerTimes"
        );

    if (!container)
        return;

    await updatePrayers();

    setInterval(
        updatePrayers,
        3600000
    );

    setInterval(
        highlightCurrentPrayer,
        60000
    );

    console.log(
        "✅ تم تشغيل نظام الصلاة"
    );

}

async function updatePrayers() {

    let timings =
        await fetchLivePrayers();

    if (timings) {

        saveToLocal(
            PRAYER_KEY,
            timings
        );

    } else {

        timings =
            getFromLocal(
                PRAYER_KEY
            );

        if (!timings) {

            const localData =
                await fetchJsonData(
                    "prayers"
                );

            timings =
                localData?.timings;

        }

    }

    if (!timings)
        return;

    renderPrayers(
        timings
    );

    showNextPrayer(
        timings
    );

}

function renderPrayers(
    timings
) {

    const container =
        document.getElementById(
            "prayerTimes"
        );

    const prayers = {

        Fajr: "الفجر",
        Sunrise: "الشروق",
        Dhuhr: "الظهر",
        Asr: "العصر",
        Maghrib: "المغرب",
        Isha: "العشاء"

    };

    container.innerHTML = "";

    Object.entries(
        prayers
    ).forEach(
        ([key, name]) => {

            const time =
                timings[key]
                ?.split(" ")[0];

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "prayer-item";

            div.dataset.prayer =
                key;

            div.innerHTML = `
                <div class="prayer-name">
                    ${name}
                </div>

                <div class="prayer-time">
                    ${time}
                </div>
            `;

            container.appendChild(
                div
            );

        }
    );

    highlightCurrentPrayer();

}

function showNextPrayer(
    timings
) {

    const nextPrayerBox =
        document.getElementById(
            "nextPrayer"
        );

    if (!nextPrayerBox)
        return;

    const prayers = [

        {
            key: "Fajr",
            name: "الفجر"
        },

        {
            key: "Dhuhr",
            name: "الظهر"
        },

        {
            key: "Asr",
            name: "العصر"
        },

        {
            key: "Maghrib",
            name: "المغرب"
        },

        {
            key: "Isha",
            name: "العشاء"
        }

    ];

    const now =
        new Date();

    let nextPrayer =
        null;

    prayers.forEach(
        prayer => {

            const time =
                timings[
                    prayer.key
                ];

            if (!time)
                return;

            const parts =
                time
                .split(":");

            const prayerDate =
                new Date();

            prayerDate.setHours(
                parseInt(parts[0]),
                parseInt(parts[1]),
                0
            );

            if (
                prayerDate > now &&
                !nextPrayer
            ) {

                nextPrayer = {

                    ...prayer,
                    time

                };

            }

        }
    );

    if (nextPrayer) {

        nextPrayerBox.innerHTML = `

            <div class="next-prayer-card">

                الصلاة القادمة

                <strong>
                    ${nextPrayer.name}
                </strong>

                ${nextPrayer.time}

            </div>

        `;

    }

}

function highlightCurrentPrayer() {

    document
        .querySelectorAll(
            ".prayer-item"
        )
        .forEach(
            item =>
                item.classList.remove(
                    "active-prayer"
                )
        );

}

export function playAdhanAlert() {

    addLog(
        "تنبيه أذان",
        "تم تشغيل التنبيه"
    );

}

export function playBeforePrayerAlert(
    minutes = 10
) {

    addLog(
        "تنبيه قبل الصلاة",
        `${minutes} دقائق`
    );

}
