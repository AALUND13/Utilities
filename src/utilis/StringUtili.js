/**
 * Truncates a string if it exceeds a specified length.
 * @param {string} str - The string to truncate.
 * @param {number} n - The maximum length of the truncated string.
 * @returns {string} - The truncated string.
 */
function truncateString(str, n) {
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
};

module.exports = {
    truncateString
};
