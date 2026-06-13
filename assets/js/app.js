// ============================================================================
// Authentication Manager - (النسخة المعززة)
// ============================================================================

export function initAuth() {
    const loginBtn = document.getElementById("loginBtn");
    const passwordInput = document.getElementById("adminPassword");
    const errorMsg = document.getElementById("loginError");
    const loginScreen = document.getElementById("loginScreen");
    const dashboard = document.getElementById("adminDashboard");
    const logoutBtn = document.getElementById("logoutBtn");

    // حماية: إذا لم نكن في صفحة الإدارة، نخرج فوراً لتوفير الموارد
    if (!loginScreen || !dashboard) return;

    console.log("✅ نظام المصادقة مفعل.");
    const ACCESS_PASSWORD = "123";
    const SESSION_KEY = "is_admin_logged_in";

    // 1. التحقق الفوري عند التحميل
    try {
        if (sessionStorage.getItem(SESSION_KEY) === "true") {
            showDashboard(loginScreen, dashboard);
        }
    } catch (e) {
        console.warn("تعذر الوصول إلى sessionStorage.");
    }

    // 2. معالجة زر الدخول
    if (loginBtn) {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const password = passwordInput ? passwordInput.value.trim() : "";

            if (password === ACCESS_PASSWORD) {
                try {
                    sessionStorage.setItem(SESSION_KEY, "true");
                    showDashboard(loginScreen, dashboard);
                } catch (e) {
                    errorMsg.textContent = "خطأ في حفظ الجلسة!";
                }
            } else {
                if (errorMsg) errorMsg.textContent = "كلمة المرور غير صحيحة!";
                if (passwordInput) passwordInput.value = "";
            }
        });
    }

    // 3. تسجيل الخروج
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem(SESSION_KEY);
            // إخفاء اللوحة وإظهار شاشة الدخول يدوياً قبل التحديث لضمان سلاسة التجربة
            location.reload();
        });
    }

    // 4. دعم زر Enter
    if (passwordInput) {
        passwordInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") loginBtn.click();
        });
    }
}

/**
 * دالة الانتقال للوحة التحكم
 */
function showDashboard(screen, dash) {
    if (screen) screen.style.display = "none";
    if (dash) {
        dash.style.display = "flex";
        // إضافة حالة للـ body لتسهيل تنسيق الـ CSS
        document.body.setAttribute("data-admin-state", "logged-in");
    }
}
