// ============================================================================
// 📂 وحدة إدارة المحتوى والوسائط (Content Management)
// ============================================================================

import { fetchJsonData, saveJsonData } from "../js/storage.js";
import { applyPermissionsToContainer } from "../js/auth.js";
import { showToast } from "../js/utils.js";

export async function renderContent(systemState) {
    const pane = document.getElementById("contentSettings");
    if (!pane) return;

    // جلب بيانات المحتوى الموجودة مسبقاً
    const contentData = await fetchJsonData("content") || { files: [] };

    pane.innerHTML = `
        <div style="margin-bottom: 25px;">
            <h2>📂 إدارة المحتوى والوسائط</h2>
            <p style="color: #94a3b8;">إدارة الملفات المرفوعة للعرض على الشاشة الرقمية.</p>
        </div>

        <div style="background: #1e293b; padding: 25px; border-radius: 10px; border: 2px dashed #334155; text-align: center; margin-bottom: 30px;">
            <h3 style="color: #cbd5e1; margin-top: 0;">رفع ملف جديد</h3>
            <input type="file" id="mediaUploader" style="margin: 15px 0; color: #fff;" data-permission="manage_content">
            <button id="uploadBtn" class="btn-primary" data-permission="manage_content">⬆️ رفع الملف</button>
        </div>

        <div style="background: #1e293b; border-radius: 10px; overflow: hidden; border: 1px solid #334155;">
            <div style="padding: 15px 20px; background: #0f172a; border-bottom: 1px solid #334155; font-weight: bold; color: #f8fafc;">📋 الملفات المتاحة</div>
            <ul id="filesList" style="list-style: none; padding: 0; margin: 0;">
                ${contentData.files.length === 0 ? '<li style="padding: 20px; text-align: center; color: #94a3b8;">لا توجد ملفات مرفوعة حالياً</li>' : 
                contentData.files.map((file, index) => `
                    <li style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #334155;">
                        <span style="color: #e2e8f0;">${file.name}</span>
                        <button class="btn-danger delete-file-btn" data-index="${index}" data-permission="manage_content" style="padding: 5px 10px;">🗑️ حذف</button>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;

    // تفعيل الصلاحيات
    applyPermissionsToContainer(pane);

    // تفعيل وظيفة الحذف
    pane.querySelectorAll(".delete-file-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const index = parseInt(e.target.getAttribute("data-index"));
            contentData.files.splice(index, 1);
            await saveJsonData("content", contentData);
            showToast("تم حذف الملف بنجاح", "success");
            renderContent(systemState); // إعادة رسم الواجهة
        });
    });

    // تفعيل زر الرفع (محاكاة)
    const uploadBtn = document.getElementById("uploadBtn");
    uploadBtn.addEventListener("click", () => {
        const fileInput = document.getElementById("mediaUploader");
        if (fileInput.files.length > 0) {
            const newFile = { name: fileInput.files[0].name, date: new Date().toISOString() };
            contentData.files.push(newFile);
            saveJsonData("content", contentData).then(() => {
                showToast("تم رفع الملف بنجاح", "success");
                renderContent(systemState);
            });
        } else {
            showToast("الرجاء اختيار ملف أولاً", "error");
        }
    });
}
