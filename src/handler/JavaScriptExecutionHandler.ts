import type { ICheckIfPermittedRequireResult, IJavaScriptExecutorState } from '../typings'
import { findInDatabase, getDatabaseData, writeToDatabase } from '../utilis/LocalDatabase';
import { isWhitespace } from '../utilis/StringUtili'
import { Utilities } from '../utilities'

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

/**
* Represents a JavaScript executor that can run arbitrary JavaScript code with optional callback functionality.
* The JavaScriptExecutor class provides a way to execute JavaScript code safely, with the ability to control which modules can be loaded and to monitor the execution progress.
*/
export class JavaScriptExecutor {
    // Static members
    private static CharacterSetForId: string[] = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    private static IdMaxLength: number = 10;
    private static originalConsoleLog = console.log;
    static Instances: JavaScriptExecutor[] = [];

    // Instance members
    private id: string;
    private code: string;
    private isRunning: boolean = false;
    private consoleOutput: string = '';
    private returnValue: any = undefined;
    private error: Error | undefined = undefined;
    private incluededObjects: object;
    private permittedRequires: string[] = [];
    private invertPermittedRequireCheck = false; 
    private updateInterval: number;

    /**
    * Constructs a new instance of the `JavaScriptExecutor` class.
    * @param code - The JavaScript code to be executed.
    * @param requireFn - An optional `require` function to be used within the executed code.
    * @param invertPermittedRequireCheck - A boolean flag indicating whether to invert the permitted require check.
    * @param permittedRequires - An array of permitted require strings.
    * @param incluededObjects - An object containing objects to be included in the executed code.
    * @param UpdateInterval - The interval (in milliseconds) at which the callback function should be called during code execution.
    */
    constructor(code: string, requireFn?: NodeRequire, invertPermittedRequireCheck: boolean = false, permittedRequires: string[] = [], incluededObjects: object = {}, UpdateInterval: number = 1000) {
        if (isWhitespace(code)) throw new Error('Code cannot be empty.');

        this.id = this.generateId();
        
        this.code = code;
        this.invertPermittedRequireCheck = invertPermittedRequireCheck;
        this.permittedRequires = permittedRequires;
        this.incluededObjects = incluededObjects;

        if (requireFn !== undefined) {
            Object.assign(this.incluededObjects, { require: requireFn });
        }

        this.updateInterval = Math.max(100, UpdateInterval);

        // This done late so that the constructor can be called without errors.
        JavaScriptExecutor.Instances.push(this);
    }

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
    findOrCreateExecutor(code: string, requireFn?: NodeRequire, invertPermittedRequireCheck: boolean = false, permittedRequires: string[] = [], incluededObjects: object = {}, UpdateInterval: number = 1000): JavaScriptExecutor {
        const executor = JavaScriptExecutor.findByCode(code);
        if (executor !== undefined) return executor;
        else return new JavaScriptExecutor(code, requireFn, invertPermittedRequireCheck, permittedRequires, incluededObjects, UpdateInterval);
    }

    /**
    * Executes the provided JavaScript code, with optional callback functionality.
    * @param callback - An optional callback function that will be called repeatedly during the code execution, with the JavaScriptExecutor instance and a logger function as arguments.
    * @returns The JavaScriptExecutor instance, with the executed code's return value, console output, and any errors stored in its properties.
    */
    async executes(callback?: ((executor: JavaScriptExecutor, logger: Function) => Promise<void>)): Promise<JavaScriptExecutor> {
        this.resetState();

        let { permitted, firstPermittedModule } = this.checkIfPermittedRequire(this.code)

        if (this.isRunning) {
            this.error = new AlreadyRunningError(`JavaScriptExecutor#${this.id} is already running.`);
            return this;
        } else if (permitted) {
            this.isRunning = false
            this.error = new PermittedRequiresError(`JavaScriptExecutor#${this.id} Permitted requires are not allowed. The first permitted module was: ${firstPermittedModule}`);
            return this;
        }
        
        // Setup the console output
        console.log = (message) => {
            this.consoleOutput += (this.consoleOutput.length != 0 ? `\n${message}` : `${message}`);
        };

        // Setup the included objects
        const incluededObjectsNames = Object.keys(this.incluededObjects);
        const incluededObjectsValues = Object.values(this.incluededObjects);

        // Dynamically create a function that uses the provided incluededObjects directly
        const codeFunction: Function = new AsyncFunction(...incluededObjectsNames, this.code);

        // Call the dynamically created function with the spread incluededObjects
        this.isRunning = true;
        let interval: NodeJS.Timeout | undefined = undefined;
        try {
            if (callback!== undefined) {
                interval = setInterval(async () => {
                    await callback(this, JavaScriptExecutor.originalConsoleLog);
                }, this.updateInterval); 
            }
            
            this.returnValue = await codeFunction(...incluededObjectsValues);
        } catch (error: any) {
            this.error = error;
        }
        if (callback!== undefined) {
            clearInterval(interval);
        }

        // Put the original console log back
        console.log = JavaScriptExecutor.originalConsoleLog;


        return this;
    }
        
