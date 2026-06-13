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
    
    // ========================================================================
    // 1. نظام استقبال وحفظ البيانات من لوحة الإدارة (API)
    // ========================================================================
    if (req.method === "POST" && req.url === "/api/save") {
        let body = "";
        
        // تجميع حزم البيانات القادمة
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

                // حماية اسم الملف والتأكد من حفظه داخل مجلد data بصيغة json فقط
                const safeFileName = path.basename(filename) + ".json";
                const savePath = path.join(__dirname, "data", safeFileName);

                // كتابة البيانات في الملف
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
        return; // إيقاف التنفيذ هنا حتى لا يكمل للبحث عن ملفات ثابتة
    }

    // ========================================================================
    // 2. نظام عرض الملفات الأساسي (Static File Server) - كما كتبته أنت
    // ========================================================================
    
    // تنظيف الرابط لمنع ثغرات (Directory Traversal)
    const safePath = path.normalize(decodeURIComponent(req.url)).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(__dirname, safePath);

    // توجيه المسار الرئيسي إلى index.html
    if (req.url === "/") {
        filePath = path.join(__dirname, "index.html");
    }

    // حماية إضافية: التأكد من أن الملف المطلوب يقع حصراً داخل مجلد المشروع
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { "Content-Type": "text/plain" });
        return res.end("403 Forbidden");
    }

    // قراءة وإرسال الملف
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
    console.log("📁 API endpoint ready at POST /api/save");
});
