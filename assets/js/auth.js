// assets/js/auth.js

// كلمة المرور الافتراضية للمرحلة الحالية (يمكن تغييرها)
const ADMIN_PASSWORD = "123"; 

export function initAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const passwordInput = document.getElementById('adminPassword');
    const errorMsg = document.getElementById('loginError');

    // التحقق من حالة الجلسة عند تحميل الصفحة
    checkSession();

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (passwordInput.value === ADMIN_PASSWORD) {
                // حفظ حالة الدخول في المتصفح محلياً
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                errorMsg.textContent = '';
                passwordInput.value = '';
                showDashboard();
            } else {
                errorMsg.textContent = 'كلمة المرور غير صحيحة!';
            }
        });
    }

    // دعم الضغط على زر Enter لتسجيل الدخول
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginBtn.click();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('isAdminLoggedIn');
            showLogin();
        });
    }
}

function checkSession() {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
    if (isLoggedIn) {
        showDashboard();
    } else {
        showLogin();
    }
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'grid';
}

function showLogin() {
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
}
