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
    
    // 1. تنظيف الرابط لمنع ثغرات (Directory Traversal)
    const safePath = path.normalize(decodeURIComponent(req.url)).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(__dirname, safePath);

    // 2. توجيه المسار الرئيسي إلى index.html
    if (req.url === "/") {
        filePath = path.join(__dirname, "index.html");
    }

    // 3. حماية إضافية: التأكد من أن الملف المطلوب يقع حصراً داخل مجلد المشروع
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { "Content-Type": "text/plain" });
        return res.end("403 Forbidden");
    }

    // 4. قراءة وإرسال الملف
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // في حال عدم العثور على الملف، يتم عرض صفحة 404
            const notFoundPage = path.join(__dirname, "404.html");
            
            fs.readFile(notFoundPage, (notFoundErr, notFoundContent) => {
                if (notFoundErr) {
                    res.writeHead(404, { "Content-Type": "text/plain" });
                    return res.end("404 Not Found");
                }
                res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
                res.end(notFoundContent);
            });
            return;
        }

        // جلب نوع الملف وإرساله بنجاح
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            "Content-Type": MIME_TYPES[ext] || "application/octet-stream"
        });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log("🚀 Smart Digital Clock running securely on port " + PORT);
});
