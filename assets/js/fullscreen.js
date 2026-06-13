// assets/js/fullscreen.js

export function initFullscreen() {
    // يمكن تفعيل الشاشة الكاملة بالنقر المزدوج على ترويسة الصفحة
    const header = document.querySelector('header');
    
    if (!header) return;

    header.addEventListener('dblclick', toggleFullScreen);
    header.style.cursor = 'pointer'; // تنبيه المستخدم أن المنطقة قابلة للنقر
    header.title = "انقر نقراً مزدوجاً لملء الشاشة";

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn(`تعذر تشغيل وضع ملء الشاشة: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // استماع لتغير حالة الشاشة وتعديل الواجهة إن لزم الأمر
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            document.body.classList.add('is-fullscreen');
            console.log("تم تفعيل وضع ملء الشاشة.");
        } else {
            document.body.classList.remove('is-fullscreen');
            console.log("تم الخروج من وضع ملء الشاشة.");
        }
    });

    console.log("تم تفعيل ميزة الشاشة الكاملة.");
}
