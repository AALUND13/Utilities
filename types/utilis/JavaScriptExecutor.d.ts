/**
 * Executes JavaScript code and captures console output and errors.
 * @deprecated This function is deprecated. Use JavaScriptExecutionHandler instead.
 * @param {string | Function} code - The JavaScript code to execute.
 * @param {Object} args - Arguments to pass to the code.
 * @param {NodeRequire} [requireFn] - The require function to use when executing the code.
 * @param {number} [cutoff=Infinity] - The maximum length of console output to capture.
 * @returns {Promise<{returnValue: any, consoleOutput: string, error: string | undefined}>} - An object containing the return value, console output, and error message (if any).
 */
export declare function executeJavaScript(code: string | Function, args: Object | undefined, requireFn: NodeRequire, cutoff?: number): Promise<{
    returnValue: any;
    consoleOutput: string;
    error: string | undefined;
}>;
