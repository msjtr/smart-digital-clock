// ============================================================================
// Authentication Manager - (النسخة الذكية)
// ============================================================================

export function initAuth() {
    const loginBtn = document.getElementById("loginBtn");
    const passwordInput = document.getElementById("adminPassword");
    const errorMsg = document.getElementById("loginError");
    const loginScreen = document.getElementById("loginScreen");
    const dashboard = document.getElementById("adminDashboard");
    const logoutBtn = document.getElementById("logoutBtn");

    // الإصلاح الجذري: إذا لم نكن في صفحة الإدارة، أوقف تشغيل السكربت بصمت
    if (!loginScreen && !dashboard) {
        return; 
    }

    console.log("✅ ملف auth.js يعمل الآن (النسخة المستقلة)");
    const ACCESS_PASSWORD = "123";

    // التحقق المباشر عند تحديث الصفحة
    if (sessionStorage.getItem("is_admin_logged_in") === "true") {
        showDashboard(loginScreen, dashboard);
    }

    if (loginBtn) {
        loginBtn.onclick = null; 
        
        loginBtn.onclick = function(e) {
            e.preventDefault(); 
            
            if (!passwordInput) return;
            const password = passwordInput.value.trim();

            if (password === ACCESS_PASSWORD) {
                sessionStorage.setItem("is_admin_logged_in", "true");
                showDashboard(loginScreen, dashboard);
            } else {
                if (errorMsg) errorMsg.textContent = "كلمة المرور غير صحيحة!";
                passwordInput.value = "";
            }
        };
    }

    // تسجيل الخروج
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            sessionStorage.removeItem("is_admin_logged_in");
            location.reload();
        };
    }

    // دعم الدخول عبر زر Enter
    if (passwordInput) {
        passwordInput.onkeypress = function(e) {
            if (e.key === "Enter" && loginBtn) {
                e.preventDefault();
                loginBtn.click();
            }
        };
    }
}

function showDashboard(screen, dash) {
    if (screen) screen.style.display = "none";
    if (dash) dash.style.display = "flex"; 
}
