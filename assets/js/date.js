
export const DateManager = {

    update() {

        const now = new Date();

        this.updateDay(now);

        this.updateGregorian(now);

        this.updateHijri(now);

    },

    updateDay(date) {

        const element =
            document.getElementById("dayName");

        if (!element) return;

        const days = [
            "الأحد",
            "الإثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
            "السبت"
        ];

        element.textContent =
            days[date.getDay()];

    },

    updateGregorian(date) {

        const element =
            document.getElementById("gregorianDate");

        if (!element) return;

        element.textContent =
            date.toLocaleDateString("ar-SA");

    },

    updateHijri(date) {

        const element =
            document.getElementById("hijriDate");

        if (!element) return;

        element.textContent =
            new Intl.DateTimeFormat(
                "ar-SA-u-ca-islamic",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            ).format(date);

    }

};
