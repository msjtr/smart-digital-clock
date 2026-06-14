// ============================================================================
// Utilities - أدوات عامة وإشعارات
// ============================================================================

export function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.warn("Toast container not found in DOM");
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    // تنسيق سريع لضمان الظهور
    toast.style.cssText = "background: #1e293b; padding: 15px; margin: 10px; border-radius: 8px; color: white; border-right: 4px solid " + (type === 'success' ? '#10b981' : '#ef4444') + "; z-index: 9999;";
    
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'} ${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

export function padZero(num) {
    return num.toString().padStart(2, '0');
}

export function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
