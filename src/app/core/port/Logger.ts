export interface Logger {
    info(message?: any, ...optionalParams: any[]):void
    warn(message?: any, ...optionalParams: any[]):void
    debug(message?: any, ...optionalParams: any[]):void
    error(message?: any, ...optionalParams: any[]):void
}
export const LoggerNames = ['default', 'eventBus', 'expressInstance', 'drawingAdapter', 'controllerAdapter', 'webServerEventInteractor', 'webClientEventInteractor'] as const
export type LoggerName = typeof LoggerNames[number]
