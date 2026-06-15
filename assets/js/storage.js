// ============================================================================
// Storage Manager - مدير البيانات والتواصل مع السيرفر
// ============================================================================

/**
 * جلب البيانات من ملفات JSON في مجلد data
 * إذا تعذر الاتصال بالسيرفر، يقوم تلقائياً بجلب النسخة الاحتياطية من LocalStorage
 */
export async function fetchJsonData(fileName) {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/data/${fileName}.json?v=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`تعذر العثور على ملف ${fileName}.json`);
        }
        
        const data = await response.json();
        // حفظ نسخة محدثة محلياً عند نجاح الجلب من السيرفر
        saveToLocal(fileName, data);
        return data;
    } catch (error) {
        console.warn(`⚠️ تنبيه: خطأ في قراءة ${fileName} من السيرفر، يتم المحاولة من التخزين المحلي...`, error);
        return getFromLocal(fileName); 
    }
}

/**
 * إرسال البيانات للسيرفر لحفظها (POST Request)
 * يقوم بالتحديث المحلي فوراً لضمان سرعة الاستجابة
 */
export async function saveJsonData(fileName, content) {
    // 1. تحديث محلي فوري (لضمان تجربة مستخدم سريعة)
    saveToLocal(fileName, content);

    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: fileName, content: content })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log(`💾 تم حفظ ${fileName}.json في السيرفر بنجاح`);
            return true;
        } else {
            throw new Error(result.error || "خطأ غير معروف");
        }
    } catch (error) {
        console.error(`❌ فشل الاتصال بالسيرفر أثناء حفظ ${fileName}:`, error);
        return false;
    }
}

/**
 * الحفظ في LocalStorage (تخزين محلي دائم)
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
 * استرجاع البيانات من LocalStorage
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

/**
 * مسح البيانات المحلية (مفيد عند تسجيل الخروج أو إعادة تعيين النظام)
 */
export function clearLocalData() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('admin_')) {
            localStorage.removeItem(key);
        }
    });
    console.log("🧹 تم مسح جميع البيانات المحلية للإدارة");
}
