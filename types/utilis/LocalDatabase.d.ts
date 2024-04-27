/**
 * Retrieves the path to the database file.
 * @param {string | undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string | undefined} OverrideDatabaseLocation - The optional location of the database file.
 * @returns {string} The path to the database file.
 */
export declare function GetDatabasePath(OverrideDatabaseName?: string | undefined, OverrideDatabaseLocation?: string | undefined): string;
/**
 * Retrieves data from the database.
 * @param {string[]} keys - The keys to traverse the nested data structure.
 * @param {string | undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string | undefined} OverrideDatabaseLocation - The optional location of the database file.
 * @returns {*} The retrieved data from the database.
 */
export declare function GetDatabaseData(keys?: string[], OverrideDatabaseName?: string | undefined, OverrideDatabaseLocation?: string | undefined): any;
/**
 * Writes data to the database.
 * @param {string[]} keys - The keys to traverse the nested data structure.
 * @param {*} data - The data to write to the database.
 * @param {string | undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string | undefined} OverrideDatabaseLocation - The optional location of the database file.
 */
export declare function WriteToDatabase(keys: string[], data: any, OverrideDatabaseName?: string | undefined, OverrideDatabaseLocation?: string | undefined): void;
declare const _default: {
    GetDatabasePath: typeof GetDatabasePath;
    GetDatabaseData: typeof GetDatabaseData;
    WriteToDatabase: typeof WriteToDatabase;
};
export default _default;
//# sourceMappingURL=LocalDatabase.d.ts.map