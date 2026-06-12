import { Clock } from "./clock.js";
import { DateManager } from "./date.js";
import { Settings } from "./settings.js";
import { Layouts } from "./layouts.js";
import { Themes } from "./themes.js";
import { Logos } from "./logos.js";
import { Messages } from "./messages.js";
import { Occasions } from "./occasions.js";
import { Countdown } from "./countdown.js";
import { Weather } from "./weather.js";
import { Prayers } from "./prayers.js";

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

function initializeApp() {

    console.log("Smart Digital Clock Started");

    try {

        Clock.start();

        DateManager.update();

        Settings.init();

        if (typeof Layouts.init === "function") {
            Layouts.init();
        }

        if (typeof Themes.load === "function") {
            Themes.load();
        }

        if (typeof Logos.loadUniversity === "function") {
            Logos.loadUniversity();
        }

        if (typeof Logos.loadCollege === "function") {
            Logos.loadCollege();
        }

        if (typeof Messages.init === "function") {
            Messages.init();
        }

        if (typeof Occasions.init === "function") {
            Occasions.init();
        }

        if (typeof Countdown.init === "function") {
            Countdown.init();
        }

        if (typeof Weather.init === "function") {
            Weather.init();
        }

        if (typeof Prayers.init === "function") {
            Prayers.init();
        }

        console.log("Application Loaded");

    } catch (error) {

        console.error(
            "Initialization Error:",
            error
        );

    }

}
