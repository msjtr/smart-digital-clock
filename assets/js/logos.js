export const Logos = {

    setUniversity(src) {

        const logo =
            document.getElementById(
                "universityLogo"
            );

        if (logo) {

            logo.src = src;

        }

        localStorage.setItem(
            "universityLogo",
            src
        );

    },

    loadUniversity() {

        const src =
            localStorage.getItem(
                "universityLogo"
            );

        const logo =
            document.getElementById(
                "universityLogo"
            );

        if (
            src &&
            logo
        ) {

            logo.src = src;

        }

    }

};
