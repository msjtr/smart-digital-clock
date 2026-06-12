export const Themes = {

    current: "dark",

    set(theme) {

        this.current = theme;

        document.body.setAttribute(
            "data-theme",
            theme
        );

    },

    dark() {

        this.set("dark");

    },

    light() {

        this.set("light");

    },

    blue() {

        this.set("blue");

    },

    green() {

        this.set("green");

    }

};
