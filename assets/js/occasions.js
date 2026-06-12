import { Storage } from "./storage.js";

export const Occasions = {

    data: null,

    init() {

        this.data =
            Storage.load(
                "occasion",
                {
                    title:
                        "أهلاً بكم",

                    description:
                        "كلية الشريعة والقانون",

                    color:
                        "#2563eb"
                }
            );

        this.render();

    },

    render() {

        const box =
            document.getElementById(
                "occasionBox"
            );

        if (!box) return;

        box.innerHTML = `
            <h2>${this.data.title}</h2>
            <p>${this.data.description}</p>
        `;

        box.style.background =
            this.data.color;

    },

    update(data) {

        this.data = data;

        Storage.save(
            "occasion",
            data
        );

        this.render();

    }

};
