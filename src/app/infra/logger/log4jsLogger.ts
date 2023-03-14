import { configure, getLogger, Configuration, Logger as log4jsLogger } from 'log4js'
import { Logger, LoggerName } from '../../core/port/Logger'

const configuration:Configuration = { appenders: {}, categories: {} }
configuration.appenders.default = { type: 'console' }
configuration.categories.default = { appenders: ['default'], level: 'debug' }
configure(configuration)
export class Log4jsLogger implements Logger {
    constructor (loggerName:LoggerName) {
        configuration.appenders[loggerName] = { type: 'console' }
        configuration.categories[loggerName] = { appenders: [loggerName], level: 'debug' }
        configure(configuration)
        this.log4jsLogger = getLogger(loggerName)
    }

    info (message?: any, ...optionalParams: any[]): void {
        this.log4jsLogger.info(message, ...optionalParams)
    }

    warn (message?: any, ...optionalParams: any[]): void {
        this.log4jsLogger.warn(message, ...optionalParams)
    }

    debug (message?: any, ...optionalParams: any[]): void {
        this.log4jsLogger.debug(message, ...optionalParams)
    }

    error (message?: any, ...optionalParams: any[]): void {
        this.log4jsLogger.error(message, ...optionalParams)
    }

    private readonly log4jsLogger:log4jsLogger
}
