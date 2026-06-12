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

```
console.log(
    "Smart Digital Clock Started"
);

// الوقت
Clock.start();

// التاريخ
DateManager.update();

// الإعدادات
Settings.init();

// التخطيط الذكي
Layouts.init();

// الثيمات
Themes.load();

// الشعارات
Logos.loadUniversity();

if (
    typeof Logos.loadCollege ===
    "function"
) {
    Logos.loadCollege();
}

// الرسائل
Messages.init();

// المناسبات
Occasions.init();

// العد التنازلي
Countdown.init();

// مؤقت تجريبي لمدة ساعة
Countdown.start(
    new Date(
        Date.now() + 3600000
    )
);

// الطقس
Weather.init();

// أوقات الصلاة
Prayers.init();

}
