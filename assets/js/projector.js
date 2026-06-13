// assets/js/projector.js

export function initProjector() {
    // يمكن تفعيل وضع البروجكتور عبر اختصار كيبورد (مثلاً حرف P)
    document.addEventListener('keydown', (e) => {
        // التحقق من الضغط على Alt + P
        if (e.altKey && e.key.toLowerCase() === 'p') {
            toggleProjectorMode();
        }
    });

    console.log("تم تفعيل دعم وضع البروجكتور (Alt + P للتبديل).");
}

function toggleProjectorMode() {
    const body = document.body;
    const isProjector = body.classList.toggle('projector-mode');
    
    if (isProjector) {
        console.log("تم تفعيل وضع البروجكتور: زيادة التباين وتكبير الخطوط.");
        // إضافة تنسيقات برمجية إضافية إذا لزم الأمر
        document.documentElement.style.setProperty('--glass-bg', 'rgba(0, 0, 0, 0.8)');
    } else {
        console.log("تم إيقاف وضع البروجكتور.");
        // العودة للوضع الطبيعي
        document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.1)');
    }
}
