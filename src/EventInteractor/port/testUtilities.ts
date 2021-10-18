import { Func } from 'mocha'
import { position, Position, Physical } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { GameEvent, newGameEvent } from '../../Event/GameEvent'
import { InMemoryEventBus } from '../../Event/infra/InMemoryEventBus'
import { WebClientEventInteractor } from '../infra/WebClientEventInteractor'
import { InMemoryClientEventInteractor } from '../infra/InMemoryClientEventInteractor'
import { InMemoryServerEventInteractor } from '../infra/InMemoryServerEventInteractor'
import { ClientEventInteractor, ServerEventInteractor } from './EventInteractor'
import { webServerPort } from '../infra/WebServerEventInteractor'

export interface ClientEventIntegrationTestSuite {
    clientEventInteractor:ClientEventInteractor
    clientEvents:GameEvent[]
}
export interface EventIntegrationTestSuite {
    adapterType: string;
    serverEventInteractor: ServerEventInteractor
    clientsEventIntegrationTestSuite: ClientEventIntegrationTestSuite[];
}
export const serverFullyQualifiedDomainName = 'localhost'
export const clientQty = 20

export const makeRestClientsEventIntegrationTestSuite = (qty:number) => [...Array(qty).keys()].map(value => makeRestClientEventIntegrationTestSuite(value.toString(), position(0, 0)))
export const makeInMemoryClientsEventIntegrationTestSuite = (qty:number) => [...Array(qty).keys()].map(value => makeInMemoryClientEventIntegrationTestSuite(value.toString(), position(0, 0)))
export const afterFunction = (testSuite: EventIntegrationTestSuite): Func => () => { testSuite.serverEventInteractor.stop() }
export const beforeFunction = (testSuite: EventIntegrationTestSuite): Func => () => {
    testSuite.clientsEventIntegrationTestSuite.forEach(clientEventIntegrationTestSuite => {
        if (clientEventIntegrationTestSuite.clientEventInteractor instanceof InMemoryClientEventInteractor)
            clientEventIntegrationTestSuite.clientEventInteractor.setServerEventInteractor(testSuite.serverEventInteractor)
    })
    if (testSuite.serverEventInteractor instanceof InMemoryServerEventInteractor) configureInMemoryClientsOnServer(testSuite.serverEventInteractor, testSuite)
    testSuite.serverEventInteractor.start()
    testSuite.clientsEventIntegrationTestSuite.forEach(clientEventIntegrationTestSuite => clientEventIntegrationTestSuite.clientEventInteractor.start())
}
const configureInMemoryClientsOnServer = (serverEventInteractor: InMemoryServerEventInteractor, testSuite:EventIntegrationTestSuite) =>
    serverEventInteractor.setClientEventInteractors(testSuite.clientsEventIntegrationTestSuite.map(clientEventIntegrationTestSuite => {
        if (clientEventIntegrationTestSuite.clientEventInteractor instanceof InMemoryClientEventInteractor)
            return clientEventIntegrationTestSuite.clientEventInteractor
        throw new Error(`Unsupported clientEventInteractor ${clientEventIntegrationTestSuite.clientEventInteractor.constructor.name}`)
    }))

export const makeInMemoryClientEventIntegrationTestSuite = (playerId:string, position:Position): ClientEventIntegrationTestSuite => ({
    clientEventInteractor: new InMemoryClientEventInteractor(playerId, new InMemoryEventBus()),
    clientEvents: [newGameEvent(Action.attack, new Map([[EntityType.player, [playerId]]]), [new Physical(EntityId.playerAPointer, position, ShapeType.pointer)])]
})
export const makeRestClientEventIntegrationTestSuite = (playerId:string, position:Position): ClientEventIntegrationTestSuite => ({
    clientEventInteractor: new WebClientEventInteractor(serverFullyQualifiedDomainName, webServerPort, playerId, new InMemoryEventBus()),
    clientEvents: [newGameEvent(Action.attack, new Map([[EntityType.player, [playerId]]]), [new Physical(EntityId.playerAPointer, position, ShapeType.pointer)])]
})
