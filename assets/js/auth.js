// ============================================================================
// Authentication Manager - (النسخة النهائية - جاهزة للربط)
// ============================================================================

export function initAuth() {
    const runAuth = () => {
        const loginBtn = document.getElementById("loginBtn");
        const passwordInput = document.getElementById("adminPassword");
        const errorMsg = document.getElementById("loginError");
        const loginScreen = document.getElementById("loginScreen");
        const dashboard = document.getElementById("adminDashboard");
        const logoutBtn = document.getElementById("logoutBtn");

        // حماية: إذا لم نكن في صفحة الإدارة، نخرج لتجنب الأخطاء
        if (!loginScreen || !dashboard) return;

        console.log("🔒 نظام المصادقة مفعل.");
        
        const ACCESS_PASSWORD = "123";
        const SESSION_KEY = "is_admin_logged_in";

        // 1. التحقق الفوري من الجلسة عند تحميل الصفحة
        if (sessionStorage.getItem(SESSION_KEY) === "true") {
            showDashboard(loginScreen, dashboard);
        } else {
            // إخفاء اللوحة وإظهار شاشة الدخول إذا لم يكن مسجلاً
            dashboard.style.display = "none";
            loginScreen.style.display = "flex";
        }

        // 2. معالجة زر تسجيل الدخول
        if (loginBtn) {
            loginBtn.addEventListener("click", (e) => {
                e.preventDefault();
                const password = passwordInput ? passwordInput.value.trim() : "";

                if (password === ACCESS_PASSWORD) {
                    sessionStorage.setItem(SESSION_KEY, "true");
                    showDashboard(loginScreen, dashboard);
                } else {
                    if (errorMsg) errorMsg.textContent = "كلمة المرور غير صحيحة!";
                    if (passwordInput) passwordInput.value = "";
                }
            });
        }

        // 3. معالجة زر تسجيل الخروج
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                sessionStorage.removeItem(SESSION_KEY);
                location.reload();
            });
        }

        // 4. دعم زر Enter في لوحة المفاتيح
        if (passwordInput) {
            passwordInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") loginBtn.click();
            });
        }
    };

    // تنفيذ الكود عند جاهزية الصفحة (تجنب أخطاء غياب العناصر)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAuth);
    } else {
        runAuth();
    }
}

/**
 * دالة الانتقال للوحة التحكم وإخفاء شاشة الدخول
 */
function showDashboard(screen, dash) {
    if (screen) screen.style.display = "none";
    if (dash) {
        dash.style.display = "flex";
        document.body.setAttribute("data-admin-state", "logged-in");
    }
}
