import { Clock } from "./clock.js";
import { DateManager } from "./date.js";

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

function initializeApp() {

    Clock.start();

    DateManager.update();

    console.log(
        "Smart Digital Clock Started"
    );

}
