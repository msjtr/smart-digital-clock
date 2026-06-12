export const Themes = {

    set(theme) {

        document.body.setAttribute(
            "data-theme",
            theme
        );

        localStorage.setItem(
            "theme",
            theme
        );

    },

    load() {

        const theme =
            localStorage.getItem(
                "theme"
            ) || "dark";

        this.set(theme);

    }

};
