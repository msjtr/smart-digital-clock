// ============================================================================
// 🎉 وحدة إدارة المناسبات والأحداث (Occasions Management)
// ============================================================================

import { saveJsonData } from "../js/storage.js";
import { hasPermission, applyPermissionsToContainer } from "../js/auth.js";
import { showToast } from "../js/utils.js";
import { broadcastUpdate } from "../js/sync.js";

export function renderOccasions(systemState) {
    const pane = document.getElementById("occasionsSettings");
    if (!pane) return;

    pane.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h2>🎉 إدارة المناسبات والأحداث</h2>
            <div style="background: #0f172a; padding: 10px 20px; border-radius: 20px; display: inline-block; border: 1px solid #334155;">
                إجمالي المناسبات: <strong>${systemState.occasions.length}</strong>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
            <div style="background: #1e293b; padding: 20px; border-radius: 10px; border: 1px solid #334155;">
                <h3 style="margin-top: 0; color: #10b981;">إضافة مناسبة</h3>
                <input type="text" id="occTitle" placeholder="اسم المناسبة..." style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 5px; background: #0f172a; color: #fff; border: 1px solid #334155;" data-permission="manage_occasions">
                <input type="datetime-local" id="occDate" style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 5px; background: #0f172a; color: #fff; border: 1px solid #334155; color-scheme: dark;" data-permission="manage_occasions">
                <button id="saveOccasionBtn" class="btn-primary" style="width: 100%; padding: 10px;" data-permission="manage_occasions">➕ حفظ</button>
            </div>

            <div style="background: #1e293b; border-radius: 10px; border: 1px solid #334155;">
                <ul id="occasionsList" style="list-style: none; padding: 0; margin: 0;">
                    ${systemState.occasions.map((occ, index) => `
                        <li style="padding: 15px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="display: block; color: #fff;">${occ.title}</strong>
                                <small style="color: #94a3b8;">${new Date(occ.date).toLocaleString('ar-SA')}</small>
                            </div>
                            <button class="btn-danger delete-occ-btn" data-index="${index}" data-permission="manage_occasions">🗑️</button>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;

    applyPermissionsToContainer(pane);
    bindOccasionsEvents(pane, systemState);
}

function bindOccasionsEvents(pane, systemState) {
    const titleInput = pane.querySelector("#occTitle");
    const dateInput = pane.querySelector("#occDate");
    const saveBtn = pane.querySelector("#saveOccasionBtn");

    saveBtn?.addEventListener("click", async () => {
        if (!titleInput.value || !dateInput.value) return showToast("أدخل البيانات كاملة", "error");

        const newOccasion = { title: titleInput.value, date: dateInput.value, timestamp: Date.now() };
        systemState.occasions.push(newOccasion);
        
        if (await saveJsonData("occasions", { list: systemState.occasions })) {
            broadcastUpdate("UPDATE_OCCASIONS", systemState.occasions);
            showToast("تم الحفظ", "success");
            renderOccasions(systemState);
        }
    });

    pane.querySelectorAll(".delete-occ-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const index = parseInt(e.target.getAttribute("data-index"));
            systemState.occasions.splice(index, 1);
            await saveJsonData("occasions", { list: systemState.occasions });
            renderOccasions(systemState);
        });
    });
}
