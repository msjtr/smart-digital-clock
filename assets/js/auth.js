// assets/js/auth.js
export function initAuth() {
    console.log("🔒 نظام الحماية: جاري التهيئة...");

    const loginBtn = document.getElementById('loginBtn');
    const passwordInput = document.getElementById('adminPassword');
    const errorMsg = document.getElementById('loginError');
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');

    const ADMIN_PASSWORD = "123";

    // 1. وظيفة عرض لوحة التحكم
    function showDashboard() {
        console.log("✅ الدخول ناجح: يتم عرض لوحة التحكم.");
        if (loginScreen) loginScreen.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'grid';
    }

    // 2. التحقق المباشر من الجلسة
    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        showDashboard();
    }

    // 3. التحقق من وجود الزر قبل الربط
    if (loginBtn) {
        // استخدم onclick بدلاً من addEventListener لضمان عدم تعدد النسخ
        loginBtn.onclick = function() {
            if (passwordInput && passwordInput.value === ADMIN_PASSWORD) {
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                if (errorMsg) errorMsg.textContent = '';
                showDashboard();
            } else {
                console.warn("⚠️ محاولة دخول فاشلة.");
                if (errorMsg) errorMsg.textContent = 'كلمة المرور غير صحيحة، حاول مرة أخرى.';
                if (passwordInput) {
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            }
        };
    } else {
        console.error("❌ خطأ: الزر 'loginBtn' غير موجود في صفحة الـ HTML.");
    }

    // 4. دعم مفتاح Enter
    if (passwordInput) {
        passwordInput.onkeypress = function(e) {
            if (e.key === 'Enter') {
                loginBtn.click();
            }
        };
    }
}
