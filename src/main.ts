import express from 'express'
import { Configuration } from 'log4js'
import { ServerGameSystem } from './app/core/ecs/systems/ServerGameSystem'
import { createServerGameEvent } from './app/core/events/create/create'
import { newLoopEvent } from './app/core/events/newLoop/newLoop'
import { ProductionEventBus } from './app/infra/eventBus/ProductionEventBus'
import { ExpressWebServerInstance } from './app/infra/eventInteractor/server/ExpressWebServerInstance'
import { WebServerEventInteractor } from './app/infra/eventInteractor/server/WebServerEventInteractor'
import { defaultHTTPWebServerPort, productionSSERetryInterval } from './app/infra/eventInteractor/server/webServerInformation'
import { ProductionServerAdapters } from './app/infra/game/server/ProductionServerAdapters'
import { Log4jsLogger, makeLog4jsDefaultConfiguration } from './app/infra/logger/log4jsLogger'

const loadProductionServer = (expressWebServerInstance:ExpressWebServerInstance, sseRetryInterval:number, configuration:Configuration) => {
    const eventBus = new ProductionEventBus(new Log4jsLogger('eventBus', configuration))
    const gameSystem = new ServerGameSystem(
        new ProductionServerAdapters(
            new WebServerEventInteractor(expressWebServerInstance, eventBus, sseRetryInterval, new Log4jsLogger('webServerEventInteractor', configuration))
        )
    )
    eventBus.setGameSystem(gameSystem)
    return eventBus
}

const configuration = makeLog4jsDefaultConfiguration()
const newLoopIntervalInSeconds = 1
const expressIntance = new ExpressWebServerInstance(express(), Number(process.env.PORT || defaultHTTPWebServerPort), new Log4jsLogger('expressInstance', configuration))
expressIntance.instance.use(express.static('dist/public'))
const eventBus = loadProductionServer(expressIntance, productionSSERetryInterval, configuration)
eventBus.send(createServerGameEvent)
    .then(() => expressIntance.start())
    .then(() => setInterval(() => eventBus.send(newLoopEvent), newLoopIntervalInSeconds * 1000))
    .catch(error => { throw error })
