// assets/js/countdown.js
import { fetchJsonData } from './storage.js';
import { padZero } from './utils.js';

export async function initCountdown() {
    const countdownSection = document.getElementById('countdownSection');
    const countdownElement = document.getElementById('countdown');
    
    if (!countdownElement || !countdownSection) return;

    let schedulesData = await fetchJsonData('schedules');
    let events = schedulesData?.events || [];
    
    let targetDate = null;
    let eventName = "";

    // البحث عن أول فعالية قادمة في المستقبل
    const now = new Date().getTime();
    const upcomingEvent = events.find(event => new Date(event.date).getTime() > now);

    if (upcomingEvent) {
        targetDate = new Date(upcomingEvent.date).getTime();
        eventName = upcomingEvent.title;
    }

    // إخفاء قسم العد التنازلي إذا لم تكن هناك فعاليات قادمة
    if (!targetDate) {
        countdownSection.style.display = 'none';
        console.log("لا توجد فعاليات قادمة، تم إخفاء العد التنازلي.");
        return;
    }

    // تحديث عنوان القسم باسم الفعالية
    const sectionTitle = countdownSection.querySelector('h2');
    if (sectionTitle) {
        sectionTitle.textContent = `العد التنازلي: ${eventName}`;
    }

    function updateCountdown() {
        const currentTime = new Date().getTime();
        const distance = targetDate - currentTime;

        if (distance < 0) {
            countdownElement.innerHTML = `<div class="event-started">بدأت الفعالية! 🎉</div>`;
            return;
        }

        // الحسابات الزمنية
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = padZero(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const minutes = padZero(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        const seconds = padZero(Math.floor((distance % (1000 * 60)) / 1000));

        // عرض العداد بشكل أنيق
        countdownElement.innerHTML = `
            <div class="countdown-grid" style="display: flex; gap: 15px; justify-content: center; direction: ltr;">
                <div class="countdown-item"><span>${days}</span><br><small>أيام</small></div>
                <div class="countdown-item"><span>${hours}</span><br><small>ساعات</small></div>
                <div class="countdown-item"><span>${minutes}</span><br><small>دقائق</small></div>
                <div class="countdown-item" style="color: var(--accent-color);"><span>${seconds}</span><br><small>ثواني</small></div>
            </div>
        `;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    console.log(`تم تفعيل العد التنازلي لفعالية: ${eventName}`);
}
