// ============================================================================
// 🎉 وحدة إدارة المناسبات والأحداث (Occasions Management)
// ============================================================================

import { saveJsonData } from "../storage.js";
import { hasPermission, applyPermissionsToContainer } from "../auth.js";
import { showToast } from "../utils.js";
import { broadcastUpdate } from "../sync.js";

export function renderOccasions(systemState) {
    const pane = document.getElementById("occasionsSettings");
    if (!pane) return;

    pane.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>🎉 إدارة المناسبات والأحداث الكبرى</h2>
            <span style="color: #94a3b8; font-weight: bold; background: #0f172a; padding: 5px 15px; border-radius: 20px; border: 1px solid #334155;">إجمالي المناسبات: ${systemState.occasions.length}</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px; margin-bottom: 30px;">
            
            <div style="background: #1e293b; padding: 20px; border-radius: 10px; border: 1px solid #334155;">
                <h3 style="margin-top: 0; color: #10b981; border-bottom: 1px solid #334155; padding-bottom: 10px;">إضافة مناسبة جديدة</h3>

                <label style="display:block; margin-bottom:5px; color:#cbd5e1;">اسم المناسبة</label>
                <input type="text" id="occTitle" placeholder="مثال: بداية الاختبارات النهائية..." 
                       style="width: calc(100% - 22px); padding: 10px; margin-bottom: 15px; border-radius: 5px; background: #0f172a; color: #fff; border: 1px solid #334155;" data-permission="manage_occasions">
                
                <label style="display:block; margin-bottom:5px; color:#cbd5e1;">تاريخ ووقت المناسبة</label>
                <input type="datetime-local" id="occDate" 
                       style="width: calc(100% - 22px); padding: 10px; margin-bottom: 20px; border-radius: 5px; background: #0f172a; color: #fff; border: 1px solid #334155; color-scheme: dark;" data-permission="manage_occasions">

                <button id="saveOccasionBtn" class="btn-primary" style="width: 100%; padding: 12px; font-size: 1.1rem; font-weight: bold; background: #10b981; border: none; color: white; border-radius: 5px; cursor: pointer;" data-permission="manage_occasions">➕ حفظ المناسبة</button>
            </div>

            <div style="background: #1e293b; border-radius: 10px; overflow: hidden; border: 1px solid #334155;">
                <div style="padding: 15px 20px; background: #0f172a; border-bottom: 1px solid #334155; font-weight: bold; color: #f8fafc;">📅 المناسبات المجدولة</div>
                <ul id="occasionsList" style="list-style: none; padding: 0; margin: 0;">
                    ${systemState.occasions.length === 0 ? '<li style="padding: 20px; text-align: center; color: #94a3b8;">لا توجد مناسبات مجدولة حالياً</li>' : ''}
                    
                    ${systemState.occasions.map((occ, index) => {
                        const title = typeof occ === 'string' ? occ : occ.title;
                        const dateStr = typeof occ === 'string' ? '' : occ.date;
                        
                        // حساب الأيام المتبقية
                        let timeBadge = '';
                        if (dateStr) {
                            const diff = new Date(dateStr) - new Date();
                            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                            if (days > 0) {
                                timeBadge = `<span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; margin-right: 10px;">باقي ${days} يوم</span>`;
                            } else if (days === 0) {
                                timeBadge = `<span style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; margin-right: 10px;">اليوم!</span>`;
                            } else {
                                timeBadge = `<span style="background: rgba(239, 68, 68, 0.2); color: #ef4444; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; margin-right: 10px;">منتهية</span>`;
                            }
                        }

                        return `
                        <li style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #334155;">
                            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 5px;">
                                <span style="font-size: 1.1rem; color: #e2e8f0; font-weight: bold;">${title}</span>
                                ${timeBadge}
                                ${dateStr ? `<span style="display: block; width: 100%; font-size: 0.85rem; color: #94a3b8; margin-top: 5px;">${new Date(dateStr).toLocaleString('ar-SA')}</span>` : ''}
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button class="btn-danger delete-occ-btn" data-index="${index}" data-permission="manage_occasions" style="padding: 8px 12px; font-size: 0.9rem;">🗑️ حذف</button>
                            </div>
                        </li>
                    `}).join('')}
                </ul>
            </div>
        </div>
    `;

    applyPermissionsToContainer(pane);
    bindOccasionsEvents(systemState);
}

function bindOccasionsEvents(systemState) {
    const titleInput = document.getElementById("occTitle");
    const dateInput = document.getElementById("occDate");
    const saveBtn = document.getElementById("saveOccasionBtn");

    if (saveBtn) {
        saveBtn.addEventListener("click", async () => {
            if (!hasPermission("manage_occasions")) return;

            const title = titleInput.value.trim();
            const dateVal = dateInput.value;

            if (!title || !dateVal) {
                showToast("الرجاء كتابة اسم المناسبة وتحديد التاريخ", "error");
                return;
            }

            saveBtn.disabled = true;
            saveBtn.textContent = "جاري الحفظ...";

            const newOccasion = {
                title: title,
                date: dateVal,
                timestamp: Date.now()
            };

            systemState.occasions.push(newOccasion);
            
            // ترتيب المناسبات زمنياً (الأقرب أولاً)
            systemState.occasions.sort((a, b) => new Date(a.date) - new Date(b.date));

            const isSaved = await saveJsonData("occasions", { list: systemState.occasions });
            
            if (isSaved) {
                if(typeof broadcastUpdate === 'function') {
                    broadcastUpdate("UPDATE_OCCASIONS", systemState.occasions);
                }
                showToast("تم جدولة المناسبة بنجاح", "success");
                
                titleInput.value = "";
                dateInput.value = "";
                
                renderOccasions(systemState); 
            } else {
                showToast("حدث خطأ أثناء حفظ المناسبة", "error");
                saveBtn.disabled = false;
                saveBtn.textContent = "➕ حفظ المناسبة";
            }
        });
    }

    const deleteButtons = document.querySelectorAll(".delete-occ-btn");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", async (e) => {
            if (!hasPermission("manage_occasions")) return;

            const index = parseInt(e.target.getAttribute("data-index"));
            if (confirm("هل أنت متأكد من حذف هذه المناسبة؟")) {
                
                const backupOccasions = [...systemState.occasions];
                systemState.occasions.splice(index, 1);
                
                const isDeleted = await saveJsonData("occasions", { list: systemState.occasions });
                
                if (isDeleted) {
                    if(typeof broadcastUpdate === 'function') {
                        broadcastUpdate("UPDATE_OCCASIONS", systemState.occasions);
                    }
                    showToast("تم الحذف بنجاح", "success");
                    renderOccasions(systemState); 
                } else {
                    systemState.occasions = backupOccasions;
                    showToast("حدث خطأ أثناء الحذف", "error");
                }
            }
        });
    });
}
