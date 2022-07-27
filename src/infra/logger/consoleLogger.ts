import { Logger, LoggerName } from '../../app/core/port/Logger'

export class ConsoleLogger implements Logger {
    constructor (loggerName:LoggerName) {
        this.loggerName = loggerName
    }

    info (message?: any, ...optionalParams: any[]): void {
        console.log(`[${this.isoDate()}]`, '[INFO]', this.loggerName, message, ...optionalParams)
    }

    warn (message?: any, ...optionalParams: any[]): void {
        console.log(`[${this.isoDate()}]`, this.loggerName, message, ...optionalParams)
    }

    debug (message?: any, ...optionalParams: any[]): void {
        console.log(`[${this.isoDate()}]`, '[DEBUG]', this.loggerName, message, ...optionalParams)
    }

    error (message?: any, ...optionalParams: any[]): void {
        console.log(`[${this.isoDate()}]`, '[ERROR]', this.loggerName, message, ...optionalParams)
    }

    private isoDate (): any {
        return new Date(Date.now()).toISOString()
    }

    private loggerName: LoggerName
}
