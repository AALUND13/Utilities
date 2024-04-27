import { IUtilitiesOptions } from "./typings";

/**
 * A utility class for managing options.
 */
export class Utilities {
    /**
     * The singleton instance of the Utilities class.
     */
    static _instance: Utilities;

    // Private property to store the options
    private options: IUtilitiesOptions;

    /**
     * Creates an instance of Utilities.
     * @param options The options to initialize Utilities with.
     */
    constructor(options: IUtilitiesOptions) {
        // Initialize options
        this.options = options;
        // Set the singleton instance to this instance
        Utilities._instance = this;
    }

    /**
     * Get the name of the database.
     */
    getDataBaseName(): string {
        return this.options.databaseName;
    }

    /**
     * Get the location of the database.
     */
    getDataBaseLocation(): string {
        return this.options.databaseLocation;
    }
}
