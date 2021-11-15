import express from 'express'
import { defaultHTTPWebServerPort, productionSSERetryInterval, WebServerEventInteractor } from './EventInteractor/infra/WebServerEventInteractor'
import { ExpressWebServerInstance } from './EventInteractor/infra/ExpressWebServerInstance'
import { ProductionServerAdapters } from './Systems/Game/infra/ProductionServerAdapters'
import { ServerGameSystem } from './Systems/Game/ServerGame'
import { ProductionEventBus } from './Event/infra/ProductionEventBus'
import { createServerGameEvent } from './Events/create/create'
import { Log4jsLogger } from './Log/infra/log4jsLogger'
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

const expressIntance = new ExpressWebServerInstance(express(), Number(process.env.PORT || defaultHTTPWebServerPort), new Log4jsLogger('expressInstance'))
expressIntance.instance.use(express.static('dist/public'))
loadProductionServer(expressIntance, productionSSERetryInterval)
    .send(createServerGameEvent)
    .then(() => expressIntance.start())
    .catch(error => { throw error })
