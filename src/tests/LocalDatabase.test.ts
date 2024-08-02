import LocalDatabase from "../utilis/LocalDatabase";
import { Utilities } from "../utilities";

// Initialize Utilities before all tests
beforeAll(() => {
    new Utilities({
        databaseName: "test",
        databaseLocation: `${__dirname}`,
    });

    LocalDatabase.deleteFromDatabase();
    console.log('Cleaned the database');
});

test('Writing a string value to the database', () => {
    LocalDatabase.writeToDatabase(["test"], "test");
    expect(LocalDatabase.getDatabaseData(["test"])).toBe("test");
});

test('Writing a string value "test" to an array at key "testArray".', () => {
    LocalDatabase.writeToDatabase(["testArray", 0], "test", true);
    expect(LocalDatabase.getDatabaseData(["testArray", 0])).toBe("test");
});

test('Writing a string value "test2" to the array at key "testArray".', () => {
    LocalDatabase.writeToDatabase(["testArray", 1], "test2", true);
    expect(LocalDatabase.getDatabaseData(["testArray", 1])).toBe("test2");
});

test('Writing an object {"test": "test"} to the array at key "testArray", treating it as an array.', () => {
    LocalDatabase.writeToDatabase(["testArray", 2], {"test": "test"}, true);
    expect(LocalDatabase.getDatabaseData(["testArray", 2])).toEqual({"test": "test"});
});

test('Writing a string value "test2" to the nested array within the object at key "testArray".', () => {
    LocalDatabase.writeToDatabase(["testArray", 2, "test2"], "test2");
    expect(LocalDatabase.getDatabaseData(["testArray", 2, "test2"])).toBe("test2");
});
