const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 10000;

const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".pdf": "application/pdf"
};

const server = http.createServer((req, res) => {

    let filePath;

    if (
        req.url === "/" ||
        req.url === "/index.html"
    ) {

        filePath = path.join(
            __dirname,
            "index.html"
        );

    } else {

        filePath = path.join(
            __dirname,
            decodeURIComponent(req.url)
        );

    }

    fs.readFile(
        filePath,
        (err, content) => {

            if (err) {

                const notFoundPage = path.join(
                    __dirname,
                    "404.html"
                );

                fs.readFile(
                    notFoundPage,
                    (notFoundErr, notFoundContent) => {

                        if (notFoundErr) {

                            res.writeHead(
                                404,
                                {
                                    "Content-Type":
                                        "text/plain"
                                }
                            );

                            return res.end(
                                "404 Not Found"
                            );

                        }

                        res.writeHead(
                            404,
                            {
                                "Content-Type":
                                    "text/html; charset=utf-8"
                            }
                        );

                        res.end(
                            notFoundContent
                        );

                    }
                );

                return;

            }

            const ext = path
                .extname(filePath)
                .toLowerCase();

            res.writeHead(
                200,
                {
                    "Content-Type":
                        MIME_TYPES[ext] ||
                        "application/octet-stream"
                }
            );

            res.end(content);

        }
    );

});

server.listen(
    PORT,
    () => {

        console.log(
            "Smart Digital Clock running on port " + PORT
        );

    }
);
