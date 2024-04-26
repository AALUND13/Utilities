const path = require('path');
const fs = require('fs');
const { utilities } = require('../utilities');

/**
 * Retrieves the path to the database file.
 * @param {string|undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string|undefined} OverrideDatabaseLocation - The optional location of the database file.
 * @returns {string} The path to the database file.
 */
function GetDatabasePath(OverrideDatabaseName = undefined, OverrideDatabaseLocation = undefined) {
    var databaseName = OverrideDatabaseName || utilities.databaseName;
    var databaseLocation = OverrideDatabaseLocation || utilities.databaseLocation;
    return path.join(databaseLocation, `${databaseName}.json`);
}

/**
 * Retrieves data from the database.
 * @param {string[]} keys - The keys to traverse the nested data structure.
 * @param {string|undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string|undefined} OverrideDatabaseLocation - The optional location of the database file.
 * @returns {*} The retrieved data from the database.
 */
function GetDatabaseData(keys = [], OverrideDatabaseName = undefined, OverrideDatabaseLocation = undefined) {
    if (OverrideDatabaseName === undefined && utilities.databaseName === undefined) {
        throw new Error("No database name specified in the configuration.");
    } else if (OverrideDatabaseLocation === undefined && utilities.databaseLocation === undefined) {
        throw new Error("No database location specified in the configuration.");
    }

    const databasePath = GetDatabasePath(OverrideDatabaseName, OverrideDatabaseLocation);
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
 * Writes data to the database.
 * @param {string[]} keys - The keys to traverse the nested data structure.
 * @param {*} data - The data to write to the database.
 * @param {string|undefined} OverrideDatabaseName - The optional name of the database file.
 * @param {string|undefined} OverrideDatabaseLocation - The optional location of the database file.
 */
function WriteToDatabase(keys, data, OverrideDatabaseName = undefined, OverrideDatabaseLocation = undefined) {
    if (OverrideDatabaseName === undefined && utilities.databaseName === undefined) {
        throw new Error("No database name specified in the configuration.");
    } else if (OverrideDatabaseLocation === undefined && utilities.databaseLocation === undefined) {
        throw new Error("No database location specified in the configuration.");
    }

    const databasePath = GetDatabasePath(OverrideDatabaseName, OverrideDatabaseLocation);
    const allData = GetDatabaseData(keys, OverrideDatabaseName, OverrideDatabaseLocation); // Pass keys parameter

    // Traverse the keys array and access the nested object until the last key
    let nestedObject = allData;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        nestedObject[key] = nestedObject[key] || {};
        nestedObject = nestedObject[key];
    }

    // Assign the data to the last key in the array
    const lastKey = keys[keys.length - 1];
    nestedObject[lastKey] = data;

    // Write the updated data back to the file
    fs.writeFileSync(databasePath, JSON.stringify(allData, undefined, 2));
}

module.exports = {
    GetDatabasePath,
    GetDatabaseData,
    WriteToDatabase
};
