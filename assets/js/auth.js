// ============================================================================
// Authentication Manager (Password Only)
// ============================================================================

export function initAuth() {
    const loginBtn = document.getElementById("loginBtn");
    const passwordInput = document.getElementById("adminPassword");
    const errorMsg = document.getElementById("loginError");
    const loginScreen = document.getElementById("loginScreen");
    const dashboard = document.getElementById("adminDashboard");
    const logoutBtn = document.getElementById("logoutBtn");

    // كلمة المرور الموحدة (يمكنك تغييرها هنا)
    const ACCESS_PASSWORD = "123"; 

    // فحص الجلسة عند التحميل
    if (sessionStorage.getItem("admin_is_logged_in") === "true") {
        showDashboard(loginScreen, dashboard);
    }

    // زر الدخول
    loginBtn?.addEventListener("click", () => {
        const password = passwordInput?.value?.trim();

        if (password === ACCESS_PASSWORD) {
            sessionStorage.setItem("admin_is_logged_in", "true");
            showDashboard(loginScreen, dashboard);
        } else {
            if (errorMsg) errorMsg.textContent = "كلمة المرور غير صحيحة";
        }
    });

    // تسجيل الخروج
    logoutBtn?.addEventListener("click", () => {
        sessionStorage.removeItem("admin_is_logged_in");
        location.reload();
    });

    // دعم زر Enter
    passwordInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") loginBtn?.click();
    });
}

function showDashboard(screen, dash) {
    if (screen) screen.style.display = "none";
    if (dash) dash.style.display = "grid";
}

export function isLoggedIn() {
    return sessionStorage.getItem("admin_is_logged_in") === "true";
}
