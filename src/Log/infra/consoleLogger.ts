import { Logger, LoggerName } from '../port/logger'

export class ConsoleLogger implements Logger {
    constructor (loggerName:LoggerName) {
        this.loggerName = loggerName
    }

    info (message?: any, ...optionalParams: any[]): void {
        console.log('INFO', this.loggerName, message, ...optionalParams)
    }

    warn (message?: any, ...optionalParams: any[]): void {
        console.log('WARN', this.loggerName, message, ...optionalParams)
    }

    debug (message?: any, ...optionalParams: any[]): void {
        console.log('DEBUG', this.loggerName, message, ...optionalParams)
    }

    error (message?: any, ...optionalParams: any[]): void {
        console.log('ERROR', this.loggerName, message, ...optionalParams)
    }

    private loggerName: LoggerName
}
