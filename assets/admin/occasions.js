// ============================================================================
// وحدة الإدارة - (تم إنشاء هذا الملف لضمان استقرار النظام)
// ============================================================================

import { saveJsonData } from "../js/storage.js";
import { applyPermissionsToContainer } from "../js/auth.js";
import { showToast } from "../js/utils.js";

// تأكد أن اسم الدالة يطابق الاسم المستدعى في admin.js
export function renderCountdown(systemState) {
    const pane = document.getElementById("countdownSettings"); // غيّر الـ ID حسب الملف
    if (!pane) return;

    pane.innerHTML = `
        <div style="padding: 20px; color: #94a3b8; text-align: center;">
            <h2>🛠️ هذه الوحدة قيد التطوير</h2>
            <p>سيتم تفعيل إعدادات هذا القسم قريباً.</p>
        </div>
    `;

    applyPermissionsToContainer(pane);
}