    /**
    * Checks if the provided code contains any `require` or `from` statements that reference modules not permitted by the configured list of allowed modules.
    * @param code - The code to check for permitted `require` and `from` statements.
    * @returns An object indicating whether the code is permitted, and the first permitted module if any.
    */
    checkIfPermittedRequire(code: string): ICheckIfPermittedRequireResult {
        const regex: RegExp = /(require|from)\s*(?:\(\s*?['"`])(.*?)\s*(?:['"`]\s*\)?)/g;
    
        const matches = code.matchAll(regex);
        if (!matches) {
            return { permitted: false, firstPermittedModule: undefined };
        }
    
        for (const match of matches) {
            
            const requiredModule = match[2];

            if (!requiredModule) continue;

            if (this.invertPermittedRequireCheck && this.permittedRequires.length === 0) {
                return { permitted: true, firstPermittedModule: requiredModule };
            }

            for (const allowedRequire of this.permittedRequires) {
                if (this.invertPermittedRequireCheck ? !requiredModule.startsWith(allowedRequire) : requiredModule.startsWith(allowedRequire)) {
                    return { permitted: true, firstPermittedModule: requiredModule };
                }
            }
        }
    
        return { permitted: false, firstPermittedModule: undefined };
    }

    
    /**
    * Gets the current state of the JavaScriptExecutionHandler instance.
    * @returns {object} An object containing the current state of the instance, including the unique identifier, the code being executed, the return value, console output, any error, and whether the instance is currently running.
    */
    getState(): IJavaScriptExecutorState {
        return {
            id: this.id,
            code: this.code,
            returnValue: this.returnValue,
            consoleOutput: this.consoleOutput,
            error: this.error,
            isRunning: this.isRunning,
        }
    }

    /**
    * Removes the JavaScriptExecutor instance with the specified ID from the Instances array.
    * If the instance is found, it will be removed from the array.
    */
    remove() {
        const index = JavaScriptExecutor.Instances.indexOf(this);
        if (index!== -1) {
            JavaScriptExecutor.Instances.splice(index, 1);
        }
    }
    

    /**
    * Removes a JavaScriptExecutor instance with the specified ID.
    * @param id - The unique identifier of the JavaScriptExecutor instance to remove.
    */
    static remove(id: string) {
        const Instance = JavaScriptExecutor.findById(id);
        if (Instance) {
            Instance.remove();
        }
    }

    /**
    * Resets the state of the JavaScriptExecutionHandler instance, clearing any existing error, console output, and return value.
    */
    resetState(): void {
        this.error = undefined;
        this.consoleOutput = '';
        this.returnValue = undefined;
    }
    
    /**
    * Sets whether the permitted requires check should be inverted.
    * @param toggle - If true, the permitted requires check will be inverted, allowing any module except those in the permitted list. If false, the check will only allow modules in the permitted list.
    */
    setInvertPermittedRequireCheck(toggle: boolean): void {
        this.invertPermittedRequireCheck = toggle;
    }
    
    /**
    * Sets the list of modules that are permitted to be loaded by this JavaScriptExecutionHandler instance.
    * @param newRequires - An array of module names that are permitted to be loaded.
    */
    setPermittedRequires(newRequires: string[]): void {
        this.permittedRequires = newRequires;
    }

    /**
    * Clears the console output for this JavaScriptExecutionHandler instance.
    */
    clearConsoleOutput(): void {
        this.consoleOutput = '';
    }    

    /**
    * Finds a JavaScriptExecutor instance by its unique identifier.
    * @param id - The unique identifier of the JavaScriptExecutor instance to find.
    * @returns {JavaScriptExecutor|undefined} The JavaScriptExecutor instance with the specified ID, or undefined if not found.
    */
    static findById(id: string): JavaScriptExecutor | undefined {
        return JavaScriptExecutor.Instances.find(instance => instance.id === id);
    }

    /**
    * Finds a JavaScriptExecutor instance by its unique code.
    * @param code - The unique code of the JavaScriptExecutor instance to find.
    * @returns The JavaScriptExecutor instance with the specified code, or undefined if not found.
    */
    static findByCode(code: string): JavaScriptExecutor | undefined {
        return JavaScriptExecutor.Instances.find(instance => instance.code === code);
    }

    /**
    * Generates a unique identifier string of a fixed length.
    * @returns {string} A unique identifier string.
    */
    private generateId(): string {
        let id = '';
        const instanceIds = JavaScriptExecutor.Instances.map(instance => instance.id);
    
        do {
            id = '';
            for (let i = 0; i < JavaScriptExecutor.IdMaxLength; i++) {
                id += JavaScriptExecutor.CharacterSetForId[Math.floor(Math.random() * JavaScriptExecutor.CharacterSetForId.length)];
            }
        } while (instanceIds.includes(id));
    
        return id;
    }
}

/**
* Represents an error that is thrown when a required module is not permitted to be loaded.
*/
export class PermittedRequiresError extends Error {
    constructor(message: string) {
        super(message);
    }
}

/**
* An error that is thrown when an operation cannot be performed because it is already running.
*/
export class AlreadyRunningError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export default {
    JavaScriptExecutor,
    AlreadyRunningError,
    PermittedRequiresError
}