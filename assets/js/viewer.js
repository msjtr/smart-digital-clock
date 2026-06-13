// assets/js/viewer.js

export function initViewer() {
    console.log("تم تهيئة نظام العارض المتقدم (Viewer).");
}

// دالة قابلة للاستدعاء من أي مكان لفتح ملف (صورة، PDF) في نافذة العرض
export function openViewer(fileUrl, fileType) {
    let viewerContainer = document.getElementById('mainViewer');
    
    // إنشاء الحاوية إذا لم تكن موجودة
    if (!viewerContainer) {
        viewerContainer = document.createElement('div');
        viewerContainer.id = 'mainViewer';
        viewerContainer.className = 'fullscreen-viewer';
        document.body.appendChild(viewerContainer);
    }

    viewerContainer.innerHTML = '<button class="close-viewer-btn" onclick="this.parentElement.style.display=\'none\'">❌ إغلاق</button>';
    viewerContainer.style.display = 'flex';

    if (fileType === 'image') {
        const img = document.createElement('img');
        img.src = fileUrl;
        img.className = 'viewer-image';
        
        // معالجة الخطأ إذا كان الملف غير مرفق
        img.onerror = () => {
            viewerContainer.innerHTML += `<div class="error-msg">⚠️ عذراً، تعذر عرض المكون لعدم توفر المرفق (${fileUrl}).</div>`;
        };
        viewerContainer.appendChild(img);
        
    } else if (fileType === 'pdf') {
        // استخدام iframe لعرض الـ PDF محلياً
        const iframe = document.createElement('iframe');
        iframe.src = fileUrl;
        iframe.className = 'viewer-pdf';
        viewerContainer.appendChild(iframe);
    }
}
