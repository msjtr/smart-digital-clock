// ============================================================================
// Fullscreen Manager - إدارة وضع العرض الكامل (محدث)
// ============================================================================

export function initFullscreen() {
    const header = document.querySelector('header');
    
    if (!header) return;

    // تفعيل وضع ملء الشاشة بالنقر المزدوج
    header.addEventListener('dblclick', toggleFullScreen);
    header.style.cursor = 'pointer';
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

    // استماع لتغير حالة الشاشة وتعديل الواجهة
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

/**
 * وظيفة إضافية: ضمان بقاء الشاشة في وضع ملء الشاشة
 * يمكن استدعاء هذه الدالة من app.js إذا لزم الأمر
 */
export function ensureFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.debug("نظام الحماية يمنع تفعيل ملء الشاشة تلقائياً بدون تفاعل المستخدم.");
        });
    }
}
