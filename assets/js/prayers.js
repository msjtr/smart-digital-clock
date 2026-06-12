export const Prayers = {

    prayers: {

        fajr: "04:10",

        sunrise: "05:30",

        dhuhr: "12:05",

        asr: "03:25",

        maghrib: "06:40",

        isha: "08:00"

    },

    init() {

        const container =
            document.getElementById(
                "prayerTimes"
            );

        if (!container) return;

        container.innerHTML = `
            <div>الفجر ${this.prayers.fajr}</div>
            <div>الشروق ${this.prayers.sunrise}</div>
            <div>الظهر ${this.prayers.dhuhr}</div>
            <div>العصر ${this.prayers.asr}</div>
            <div>المغرب ${this.prayers.maghrib}</div>
            <div>العشاء ${this.prayers.isha}</div>
        `;

    }

};
