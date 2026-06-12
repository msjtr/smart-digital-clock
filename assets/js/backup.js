export const Backup = {

    export() {

        const data = {

            settings:
                localStorage.getItem(
                    "settings"
                ),

            messages:
                localStorage.getItem(
                    "messages"
                ),

            occasion:
                localStorage.getItem(
                    "occasion"
                )

        };

        const blob =
            new Blob(
                [
                    JSON.stringify(
                        data,
                        null,
                        2
                    )
                ],
                {
                    type:
                        "application/json"
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            "backup.json";

        link.click();

    }

};
