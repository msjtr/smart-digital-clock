// ============================================================================
// Occasions Manager
// ============================================================================

import {
    fetchJsonData,
    saveToLocal,
    getFromLocal
} from "./storage.js";

import {
    addLog
} from "./logs.js";

let occasions = [];

let activeOccasion = null;

// ============================================================================
// تشغيل المناسبات
// ============================================================================

export async function initOccasions() {

    const localData =
        getFromLocal(
            "occasions"
        );

    if (
        localData &&
        localData.length
    ) {

        occasions =
            localData;

    } else {

        const jsonData =
            await fetchJsonData(
                "occasions"
            );

        occasions =
            jsonData?.list || [];

        saveToLocal(
            "occasions",
            occasions
        );

    }

    selectActiveOccasion();

    renderOccasion();

    console.log(
        "✅ تم تشغيل نظام المناسبات"
    );

}

// ============================================================================
// اختيار المناسبة الحالية
// ============================================================================

function selectActiveOccasion() {

    const today =
        new Date();

    activeOccasion =
        occasions.find(
            occasion => {

                if (
                    !occasion.isActive
                ) return false;

                const start =
                    new Date(
                        occasion.startDate
                    );

                const end =
                    new Date(
                        occasion.endDate
                    );

                return (
                    today >= start &&
                    today <= end
                );

            }
        );

    if (
        !activeOccasion &&
        occasions.length
    ) {

        activeOccasion =
            occasions.find(
                o => o.isActive
            );

    }

}

// ============================================================================
// عرض المناسبة
// ============================================================================

function renderOccasion() {

    const box =
        document.getElementById(
            "occasionBox"
        );

    if (!box)
        return;

    if (!activeOccasion) {

        box.innerHTML = `

            <h2>
                🎉 مرحباً بكم
            </h2>

            <p>
                أهلاً بكم في
                كلية الشريعة والقانون
            </p>

        `;

        return;

    }

    box.innerHTML = `

        <h2>
            ${activeOccasion.title}
        </h2>

        <p>
            ${activeOccasion.description}
        </p>

    `;

    if (
        activeOccasion.imagePath
    ) {

        const image =
            document.createElement(
                "img"
            );

        image.src =
            activeOccasion.imagePath;

        image.alt =
            activeOccasion.title;

        image.className =
            "occasion-image";

        image.onerror =
            () =>
            image.remove();

        box.appendChild(
            image
        );

    }

}

// ============================================================================
// إضافة مناسبة
// ============================================================================

export function addOccasion(
    occasion
) {

    occasions.push(
        occasion
    );

    saveOccasions();

    addLog(
        "إضافة مناسبة",
        occasion.title
    );

    selectActiveOccasion();

    renderOccasion();

}

// ============================================================================
// تعديل مناسبة
// ============================================================================

export function updateOccasion(
    index,
    data
) {

    if (
        !occasions[index]
    ) return;

    occasions[index] = {

        ...occasions[index],

        ...data

    };

    saveOccasions();

    addLog(
        "تعديل مناسبة",
        occasions[index].title
    );

    selectActiveOccasion();

    renderOccasion();

}

// ============================================================================
// حذف مناسبة
// ============================================================================

export function deleteOccasion(
    index
) {

    if (
        !occasions[index]
    ) return;

    const deleted =
        occasions[index];

    occasions.splice(
        index,
        1
    );

    saveOccasions();

    addLog(
        "حذف مناسبة",
        deleted.title
    );

    selectActiveOccasion();

    renderOccasion();

}

// ============================================================================
// تفعيل مناسبة
// ============================================================================

export function activateOccasion(
    index
) {

    occasions.forEach(
        occasion => {

            occasion.isActive =
                false;

        }
    );

    if (
        occasions[index]
    ) {

        occasions[index]
            .isActive = true;

        addLog(
            "تفعيل مناسبة",
            occasions[index]
                .title
        );

    }

    saveOccasions();

    selectActiveOccasion();

    renderOccasion();

}

// ============================================================================
// حفظ المناسبات
// ============================================================================

function saveOccasions() {

    saveToLocal(
        "occasions",
        occasions
    );

}

// ============================================================================
// جلب جميع المناسبات
// ============================================================================

export function getOccasions() {

    return occasions;

}

// ============================================================================
// جلب المناسبة الحالية
// ============================================================================

export function getActiveOccasion() {

    return activeOccasion;

}
