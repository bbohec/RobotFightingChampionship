import { Func } from 'mocha'
import { position, Position, makePhysical } from '../../core/ecs/components/Physical'
import { ClientEventInteractor, ServerEventInteractor } from '../../core/port/EventInteractor'
import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { GameEvent, newGameEvent } from '../../core/type/GameEvent'
import { ShapeType } from '../../core/type/ShapeType'
import { EntityIds } from '../../test/entityIds'
import { InMemoryEventBus } from '../eventBus/InMemoryEventBus'
import { ConsoleLogger } from '../logger/consoleLogger'
import { InMemoryClientEventInteractor } from './client/InMemoryClientEventInteractor'
import { WebClientEventInteractor } from './client/WebClientEventInteractor'
import { InMemoryServerEventInteractor } from './server/InMemoryServerEventInteractor'
import { defaultHTTPWebServerPort } from './server/WebServerEventInteractor'

export interface ClientEventIntegrationTestSuite {
    clientEventInteractor:ClientEventInteractor
    clientEvents:GameEvent[]
}
export interface EventIntegrationTestSuite {
    adapterType: string
    serverEventInteractor: ServerEventInteractor
    clientsEventIntegrationTestSuite: ClientEventIntegrationTestSuite[]
}
export const serverFullyQualifiedDomainName = 'localhost'
export const clientQty = 10

export const makeRestClientsEventIntegrationTestSuite = (qty:number):ClientEventIntegrationTestSuite[] => [...Array(qty).keys()].map(value => makeRestClientEventIntegrationTestSuite(value.toString(), position(0, 0)))
export const makeInMemoryClientsEventIntegrationTestSuite = (qty:number):ClientEventIntegrationTestSuite[] => [...Array(qty).keys()].map(value => makeInMemoryClientEventIntegrationTestSuite(value.toString(), position(0, 0)))
export const beforeFunction = (testSuite: EventIntegrationTestSuite): Func => function (done) {
    this.timeout(5000)
    console.log(`BEFORE TEST SUITE - ${testSuite.adapterType}`)
    testSuite.clientsEventIntegrationTestSuite.forEach(clientEventIntegrationTestSuite => {
        if (clientEventIntegrationTestSuite.clientEventInteractor instanceof InMemoryClientEventInteractor)
            clientEventIntegrationTestSuite.clientEventInteractor.setServerEventInteractor(testSuite.serverEventInteractor)
    })
    if (testSuite.serverEventInteractor instanceof InMemoryServerEventInteractor) configureInMemoryClientsOnServer(testSuite.serverEventInteractor, testSuite)
    testSuite.serverEventInteractor.start()
        .then(() => Promise.all(testSuite.clientsEventIntegrationTestSuite.map(clientEventIntegrationTestSuite => clientEventIntegrationTestSuite.clientEventInteractor.start())))
        .then(() => done())
        .catch(error => done(error))
}
export const afterFunction = (testSuite: EventIntegrationTestSuite): Func => function (done) {
    this.timeout(5000)
    console.log(`AFTER TEST SUITE - ${testSuite.adapterType}`)
    testSuite.serverEventInteractor.stop()
        .then(() => done())
        .catch(error => done(error))
}

const configureInMemoryClientsOnServer = (serverEventInteractor: InMemoryServerEventInteractor, testSuite:EventIntegrationTestSuite) =>
    serverEventInteractor.setClientEventInteractors(testSuite.clientsEventIntegrationTestSuite.map(clientEventIntegrationTestSuite => {
        if (clientEventIntegrationTestSuite.clientEventInteractor instanceof InMemoryClientEventInteractor)
            return clientEventIntegrationTestSuite.clientEventInteractor
        throw new Error(`Unsupported clientEventInteractor ${clientEventIntegrationTestSuite.clientEventInteractor.constructor.name}`)
    }))

const sseTestGameEvent = (playerId:string, position:Position) => newGameEvent(
    Action.attack,
    new Map([[EntityType.player, [playerId]]]),
    [makePhysical(EntityIds.playerAPointer, position, ShapeType.pointer, true)])
export const makeInMemoryClientEventIntegrationTestSuite = (playerId:string, position:Position): ClientEventIntegrationTestSuite => ({
    clientEventInteractor: new InMemoryClientEventInteractor(playerId, new InMemoryEventBus()),
    clientEvents: [sseTestGameEvent(playerId, position)]
})
export const makeRestClientEventIntegrationTestSuite = (playerId:string, position:Position): ClientEventIntegrationTestSuite => ({
    clientEventInteractor: new WebClientEventInteractor(serverFullyQualifiedDomainName, defaultHTTPWebServerPort, playerId, new InMemoryEventBus(), new ConsoleLogger('eventInteractor')),
    clientEvents: [sseTestGameEvent(playerId, position)]
})
