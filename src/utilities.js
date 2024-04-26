/**
 * Represents a utility class that provides various functionalities.
 */
class Utilities {
    /**
     * Creates an instance of Utilities.
     * @param {object} options - The options object containing configuration settings.
     */
    constructor(options) {
        this.options = options;
        utilities = this; // Assigns the current instance to the global variable utilities
    }
}

/**
 * The global instance of the Utilities class.
 * @type {Utilities}
 */
var utilities;

module.exports = {
    Utilities,
    utilities
};
