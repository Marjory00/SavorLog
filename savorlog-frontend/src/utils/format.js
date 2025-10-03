// src/utils/format.js

/**
 * Formats time in minutes to be more readable (e.g., 90 -> 1h 30m).
 * @param {number|string} minutes - The preparation time in minutes.
 * @returns {string} The formatted time string.
 */
export const formatTime = (minutes) => {
    const min = Number(minutes);
    if (isNaN(min) || min <= 0) return 'N/A';

    if (min < 60) {
        return `${min}m`;
    }

    const hours = Math.floor(min / 60);
    const remainingMinutes = min % 60;

    let timeString = `${hours}h`;
    if (remainingMinutes > 0) {
        timeString += ` ${remainingMinutes}m`;
    }
    return timeString;
};