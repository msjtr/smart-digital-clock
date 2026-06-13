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

// التأكد من وجود المجلدات الأساسية قبل بدء السيرفر
const ensureDirectories = () => {
    const dirs = ["data", "assets/images", "assets/videos", "assets/pdfs", "assets/misc"];
    dirs.forEach(dir => {
        const fullPath = path.join(__dirname, dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    });
};
ensureDirectories();

const server = http.createServer((req, res) => {
    
    // ========================================================================
    // 1. نظام استقبال وحفظ بيانات الإعدادات والرسائل (JSON API)
    // ========================================================================
    if (req.method === "POST" && req.url === "/api/save") {
        let body = "";
        
        req.on("data", chunk => {
            body += chunk.toString();
        });
        
        req.on("end", () => {
            try {
                const data = JSON.parse(body);
                const { filename, content } = data;
                
                if (!filename || !content) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ error: "اسم الملف أو المحتوى مفقود" }));
                }

                const safeFileName = path.basename(filename) + ".json";
                const savePath = path.join(__dirname, "data", safeFileName);

                fs.writeFile(savePath, JSON.stringify(content, null, 4), "utf8", (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ error: "فشل في حفظ الملف" }));
                    }
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, message: "تم الحفظ بنجاح" }));
                });
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "بيانات JSON غير صالحة" }));
            }
        });
        return; 
    }

    // ========================================================================
    // 2. نظام رفع الملفات (صور، فيديو، PDF) للمحتوى (Upload API)
    // ========================================================================
    if (req.method === "POST" && req.url === "/api/upload") {
        const fileNameHeader = req.headers["x-file-name"];
        
        if (!fileNameHeader) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "لم يتم العثور على اسم الملف في الهيدر" }));
        }

        // تنظيف اسم الملف وإضافة طابع زمني لمنع التكرار
        const originalName = path.basename(decodeURIComponent(fileNameHeader));
        const safeFileName = Date.now() + "_" + originalName.replace(/\s+/g, '-');
        const ext = path.extname(safeFileName).toLowerCase();

        // الفرز الذكي للمجلدات بناءً على نوع الملف
        let folder = "misc";
        if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)) folder = "images";
        else if ([".mp4", ".webm"].includes(ext)) folder = "videos";
        else if (ext === ".pdf") folder = "pdfs";

        const savePath = path.join(__dirname, "assets", folder, safeFileName);
        const fileUrl = `assets/${folder}/${safeFileName}`; // المسار الذي سيُحفظ في النظام

        // كتابة الملف كـ Stream (يدعم رفع الفيديوهات الكبيرة بدون تعليق السيرفر)
        const writeStream = fs.createWriteStream(savePath);
        req.pipe(writeStream);

        writeStream.on("finish", () => {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, url: fileUrl }));
        });

        writeStream.on("error", (err) => {
            console.error("Upload error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "فشل في حفظ الملف المرفوع" }));
        });
        return;
    }

    // ========================================================================
    // 3. نظام عرض الملفات الأساسي (Static File Server)
    // ========================================================================
    
    const safePath = path.normalize(decodeURIComponent(req.url)).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(__dirname, safePath);

    if (req.url === "/") {
        filePath = path.join(__dirname, "index.html");
    }

    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { "Content-Type": "text/plain" });
        return res.end("403 Forbidden");
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
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

        const ext = path.extname(filePath).toLowerCase();
        
        // إعدادات الكاش والمناطق الزمنية
        const headers = {
            "Content-Type": MIME_TYPES[ext] || "application/octet-stream"
        };
        
        // منع تخزين بيانات JSON في المتصفح لضمان رؤية التحديثات اللحظية
        if (ext === ".json") {
            headers["Cache-Control"] = "no-store, no-cache, must-revalidate, proxy-revalidate";
            headers["Pragma"] = "no-cache";
            headers["Expires"] = "0";
        }

        res.writeHead(200, headers);
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log("=================================================");
    console.log(`🚀 Smart Digital Clock System is ONLINE`);
    console.log(`🌐 Server Address: http://localhost:${PORT}`);
    console.log(`📡 API Endpoints:`);
    console.log(`   - [JSON] POST /api/save`);
    console.log(`   - [FILE] POST /api/upload`);
    console.log("=================================================");
});
