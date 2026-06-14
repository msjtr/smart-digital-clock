// ============================================================================
// Authentication Manager - (نسخة مكتفية ذاتياً لحل مشاكل الـ Import)
// ============================================================================

/**
 * دالة إشعار محلية لحل تعارضات الـ Import
 */
function showLocalToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.style.cssText = "background: #1e293b; padding: 15px; margin: 10px; border-radius: 8px; color: white; border-right: 4px solid " + (type === 'success' ? '#10b981' : '#ef4444');
    
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'} ${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

export function initAuth() {
    const runAuth = () => {
        const loginBtn = document.getElementById("loginBtn");
        const passwordInput = document.getElementById("adminPassword");
        const errorMsg = document.getElementById("loginError");
        const loginScreen = document.getElementById("loginScreen");
        const dashboard = document.getElementById("adminDashboard");
        const logoutBtn = document.getElementById("logoutBtn");

        if (!loginScreen || !dashboard) return;

        console.log("🔒 نظام المصادقة مفعل.");
        const ACCESS_PASSWORD = "123";
        const SESSION_KEY = "is_admin_logged_in";

        if (sessionStorage.getItem(SESSION_KEY) === "true") {
            showDashboard(loginScreen, dashboard);
        } else {
            dashboard.style.display = "none";
            loginScreen.style.display = "flex";
        }

        if (loginBtn) {
            loginBtn.addEventListener("click", (e) => {
                e.preventDefault();
                const password = passwordInput ? passwordInput.value.trim() : "";

                if (password === ACCESS_PASSWORD) {
                    sessionStorage.setItem(SESSION_KEY, "true");
                    showDashboard(loginScreen, dashboard);
                    showLocalToast("تم تسجيل الدخول بنجاح!", "success");
                } else {
                    if (errorMsg) errorMsg.textContent = "كلمة المرور غير صحيحة!";
                    showLocalToast("كلمة المرور غير صحيحة!", "error");
                    if (passwordInput) {
                        passwordInput.value = "";
                        passwordInput.focus();
                    }
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                sessionStorage.removeItem(SESSION_KEY);
                location.reload();
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter" && loginBtn) loginBtn.click();
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAuth);
    } else {
        runAuth();
    }
}

function showDashboard(screen, dash) {
    if (screen) screen.style.display = "none";
    if (dash) {
        dash.style.display = "flex";
        document.body.setAttribute("data-admin-state", "logged-in");
    }
}
