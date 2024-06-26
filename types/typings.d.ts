/**
 * Options for the utilities package
 */
export interface IUtilitiesOptions {
    /**
     * The name of the database
     */
    databaseName: string;
    /**
     * The location of the database
     */
    databaseLocation: string;
}
/**
* Represents the result of checking if a module is permitted to be required.
*/
export interface ICheckIfPermittedRequireResult {
    /**
    * Indicates whether the module is permitted to be required.
    */
    permitted: boolean;
    /**
    * The name of the first permitted module, if any.
    */
    firstPermittedModule: string | undefined;
}
/**
* Represents the state of a JavaScript executor, which can be used to execute JavaScript code.
*/
export interface IJavaScriptExecutorState {
    /**
    * The unique identifier of the JavaScript executor.
    */
    id: string | undefined;
    /**
    * The JavaScript code to be executed.
    */
    code: string;
    /**
    * The return value of the executed JavaScript code.
    */
    returnValue: any;
    /**
    * The console output generated by the executed JavaScript code.
    */
    consoleOutput: string;
    /**
    * Any error that occurred during the execution of the JavaScript code.
    */
    error: Error | undefined;
    /**
    * Indicates whether the JavaScript code is currently running.
    */
    isRunning: boolean;
}
export interface IFindInDatabaseResult {
    /**
    * Represents some data of unspecified type.
    */
    data: any;
    /**
    * The index of the item, if applicable.
    */
    index: number;
}
