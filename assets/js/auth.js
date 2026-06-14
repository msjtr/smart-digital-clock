// ============================================================================
// Authentication Manager - (النسخة الكاملة والمتوافقة مع جميع الصفحات)
// ============================================================================
import { showToast } from "./utils.js";

export function initAuth() {
    console.log("🔒 محرك المصادقة: بدء التهيئة...");
    
    const loginBtn = document.getElementById("loginBtn");
    const passwordInput = document.getElementById("adminPassword");
    const loginScreen = document.getElementById("loginScreen");
    const dashboard = document.getElementById("adminDashboard");
    const logoutBtn = document.getElementById("logoutBtn");

    // إذا لم تكن العناصر موجودة (مثل صفحة العرض الرئيسية)، نخرج بهدوء
    if (!loginScreen || !dashboard) {
        console.info("ℹ️ Auth: نظام الدخول غير متاح في هذه الصفحة (وهذا طبيعي في شاشة العرض).");
        return;
    }

    const ACCESS_PASSWORD = "123";
    const SESSION_KEY = "is_admin_logged_in";

    // التحقق من الجلسة
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
        showDashboard(loginScreen, dashboard);
    } else {
        dashboard.style.display = "none";
        loginScreen.style.display = "flex";
    }

    // زر الدخول
    if (loginBtn) {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const password = passwordInput ? passwordInput.value.trim() : "";

            if (password === ACCESS_PASSWORD) {
                sessionStorage.setItem(SESSION_KEY, "true");
                showDashboard(loginScreen, dashboard);
                showToast("تم الدخول بنجاح", "success");
            } else {
                showToast("كلمة المرور خاطئة", "error");
                if (passwordInput) passwordInput.value = "";
            }
        });
    }

    // زر الخروج
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem(SESSION_KEY);
            window.location.reload();
        });
    }

    // دعم مفتاح Enter
    passwordInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") loginBtn.click();
    });
}

function showDashboard(screen, dash) {
    if (screen) screen.style.display = "none";
    if (dash) {
        dash.style.display = "flex";
        document.body.setAttribute("data-admin-state", "logged-in");
    }
}
