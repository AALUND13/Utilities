/**
* Truncates a given string to a specified length, optionally appending an ellipsis.
* @param str - The input string to truncate.
* @param n - The maximum length of the truncated string.
* @param swap - If true, the ellipsis is prepended instead of appended.
* @returns The truncated string, with an ellipsis appended or prepended if the original string exceeds the specified length.
*/
export declare function truncateString(str: string, n: number, swap?: boolean): string;
/**
* Checks if a given string is composed entirely of whitespace characters.
* @param str - The string to check.
* @returns `true` if the string is composed entirely of whitespace characters, `false` otherwise.
*/
export declare function isWhitespace(str: string): boolean;
declare const _default: {
    truncateString: typeof truncateString;
    isWhitespace: typeof isWhitespace;
};
export default _default;
