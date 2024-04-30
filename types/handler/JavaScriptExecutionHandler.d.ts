/// <reference types="node" />
import type { ICheckIfPermittedRequireResult, IJavaScriptExecutorState } from '../typings';
/**
* Represents a JavaScript executor that can run arbitrary JavaScript code with optional callback functionality.
* The JavaScriptExecutor class provides a way to execute JavaScript code safely, with the ability to control which modules can be loaded and to monitor the execution progress.
*/
export declare class JavaScriptExecutor {
    private static CharacterSetForId;
    private static IdMaxLength;
    private static originalConsoleLog;
    static Instances: JavaScriptExecutor[];
    private id;
    private code;
    private isRunning;
    private consoleOutput;
    private returnValue;
    private error;
    private incluededObjects;
    private permittedRequires;
    private invertPermittedRequireCheck;
    private updateInterval;
    /**
    * Constructs a new instance of the `JavaScriptExecutor` class.
    * @param code - The JavaScript code to be executed.
    * @param requireFn - An optional `require` function to be used within the executed code.
    * @param invertPermittedRequireCheck - A boolean flag indicating whether to invert the permitted require check.
    * @param permittedRequires - An array of permitted require strings.
    * @param incluededObjects - An object containing objects to be included in the executed code.
    * @param UpdateInterval - The interval (in milliseconds) at which the callback function should be called during code execution.
    */
    constructor(code: string, requireFn?: NodeRequire, invertPermittedRequireCheck?: boolean, permittedRequires?: string[], incluededObjects?: object, UpdateInterval?: number);
    /**
     * Finds an existing JavaScriptExecutor instance by the provided code, or creates a new one.
     * @param code - The JavaScript code to execute.
     * @param requireFn - An optional custom require function to use for the code execution.
     * @param invertPermittedRequireCheck - An optional flag to invert the permitted require check.
     * @param permittedRequires - An optional array of permitted require modules.
     * @param incluededObjects - An optional object of objects to include in the code execution context.
     * @param UpdateInterval - An optional interval (in milliseconds) to call the provided callback function during code execution.
     * @returns The JavaScriptExecutor instance.
    */
    findOrCreateExecutor(code: string, requireFn?: NodeRequire, invertPermittedRequireCheck?: boolean, permittedRequires?: string[], incluededObjects?: object, UpdateInterval?: number): JavaScriptExecutor;
    /**
    * Executes the provided JavaScript code, with optional callback functionality.
    * @param callback - An optional callback function that will be called repeatedly during the code execution, with the JavaScriptExecutor instance and a logger function as arguments.
    * @returns The JavaScriptExecutor instance, with the executed code's return value, console output, and any errors stored in its properties.
    */
    executes(callback?: ((executor: JavaScriptExecutor, logger: Function) => Promise<void>)): Promise<JavaScriptExecutor>;
    /**
    * Checks if the provided code contains any `require` or `from` statements that reference modules not permitted by the configured list of allowed modules.
    * @param code - The code to check for permitted `require` and `from` statements.
    * @returns An object indicating whether the code is permitted, and the first permitted module if any.
    */
    checkIfPermittedRequire(code: string): ICheckIfPermittedRequireResult;
    /**
    * Gets the current state of the JavaScriptExecutionHandler instance.
    * @returns {object} An object containing the current state of the instance, including the unique identifier, the code being executed, the return value, console output, any error, and whether the instance is currently running.
    */
    getState(): IJavaScriptExecutorState;
    /**
    * Removes the JavaScriptExecutor instance with the specified ID from the Instances array.
    * If the instance is found, it will be removed from the array.
    */
    remove(): void;
    /**
    * Removes a JavaScriptExecutor instance with the specified ID.
    * @param id - The unique identifier of the JavaScriptExecutor instance to remove.
    */
    static remove(id: string): void;
    /**
    * Resets the state of the JavaScriptExecutionHandler instance, clearing any existing error, console output, and return value.
    */
    resetState(): void;
    /**
    * Sets whether the permitted requires check should be inverted.
    * @param toggle - If true, the permitted requires check will be inverted, allowing any module except those in the permitted list. If false, the check will only allow modules in the permitted list.
    */
    setInvertPermittedRequireCheck(toggle: boolean): void;
    /**
    * Sets the list of modules that are permitted to be loaded by this JavaScriptExecutionHandler instance.
    * @param newRequires - An array of module names that are permitted to be loaded.
    */
    setPermittedRequires(newRequires: string[]): void;
    /**
    * Clears the console output for this JavaScriptExecutionHandler instance.
    */
    clearConsoleOutput(): void;
    /**
    * Finds a JavaScriptExecutor instance by its unique identifier.
    * @param id - The unique identifier of the JavaScriptExecutor instance to find.
    * @returns {JavaScriptExecutor|undefined} The JavaScriptExecutor instance with the specified ID, or undefined if not found.
    */
    static findById(id: string): JavaScriptExecutor | undefined;
    /**
    * Finds a JavaScriptExecutor instance by its unique code.
    * @param code - The unique code of the JavaScriptExecutor instance to find.
    * @returns The JavaScriptExecutor instance with the specified code, or undefined if not found.
    */
    static findByCode(code: string): JavaScriptExecutor | undefined;
    /**
    * Generates a unique identifier string of a fixed length.
    * @returns {string} A unique identifier string.
    */
    private generateId;
}
/**
* Represents an error that is thrown when a required module is not permitted to be loaded.
*/
export declare class PermittedRequiresError extends Error {
    constructor(message: string);
}
/**
* An error that is thrown when an operation cannot be performed because it is already running.
*/
export declare class AlreadyRunningError extends Error {
    constructor(message: string);
}
declare const _default: {
    JavaScriptExecutor: typeof JavaScriptExecutor;
    AlreadyRunningError: typeof AlreadyRunningError;
    PermittedRequiresError: typeof PermittedRequiresError;
};
export default _default;
