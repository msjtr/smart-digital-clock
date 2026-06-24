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
    ".pdf": "application/pdf",
    ".mp4": "video/mp4",
    ".webm": "video/webm"
};

// التأكد من وجود المجلدات الأساسية
const ensureDirectories = () => {
    const dirs = ["data", "assets/images", "assets/videos", "assets/pdfs", "assets/misc", "assets/js/admin"];
    dirs.forEach(dir => {
        const fullPath = path.join(__dirname, dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    });
};
ensureDirectories();

const server = http.createServer((req, res) => {
    const reqPath = req.url.split('?')[0];

    // 1. API الحفظ
    if (req.method === "POST" && reqPath === "/api/save") {
        let body = "";
        req.on("data", chunk => { body += chunk.toString(); });
        req.on("end", () => {
            try {
                const data = JSON.parse(body);
                const { filename, content } = data;
                if (!filename || !content) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ error: "بيانات مفقودة" }));
                }
                const safeFileName = path.basename(filename) + ".json";
                const savePath = path.join(__dirname, "data", safeFileName);
                fs.writeFile(savePath, JSON.stringify(content, null, 4), "utf8", (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ error: "فشل الحفظ" }));
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true }));
                });
            } catch (e) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "JSON غير صالح" }));
            }
        });
        return;
    }

    // 2. API الرفع
    if (req.method === "POST" && reqPath === "/api/upload") {
        const fileNameHeader = req.headers["x-file-name"];
        if (!fileNameHeader) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "اسم الملف مفقود" }));
        }
        const originalName = path.basename(decodeURIComponent(fileNameHeader));
        const safeFileName = Date.now() + "_" + originalName.replace(/\s+/g, '-');
        const ext = path.extname(safeFileName).toLowerCase();
        let folder = "misc";
        if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) folder = "images";
        else if ([".mp4", ".webm"].includes(ext)) folder = "videos";
        else if (ext === ".pdf") folder = "pdfs";

        const savePath = path.join(__dirname, "assets", folder, safeFileName);
        const writeStream = fs.createWriteStream(savePath);
        req.pipe(writeStream);
        writeStream.on("finish", () => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, url: `assets/${folder}/${safeFileName}` }));
        });
        return;
    }

    // 3. نظام عرض الملفات (Static File Server) المحدث
    let safePath = path.normalize(decodeURIComponent(reqPath)).replace(/^(\.\.[\/\\])+/, '');
    
    // إذا كان الطلب للجذر
    if (reqPath === "/") safePath = "index.html";

    // محاولة البحث في المسار المباشر، إذا لم يوجد، ابحث داخل مجلد assets
    let filePath = path.join(__dirname, safePath);
    if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, "assets", safePath);
    }

    // تأمين المسارات
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        return res.end("403 Forbidden");
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/html" });
            return res.end("<h1>404 Not Found</h1>");
        }
        const ext = path.extname(filePath).toLowerCase();
        const headers = { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" };
        if (ext === ".json") {
            headers["Cache-Control"] = "no-store";
        }
        res.writeHead(200, headers);
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 System Online on port ${PORT}`);
});
