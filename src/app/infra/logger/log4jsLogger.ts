import { configure, getLogger, Configuration, Appender } from 'log4js'
import { Logger, LoggerName } from '../../core/port/Logger'

const logDir = 'logs'
const appLog = 'app.log'
const defaultLoggerName = 'default'
const defaultAppender:Appender = { type: 'file', filename: `${logDir}/${appLog}`, maxLogSize: '100M' }

export const makeLog4jsDefaultConfiguration = ():Configuration => {
    const configuration:Configuration = { appenders: {}, categories: {} }
    configuration.appenders[defaultLoggerName] = defaultAppender
    configuration.categories[defaultLoggerName] = { appenders: [defaultLoggerName], level: 'debug' }
    configure(configuration)
    return configuration
}

export class Log4jsLogger implements Logger {
    constructor (private loggerName:LoggerName, configuration:Configuration) {
        configuration.appenders[this.loggerName] = { type: 'file', filename: `logs/${this.loggerName}.log`, maxLogSize: '100M' }
        configuration.categories[this.loggerName] = { appenders: [this.loggerName, defaultLoggerName], level: 'debug' }
        configure(configuration)
    }

    info (message?: any, ...optionalParams: any[]): void {
        getLogger(this.loggerName).info(message, ...optionalParams)
    }

    warn (message?: any, ...optionalParams: any[]): void {
        getLogger(this.loggerName).warn(message, ...optionalParams)
    }

    debug (message?: any, ...optionalParams: any[]): void {
        getLogger(this.loggerName).debug(message, ...optionalParams)
    }

    error (message?: any, ...optionalParams: any[]): void {
        getLogger(this.loggerName).error(message, ...optionalParams)
    }
}
