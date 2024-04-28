import { truncateString } from "./StringUtili";

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

/**
 * Executes JavaScript code and captures console output and errors.
 * @param {string | Function} code - The JavaScript code to execute.
 * @param {Object} args - Arguments to pass to the code.
 * @param {NodeRequire} [requireFn] - The require function to use when executing the code.
 * @param {number} [cutoff=Infinity] - The maximum length of console output to capture.
 * @returns {Promise<{returnValue: any, consoleOutput: string, error: string | undefined}>} - An object containing the return value, console output, and error message (if any).
 */
export async function executeJavaScript(code: string | Function, args:Object = {}, requireFn:NodeRequire, cutoff:number = Infinity): Promise<{returnValue: any, consoleOutput: string, error: string}> {
    let consoleOutput = "";

    const originalConsoleLog = console.log;
    console.log = function(message) {
        consoleOutput += message + "\n";
    };

    let returnValue;

    const codeString = typeof code === 'string' ? code : code.toString();
    try {
        const argNames = Object.keys(args);
        const argValues = Object.values(args);

        // Dynamically create a function that uses the provided arguments directly
        const codeFunction = new AsyncFunction(...argNames, 'require', codeString);

        // Call the dynamically created function with the spread args
        returnValue = await codeFunction(...argValues, requireFn);

        console.log = originalConsoleLog;

        // Remove the trailing newline character
        consoleOutput = consoleOutput.slice(0, -1);
    } catch (error) {
        console.log = originalConsoleLog;

        // Remove the trailing newline character
        consoleOutput = consoleOutput.slice(0, -1);

        return {
            returnValue: undefined,
            consoleOutput: truncateString(consoleOutput, cutoff),
            error: `${error.name}: ${error.message}`,
        };
    }

    return {
        returnValue: returnValue,
        consoleOutput: truncateString(consoleOutput, cutoff),
        error: undefined,
    };
}