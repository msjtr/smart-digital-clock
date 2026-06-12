export const Layouts = {

    init() {

        this.updateLayout();

        window.addEventListener(
            "resize",
            () => this.updateLayout()
        );

    },

    updateLayout() {

        const visibleWidgets =
            document.querySelectorAll(
                ".widget:not(.hidden)"
            );

        document.body.setAttribute(
            "data-widgets",
            visibleWidgets.length
        );

    },

    show(id) {

        const element =
            document.getElementById(id);

        if (!element) return;

        element.classList.remove(
            "hidden"
        );

        this.updateLayout();

    },

    hide(id) {

        const element =
            document.getElementById(id);

        if (!element) return;

        element.classList.add(
            "hidden"
        );

        this.updateLayout();

    }

};
