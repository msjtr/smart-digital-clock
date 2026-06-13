// assets/js/auth.js
export function initAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const passwordInput = document.getElementById('adminPassword');
    const errorMsg = document.getElementById('loginError');
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');

    // كلمة المرور المطلوبة
    const ADMIN_PASSWORD = "123";

    // التحقق من حالة الجلسة عند تحميل الصفحة
    if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        showDashboard();
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (passwordInput.value === ADMIN_PASSWORD) {
                // كلمة المرور صحيحة
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                if (errorMsg) errorMsg.textContent = '';
                showDashboard();
            } else {
                // كلمة المرور خاطئة
                if (errorMsg) errorMsg.textContent = 'كلمة المرور غير صحيحة، حاول مرة أخرى.';
                passwordInput.value = ''; // تفريغ الحقل
                passwordInput.focus();
            }
        });
    }

    // السماح بالدخول عند الضغط على زر Enter
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginBtn.click();
        });
    }

    function showDashboard() {
        if (loginScreen) loginScreen.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'grid'; // أو 'flex' حسب الـ CSS لديك
    }
}
