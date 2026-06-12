import { Utils } from "./utils.js";

export const Clock = {

    start() {

        this.update();

        setInterval(() => {
            this.update();
        }, 1000);

    },

    update() {

        const element =
            document.getElementById("clock");

        if (!element) return;

        const now = new Date();

        const hours =
            Utils.pad(now.getHours());

        const minutes =
            Utils.pad(now.getMinutes());

        const seconds =
            Utils.pad(now.getSeconds());

        element.textContent =
            `${hours}:${minutes}:${seconds}`;

    }

};
