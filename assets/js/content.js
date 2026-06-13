// assets/js/content.js
import { fetchJsonData } from './storage.js';

export async function initContent() {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;

    // جلب بيانات المحتوى المراد عرضه (مثلاً صور إعلانية أو إرشادات)
    let contentData = await fetchJsonData('content'); 
    let items = contentData?.items || [];

    if (items.length === 0) {
        contentArea.innerHTML = '<p class="empty-state">لا يوجد محتوى حالياً</p>';
        return;
    }

    let currentIndex = 0;

    function showNextContent() {
        const currentItem = items[currentIndex];
        
        // تفريغ المحتوى مع تأثير حركي بسيط
        contentArea.style.opacity = '0';

        setTimeout(() => {
            contentArea.innerHTML = ''; // تنظيف الحاوية

            if (currentItem.type === 'image') {
                const img = document.createElement('img');
                img.src = currentItem.url;
                img.alt = currentItem.title || 'محتوى معروض';
                img.className = 'content-image';
                
                // معالجة ذكية: إذا لم يتم إرفاق مسار الصورة بشكل صحيح أو كان الملف مفقوداً
                img.onerror = () => {
                    console.warn(`تعذر تحميل المرفق: ${currentItem.url}. تم إخفاء العنصر لتجنب تشوه الواجهة.`);
                    contentArea.innerHTML = `<p class="error-state">محتوى غير متوفر (${currentItem.title})</p>`;
                };
                
                contentArea.appendChild(img);
            } else if (currentItem.type === 'text') {
                contentArea.innerHTML = `<h3>${currentItem.title}</h3><p>${currentItem.text}</p>`;
            }

            contentArea.style.opacity = '1';
            currentIndex = (currentIndex + 1) % items.length;
        }, 300);
    }

    // تبديل المحتوى كل 15 ثانية
    setInterval(showNextContent, 15000);
    showNextContent();

    console.log("تم تفعيل نظام عرض المحتوى.");
}
