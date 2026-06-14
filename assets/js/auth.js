// ============================================================================
// Authentication Manager - (النسخة الكاملة والمحدثة)
// ============================================================================
import { showToast } from "./utils.js";

export function initAuth() {
    console.log("🔒 محرك المصادقة: بدء التهيئة...");
    
    const loginBtn = document.getElementById("loginBtn");
    const passwordInput = document.getElementById("adminPassword");
    const loginScreen = document.getElementById("loginScreen");
    const dashboard = document.getElementById("adminDashboard");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!loginScreen || !dashboard) {
        console.error("❌ Auth: عناصر شاشة الدخول غير موجودة!");
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

    // دعم Enter
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





// ============================================================================
// Utilities - أدوات عامة وإشعارات
// ============================================================================

/**
 * عرض إشعار منبثق (Toast)
 * @param {string} message - نص الرسالة
 * @param {string} type - 'success' أو 'error'
 */
export function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    
    // في حال عدم وجود حاوية، نقوم بإنشائها ديناميكياً
    let toastWrapper = container;
    if (!toastWrapper) {
        toastWrapper = document.createElement('div');
        toastWrapper.id = 'toastContainer';
        toastWrapper.style.cssText = "position: fixed; bottom: 20px; left: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;";
        document.body.appendChild(toastWrapper);
    }

    const toast = document.createElement('div');
    const borderColor = type === 'success' ? '#10b981' : '#ef4444';
    
    toast.style.cssText = `
        background: #1e293b; 
        padding: 15px 20px; 
        border-radius: 8px; 
        color: white; 
        border-right: 5px solid ${borderColor}; 
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: fadeIn 0.3s ease;
    `;
    
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span> <span>${message}</span>`;
    
    toastWrapper.appendChild(toast);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/**
 * تنسيق الأرقام لتكون خانتين (مثل 01, 09)
 */
export function padZero(num) {
    return num.toString().padStart(2, '0');
}

/**
 * توليد معرف فريد
 */
export function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
