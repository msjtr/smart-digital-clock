// ============================================================================
// Admin Master Controller - المحرك الرئيسي للوحة التحكم (مع دعم الصلاحيات)
// ============================================================================

import { fetchJsonData } from "./storage.js";
import { initAuth, hasPermission } from "./auth.js"; 
import { getOccasions } from "./occasions.js";
import { showToast } from "./utils.js";

// متغير عام لتخزين بيانات النظام لتسهيل الوصول إليها
let systemData = {
    messages: [],
    occasions: [],
    usersCount: 3 // رقم افتراضي لحين بناء شاشة إدارة المستخدمين
};

export async function initAdmin() {
    console.log("🛠️ جاري تهيئة لوحة التحكم...");
    initAuth();
    
    if (sessionStorage.getItem("current_user_session") !== null) {
        await loadSystemData();
        setupTabs();
        renderDashboardStats();
        
        // تشغيل واجهة الرسائل
        renderMessages(); 
    }
}
    // 1. تشغيل المصادقة (وتطبيق الصلاحيات الأولية على الـ HTML الثابت)
    initAuth();
    
    // 2. إذا لم يكن المستخدم مسجلاً للدخول، يتم إيقاف تحميل باقي البيانات
    if (sessionStorage.getItem("current_user_session") !== null) {
        await loadSystemData();
        setupTabs();
        renderDashboardStats();
        
        // سيتم استدعاء دوال رسم باقي الأقسام هنا في الخطوات القادمة
        // renderMessages();
        // renderOccasions();
    }
}

// ============================================================================
// تحميل البيانات الأساسية للإحصائيات
// ============================================================================
async function loadSystemData() {
    try {
        const msgs = await fetchJsonData("messages");
        systemData.messages = Array.isArray(msgs) ? msgs : [];
        
        const occs = await getOccasions();
        systemData.occasions = Array.isArray(occs) ? occs : [];
    } catch (error) {
        console.error("❌ خطأ في تحميل بيانات النظام:", error);
    }
}

// ============================================================================
// نظام التنقل بين التبويبات (Tabs)
// ============================================================================
function setupTabs() {
    const tabs = document.querySelectorAll(".sidebar-menu li[data-tab]");
    const panes = document.querySelectorAll(".tab-pane");
    
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // منع النقر والتنقل إذا كان التبويب مخفياً بسبب الصلاحيات
            if (window.getComputedStyle(tab).display === "none") return;

            // إزالة التفعيل من جميع التبويبات
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => { 
                p.classList.remove("active"); 
                p.style.display = "none"; 
            });

            // تفعيل التبويب المطلوب
            tab.classList.add("active");
            const targetId = tab.getAttribute("data-tab");
            const targetPane = document.getElementById(targetId);
            
            if (targetPane) {
                targetPane.classList.add("active");
                targetPane.style.display = "block";
            }
        });
    });
}

// ============================================================================
// بناء شاشة الإحصائيات (Dashboard)
// ============================================================================
function renderDashboardStats() {
    const dashboardPane = document.getElementById("mainDashboard");
    if (!dashboardPane) return;

    // استخراج معلومات المستخدم الحالي من الجلسة
    const sessionStr = sessionStorage.getItem("current_user_session");
    const user = sessionStr ? JSON.parse(sessionStr) : { role: "viewer", username: "زائر" };

    const roleName = 
        user.role === "super_admin" ? "مدير نظام أعلى (Super Admin)" :
        user.role === "admin" ? "مدير محتوى (Admin)" : "مشاهد (Viewer)";

    // بناء الواجهة (HTML) للإحصائيات ديناميكياً
    dashboardPane.innerHTML = `
        <div style="margin-bottom: 30px; padding: 20px; background: var(--bg-card, #1e293b); border-radius: 10px; border-left: 5px solid var(--primary, #3b82f6);">
            <h2 style="margin:0 0 10px 0;">مرحباً، ${user.username} 👋</h2>
            <p style="margin:0; color: var(--text-muted, #94a3b8);">الصلاحية الحالية: <strong>${roleName}</strong></p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
            <div class="stat-card" style="background: rgba(59, 130, 246, 0.1); padding: 20px; border-radius: 10px; text-align: center; border: 1px solid rgba(59, 130, 246, 0.2);">
                <h3 style="margin-bottom: 10px;">الرسائل النشطة</h3>
                <p style="font-size: 2.5rem; font-weight: bold; margin: 0; color: #3b82f6;">${systemData.messages.length}</p>
            </div>
            
            <div class="stat-card" style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 10px; text-align: center; border: 1px solid rgba(16, 185, 129, 0.2);">
                <h3 style="margin-bottom: 10px;">المناسبات</h3>
                <p style="font-size: 2.5rem; font-weight: bold; margin: 0; color: #10b981;">${systemData.occasions.length}</p>
            </div>

            <div class="stat-card" style="background: rgba(245, 158, 11, 0.1); padding: 20px; border-radius: 10px; text-align: center; border: 1px solid rgba(245, 158, 11, 0.2);">
                <h3 style="margin-bottom: 10px;">حالة النظام</h3>
                <p style="font-size: 1.5rem; font-weight: bold; margin: 0; color: #f59e0b; margin-top: 15px;">متصل 🟢</p>
            </div>
            
            <div class="stat-card" data-permission="manage_users" style="background: rgba(139, 92, 246, 0.1); padding: 20px; border-radius: 10px; text-align: center; border: 1px solid rgba(139, 92, 246, 0.2);">
                <h3 style="margin-bottom: 10px;">المستخدمين</h3>
                <p style="font-size: 2.5rem; font-weight: bold; margin: 0; color: #8b5cf6;">${systemData.usersCount}</p>
            </div>
        </div>

        <div style="background: var(--bg-card, #1e293b); padding: 20px; border-radius: 10px;">
            <h3>إجراءات سريعة ⚡</h3>
            <p style="color: #94a3b8; margin-bottom: 15px;">آخر تحديث للبيانات: ${new Date().toLocaleTimeString('ar-SA')}</p>
            <button class="btn-primary" onclick="location.reload()">تحديث البيانات</button>
            <button class="btn-danger" data-permission="manage_settings" style="margin-right:10px;">إعادة تشغيل النظام</button>
        </div>
    `;

    // تطبيق فلتر الصلاحيات على العناصر التي تم إنشاؤها للتو بداخل هذه الشاشة
    applyPermissionsToContainer(dashboardPane);
}

