import { initAuth } from "./auth.js";

export function initAdmin() {
    console.log("✅ تم تهيئة نظام الإدارة");

    // 1. نظام التنقل بين التبويبات
    const menuItems = document.querySelectorAll(".sidebar-menu li[data-tab]");
    const tabContents = document.querySelectorAll(".tab-pane");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(i => i.classList.remove("active"));
            tabContents.forEach(t => {
                t.classList.remove("active");
                t.style.display = "none";
            });

            item.classList.add("active");
            const target = document.getElementById(item.dataset.tab);
            if (target) {
                target.classList.add("active");
                target.style.display = "block";
            }
        });
    });

    // 2. تفعيل زر حفظ الإعدادات في "إدارة العرض"
    const displaySaveBtn = document.querySelector("#displayManager .btn-primary");
    displaySaveBtn?.addEventListener("click", () => {
        alert("تم حفظ الإعدادات بنجاح!");
        // هنا يمكنك إضافة استدعاء لـ saveToLocal
    });

    // 3. ربط زر الخروج
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        sessionStorage.removeItem("admin_session");
        window.location.reload();
    });
}
