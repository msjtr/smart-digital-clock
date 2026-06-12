import { Storage } from "./storage.js";

export const Messages = {

    messages: [],

    currentIndex: 0,

    interval: null,

    init() {

        this.messages =
            Storage.load(
                "messages",
                [
                    "أهلاً بكم في كلية الشريعة والقانون",
                    "نتمنى لكم يوماً موفقاً",
                    "الرجاء المحافظة على الهدوء",
                    "موعد المحاضرة القادمة الساعة 10:00 صباحاً"
                ]
            );

        this.start();

    },

    start() {

        const element =
            document.getElementById(
                "messageDisplay"
            );

        if (!element) return;

        element.textContent =
            this.messages[0];

        this.interval =
            setInterval(() => {

                this.currentIndex++;

                if (
                    this.currentIndex >=
                    this.messages.length
                ) {

                    this.currentIndex = 0;

                }

                element.textContent =
                    this.messages[
                        this.currentIndex
                    ];

            }, 5000);

    },

    add(message) {

        this.messages.push(message);

        Storage.save(
            "messages",
            this.messages
        );

    },

    remove(index) {

        this.messages.splice(
            index,
            1
        );

        Storage.save(
            "messages",
            this.messages
        );

    }

};
