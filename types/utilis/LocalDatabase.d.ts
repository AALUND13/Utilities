import { IFindInDatabaseResult } from "../typings";
/**
 * Retrieves the path to the database file.
 * @param {string | undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string | undefined} OverrideDatabaseLocation - The optional location of the database file.
 * @returns {string} The path to the database file.
 */
export declare function getDatabasePath(OverrideDatabaseName?: string, OverrideDatabaseLocation?: string): string;
/**
 * Retrieves data from the database.
 * @param {string[]} keys - The keys to traverse the nested data structure.
 * @param {string | undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string | undefined} OverrideDatabaseLocation - The optional location of the database file.
 * @returns {*} The retrieved data from the database, or `undefined` if the data does not exist.
 */
export declare function getDatabaseData(keys?: (string | number)[], OverrideDatabaseName?: string, OverrideDatabaseLocation?: string): any;
/**
* Writes data to the local database.
*
* @param keys - An array of keys to access the nested object in the database.
* @param data - The data to be written to the database.
* @param isArray - Indicates whether the last key in the `keys` array is an index in an array.
* @param OverrideDatabaseName - Optionally, the name of the database to use instead of the default.
* @param OverrideDatabaseLocation - Optionally, the location of the database to use instead of the default.
*/
export declare function writeToDatabase(keys: (string | number)[], data: any, isArray?: boolean, OverrideDatabaseName?: string, OverrideDatabaseLocation?: string): void;
/**
* Deletes one or more entries from the local database.
*
* @param keys - An array of keys to delete from the database. If not provided, the entire database will be cleared.
* @param OverrideDatabaseName - An optional override for the database name.
* @param OverrideDatabaseLocation - An optional override for the database location.
*/
export declare function deleteFromDatabase(keys?: (string | number)[], OverrideDatabaseName?: string, OverrideDatabaseLocation?: string): void;
/**
* Finds the first item in the database that matches the provided predicate function.
*
* @param predicate - A function that takes a database item and returns a boolean indicating whether it matches the search criteria.
* @param keys - An optional array of keys to use when retrieving data from the database.
* @param OverrideDatabaseName - An optional database name to use instead of the default.
* @param OverrideDatabaseLocation - An optional database location to use instead of the default.
* @returns The first item in the database that matches the predicate, or `undefined` if no match is found.
*/
export declare function findInDatabase(predicate: (value: any) => boolean, keys?: (string | number)[], OverrideDatabaseName?: string, OverrideDatabaseLocation?: string): IFindInDatabaseResult | undefined;
/**
* Finds all items in the local database that match the provided predicate function.
*
* @param predicate - A function that takes a data item and returns a boolean indicating whether it matches the search criteria.
* @param keys - An optional array of keys to search within the database. If not provided, the entire database will be searched.
* @param OverrideDatabaseName - An optional database name to use instead of the default database name.
* @param OverrideDatabaseLocation - An optional database location to use instead of the default database location.
* @returns An array of `IFindInDatabaseResult` objects containing the matching data items and their indices, or `undefined` if no matches are found.
*/
export declare function findAllInDatabase(predicate: (data: any) => boolean, keys?: (string | number)[], OverrideDatabaseName?: string, OverrideDatabaseLocation?: string): IFindInDatabaseResult[] | undefined;
declare const _default: {
    getDatabasePath: typeof getDatabasePath;
    getDatabaseData: typeof getDatabaseData;
    writeToDatabase: typeof writeToDatabase;
    deleteFromDatabase: typeof deleteFromDatabase;
    findInDatabase: typeof findInDatabase;
    findAllInDatabase: typeof findAllInDatabase;
};
export default _default;
