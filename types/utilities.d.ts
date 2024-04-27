import { IUtilitiesOptions } from "./typings";
/**
 * A utility class for managing options.
 */
export declare class Utilities {
    /**
     * The singleton instance of the Utilities class.
     */
    static _instance: Utilities;
    private options;
    /**
     * Creates an instance of Utilities.
     * @param options The options to initialize Utilities with.
     */
    constructor(options: IUtilitiesOptions);
    /**
     * Get the name of the database.
     */
    getDataBaseName(): string;
    /**
     * Get the location of the database.
     */
    getDataBaseLocation(): string;
}
//# sourceMappingURL=utilities.d.ts.map