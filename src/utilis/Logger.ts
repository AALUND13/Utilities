import * as fs from 'fs';

export class Logger {
    private static originalConsoleLog = console.log;
    private static originalConsoleWarn = console.warn;
    private static originalConsoleError = console.error;

    private static logToFileEnabled = false;

    // Overloads for log
    public static log(...data: any[]): void;
    public static log(message?: any, ...optionalParams: any[]): void;

    // Implementation for log
    public static log(...args: any[]): void {
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -1); // ISO format without 'Z'
        Logger.originalConsoleLog(`[${timestamp}]:`, ...args);
        if (Logger.logToFileEnabled) {
            Logger.logToFile(`[${timestamp}]:`, ...args);
        }
    }

    // Overloads for warn
    public static warn(...data: any[]): void;
    public static warn(message?: any, ...optionalParams: any[]): void;

    // Implementation for warn
    public static warn(...args: any[]): void {
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -1); // ISO format without 'Z'
        Logger.originalConsoleWarn(`[${timestamp}]:`, ...args);
        if (Logger.logToFileEnabled) {
            Logger.logToFile(`[${timestamp}]:`, ...args);
        }
    }

    // Overloads for error
    public static error(...data: any[]): void;
    public static error(message?: any, ...optionalParams: any[]): void;

    // Implementation for error
    public static error(...args: any[]): void {
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -1); // ISO format without 'Z'
        Logger.originalConsoleError(`[${timestamp}]:`, ...args);
        if (Logger.logToFileEnabled) {
            Logger.logToFile(`[${timestamp}]:`, ...args);
        }
    }

    public static setup(enableLogToFile: boolean): void {
        fs.writeFileSync('logfile.txt', ''); // Clear the log file
        Logger.logToFileEnabled = enableLogToFile;

        console.log = Logger.log;
        console.warn = Logger.warn;
        console.error = Logger.error;


    }

    private static logToFile(...data: any[]): void {
        const logMessage = data.map(d => typeof d === 'string' ? d : JSON.stringify(d)).join(' ');
        fs.appendFileSync('logfile.log', this.stripAnsiEscapeCodes(logMessage) + '\n');
    }

    private static stripAnsiEscapeCodes(text: string): string {
        // Regular expression to match ANSI escape codes
        const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
        return text.replace(ansiRegex, '');
    }
}
