export interface Logger {
    info(message?: any, ...optionalParams: any[]):void
    warn(message?: any, ...optionalParams: any[]):void
    debug(message?: any, ...optionalParams: any[]):void
    error(message?: any, ...optionalParams: any[]):void
}
export const LoggerNames = ['default', 'eventBus', 'eventInteractor', 'expressInstance', 'drawingAdapter', 'controllerAdapter'] as const
export type LoggerName = typeof LoggerNames[number]
