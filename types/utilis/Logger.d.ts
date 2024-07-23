export declare class Logger {
    private static originalConsoleLog;
    private static originalConsoleWarn;
    private static originalConsoleError;
    private static logToFileEnabled;
    static log(...data: any[]): void;
    static log(message?: any, ...optionalParams: any[]): void;
    static warn(...data: any[]): void;
    static warn(message?: any, ...optionalParams: any[]): void;
    static error(...data: any[]): void;
    static error(message?: any, ...optionalParams: any[]): void;
    static setup(enableLogToFile: boolean): void;
    private static logToFile;
    private static stripAnsiEscapeCodes;
}
