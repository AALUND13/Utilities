import * as path from "path";
import * as fs from "fs";
import { Utilities } from "../utilities";
import { IFindInDatabaseResult } from "../typings";

/**
 * Retrieves the path to the database file.
 * @param {string | undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string | undefined} OverrideDatabaseLocation - The optional location of the database file.
 * @returns {string} The path to the database file.
 */
export function getDatabasePath(OverrideDatabaseName?: string, OverrideDatabaseLocation?: string): string {
    var databaseName = OverrideDatabaseName || Utilities._instance.getDataBaseName();
    var databaseLocation = OverrideDatabaseLocation || Utilities._instance.getDataBaseLocation();
    return path.join(databaseLocation, `${databaseName}.json`);
}

/**
 * Retrieves data from the database.
 * @param {string[]} keys - The keys to traverse the nested data structure.
 * @param {string | undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string | undefined} OverrideDatabaseLocation - The optional location of the database file.
 * @returns {*} The retrieved data from the database, or `undefined` if the data does not exist.
 */
export function getDatabaseData(keys: (string | number)[] = [], OverrideDatabaseName?: string, OverrideDatabaseLocation?: string): any {
    if (OverrideDatabaseName === undefined && Utilities._instance.getDataBaseName() === undefined) {
        throw new Error("No database name specified in the configuration.");
    } else if (OverrideDatabaseLocation === undefined && Utilities._instance.getDataBaseLocation() === undefined) {
        throw new Error("No database location specified in the configuration.");
    }

    const databasePath = getDatabasePath(OverrideDatabaseName, OverrideDatabaseLocation);
    if (!fs.existsSync(databasePath)) {
        console.log("Database does not exist, creating...");
        fs.writeFileSync(databasePath, "{}");
    }

    const rawData = fs.readFileSync(databasePath, "utf8");
    const allData = JSON.parse(rawData);

    // If keys array is empty, return everything from the database
    if (keys.length === 0) {
        return allData;
    }

    // Traverse the keys array to access nested data
    let nestedData = allData;
    for (const key of keys) {
        nestedData = nestedData[key];
        // If any intermediate key is undefined, return undefined
        if (nestedData === undefined) {
            return undefined;
        }
    }

    return nestedData;
}

/**
* Writes data to the local database.
*
* @param keys - An array of keys to access the nested object in the database.
* @param data - The data to be written to the database.
* @param isArray - Indicates whether the last key in the `keys` array is an index in an array.
* @param OverrideDatabaseName - Optionally, the name of the database to use instead of the default.
* @param OverrideDatabaseLocation - Optionally, the location of the database to use instead of the default.
*/
export function writeToDatabase(keys: (string | number)[], data: any, isArray: boolean = false, OverrideDatabaseName?: string, OverrideDatabaseLocation?: string): void {
    if (OverrideDatabaseName === undefined && Utilities._instance.getDataBaseName() === undefined) {
        throw new Error("No database name specified in the configuration.");
    } else if (OverrideDatabaseLocation === undefined && Utilities._instance.getDataBaseLocation() === undefined) {
        throw new Error("No database location specified in the configuration.");
    }

    const databasePath = getDatabasePath(OverrideDatabaseName, OverrideDatabaseLocation);
    let allData = getDatabaseData([], OverrideDatabaseName, OverrideDatabaseLocation) || {}; // Pass an empty array for the root level

    // Traverse the keys array and access the nested object until the last key
    let nestedObject = allData;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key === undefined) {
            return;
        }
        if (!nestedObject[key]) {
            // If the key doesn't exist, create an empty object or array based on the next key
            nestedObject[key] = typeof keys[i + 1] === 'number' ? [] : {};
        }
        nestedObject = nestedObject[key];
    }

    // Assign the data to the last key in the array
    const lastKey = keys[keys.length - 1];
    if (lastKey === undefined) {
        return;
    }

    if (isArray && typeof lastKey === 'number') {
        // If the last key is a number, treat it as an index in the array and override the existing data
        nestedObject[lastKey] = data;
    } else {
        // Otherwise, assign the data as usual
        nestedObject[lastKey] = data;
    }

    // Write the updated data back to the file
    fs.writeFileSync(databasePath, JSON.stringify(allData, undefined, 2));
}

/**
* Deletes one or more entries from the local database.
*
* @param keys - An array of keys to delete from the database. If not provided, the entire database will be cleared.
* @param OverrideDatabaseName - An optional override for the database name.
* @param OverrideDatabaseLocation - An optional override for the database location.
*/
export function deleteFromDatabase(keys?: (string | number)[], OverrideDatabaseName?: string, OverrideDatabaseLocation?: string): void {
    if (OverrideDatabaseName === undefined && Utilities._instance.getDataBaseName() === undefined) {
        throw new Error("No database name specified in the configuration.");
    } else if (OverrideDatabaseLocation === undefined && Utilities._instance.getDataBaseLocation() === undefined) {
        throw new Error("No database location specified in the configuration.");
    }

    const databasePath = getDatabasePath(OverrideDatabaseName, OverrideDatabaseLocation);
    let allData = getDatabaseData([], OverrideDatabaseName, OverrideDatabaseLocation) || {}; // Pass an empty array for the root level

    if (keys === undefined) {
        // Clear the database
        fs.writeFileSync(databasePath, "{}");
        return;
    }

    // Traverse the keys array and access the nested object until the last key
    let nestedObject = allData;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key === undefined) {
            return;
        }
        if (!nestedObject[key]) {
            // If the key doesn't exist, there's nothing to delete
            return;
        }
        nestedObject = nestedObject[key];
    }

    // Assign the data to the last key in the array
    const lastKey = keys[keys.length - 1];
    if (lastKey === undefined) {
        return;
    }

    // Delete the data at the last key
    delete nestedObject[lastKey];

    // Write the updated data back to the file
    fs.writeFileSync(databasePath, JSON.stringify(allData, undefined, 2));
}


