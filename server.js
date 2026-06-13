const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {

    let filePath = "." + (req.url === "/" ? "/index.html" : req.url);

    const ext = path.extname(filePath);

    const contentTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml"
    };

    fs.readFile(filePath, (err, content) => {

        if (err) {
            res.writeHead(404);
            res.end("Not Found");
            return;
        }

        res.writeHead(
            200,
            {
                "Content-Type":
                    contentTypes[ext] || "text/plain"
            }
        );

        res.end(content);
    });

});

const PORT =
    process.env.PORT || 10000;

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
