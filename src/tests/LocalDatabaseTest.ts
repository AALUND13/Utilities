import test from "node:test";
import LocalDatabase from "../utilis/LocalDatabase";
import { Utilities } from "../utilities";

function delay(num: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, num);
    });
}

new Utilities({
    databaseName: "test",
    databaseLocation: `${__dirname}`,
});

// Writing a string value "test" to the key "test" in the database.
LocalDatabase.writeToDatabase(["test"], "test");

// Writing a string value "test" to an array at key "testArray".
LocalDatabase.writeToDatabase(["testArray", 0], "test", true);

// Writing a string value "test2" to the array at key "testArray".
LocalDatabase.writeToDatabase(["testArray", 1], "test2", true);

// Writing an object {"test": "test"} to the array at key "testArray", treating it as an array.
LocalDatabase.writeToDatabase(["testArray", 2], {"test": "test"} , true);

// Writing the string value "test2" to the nested array within the object at key "testArray".
// The new value is appended to the end of the nested array, using the length of the current array to determine the index.
LocalDatabase.writeToDatabase(["testArray", 2, "test2"], "test2");

// Find "test2" in "TestArray" in the database
console.log(LocalDatabase.findInDatabase((data) => data.test2 === "test2", ["testArray"]));

// Deleting the data at the nested key ["testArray", 2, "test2"] from the database after 10 second.
delay(10000).then(() => {
    LocalDatabase.deleteFromDatabase();
})