/**
* Finds the first item in the database that matches the provided predicate function.
*
* @param predicate - A function that takes a database item and returns a boolean indicating whether it matches the search criteria.
* @param keys - An optional array of keys to use when retrieving data from the database.
* @param OverrideDatabaseName - An optional database name to use instead of the default.
* @param OverrideDatabaseLocation - An optional database location to use instead of the default.
* @returns The first item in the database that matches the predicate, or `undefined` if no match is found.
*/
export function findInDatabase(predicate: (value: any) => boolean, keys: (string | number)[] = [], OverrideDatabaseName?: string, OverrideDatabaseLocation?: string): IFindInDatabaseResult | undefined {
    if (OverrideDatabaseName === undefined && Utilities._instance.getDataBaseName() === undefined) {
        throw new Error("No database name specified in the configuration.");
    } else if (OverrideDatabaseLocation === undefined && Utilities._instance.getDataBaseLocation() === undefined) {
        throw new Error("No database location specified in the configuration.");
    }

    const data = getDatabaseData(keys, OverrideDatabaseName, OverrideDatabaseLocation);

    // Recursive function to traverse nested data
    const findInNestedData = (nestedData: any, parentKey?: string | number): IFindInDatabaseResult | undefined => {
        // Base case: if data is an array, check each item in the array
        if (Array.isArray(nestedData)) {
            const index = nestedData.findIndex(predicate);
            if (index !== -1) {
                return { data: nestedData[index], index };
            }
        } else if (typeof nestedData === 'object') { // Recursive case: if data is an object, traverse its properties
            for (const key in nestedData) {
                const currentKey = parentKey !== undefined ? `${parentKey}.${key}` : key;
                const result = findInNestedData(nestedData[key], currentKey);
                if (result !== undefined) {
                    return result;
                }
            }
        } else { // If data is neither an array nor an object, apply the predicate directly
            if (predicate(nestedData)) {
                return { data: nestedData, index: -1 };
            }
        }
        return undefined; // Predicate didn't match any item
    };

    return findInNestedData(data);
}

/**
* Finds all items in the local database that match the provided predicate function.
*
* @param predicate - A function that takes a data item and returns a boolean indicating whether it matches the search criteria.
* @param keys - An optional array of keys to search within the database. If not provided, the entire database will be searched.
* @param OverrideDatabaseName - An optional database name to use instead of the default database name.
* @param OverrideDatabaseLocation - An optional database location to use instead of the default database location.
* @returns An array of `IFindInDatabaseResult` objects containing the matching data items and their indices, or `undefined` if no matches are found.
*/
export function findAllInDatabase(predicate: (data: any) => boolean, keys: (string | number)[] = [], OverrideDatabaseName?: string, OverrideDatabaseLocation?: string): IFindInDatabaseResult[] | undefined {
    if (OverrideDatabaseName === undefined && Utilities._instance.getDataBaseName() === undefined) {
        throw new Error("No database name specified in the configuration.");
    } else if (OverrideDatabaseLocation === undefined && Utilities._instance.getDataBaseLocation() === undefined) {
        throw new Error("No database location specified in the configuration.");
    }

    const data = getDatabaseData(keys, OverrideDatabaseName, OverrideDatabaseLocation);
    let results: IFindInDatabaseResult[] = [];

    // Recursive function to traverse nested data
    const findInNestedData = (nestedData: any, parentKey?: string | number): void => {
        // Base case: if data is an array, check each item in the array
        if (Array.isArray(nestedData)) {
            nestedData.forEach((item, index) => {
                if (predicate(item)) {
                    results.push({ data: item, index });
                }
            });
        } else if (typeof nestedData === 'object') { // Recursive case: if data is an object, traverse its properties
            for (const key in nestedData) {
                const currentKey = parentKey !== undefined ? `${parentKey}.${key}` : key;
                findInNestedData(nestedData[key], currentKey);
            }
        } else { // If data is neither an array nor an object, apply the predicate directly
            if (predicate(nestedData)) {
                results.push({ data: nestedData, index: -1 });
            }
        }
    };

    findInNestedData(data);

    return results.length > 0 ? results : undefined;
}



export default {
    getDatabasePath,
    getDatabaseData,
    writeToDatabase,
    deleteFromDatabase,
    findInDatabase,
    findAllInDatabase
}