import { Storage } from "./storage.js";

export const Logs = {

    add(action) {

        const logs =
            Storage.load(
                "logs",
                []
            );

        logs.push({

            action,

            date:
                new Date().toISOString()

        });

        Storage.save(
            "logs",
            logs
        );

    },

    getAll() {

        return Storage.load(
            "logs",
            []
        );

    }

};
