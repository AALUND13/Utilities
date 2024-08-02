import * as fs from 'fs';
import * as path from 'path';

export class Logger {
    private static originalConsoleLog = console.log;
    private static originalConsoleWarn = console.warn;
    private static originalConsoleError = console.error;
    
    private static logStartTime: string | undefined = undefined;
    private static setupCalled = false;
    
    // Enable or disable logging to a file
    public static logToFileEnabled = false;
    // Enable or disable fatal cause exception
    public static fatalCauseException = true;
    

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
    public static consoleLogMessage = '[${timestamp}] [${level:upperCase=true}]: ${message}';

    /**
     * Template for log file name.
     * 
     * Available placeholders:
     * - ${timestamp} - The timestamp of the logging session started
     * 
     * Example usage:
     * utillties.Logger.logFileName = 'logfile-${timestamp}.log';
     */
    public static logFileName = 'logs/logfile-${timestamp}.log';


    private static replaceMessageWithTemplate(message: string, level: string): string {
        let convertedMessage = this.consoleLogMessage;

        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -1); // ISO format without 'Z'
        convertedMessage = convertedMessage.replace('${timestamp}', timestamp);

        const levelPlaceholderRegex = /\$\{level(:upperCase=(true|false))?(:lowerCase=(true|false))?\}/;
        const messagePlaceholderRegex = /\$\{message(:upperCase=(true|false))?(:lowerCase=(true|false))?\}/;

        const applyTransformations = (value: string, transformations: { upperCase?: boolean; lowerCase?: boolean }) => {
            if (transformations.upperCase) {
                value = value.toUpperCase();
            }
            if (transformations.lowerCase) {
                value = value.toLowerCase();
            }
            return value;
        };

        const parsePlaceholder = (placeholder: string, value: string) => {
            const upperCaseMatch = placeholder.match(/:upperCase=(true|false)/);
            const lowerCaseMatch = placeholder.match(/:lowerCase=(true|false)/);

            const transformations = {
                upperCase: upperCaseMatch ? upperCaseMatch[1] === 'true' : false,
                lowerCase: lowerCaseMatch ? lowerCaseMatch[1] === 'true' : false,
            };

            return applyTransformations(value, transformations);
        };

        const levelMatch = convertedMessage.match(levelPlaceholderRegex);
        if (levelMatch) {
            const placeholder = levelMatch[0];
            const transformedLevel = parsePlaceholder(placeholder, level);
            convertedMessage = convertedMessage.replace(placeholder, transformedLevel);
        }

        const messageMatch = convertedMessage.match(messagePlaceholderRegex);
        if (messageMatch) {
            const placeholder = messageMatch[0];
            const transformedMessage = parsePlaceholder(placeholder, message);
            convertedMessage = convertedMessage.replace(placeholder, transformedMessage);
        }

        return convertedMessage;
    }

    public static log(...data: any[]): void;
    public static log(message?: any, ...optionalParams: any[]): void;
    public static log(...args: any[]): void {
        if (!Logger.setupCalled) {
            throw new Error('Logger.setup() must be called before using the logger.');
        }

        const [message, ...optionalParams] = args;
        const convertedMessage = Logger.replaceMessageWithTemplate(message, 'Info');
        Logger.originalConsoleLog(convertedMessage);
        if (Logger.logToFileEnabled) {
            Logger.logToFile(convertedMessage);
        }
    }

    public static warn(...data: any[]): void;
    public static warn(message?: any, ...optionalParams: any[]): void;
    public static warn(...args: any[]): void {
        if (!Logger.setupCalled) {
            throw new Error('Logger.setup() must be called before using the logger.');
        }

        const [message, ...optionalParams] = args;
        const convertedMessage = Logger.replaceMessageWithTemplate(message, 'Warn');
        Logger.originalConsoleWarn(convertedMessage);
        if (Logger.logToFileEnabled) {
            Logger.logToFile(convertedMessage);
        }   
    }

    public static error(...data: any[]): void;
    public static error(message?: any, ...optionalParams: any[]): void;
    public static error(...args: any[]): void {
        if (!Logger.setupCalled) {
            throw new Error('Logger.setup() must be called before using the logger.');
        }

        const [message, ...optionalParams] = args;
        const convertedMessage = Logger.replaceMessageWithTemplate(message, 'Error');
        Logger.originalConsoleError(convertedMessage);
        if (Logger.logToFileEnabled) {
            Logger.logToFile(convertedMessage);
        }
    }

    public static fatal(...data: any[]): void;
    public static fatal(message?: any, ...optionalParams: any[]): void;
    public static fatal(...args: any[]): void {
        if (!Logger.setupCalled) {
            throw new Error('Logger.setup() must be called before using the logger.');
        }

        const [message, ...optionalParams] = args;
        const convertedMessage = Logger.replaceMessageWithTemplate(message, 'Fatal');
    
        try {
            throw new Error(convertedMessage);
        } catch (error: any) {
            // Prevent double logging of fatal errors
            if (!Logger.fatalCauseException) {
                Logger.originalConsoleError(convertedMessage);
                if (Logger.logToFileEnabled) {
                    Logger.logToFile(convertedMessage);
                }
            } else {
                throw error;
            }
        }
    }

    public static setup(enableLogToFile: boolean= true): void {
        this.logStartTime = new Date().toISOString().replace('T', ' ').slice(0, -1); // ISO format without 'Z'

        console.log(`Logger started at ${this.logStartTime}`);

        const logDir = path.dirname(Logger.logFileName);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        fs.writeFileSync(Logger.logFileName.replace('${timestamp}', this.logStartTime!).replace(/:/g, '-'), ''); // Create log file
        Logger.logToFileEnabled = enableLogToFile;

        console.log = Logger.log;
        console.warn = Logger.warn;
        console.error = Logger.error;


        // Log uncaught exceptions
        process.on('uncaughtException', (error: Error) => {
            this.fatalCauseException = false; // Prevent infinite loop
            Logger.fatal(`Uncaught exception: ${error.message}`);
        });

        this.setupCalled = true;
    }

    private static logToFile(...data: any[]): void {
        const logMessage = data.map(d => typeof d === 'string' ? d : JSON.stringify(d)).join(' ');
        fs.appendFileSync(Logger.logFileName.replace('${timestamp}', this.logStartTime!).replace(/:/g, '-'), this.stripAnsiEscapeCodes(logMessage) + '\n');
    }

    private static stripAnsiEscapeCodes(text: string): string {
        // Regular expression to match ANSI escape codes
        const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
        return text.replace(ansiRegex, '');
    }
}
