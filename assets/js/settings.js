// assets/js/settings.js

let currentSettings = null;

export async function initSettings() {

    console.log(
        "تم تهيئة وحدة الإعدادات"
    );

    try {

        const response =
            await fetch(
                "./data/settings.json"
            );

        currentSettings =
            await response.json();

        applySettings(
            currentSettings
        );

    } catch (error) {

        console.error(
            "فشل تحميل الإعدادات",
            error
        );

    }

}

export function applySettings(
    settings
) {

    if (!settings) return;

    // الثيم

    if (settings.theme) {

        document.body.setAttribute(
            "data-theme",
            settings.theme
        );

    }

    // وضع البروجكتور

    if (
        settings.projectorMode
    ) {

        document.body.classList.add(
            "projector-mode"
        );

    }

    // العناصر

    const elementsToToggle = {

        clockSection:
            settings.features?.showClock,

        dateSection:
            settings.features?.showDate,

        weatherSection:
            settings.features?.showWeather,

        prayerSection:
            settings.features?.showPrayers,

        messagesSection:
            settings.features?.showMessages,

        occasionBox:
            settings.features?.showOccasions,

        countdownSection:
            settings.features?.showCountdown,

        contentViewer:
            settings.features?.showContent,

        newsTicker:
            settings.features?.showNewsTicker

    };

    Object.entries(
        elementsToToggle
    ).forEach(([id, show]) => {

        const element =
            document.getElementById(
                id
            );

        if (element) {

            element.style.display =
                show
                    ? ""
                    : "none";

        }

    });

    // الشعارات

    const universityLogo =
        document.getElementById(
            "universityLogo"
        );

    const collegeLogo =
        document.getElementById(
            "collegeLogo"
        );

    if (universityLogo) {

        universityLogo.style.display =
            settings.features?.showUniversityLogo
                ? ""
                : "none";

    }

    if (collegeLogo) {

        collegeLogo.style.display =
            settings.features?.showCollegeLogo
                ? ""
                : "none";

    }

}

export function getSettings() {

    return currentSettings;

}

export function updateSetting(
    key,
    value
) {

    if (!currentSettings) return;

    currentSettings[key] =
        value;

    applySettings(
        currentSettings
    );

}
