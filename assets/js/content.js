import { Storage } from "./storage.js";

export const Content = {

    items: [],

    init() {

        this.items =
            Storage.load(
                "content",
                []
            );

    },

    add(item) {

        this.items.push(item);

        Storage.save(
            "content",
            this.items
        );

    },

    remove(index) {

        this.items.splice(
            index,
            1
        );

        Storage.save(
            "content",
            this.items
        );

    },

    getAll() {

        return this.items;

    }

};
