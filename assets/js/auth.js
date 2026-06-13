// ============================================================================
// Authentication & Permissions Manager
// ============================================================================

import { addLog } from "./logs.js";
import { showNotification } from "./notifications.js";

// كلمة المرور الموحدة (يمكنك تغييرها هنا)
const ACCESS_PASSWORD = "123"; 

export function initAuth() {
    console.log("🔐 تم تشغيل نظام الدخول");

    const loginBtn = document.getElementById("loginBtn");
    const passwordInput = document.getElementById("adminPassword");
    const errorMsg = document.getElementById("loginError");
    const loginScreen = document.getElementById("loginScreen");
    const dashboard = document.getElementById("adminDashboard");
    const logoutBtn = document.getElementById("logoutBtn");

    // فحص الجلسة الحالية
    if (isLoggedIn()) {
        showDashboard(loginScreen, dashboard);
    }

    // تسجيل الدخول
    loginBtn?.addEventListener("click", () => {
        const password = passwordInput?.value?.trim();

        // التحقق من كلمة المرور
        if (password === ACCESS_PASSWORD) {
            // تسجيل دخول ناجح (بافتراض دور المدير)
            const user = { username: "Admin", role: "admin" };
            
            sessionStorage.setItem("admin_session", JSON.stringify(user));

            try {
                addLog("تسجيل دخول", "admin");
                showNotification("تم تسجيل الدخول بنجاح", "success");
            } catch (e) {}

            showDashboard(loginScreen, dashboard);
        } else {
            if (errorMsg) errorMsg.textContent = "كلمة المرور غير صحيحة";
            try { addLog("فشل تسجيل الدخول", "محاولة خاطئة"); } catch (e) {}
        }
    });

    // تسجيل الخروج
    logoutBtn?.addEventListener("click", logout);

    // زر Enter
    passwordInput?.addEventListener("keypress", e => {
        if (e.key === "Enter") loginBtn?.click();
    });
}

// ============================================================================
// Logout
// ============================================================================
export function logout() {
    sessionStorage.removeItem("admin_session");
    location.reload();
}

export function isLoggedIn() {
    return !!sessionStorage.getItem("admin_session");
}

function showDashboard(loginScreen, dashboard) {
    if (loginScreen) loginScreen.style.display = "none";
    if (dashboard) dashboard.style.display = "grid";
}
