// ============================================================================
// Authentication Manager - (نسخة الطوارئ المستقلة تماماً)
// ============================================================================

export function initAuth() {
    console.log("✅ ملف auth.js يعمل الآن بدون أي ارتباطات خارجية");

    const loginBtn = document.getElementById("loginBtn");
    const passwordInput = document.getElementById("adminPassword");
    const errorMsg = document.getElementById("loginError");
    const loginScreen = document.getElementById("loginScreen");
    const dashboard = document.getElementById("adminDashboard");
    const logoutBtn = document.getElementById("logoutBtn");

    const ACCESS_PASSWORD = "123";

    // التحقق المباشر
    if (sessionStorage.getItem("is_admin_logged_in") === "true") {
        showDashboard(loginScreen, dashboard);
    }

    if (loginBtn) {
        // إزالة أي أحداث سابقة لتجنب التكرار
        loginBtn.onclick = null; 
        
        // ربط الزر بحدث النقر
        loginBtn.onclick = function() {
            console.log("تم الضغط على الزر!"); // رسالة تأكيد في الـ Console
            
            if (!passwordInput) return;
            const password = passwordInput.value.trim();

            if (password === ACCESS_PASSWORD) {
                console.log("كلمة المرور صحيحة، جاري فتح اللوحة...");
                sessionStorage.setItem("is_admin_logged_in", "true");
                showDashboard(loginScreen, dashboard);
            } else {
                console.log("كلمة المرور خاطئة!");
                if (errorMsg) errorMsg.textContent = "كلمة المرور غير صحيحة!";
                passwordInput.value = "";
            }
        };
    } else {
        console.error("❌ المتصفح لا يرى زر الدخول (loginBtn) في الصفحة!");
    }

    // تسجيل الخروج
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            sessionStorage.removeItem("is_admin_logged_in");
            location.reload();
        };
    }

    // زر Enter
    if (passwordInput) {
        passwordInput.onkeypress = function(e) {
            if (e.key === "Enter" && loginBtn) {
                loginBtn.click();
            }
        };
    }
}

function showDashboard(screen, dash) {
    if (screen) screen.style.display = "none";
    if (dash) dash.style.display = "grid";
}
