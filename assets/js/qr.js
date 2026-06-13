// assets/js/qr.js

export function initQR() {
    console.log("تم تفعيل نظام توليد رموز QR.");
}

// دالة لتوليد وعرض QR Code
export function generateQR(url, targetElementId) {
    const container = document.getElementById(targetElementId);
    if (!container || !url) return;

    container.innerHTML = ''; // تنظيف الحاوية

    // استخدام خدمة مجانية وموثوقة لتوليد الصورة
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}&color=0d9488&bgcolor=ffffff`;
    
    const img = document.createElement('img');
    img.src = qrImageUrl;
    img.alt = 'رمز الاستجابة السريعة';
    img.className = 'qr-code-image';

    // معالجة الأخطاء بصمت في حال عدم توفر اتصال لإنشاء الصورة أو فشل المرفق
    img.onerror = () => {
        console.warn('تعذر توليد أو عرض رمز QR لعدم توفر الاتصال أو المرفق.');
        img.style.display = 'none'; // منع ظهور المربع المكسور
        container.innerHTML = '<span class="qr-error">الرمز غير متوفر حالياً</span>';
    };

    container.appendChild(img);
}
