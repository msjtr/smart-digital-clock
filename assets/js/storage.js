// ============================================================================
// Storage Manager - مدير البيانات والتواصل مع السيرفر (النسخة الكاملة)
// ============================================================================

/**
 * جلب البيانات من ملفات JSON في مجلد data
 */
export async function fetchJsonData(fileName) {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/data/${fileName}.json?v=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`تعذر العثور على ملف ${fileName}.json`);
        }
        
        return await response.json();
    } catch (error) {
        console.warn(`⚠️ تنبيه: خطأ في قراءة ${fileName}، سيتم استخدام البيانات المحلية إن وجدت.`, error);
        return getFromLocal(fileName); // استدعاء الدالة المضافة
    }
}

/**
 * إرسال البيانات للسيرفر لحفظها
 */
export async function saveJsonData(fileName, content) {
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: fileName, content: content })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`💾 تم حفظ ${fileName}.json في السيرفر بنجاح`);
            saveToLocal(fileName, content);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`❌ فشل الاتصال بالسيرفر أثناء حفظ ${fileName}:`, error);
        saveToLocal(fileName, content);
        return false;
    }
}

/**
 * الحفظ المحلي الدائم
 */
export function saveToLocal(key, data) {
    try {
        localStorage.setItem(`admin_${key}`, JSON.stringify(data));
        console.log(`⚡ تم الحفظ المحلي لـ ${key}`);
    } catch (e) {
        console.warn("⚠️ تعذر الحفظ في LocalStorage", e);
    }
}

/**
 * دالة الجلب المحلي (مهمة جداً لربطها مع باقي الملفات)
 */
export function getFromLocal(key) {
    try {
        const data = localStorage.getItem(`admin_${key}`);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error(`❌ خطأ في استرجاع البيانات المحلية لـ ${key}`, e);
        return null;
    }
}
