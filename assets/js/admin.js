// ============================================================================
// Admin Panel Controller - النسخة النهائية
// ============================================================================

import { getFromLocal, saveToLocal } from "./storage.js";
import { applySettings } from "./settings.js";

export function initAdmin() {
    initTabs();
    initAdminClock();
    initSidebar();
    initDisplayManager();
    console.log("✅ تم تهيئة لوحة الإدارة");
}

// ============================================================================
// Tabs Manager
// ============================================================================
function initTabs() {
    const menuItems = document.querySelectorAll(".sidebar-menu li[data-tab]");
    const tabContents = document.querySelectorAll(".tab-pane");
    const pageTitle = document.querySelector(".page-title");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(tab => {
                tab.classList.remove("active");
                tab.style.display = "none";
            });

            item.classList.add("active");
            const targetId = item.dataset.tab;
            const targetTab = document.getElementById(targetId);

            if (targetTab) {
                targetTab.classList.add("active");
                targetTab.style.display = "block";
            }
            if (pageTitle) pageTitle.textContent = item.textContent.trim();
        });
    });
}

// ============================================================================
// Admin Clock
// ============================================================================
function initAdminClock() {
    const clock = document.getElementById("adminCurrentTime");
    if (!clock) return;

    const updateClock = () => {
        // تنسيق ساعة ثابت بالعربية
        clock.textContent = new Date().toLocaleTimeString("ar-EG", { 
            hour: "2-digit", minute: "2-digit", second: "2-digit" 
        });
    };
    updateClock();
    setInterval(updateClock, 1000);
}

// ============================================================================
// Sidebar Toggle
// ============================================================================
function initSidebar() {
    const toggleBtn = document.getElementById("toggleSidebar");
    const sidebar = document.querySelector(".admin-sidebar");

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
            sidebar.classList.toggle("sidebar-hidden");
        });
    }
}

// ============================================================================
// Display Manager (Save System)
// ============================================================================
function initDisplayManager() {
    const saveBtn = document.querySelector("#displayManager .btn-primary");
    if (!saveBtn) return;

    saveBtn.addEventListener("click", () => {
        const settings = getFromLocal("system_settings") || { features: {} };
        
        document.querySelectorAll("#displayManager input[type='checkbox']").forEach(checkbox => {
            const key = checkbox.dataset.setting; // تأكد أن الـ HTML يحتوي على data-setting="clock" مثلاً
            if (key) {
                settings.features[key] = checkbox.checked;
            }
        });

        saveToLocal("system_settings", settings);
        applySettings(settings);
        refreshPreview();
        showSavedMessage(saveBtn);
    });
}

// ============================================================================
// Helpers
// ============================================================================
function refreshPreview() {
    const frame = document.getElementById("livePreviewFrame");
    if (frame?.contentWindow) frame.contentWindow.location.reload();
}

function showSavedMessage(button) {
    const oldText = button.textContent;
    button.textContent = "✅ تم الحفظ";
    button.disabled = true;
    setTimeout(() => {
        button.textContent = oldText;
        button.disabled = false;
    }, 2000);
}
