// assets/js/prayers.js
import { fetchLivePrayers } from './api.js';
import { fetchJsonData } from './storage.js';

export async function initPrayers() {
    const prayerContainer = document.getElementById('prayerTimes');
    if (!prayerContainer) return;

    async function updatePrayers() {
        let timings = await fetchLivePrayers();
        
        // إذا فشل الاتصال بالإنترنت، جرب قراءة الملف المحلي (أوفلاين)
        if (!timings) {
            console.log("الإنترنت غير متوفر، جاري محاولة قراءة أوقات الصلاة محلياً...");
            const localData = await fetchJsonData('prayers');
            if (localData && localData.timings) timings = localData.timings;
        }

        if (!timings) return; // إذا لم يتوفر أي مصدر للبيانات نتوقف

        // القاموس لترجمة وربط الصلوات المطلوبة فقط
        const requiredPrayers = {
            'Fajr': 'الفجر',
            'Sunrise': 'الشروق',
            'Dhuhr': 'الظهر',
            'Asr': 'العصر',
            'Maghrib': 'المغرب',
            'Isha': 'العشاء'
        };

        prayerContainer.innerHTML = ''; // تفريغ المحتوى القديم

        // بناء العناصر وإضافتها للشاشة
        for (const [englishKey, arabicName] of Object.entries(requiredPrayers)) {
            if (timings[englishKey]) {
                const timeDiv = document.createElement('div');
                timeDiv.className = 'prayer-item'; // كلاس CSS لتنسيقه لاحقاً
                
                // إزالة المنطقة الزمنية من النص إذا وجدت (مثلاً 15:30 (AST) تصبح 15:30)
                const cleanTime = timings[englishKey].split(' ')[0];

                timeDiv.innerHTML = `
                    <div class="prayer-name">${arabicName}</div>
                    <div class="prayer-time">${cleanTime}</div>
                `;
                prayerContainer.appendChild(timeDiv);
            }
        }
        
        // *ملاحظة: سيتم إضافة دالة (تمييز الصلاة القادمة باللون) في التحديثات القادمة*
    }

    updatePrayers();
    // تحديث أوقات الصلاة كل ساعة (لضمان دقة الأيام عند منتصف الليل)
    setInterval(updatePrayers, 3600000); 
    console.log("تم تفعيل نظام أوقات الصلاة.");
}
