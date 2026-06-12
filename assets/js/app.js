// assets/js/app.js
import { initClock } from './clock.js';
import { initDate } from './date.js';

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initDate();
    console.log("النظام يعمل بنجاح - تم تهيئة الوقت والتاريخ");
});
