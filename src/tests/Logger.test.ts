import { Logger } from "../utilis/Logger";

// Initialize Logger before all tests
beforeAll(() => {
    Logger.setup();
    Logger.fatalCauseException = false; // Prevent the test from throwing an exception
});

test('Logger.log() should log a message to the console.', () => {
    Logger.log('Test message');
});

test('Logger.warn() should log a warning message to the console.', () => {
    Logger.warn('Test warning message');
});

test('Logger.error() should log an error message to the console.', () => {
    Logger.error('Test error message');
});

test('Logger.fatal() should log a fatal error message to the console.', () => {
    Logger.fatal('Test fatal error message');
});

test('Console.log() should use the "Logger.log()" method instead of the original console.log() method.', () => {
    console.log('Test message');
});

test('Console.warn() should use the "Logger.warn()" method instead of the original console.warn() method.', () => {
    console.warn('Test warning message');
});

test('Console.error() should use the "Logger.error()" method instead of the original console.error() method.', () => {
    console.error('Test error message');
});