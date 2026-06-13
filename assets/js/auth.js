// ============================================================================
// Authentication Manager - (Password Only Version)
// ============================================================================

import { addLog } from "./logs.js";
import { showNotification } from "./notifications.js";

// كلمة المرور التي تعتمد عليها
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

    // تسجيل الدخول
    loginBtn?.addEventListener("click", () => {
        const password = passwordInput?.value?.trim();

        if (password === ACCESS_PASSWORD) {
            sessionStorage.setItem("is_admin_logged_in", "true");
            
            // سجل العملية
            try { addLog("تسجيل دخول", "admin"); } catch (e) {}
            try { showNotification("تم الدخول بنجاح", "success"); } catch (e) {}
            
            showDashboard(loginScreen, dashboard);
        } else {
            if (errorMsg) errorMsg.textContent = "كلمة المرور غير صحيحة!";
            passwordInput.value = "";
        }
    });

    // تسجيل الخروج
    logoutBtn?.addEventListener("click", () => {
        sessionStorage.removeItem("is_admin_logged_in");
        location.reload();
    });

    // زر Enter
    passwordInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") loginBtn.click();
    });
}

function showDashboard(screen, dash) {
    if (screen) screen.style.display = "none";
    if (dash) dash.style.display = "grid";
}
