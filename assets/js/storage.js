export const Storage = {

    save(key, value) {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    },

    load(key, fallback = null) {

        const data =
            localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        return JSON.parse(data);
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }

};
