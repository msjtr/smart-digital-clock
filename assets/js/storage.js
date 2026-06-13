// ============================================================================
// Storage Manager - مدير البيانات والتواصل مع السيرفر
// ============================================================================

/**
 * جلب البيانات من ملفات JSON في مجلد data
 * @param {string} fileName - اسم الملف بدون الامتداد (مثال: 'settings')
 */
export async function fetchJsonData(fileName) {
    try {
        // إضافة طابع زمني لمنع المتصفح من تخزين النسخة القديمة (Cache)
        const timestamp = new Date().getTime();
        const response = await fetch(`/data/${fileName}.json?v=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`تعذر العثور على ملف ${fileName}.json`);
        }
        
        return await response.json();
    } catch (error) {
        console.warn(`⚠️ تنبيه: خطأ في قراءة ${fileName}، سيتم استخدام البيانات المحلية إن وجدت.`, error);
        
        // محاولة القراءة من التخزين المحلي كخطة طوارئ
        const localData = localStorage.getItem(`admin_${fileName}`);
        return localData ? JSON.parse(localData) : null;
    }
}

/**
 * إرسال البيانات للسيرفر لحفظها في ملفات JSON
 * @param {string} fileName - اسم الملف بدون الامتداد
 * @param {object} content - البيانات المراد حفظها
 */
export async function saveJsonData(fileName, content) {
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                filename: fileName, 
                content: content 
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`💾 تم حفظ ${fileName}.json في السيرفر بنجاح`);
            // حفظ نسخة احتياطية في التخزين المحلي
            saveToLocal(fileName, content);
            return true;
        } else {
            console.error(`❌ رفض السيرفر الحفظ:`, result.error);
            return false;
        }
    } catch (error) {
        console.error(`❌ فشل الاتصال بالسيرفر أثناء حفظ ${fileName}:`, error);
        // في حال انقطاع الإنترنت، نحفظ محلياً فقط
        saveToLocal(fileName, content);
        return false;
    }
}

/**
 * الحفظ المحلي الدائم (لضمان عمل النظام Offline)
 */
export function saveToLocal(key, data) {
    try {
        localStorage.setItem(`admin_${key}`, JSON.stringify(data));
        console.log(`⚡ تم الحفظ المحلي لـ ${key}`);
    } catch (e) {
        console.warn("⚠️ تعذر الحفظ في LocalStorage", e);
    }
}
