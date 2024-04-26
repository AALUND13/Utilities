/**
 * Retrieves the path to the database file.
 * @param {string|undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string|undefined} OverrideDatabaseLocation - The optional location of the database file.
 * @returns {string} The path to the database file.
 */
export function GetDatabasePath(OverrideDatabaseName?: string | undefined, OverrideDatabaseLocation?: string | undefined): string;
/**
 * Retrieves data from the database.
 * @param {string[]} keys - The keys to traverse the nested data structure.
 * @param {string|undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string|undefined} OverrideDatabaseLocation - The optional location of the database file.
 * @returns {*} The retrieved data from the database.
 */
export function GetDatabaseData(keys?: string[], OverrideDatabaseName?: string | undefined, OverrideDatabaseLocation?: string | undefined): any;
/**
 * Writes data to the database.
 * @param {string[]} keys - The keys to traverse the nested data structure.
 * @param {*} data - The data to write to the database.
 * @param {string|undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string|undefined} OverrideDatabaseLocation - The optional location of the database file.
 */
export function WriteToDatabase(keys: string[], data: any, OverrideDatabaseName?: string | undefined, OverrideDatabaseLocation?: string | undefined): void;
//# sourceMappingURL=LocalDatabase.d.ts.map