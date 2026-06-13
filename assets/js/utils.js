// assets/js/auth.js
export function initAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const passwordInput = document.getElementById('adminPassword');
    const errorMsg = document.getElementById('loginError');

    // التحقق من حالة الجلسة عند تحميل الصفحة
    checkSession();

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (passwordInput.value === '123') { // كلمة المرور
                sessionStorage.setItem('isAdminLoggedIn', 'true');
                if(errorMsg) errorMsg.textContent = '';
                passwordInput.value = '';
                showDashboard();
            } else {
                if(errorMsg) errorMsg.textContent = 'كلمة المرور غير صحيحة!';
            }
        });
    }

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
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    if (loginScreen) loginScreen.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'flex';
}

function showLogin() {
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    if (adminDashboard) adminDashboard.style.display = 'none';
    if (loginScreen) loginScreen.style.display = 'flex';
}
