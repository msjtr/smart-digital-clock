// ============================================================================
// Authentication & Permissions Manager
// ============================================================================

import { addLog } from "./logs.js";
import { showNotification } from "./notifications.js";

// ============================================================================
// Users Database
// ============================================================================

const USERS = [

    {
        username: "superadmin",
        password: "123456",
        role: "super_admin",
        permissions: ["all"]
    },

    {
        username: "admin",
        password: "123456",
        role: "admin",
        permissions: [
            "messages",
            "occasions",
            "content",
            "countdown",
            "settings",
            "weather",
            "prayers"
        ]
    },

    {
        username: "viewer",
        password: "123456",
        role: "viewer",
        permissions: [
            "view"
        ]
    }

];

// ============================================================================
// Init Auth
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

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );

    // فحص الجلسة الحالية

    if (isLoggedIn()) {

        showDashboard(
            loginScreen,
            dashboard
        );

        applyPermissions();

    }

    // تسجيل الدخول

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

                try {

                    addLog(
                        "فشل تسجيل الدخول",
                        username
                    );

                } catch (e) {}

                return;

            }

            sessionStorage.setItem(
                "admin_session",
                JSON.stringify(user)
            );

            try {

                addLog(
                    "تسجيل دخول",
                    `${user.username} (${user.role})`
                );

            } catch (e) {}

            try {

                showNotification(
                    "تم تسجيل الدخول بنجاح",
                    "success"
                );

            } catch (e) {}

            showDashboard(
                loginScreen,
                dashboard
            );

            applyPermissions();

        }
    );

    // تسجيل الخروج

    logoutBtn?.addEventListener(
        "click",
        logout
    );

    // زر Enter

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
// Logout
// ============================================================================

export function logout() {

    sessionStorage.removeItem(
        "admin_session"
    );

    try {

        addLog(
            "تسجيل خروج"
        );

    } catch (e) {}

    location.reload();

}

// ============================================================================
// Session Check
// ============================================================================

export function isLoggedIn() {

    return !!sessionStorage.getItem(
        "admin_session"
    );

}

// ============================================================================
// Current User
// ============================================================================

export function getCurrentUser() {

    const session =
        sessionStorage.getItem(
            "admin_session"
        );

    if (!session)
        return null;

    try {

        return JSON.parse(
            session
        );

    } catch {

        sessionStorage.removeItem(
            "admin_session"
        );

        return null;

    }

}

// ============================================================================
// Show Dashboard
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
// Permissions
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
// Hide Elements
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
