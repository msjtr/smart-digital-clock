// assets/js/occasions.js
import { fetchJsonData } from './storage.js';

export async function initOccasions() {
    const occasionBox = document.getElementById('occasionBox');
    if (!occasionBox) return;

    try {
        let occasionsData = await fetchJsonData('occasions');
        let occasions = [];
        
        if (occasionsData && occasionsData.list) {
            occasions = occasionsData.list;
        }
        
        let currentOccasion = null;

        // البحث عن مناسبة نشطة حالياً
        if (occasions.length > 0) {
            for (let i = 0; i < occasions.length; i++) {
                if (occasions[i].isActive) {
                    currentOccasion = occasions[i];
                    break;
                }
            }
            if (!currentOccasion) currentOccasion = occasions[0];
        } else {
            // حالة افتراضية
            currentOccasion = { 
                title: "🎉 مرحباً بكم", 
                description: "كلية الشريعة والقانون تتمنى لكم فصلاً دراسياً مكللاً بالنجاح." 
            };
        }

        occasionBox.innerHTML = `
            <h2>${currentOccasion.title}</h2>
            <p>${currentOccasion.description}</p>
        `;

        if (currentOccasion.imagePath) {
            const img = document.createElement('img');
            img.src = currentOccasion.imagePath;
            img.alt = currentOccasion.title;
            img.className = 'occasion-image';
            
            img.onerror = () => {
                img.style.display = 'none';
            };
            
            occasionBox.appendChild(img);
        }

        console.log("تم تفعيل نظام المناسبات.");
    } catch (error) {
        console.error("حدث خطأ أثناء تحميل المناسبات:", error);
    }
}
