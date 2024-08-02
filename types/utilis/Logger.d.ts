export declare class Logger {
    private static originalConsoleLog;
    private static originalConsoleWarn;
    private static originalConsoleError;
    private static logStartTime;
    private static setupCalled;
    static logToFileEnabled: boolean;
    static fatalCauseException: boolean;
    /**
     * Template for log messages.
     *
     * Available placeholders:
     * - ${timestamp} - The timestamp of the log message
     * - ${level} - The level of the log message
     * - ${message} - The message to be logged
     *
     * Optional transformations:
     * - ":upperCase=bool" - Converts the variable to uppercase if set to true (e.g., ${message:upperCase=true})
     * - ":lowerCase=bool" - Converts the variable to lowercase if set to true (e.g., ${message:lowerCase=true})
     *
     * Example usage:
     * utillties.Logger.consoleLogMessage = '[${timestamp}] [${level:upperCase=true}]: ${message}';
     */
    static consoleLogMessage: string;
    /**
     * Template for log file name.
     *
     * Available placeholders:
     * - ${timestamp} - The timestamp of the logging session started
     *
     * Example usage:
     * utillties.Logger.logFileName = 'logfile-${timestamp}.log';
     */
    static logFileName: string;
    private static replaceMessageWithTemplate;
    static log(...data: any[]): void;
    static log(message?: any, ...optionalParams: any[]): void;
    static warn(...data: any[]): void;
    static warn(message?: any, ...optionalParams: any[]): void;
    static error(...data: any[]): void;
    static error(message?: any, ...optionalParams: any[]): void;
    static fatal(...data: any[]): void;
    static fatal(message?: any, ...optionalParams: any[]): void;
    static setup(enableLogToFile?: boolean): void;
    private static logToFile;
    private static stripAnsiEscapeCodes;
}
