import express from 'express'
import { defaultHTTPWebServerPort, productionSSERetryInterval, WebServerEventInteractor } from './infra/eventInteractor/server/WebServerEventInteractor'
import { ExpressWebServerInstance } from './infra/eventInteractor/server/ExpressWebServerInstance'
import { ProductionServerAdapters } from './Systems/Game/infra/ProductionServerAdapters'
import { ServerGameSystem } from './Systems/Game/ServerGame'
import { ProductionEventBus } from './infra/eventBus/ProductionEventBus'
import { createServerGameEvent } from './Events/create/create'
import { Log4jsLogger } from './Log/infra/log4jsLogger'
import { newLoopEvent } from './Events/newLoop/newLoop'
const loadProductionServer = (expressWebServerInstance:ExpressWebServerInstance, sseRetryInterval:number) => {
    const eventBus = new ProductionEventBus(new Log4jsLogger('eventBus'))
    const gameSystem = new ServerGameSystem(
        new ProductionServerAdapters(
            new WebServerEventInteractor(expressWebServerInstance, eventBus, sseRetryInterval, new Log4jsLogger('eventInteractor'))
        )
    )
    eventBus.setGameSystem(gameSystem)
    return eventBus
}

const newLoopIntervalInSeconds = 1
const expressIntance = new ExpressWebServerInstance(express(), Number(process.env.PORT || defaultHTTPWebServerPort), new Log4jsLogger('expressInstance'))
expressIntance.instance.use(express.static('dist/public'))
const eventBus = loadProductionServer(expressIntance, productionSSERetryInterval)
eventBus.send(createServerGameEvent)
    .then(() => expressIntance.start())
    .then(() => setInterval(() => eventBus.send(newLoopEvent), newLoopIntervalInSeconds * 1000))
    .catch(error => { throw error })
