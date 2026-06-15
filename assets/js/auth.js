// ============================================================================
// Authentication & RBAC Manager - نظام المصادقة والصلاحيات
// ============================================================================

import { showToast } from "./utils.js";

// قاعدة بيانات المستخدمين
const USERS = [
    { username: "superadmin", password: "123456", role: "super_admin" },
    { username: "admin", password: "123456", role: "admin" },
    { username: "viewer", password: "123456", role: "viewer" }
];

// مفاتيح الصلاحيات لكل دور
const ROLE_PERMISSIONS = {
    super_admin: ["all"], 
    admin: [
        "view_stats", "manage_display", "manage_messages", "manage_news", 
        "manage_occasions", "manage_content", "manage_slides", "manage_countdown", 
        "toggle_weather", "toggle_prayers", "edit_qr", "create_backup"
    ],
    viewer: [
        "view_stats", "view_logs", "view_content"
    ]
};

const SESSION_KEY = "current_user_session";

export function initAuth() {
    console.log("🔒 محرك المصادقة والصلاحيات: بدء التهيئة...");

    const loginBtn = document.getElementById("loginBtn");
    const usernameInput = document.getElementById("adminUsername");
    const passwordInput = document.getElementById("adminPassword");
    const loginScreen = document.getElementById("loginScreen");
    const dashboard = document.getElementById("adminDashboard");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!loginScreen || !dashboard) {
        console.info("ℹ️ Auth: شاشة الدخول غير متوفرة هنا.");
        return;
    }

    let currentUser = null;
    try {
        const sessionData = sessionStorage.getItem(SESSION_KEY);
        if (sessionData) currentUser = JSON.parse(sessionData);
    } catch (e) {
        sessionStorage.removeItem(SESSION_KEY);
    }

    if (currentUser) {
        showDashboard(loginScreen, dashboard, currentUser);
    } else {
        dashboard.style.display = "none";
        loginScreen.style.display = "flex";
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const username = usernameInput ? usernameInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value.trim() : "";
            const user = USERS.find(u => u.username === username && u.password === password);

            if (user) {
                const sessionData = { username: user.username, role: user.role };
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                showDashboard(loginScreen, dashboard, sessionData);
                showToast(`أهلاً بك، ${user.username}`, "success");
            } else {
                showToast("بيانات الدخول غير صحيحة", "error");
                if (passwordInput) passwordInput.value = "";
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem(SESSION_KEY);
            window.location.reload();
        });
    }

    passwordInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") loginBtn.click();
    });
}

function showDashboard(screen, dash, user) {
    if (screen) screen.style.display = "none";
    if (dash) {
        dash.style.display = "flex";
        document.body.setAttribute("data-role", user.role);
        applyPermissionsToUI(user.role);
    }
}

export function hasPermission(permissionKey) {
    let user = null;
    try {
        const sessionData = sessionStorage.getItem(SESSION_KEY);
        if (sessionData) user = JSON.parse(sessionData);
    } catch (e) { return false; }

    if (!user) return false;
    const rolePerms = ROLE_PERMISSIONS[user.role] || [];
    return rolePerms.includes("all") || rolePerms.includes(permissionKey);
}

function applyPermissionsToUI(role) {
    const elements = document.querySelectorAll("[data-permission]");
    elements.forEach(el => {
        const requiredPerm = el.getAttribute("data-permission");
        if (!hasPermission(requiredPerm)) {
            if (["BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(el.tagName)) {
                el.disabled = true;
                el.style.opacity = "0.5";
                el.style.cursor = "not-allowed";
            } else {
                el.style.display = "none";
            }
        }
    });
}

export function applyPermissionsToContainer(container) {
    if (!container) return;
    const elements = container.querySelectorAll("[data-permission]");
    elements.forEach(el => {
        const requiredPerm = el.getAttribute("data-permission");
        if (!hasPermission(requiredPerm)) {
            if (["BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(el.tagName)) {
                el.disabled = true;
                el.style.opacity = "0.5";
                el.style.cursor = "not-allowed";
            } else {
                el.style.display = "none";
            }
        }
    });
}
