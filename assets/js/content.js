import { fetchJsonData } from './storage.js';

export async function initContent() {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;

    try {
        const contentData = await fetchJsonData('content');
        
        // التحقق من وجود البيانات
        if (!contentData || !contentData.items || contentData.items.length === 0) {
            contentArea.innerHTML = '<p style="padding:20px;">لا يوجد محتوى حالياً</p>';
            return;
        }

        const items = contentData.items;
        let currentIndex = 0;

        const showContent = () => {
            const item = items[currentIndex];
            
            // تنظيف المحتوى السابق
            contentArea.innerHTML = '';
            
            if (item.type === 'text') {
                contentArea.innerHTML = `<h3>${item.title || ''}</h3><p>${item.text || ''}</p>`;
            } else if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.url;
                img.alt = item.title || 'صورة';
                img.style.maxWidth = '100%';
                img.onerror = () => {
                    contentArea.innerHTML = '<p>تعذر عرض الصورة</p>';
                };
                contentArea.appendChild(img);
            }
            
            currentIndex = (currentIndex + 1) % items.length;
        };

        // عرض المحتوى الأول فوراً ثم التدوير
        showContent();
        setInterval(showContent, 10000);
        
    } catch (e) {
        console.error("خطأ في تحميل المحتوى:", e);
        contentArea.innerHTML = '<p>حدث خطأ في تحميل المحتوى</p>';
    }
}