// ============================================================================
// دالة مساعدة لتطبيق الصلاحيات ديناميكياً
// ============================================================================
function applyPermissionsToContainer(container) {
    const elements = container.querySelectorAll("[data-permission]");
    
    elements.forEach(el => {
        const requiredPerm = el.getAttribute("data-permission");
        
        if (!hasPermission(requiredPerm)) {
            if (el.tagName === "BUTTON" || el.tagName === "INPUT") {
                // للنماذج والأزرار: تعطيلها لتبقى مرئية ولكن غير قابلة للاستخدام (كإجراء أمني إضافي)
                el.disabled = true;
                el.style.opacity = "0.5";
                el.style.cursor = "not-allowed";
                el.title = "لا تملك صلاحية للقيام بهذا الإجراء";
            } else {
                // للبطاقات والأقسام (مثل بطاقة المستخدمين): إخفاؤها بالكامل
                el.style.display = "none";
            }
        }
    });
}

// تنفيذ النظام عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", initAdmin);

// ============================================================================
// إدارة الرسائل (Messages Management)
// ============================================================================
import { saveJsonData } from "./storage.js";

function renderMessages() {
    const pane = document.getElementById("messagesSettings");
    if (!pane) return;

    // رسم واجهة الرسائل
    pane.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>💬 إدارة الرسائل</h2>
            <span style="color: var(--text-muted);">إجمالي الرسائل: ${systemData.messages.length}</span>
        </div>
        
        <div style="display: flex; gap: 10px; margin-bottom: 30px; background: #1e293b; padding: 20px; border-radius: 10px;">
            <input type="text" id="newMessageInput" placeholder="اكتب رسالة جديدة هنا..." 
                   style="flex: 1; padding: 12px; border-radius: 5px; border: 1px solid #334155; background: #0f172a; color: #fff;"
                   data-permission="manage_messages">
            <button id="addMessageBtn" class="btn-primary" data-permission="manage_messages">➕ إضافة رسالة</button>
        </div>

        <div style="background: #1e293b; border-radius: 10px; overflow: hidden;">
            <ul id="messagesList" style="list-style: none; padding: 0; margin: 0;">
                ${systemData.messages.length === 0 ? '<li style="padding: 20px; text-align: center; color: #94a3b8;">لا توجد رسائل حالياً</li>' : ''}
                
                ${systemData.messages.map((msg, index) => `
                    <li style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #334155;">
                        <span style="font-size: 1.1rem;">${msg}</span>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn-danger delete-msg-btn" data-index="${index}" data-permission="manage_messages" style="padding: 8px 12px; font-size: 0.9rem;">🗑️ حذف</button>
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    // تطبيق الصلاحيات ديناميكياً لإخفاء/تعطيل أزرار الحذف والإضافة للمشاهدين
    applyPermissionsToContainer(pane);

    // ربط الأحداث (Event Listeners)
    bindMessagesEvents();
}

function bindMessagesEvents() {
    // 1. إضافة رسالة
    const addBtn = document.getElementById("addMessageBtn");
    const input = document.getElementById("newMessageInput");

    if (addBtn && input) {
        addBtn.addEventListener("click", async () => {
            const val = input.value.trim();
            if (val) {
                systemData.messages.push(val);
                await saveJsonData("messages", systemData.messages);
                showToast("تمت إضافة الرسالة بنجاح", "success");
                renderMessages(); // إعادة رسم القائمة
                renderDashboardStats(); // تحديث العداد في الرئيسية
            } else {
                showToast("الرجاء كتابة محتوى الرسالة", "error");
            }
        });

        // دعم زر Enter
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") addBtn.click();
        });
    }

    // 2. حذف رسالة
    const deleteButtons = document.querySelectorAll(".delete-msg-btn");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            // نتحقق من الصلاحية مرة أخرى برمجياً كطبقة حماية ثانية
            if (!hasPermission("manage_messages")) return;

            const index = parseInt(e.target.getAttribute("data-index"));
            if (confirm("هل أنت متأكد من حذف هذه الرسالة؟")) {
                systemData.messages.splice(index, 1);
                await saveJsonData("messages", systemData.messages);
                showToast("تم حذف الرسالة", "success");
                renderMessages(); 
                renderDashboardStats();
            }
        });
    });
}
