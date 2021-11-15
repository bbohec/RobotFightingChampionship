import { Logger } from '../port/logger'
import * as Winston from 'winston'

export class WinstonLogger implements Logger {
    info (message?: any, ...optionalParams: any[]): void {
        this.winstonLogger.info(message, ...optionalParams)
    }

    warn (message?: any, ...optionalParams: any[]): void {
        this.winstonLogger.warn(message, ...optionalParams)
    }

    debug (message?: any, ...optionalParams: any[]): void {
        this.winstonLogger.debug(message, ...optionalParams)
    }

    error (message?: any, ...optionalParams: any[]): void {
        this.winstonLogger.error(message, ...optionalParams)
    }

    private winstonLogger = Winston.createLogger({
        format: Winston.format.combine(
            Winston.format.timestamp(),
            Winston.format.simple()
        ),
        transports: [new Winston.transports.Console()]
    })
}
