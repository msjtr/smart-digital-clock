import { Storage } from "./storage.js";

export const Occasions = {

    data: null,

    init() {

        this.data =// assets/js/occasions.js
import { fetchJsonData } from './storage.js';

export async function initOccasions() {
    const occasionBox = document.getElementById('occasionBox');
    if (!occasionBox) return;

    let occasionsData = await fetchJsonData('occasions');
    let occasions = occasionsData?.list || [];
    
    let currentOccasion = null;

    // البحث عن مناسبة نشطة حالياً
    if (occasions.length > 0) {
        currentOccasion = occasions.find(occ => occ.isActive) || occasions[0];
    } else {
        // حالة افتراضية في حال عدم وجود بيانات
        currentOccasion = { 
            title: "🎉 مرحباً بكم", 
            description: "كلية الشريعة والقانون تتمنى لكم فصلاً دراسياً مكللاً بالنجاح." 
        };
    }

    // بناء واجهة المناسبة
    occasionBox.innerHTML = `
        <h2>${currentOccasion.title}</h2>
        <p>${currentOccasion.description}</p>
    `;

    // معالجة ذكية للصورة: إضافتها فقط إذا وجدت، وإخفاؤها برمجياً إذا كان الرابط معطوباً
    if (currentOccasion.imagePath) {
        const img = document.createElement('img');
        img.src = currentOccasion.imagePath;
        img.alt = currentOccasion.title;
        img.className = 'occasion-image';
        
        img.onerror = () => {
            console.warn(`تعذر تحميل صورة المناسبة: ${currentOccasion.imagePath}`);
            img.style.display = 'none'; // منع ظهور أيقونة الصورة المكسورة
        };
        
        occasionBox.appendChild(img);
    }

    console.log("تم تفعيل نظام المناسبات.");
}
            Storage.load(
                "occasion",
                {
                    title:
                        "أهلاً بكم",

                    description:
                        "كلية الشريعة والقانون",

                    color:
                        "#2563eb"
                }
            );

        this.render();

    },

    render() {

        const box =
            document.getElementById(
                "occasionBox"
            );

        if (!box) return;

        box.innerHTML = `
            <h2>${this.data.title}</h2>
            <p>${this.data.description}</p>
        `;

        box.style.background =
            this.data.color;

    },

    update(data) {

        this.data = data;

        Storage.save(
            "occasion",
            data
        );

        this.render();

    }

};
