// assets/js/date.js
export function initDate() {
    const dayElement = document.getElementById('dayName');
    const gregorianElement = document.getElementById('gregorianDate');
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const now = new Date();
    
    dayElement.textContent = now.toLocaleDateString('ar-SA', { weekday: 'long' });
    gregorianElement.textContent = now.toLocaleDateString('ar-SA', options);
    
    // ملاحظة: للتقويم الهجري، يُفضل استخدام Intl.DateTimeFormat
    const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric', month: 'long', year: 'numeric'
    }).format(now);
    
    document.getElementById('hijriDate').textContent = hijri;
}
