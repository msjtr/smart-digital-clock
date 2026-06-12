import { Storage } from "./storage.js";

export const Logos = {

    uploadUniversity(file) {

        const reader =
            new FileReader();

        reader.onload = e => {

            Storage.save(
                "universityLogo",
                e.target.result
            );

            this.loadUniversity();

        };

        reader.readAsDataURL(file);

    },

    loadUniversity() {

        const logo =
            Storage.load(
                "universityLogo"
            );

        const image =
            document.getElementById(
                "universityLogo"
            );

        if (
            logo &&
            image
        ) {

            image.src = logo;

        }

    },

    uploadCollege(file) {

        const reader =
            new FileReader();

        reader.onload = e => {

            Storage.save(
                "collegeLogo",
                e.target.result
            );

            this.loadCollege();

        };

        reader.readAsDataURL(file);

    },

    loadCollege() {

        const logo =
            Storage.load(
                "collegeLogo"
            );

        const image =
            document.getElementById(
                "collegeLogo"
            );

        if (
            logo &&
            image
        ) {

            image.src = logo;

        }

    }

};
