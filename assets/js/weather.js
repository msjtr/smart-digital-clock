import { Storage } from "./storage.js";

export const Weather = {

    city: "Hail",

    async init() {

        try {

            const weatherInfo =
                document.getElementById(
                    "weatherInfo"
                );

            if (!weatherInfo) return;

            weatherInfo.innerHTML = `
                <span>☀️</span>
                <span>36°</span>
                <span>حائل</span>
            `;

        } catch (error) {

            console.error(
                "Weather Error",
                error
            );

        }

    }

};
