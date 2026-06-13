// assets/js/messages.js
import { fetchJsonData } from './storage.js';

export async function initMessages() {
    const messageDisplay = document.getElementById('messageDisplay');
    const tickerContent = document.querySelector('.ticker-content');
    
    if (!messageDisplay && !tickerContent) return;

    // جلب الرسائل من ملف JSON أو استخدام رسائل افتراضية
    let messagesData = await fetchJsonData('messages');
    let messages = messagesData?.list || [
        "أهلاً بكم في نظام الساعة الرقمية الذكية",
        "جامعة حائل - كلية الشريعة والقانون ترحب بكم",
        "نسعى لتقديم بيئة تعليمية إلكترونية متطورة"
    ];

    let currentIndex = 0;

    // دالة لتغيير الرسالة الرئيسية بتأثير حركي
    function showNextMessage() {
        if (messages.length === 0) return;
        
        if (messageDisplay) {
            // تأثير الاختفاء
            messageDisplay.style.opacity = '0'; 
            messageDisplay.style.transform = 'translateY(10px)';
            messageDisplay.style.transition = 'all 0.5s ease-in-out';
            
            setTimeout(() => {
                messageDisplay.textContent = messages[currentIndex];
                // تأثير الظهور
                messageDisplay.style.opacity = '1';
                messageDisplay.style.transform = 'translateY(0)';
                
                currentIndex = (currentIndex + 1) % messages.length;
            }, 500);
        }
    }

    // تعبئة الشريط الإخباري السفلي (News Ticker)
    if (tickerContent && messages.length > 0) {
        // ندمج الرسائل بفاصل بصري لعرضها كشريط مستمر
        tickerContent.textContent = messages.join('   ✦   ');
    }

    // تغيير الرسالة كل 10 ثوانٍ
    setInterval(showNextMessage, 10000);
    showNextMessage();
    
    console.log("تم تفعيل نظام الرسائل والشريط الإخباري.");
}
