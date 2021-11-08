import express from 'express'
import { defaultHTTPWebServerPort, productionSSERetryInterval, WebServerEventInteractor } from './EventInteractor/infra/WebServerEventInteractor'
import { ExpressWebServerInstance } from './EventInteractor/infra/ExpressWebServerInstance'
import { ProductionServerAdapters } from './Systems/Game/infra/ProductionServerAdapters'
import { ServerGameSystem } from './Systems/Game/ServerGame'
import { ProductionEventBus } from './Event/infra/ProductionEventBus'
import { createServerGameEvent } from './Events/create/create'
const loadProductionServer = (expressWebServerInstance:ExpressWebServerInstance, sseRetryInterval:number) => {
    const eventBus = new ProductionEventBus()
    const gameSystem = new ServerGameSystem(
        new ProductionServerAdapters(
            new WebServerEventInteractor(
                expressWebServerInstance,
                eventBus,
                sseRetryInterval
            )
        )
    )
    eventBus.setGameSystem(gameSystem)
    return eventBus
}
const expressIntance = new ExpressWebServerInstance(express(), Number(process.env.PORT || defaultHTTPWebServerPort))
expressIntance.instance.use(express.static('dist/public'))
loadProductionServer(expressIntance, productionSSERetryInterval)
    .send(createServerGameEvent)
    .then(() => expressIntance.start())
    .catch(error => { throw error })
