// assets/js/storage.js
import { handleError } from './utils.js';

// جلب البيانات من ملفات JSON
export async function fetchJsonData(fileName) {
    try {
        const response = await fetch(`./data/${fileName}.json`);
        if (!response.ok) {
            console.warn(`ملف ${fileName}.json غير موجود بعد، سيتم تخطيه حالياً.`);
            return null;
        }
        return await response.json();
    } catch (error) {
        handleError(`fetchJsonData (${fileName})`, error);
        return null;
    }
}

// الحفظ في التخزين المحلي (لتعمل الشاشة بدون إنترنت)
export function saveToLocal(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        handleError('saveToLocal', error);
    }
}

export function getFromLocal(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        handleError('getFromLocal', error);
        return null;
    }
}
