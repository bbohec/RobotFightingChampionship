import { Func } from 'mocha'
import { makePhysical, position, Position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { GameEvent, newGameEvent } from '../../Event/GameEvent'
import { InMemoryEventBus } from '../../Event/infra/InMemoryEventBus'
import { ConsoleLogger } from '../../Log/infra/consoleLogger'
import { InMemoryClientEventInteractor } from './client/InMemoryClientEventInteractor'
import { InMemoryServerEventInteractor } from './server/InMemoryServerEventInteractor'
import { WebClientEventInteractor } from './client/WebClientEventInteractor'
import { defaultHTTPWebServerPort } from './server/WebServerEventInteractor'
import { ClientEventInteractor, ServerEventInteractor } from '../port/EventInteractor'

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
