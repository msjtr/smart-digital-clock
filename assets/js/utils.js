export const Utils = {

    pad(value) {
        return String(value).padStart(2, "0");
    },

    formatTime(hours, minutes, seconds) {
        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    },

    formatDate(date) {
        return date.toLocaleDateString("ar-SA");
    },

    generateId() {
        return Date.now().toString(36);
    }

};
