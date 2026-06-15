// ============================================================================
// 📊 وحدة الإحصائيات وحالة النظام (Dashboard)
// ============================================================================

import { hasPermission, applyPermissionsToContainer } from "../auth.js";

export function renderDashboardStats(systemState) {
    const dashboardPane = document.getElementById("mainDashboard");
    if (!dashboardPane) return;

    // جلب بيانات المستخدم الحالي من الجلسة
    const sessionStr = sessionStorage.getItem("current_user_session");
    const user = sessionStr ? JSON.parse(sessionStr) : { role: "viewer", username: "زائر" };

    // تحويل مسار الصلاحية إلى اسم عربي مفهوم
    const roleName = 
        user.role === "super_admin" ? "مدير نظام أعلى (Super Admin)" :
        user.role === "admin" ? "مدير محتوى (Admin)" : "مشاهد (Viewer)";

    // حساب الإحصائيات بأمان
    const messagesCount = systemState.messages ? systemState.messages.length : 0;
    const occasionsCount = systemState.occasions ? systemState.occasions.length : 0;

    dashboardPane.innerHTML = `
        <div style="margin-bottom: 30px; padding: 20px; background: #1e293b; border-radius: 10px; border-left: 5px solid #3b82f6; border: 1px solid #334155;">
            <h2 style="margin:0 0 10px 0; color: #f8fafc;">مرحباً، ${user.username} 👋</h2>
            <p style="margin:0; color: #94a3b8;">الصلاحية الحالية: <strong style="color: #e2e8f0;">${roleName}</strong></p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
            
            <div style="background: rgba(59, 130, 246, 0.1); padding: 20px; border-radius: 10px; text-align: center; border: 1px solid rgba(59, 130, 246, 0.2);">
                <h3 style="margin-bottom: 10px; color: #cbd5e1;">الرسائل النشطة</h3>
                <p style="font-size: 2.5rem; font-weight: bold; margin: 0; color: #3b82f6;">${messagesCount}</p>
            </div>
            
            <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 10px; text-align: center; border: 1px solid rgba(16, 185, 129, 0.2);">
                <h3 style="margin-bottom: 10px; color: #cbd5e1;">المناسبات</h3>
                <p style="font-size: 2.5rem; font-weight: bold; margin: 0; color: #10b981;">${occasionsCount}</p>
            </div>

            <div style="background: rgba(245, 158, 11, 0.1); padding: 20px; border-radius: 10px; text-align: center; border: 1px solid rgba(245, 158, 11, 0.2);">
                <h3 style="margin-bottom: 10px; color: #cbd5e1;">حالة النظام</h3>
                <p style="font-size: 1.5rem; font-weight: bold; margin: 0; color: #f59e0b; margin-top: 15px;">متصل 🟢</p>
            </div>
            
        </div>

        <div style="background: #1e293b; padding: 20px; border-radius: 10px; border: 1px solid #334155;">
            <h3 style="margin-top: 0; color: #f8fafc;">إجراءات سريعة ⚡</h3>
            <p style="color: #94a3b8; margin-bottom: 15px;">آخر تحديث للبيانات: <span dir="ltr">${new Date().toLocaleTimeString('ar-SA')}</span></p>
