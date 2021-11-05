import express from 'express'
import { InMemoryEventBus } from './Event/infra/InMemoryEventBus'
import { defaultHTTPWebServerPort, ExpressWebServerInstance, productionSSERetryInterval, WebServerEventInteractor } from './EventInteractor/infra/WebServerEventInteractor'
import { ProductionServerAdapters } from './Systems/Game/infra/ProductionServerAdapters'
import { ServerGameSystem } from './Systems/Game/ServerGame'
const loadProductionServer = (expressWebServerInstance:ExpressWebServerInstance, sseRetryInterval:number) => {
    return new ServerGameSystem(
        new ProductionServerAdapters(
            new WebServerEventInteractor(
                expressWebServerInstance,
                new InMemoryEventBus(),
                sseRetryInterval
            )
        )
    )
}
const expressIntance = new ExpressWebServerInstance(express(), Number(process.env.PORT || defaultHTTPWebServerPort))
expressIntance.instance.use(express.static('dist/public'))
loadProductionServer(expressIntance, productionSSERetryInterval)
expressIntance.start()
