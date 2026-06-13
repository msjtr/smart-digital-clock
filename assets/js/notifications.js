// assets/js/notifications.js

export function initNotifications() {
    // إنشاء حاوية الإشعارات إذا لم تكن موجودة في HTML
    if (!document.getElementById('notificationContainer')) {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    console.log("تم تهيئة نظام الإشعارات.");
}

// دالة لعرض إشعار جديد
export function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fade-in`; // types: success, error, warning
    
    // تحديد الأيقونة حسب النوع
    let icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span class="toast-message">${message}</span>`;
    
    container.appendChild(toast);

    // إخفاء الإشعار وإزالته بعد 3 ثوانٍ
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
