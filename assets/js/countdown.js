import { Storage } from "./storage.js";

export const Countdown = {

    targetDate: null,

    interval: null,

    init() {

        const saved =
            Storage.load(
                "countdownDate"
            );

        if (saved) {

            this.start(
                new Date(saved)
            );

        }

    },

    start(date) {

        this.targetDate =
            date;

        Storage.save(
            "countdownDate",
            date
        );

        this.update();

        clearInterval(
            this.interval
        );

        this.interval =
            setInterval(
                () =>
                    this.update(),
                1000
            );

    },

    update() {

        const element =
            document.getElementById(
                "countdown"
            );

        if (!element) return;

        if (
            !this.targetDate
        ) {

            element.textContent =
                "--:--:--";

            return;

        }

        const now =
            new Date();

        const diff =
            this.targetDate -
            now;

        if (diff <= 0) {

            element.textContent =
                "انتهى الوقت";

            return;

        }

        const hours =
            Math.floor(
                diff /
                1000 /
                60 /
                60
            );

        const minutes =
            Math.floor(
                (diff /
                    1000 /
                    60) %
                    60
            );

        const seconds =
            Math.floor(
                (diff /
                    1000) %
                    60
            );

        element.textContent =
            `${hours}:${minutes}:${seconds}`;

        this.checkAlerts(
            diff
        );

    },

    checkAlerts(diff) {

        const minutes =
            Math.floor(
                diff /
                1000 /
                60
            );

        if (minutes === 5) {

            console.log(
                "تبقى 5 دقائق"
            );

        }

        if (minutes === 1) {

            console.log(
                "تبقت دقيقة"
            );

        }

    }

};
