// ============================================================================
// 💬 وحدة إدارة الرسائل المتقدمة (Advanced Messages & Live Preview)
// ============================================================================

import { saveJsonData } from "../storage.js";
import { hasPermission, applyPermissionsToContainer } from "../auth.js";
import { showToast } from "../utils.js";
import { broadcastUpdate } from "../sync.js";

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
                            <option value="رسالة إرشادية 💡">رسالة إرشادية 💡</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:5px; color:#cbd5e1;">الأولوية</label>
                        <select id="msgPriority" style="width:100%; padding:10px; border-radius:5px; background:#0f172a; color:#fff; border:1px solid #334155;" data-permission="manage_messages">
                            <option value="منخفضة">منخفضة</option>
                            <option value="متوسطة" selected>متوسطة</option>
                            <option value="عالية">عالية</option>
                            <option value="عاجلة">عاجلة</option>
                        </select>
                    </div>
                </div>

                <input type="text" id="msgTitle" placeholder="عنوان الرسالة (مثال: تنبيه هام للطلاب)..." 
                       style="width: calc(100% - 22px); padding: 10px; margin-bottom: 15px; border-radius: 5px; background: #0f172a; color: #fff; border: 1px solid #334155;" data-permission="manage_messages">
                
                <textarea id="msgContent" placeholder="اكتب محتوى الرسالة أو الإعلان هنا..." rows="4" 
                          style="width: calc(100% - 22px); padding: 10px; margin-bottom: 15px; border-radius: 5px; background: #0f172a; color: #fff; border: 1px solid #334155; resize: vertical;" data-permission="manage_messages"></textarea>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div>
                        <label style="display:block; margin-bottom:5px; color:#cbd5e1;">لون الخلفية</label>
                        <input type="color" id="msgBgColor" value="#3b82f6" style="width:100%; height: 40px; border:none; cursor:pointer; background:transparent;" data-permission="manage_messages">
                    </div>
                    <div>
                        <label style="display:block; margin-bottom:5px; color:#cbd5e1;">لون النص</label>
                        <input type="color" id="msgTextColor" value="#ffffff" style="width:100%; height: 40px; border:none; cursor:pointer; background:transparent;" data-permission="manage_messages">
                    </div>
                </div>

                <button id="saveAdvancedMsgBtn" class="btn-primary" style="width: 100%; padding: 12px; font-size: 1.1rem; font-weight: bold;" data-permission="manage_messages">💾 حفظ ونشر الرسالة</button>
            </div>

            <div style="background: #0f172a; padding: 20px; border-radius: 10px; border: 2px dashed #334155; display: flex; flex-direction: column;">
                <h3 style="margin-top: 0; color: #94a3b8; text-align: center; margin-bottom: 20px;">المعاينة الحية</h3>
                
                <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 10px;">
                    <div id="livePreviewCard" style="width: 100%; background: #3b82f6; color: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3); transition: all 0.3s ease;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 8px;">
                            <span id="previewType" style="font-weight: bold; font-size: 0.9rem;">إعلان 📢</span>
                            <span id="previewPriority" style="font-size: 0.8rem; background: rgba(0,0,0,0.2); padding: 4px 10px; border-radius: 20px;">متوسطة</span>
                        </div>
                        <h3 id="previewTitle" style="margin: 0 0 10px 0; font-size: 1.4rem;">عنوان الرسالة</h3>
                        <p id="previewContent" style="margin: 0; font-size: 1.1rem; line-height: 1.6;">محتوى الرسالة سيظهر هنا بشكل حي ومباشر أثناء الكتابة...</p>
                    </div>
                </div>
            </div>
            
        </div>

        <div style="background: #1e293b; border-radius: 10px; overflow: hidden; border: 1px solid #334155;">
            <div style="padding: 15px 20px; background: #0f172a; border-bottom: 1px solid #334155; font-weight: bold; color: #f8fafc;">📋 الرسائل النشطة</div>
            <ul id="messagesList" style="list-style: none; padding: 0; margin: 0;">
                ${systemState.messages.length === 0 ? '<li style="padding: 20px; text-align: center; color: #94a3b8;">لا توجد رسائل حالياً</li>' : ''}
                
                ${systemState.messages.map((msg, index) => {
                    let displayText = typeof msg === 'string' ? msg : `[${msg.type || 'إعلان'}] ${msg.title || ''}`;
                    let bgCol = typeof msg === 'object' && msg.bgColor ? msg.bgColor : '#94a3b8'; // لون افتراضي للرسائل القديمة
                    
                    return `
                    <li style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #334155;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="display: inline-block; width: 15px; height: 15px; border-radius: 50%; background-color: ${bgCol}; border: 1px solid
