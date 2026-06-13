// ============================================================================
// Authentication & Permissions Manager
// ============================================================================

import { addLog } from "./logs.js";
import { showNotification } from "./notifications.js";

const USERS = [

    {
        username: "superadmin",
        password: "123456",
        role: "super_admin"
    },

    {
        username: "admin",
        password: "123456",
        role: "admin"
    },

    {
        username: "viewer",
        password: "123456",
        role: "viewer"
    }

];

// ============================================================================
// تشغيل النظام
// ============================================================================

export function initAuth() {

    console.log(
        "🔐 تم تشغيل نظام الدخول"
    );

    const loginBtn =
        document.getElementById(
            "loginBtn"
        );

    const usernameInput =
        document.getElementById(
            "adminUsername"
        );

    const passwordInput =
        document.getElementById(
            "adminPassword"
        );

    const errorMsg =
        document.getElementById(
            "loginError"
        );

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    const dashboard =
        document.getElementById(
            "adminDashboard"
        );

    if (
        isLoggedIn()
    ) {

        showDashboard(
            loginScreen,
            dashboard
        );

        applyPermissions();

    }

    loginBtn?.addEventListener(
        "click",
        () => {

            const username =
                usernameInput?.value
                ?.trim();

            const password =
                passwordInput?.value;

            const user =
                USERS.find(

                    u =>

                        u.username === username &&
                        u.password === password

                );

            if (!user) {

                if (errorMsg) {

                    errorMsg.textContent =
                        "بيانات الدخول غير صحيحة";

                }

                addLog(
                    "فشل تسجيل الدخول",
                    username
                );

                return;

            }

            sessionStorage.setItem(
                "admin_session",
                JSON.stringify(
                    user
                )
            );

            addLog(
                "تسجيل دخول",
                `${user.username} (${user.role})`
            );

            showNotification(
                "تم تسجيل الدخول بنجاح",
                "success"
            );

            showDashboard(
                loginScreen,
                dashboard
            );

            applyPermissions();

        }
    );

    passwordInput?.addEventListener(
        "keypress",
        e => {

            if (
                e.key === "Enter"
            ) {

                loginBtn?.click();

            }

        }
    );

}

// ============================================================================
// تسجيل خروج
// ============================================================================

export function logout() {

    sessionStorage.removeItem(
        "admin_session"
    );

    addLog(
        "تسجيل خروج"
    );

    location.reload();

}

// ============================================================================
// التحقق من الجلسة
// ============================================================================

export function isLoggedIn() {

    return !!sessionStorage.getItem(
        "admin_session"
    );

}

// ============================================================================
// المستخدم الحالي
// ============================================================================

export function getCurrentUser() {

    const session =
        sessionStorage.getItem(
            "admin_session"
        );

    if (!session)
        return null;

    return JSON.parse(
        session
    );

}

// ============================================================================
// عرض لوحة التحكم
// ============================================================================

function showDashboard(
    loginScreen,
    dashboard
) {

    if (loginScreen) {

        loginScreen.style.display =
            "none";

    }

    if (dashboard) {

        dashboard.style.display =
            "grid";

    }

}

// ============================================================================
// الصلاحيات
// ============================================================================

function applyPermissions() {

    const user =
        getCurrentUser();

    if (!user)
        return;

    document.body.dataset.role =
        user.role;

    if (
        user.role ===
        "viewer"
    ) {

        hideElements([
            ".btn-save",
            ".btn-delete",
            ".btn-edit",
            ".admin-settings",
            ".backup-tools"
        ]);

    }

    if (
        user.role ===
        "admin"
    ) {

        hideElements([
            ".super-admin-only"
        ]);

    }

}

// ============================================================================
// إخفاء عناصر
// ============================================================================

function hideElements(
    selectors
) {

    selectors.forEach(
        selector => {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(
                    el => {

                        el.style.display =
                            "none";

                    }
                );

        }
    );

}
