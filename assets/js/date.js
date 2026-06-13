// assets/js/date.js

export function initDate() {
    const dayElement = document.getElementById('dayName');
    const gregorianElement = document.getElementById('gregorianDate');
    const hijriElement = document.getElementById('hijriDate');

    function updateDate() {
        const now = new Date();

        // 1. اليوم
        if (dayElement) {
            dayElement.textContent = now.toLocaleDateString('ar-SA', { weekday: 'long' });
        }

        // 2. التاريخ الميلادي
        if (gregorianElement) {
            gregorianElement.textContent = now.toLocaleDateString('ar-SA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }

        // 3. التاريخ الهجري (معتمد بشكل رسمي في النظام)
        if (hijriElement) {
            const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
                day: 'numeric', 
                month: 'long', 
                year: 'numeric'
            });
            hijriElement.textContent = hijriFormatter.format(now);
        }
    }

    updateDate();
    // تحديث التاريخ كل ساعة لضمان تغير اليوم عند منتصف الليل
    setInterval(updateDate, 3600000); 
    console.log("تم تفعيل التاريخ (الميلادي والهجري).");
}
