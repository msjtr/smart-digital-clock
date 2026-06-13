// ============================================================================
// Admin Panel Controller - المنسق الرئيسي للوحة الإدارة
// ============================================================================

import { initAuth } from "./auth.js";
import { getFromLocal, saveToLocal } from "./storage.js";
import { applySettings } from "./settings.js";

export function initAdmin() {
    console.log("✅ جاري تهيئة لوحة الإدارة...");

    // 1. تهيئة نظام الدخول أولاً
    initAuth();

    // 2. تهيئة المكونات
    initTabs();
    initAdminClock();
    initSidebar();
    initDisplayManager();

    console.log("🚀 لوحة الإدارة جاهزة للعمل.");
}

// ============================================================================
// Tabs Manager (نظام التنقل بين التبويبات)
// ============================================================================
function initTabs() {
    const menuItems = document.querySelectorAll(".sidebar-menu li[data-tab]");
    const tabContents = document.querySelectorAll(".tab-pane");
    const pageTitle = document.querySelector(".page-title");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            // إزالة التفعيل من الكل
            menuItems.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(tab => {
                tab.classList.remove("active");
                tab.style.display = "none";
            });

            // تفعيل التبويب المختار
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
        clock.textContent = new Date().toLocaleTimeString("ar-SA", {
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
// Display Manager (نظام حفظ الإعدادات)
// ============================================================================
function initDisplayManager() {
    const saveBtn = document.querySelector("#displayManager .btn-primary");
    if (!saveBtn) return;

    saveBtn.addEventListener("click", () => {
        const settings = getFromLocal("system_settings") || { features: {} };

        document.querySelectorAll("#displayManager input[type='checkbox']").forEach(checkbox => {
            const key = checkbox.dataset.setting;
            if (key) {
                settings.features[key] = checkbox.checked;
            }
        });

        saveToLocal("system_settings", settings);
        applySettings(settings); // تحديث العرض في الوقت الفعلي
        
        // إظهار رسالة النجاح
        const originalText = saveBtn.textContent;
        saveBtn.textContent = "✅ تم الحفظ";
        saveBtn.disabled = true;
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }, 2000);
    });
}
