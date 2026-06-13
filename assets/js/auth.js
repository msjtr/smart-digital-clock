// ============================================================================
// Authentication Manager - (Password Only Version)
// ============================================================================

import { addLog } from "./logs.js";
import { showNotification } from "./notifications.js";

// كلمة المرور المعتمدة
const ACCESS_PASSWORD = "123";

export function initAuth() {
    console.log("🔐 نظام الدخول نشط");

    const loginBtn = document.getElementById("loginBtn");
    const passwordInput = document.getElementById("adminPassword");
    const errorMsg = document.getElementById("loginError");
    const loginScreen = document.getElementById("loginScreen");
    const dashboard = document.getElementById("adminDashboard");
    const logoutBtn = document.getElementById("logoutBtn");

    // التحقق من الجلسة عند التحميل
    if (sessionStorage.getItem("is_admin_logged_in") === "true") {
        showDashboard(loginScreen, dashboard);
    }

    // تسجيل الدخول (مع حماية التحقق من وجود الزر)
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const password = passwordInput?.value?.trim();

            if (password === ACCESS_PASSWORD) {
                sessionStorage.setItem("is_admin_logged_in", "true");
                
                // سجل العملية (مع التعامل مع الأخطاء في حال فشل الاستيراد)
                try { addLog("تسجيل دخول", "admin"); } catch (e) { console.warn("Log module not available"); }
                try { showNotification("تم الدخول بنجاح", "success"); } catch (e) { console.warn("Notification module not available"); }
                
                showDashboard(loginScreen, dashboard);
            } else {
                if (errorMsg) errorMsg.textContent = "كلمة المرور غير صحيحة!";
                if (passwordInput) passwordInput.value = "";
            }
        });
    }

    // تسجيل الخروج
    logoutBtn?.addEventListener("click", () => {
        sessionStorage.removeItem("is_admin_logged_in");
        location.reload();
    });

    // دعم زر Enter
    passwordInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            loginBtn?.click();
        }
    });
}

function showDashboard(screen, dash) {
    if (screen) screen.style.display = "none";
    if (dash) dash.style.display = "grid";
}
