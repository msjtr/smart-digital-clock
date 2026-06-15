// ============================================================================
// 💬 وحدة إدارة الرسائل المتقدمة (Advanced Messages & Live Preview)
// ============================================================================

import { saveJsonData } from "../js/storage.js";
import { hasPermission, applyPermissionsToContainer } from "../js/auth.js";
import { showToast } from "../js/utils.js";
import { broadcastUpdate } from "../js/sync.js";

export function renderMessages(systemState) {
    const pane = document.getElementById("messagesSettings");
    if (!pane) return;

    pane.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>💬 إدارة المحتوى والرسائل المتقدمة</h2>
            <span style="color: #94a3b8; font-weight: bold; background: #0f172a; padding: 5px 15px; border-radius: 20px; border: 1px solid #334155;">إجمالي الرسائل: ${systemState.messages.length}</span>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px;">
            
            <div style="background: #1e293b; padding: 20px; border-radius: 10px; border: 1px solid #334155;">
                <h3 style="margin-top: 0; color: #3b82f6; border-bottom: 1px solid #334155; padding-bottom: 10px;">بناء رسالة جديدة</h3>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div>
                        <label style="display:block; margin-bottom:5px; color:#cbd5e1;">نوع الرسالة</label>
                        <select id="msgType" style="width:100%; padding:10px; border-radius:5px; background:#0f172a; color:#fff; border:1px solid #334155;" data-permission="manage_messages">
                            <option value="إعلان 📢">إعلان 📢</option>
                            <option value="تنبيه 🔔">تنبيه 🔔</option>
                            <option value="خبر عاجل 🚨">خبر عاجل 🚨</option>
                            <option value="تهنئة 🎉">تهنئة 🎉</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:5px; color:#cbd5e1;">الأولوية</label>
                        <select id="msgPriority" style="width:100%; padding:10px; border-radius:5px; background:#0f172a; color:#fff; border:1px solid #334155;" data-permission="manage_messages">
                            <option value="متوسطة" selected>متوسطة</option>
                            <option value="عالية">عالية</option>
                            <option value="عاجلة">عاجلة</option>
                        </select>
                    </div>
                </div>

                <input type="text" id="msgTitle" placeholder="عنوان الرسالة..." 
                       style="width: calc(100% - 22px); padding: 10px; margin-bottom: 15px; border-radius: 5px; background: #0f172a; color: #fff; border: 1px solid #334155;" data-permission="manage_messages">
                
                <textarea id="msgContent" placeholder="اكتب محتوى الرسالة هنا..." rows="4" 
                          style="width: calc(100% - 22px); padding: 10px; margin-bottom: 15px; border-radius: 5px; background: #0f172a; color: #fff; border: 1px solid #334155; resize: vertical;" data-permission="manage_messages"></textarea>

                <button id="saveAdvancedMsgBtn" class="btn-primary" style="width: 100%; padding: 12px; font-size: 1.1rem; font-weight: bold;" data-permission="manage_messages">💾 حفظ ونشر الرسالة</button>
            </div>

            <div style="background: #0f172a; padding: 20px; border-radius: 10px; border: 2px dashed #334155; display: flex; flex-direction: column;">
                <h3 style="margin-top: 0; color: #94a3b8; text-align: center; margin-bottom: 20px;">المعاينة الحية</h3>
                <div id="livePreviewCard" style="width: 100%; background: #3b82f6; color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);">
                    <h3 id="previewTitle" style="margin: 0 0 10px 0; font-size: 1.4rem;">عنوان الرسالة</h3>
                    <p id="previewContent" style="margin: 0;">محتوى الرسالة يظهر هنا...</p>
                </div>
            </div>
        </div>

        <div style="background: #1e293b; border-radius: 10px; overflow: hidden; border: 1px solid #334155;">
            <div style="padding: 15px 20px; background: #0f172a; border-bottom: 1px solid #334155; font-weight: bold; color: #f8fafc;">📋 الرسائل النشطة</div>
            <ul id="messagesList" style="list-style: none; padding: 0; margin: 0;">
                ${systemState.messages.length === 0 ? '<li style="padding: 20px; text-align: center; color: #94a3b8;">لا توجد رسائل</li>' : ''}
                ${systemState.messages.map((msg, index) => `
                    <li style="display: flex; justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid #334155;">
                        <span>${msg.title || msg}</span>
                        <button class="btn-danger delete-msg-btn" data-index="${index}" data-permission="manage_messages">🗑️</button>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    applyPermissionsToContainer(pane);
    bindEvents(systemState);
}

function bindEvents(systemState) {
    // تحديث المعاينة لحظياً
    const titleInput = document.getElementById("msgTitle");
    const contentInput = document.getElementById("msgContent");
    titleInput?.addEventListener("input", () => document.getElementById("previewTitle").textContent = titleInput.value || "عنوان الرسالة");
    contentInput?.addEventListener("input", () => document.getElementById("previewContent").textContent = contentInput.value || "محتوى الرسالة...");

    // حفظ الرسالة
    document.getElementById("saveAdvancedMsgBtn")?.addEventListener("click", async () => {
        const advancedMsg = {
            title: titleInput.value,
            content: contentInput.value,
            timestamp: Date.now()
        };
        systemState.messages.push(advancedMsg);
        await saveJsonData("messages", { list: systemState.messages });
        broadcastUpdate("UPDATE_MESSAGES", systemState.messages);
        showToast("تم الحفظ بنجاح", "success");
        renderMessages(systemState);
    });
}
