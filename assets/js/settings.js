import { Storage } from "./storage.js";

export const Settings = {

    defaults: {

        clockFormat: "24",

        showSeconds: true,

        showClock: true,

        showDate: true,

        showWeather: true,

        showPrayer: true,

        showMessages: true,

        showOccasion: true,

        showCountdown: true,

        theme: "dark",

        projectorMode: false

    },

    data: {},

    init() {

        this.data =
            Storage.load(
                "settings",
                this.defaults
            );

        this.apply();

    },

    save() {

        Storage.save(
            "settings",
            this.data
        );

    },

    apply() {

        document.body.setAttribute(
            "data-theme",
            this.data.theme
        );

    }

};
