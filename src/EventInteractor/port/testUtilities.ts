import { Func } from 'mocha'
import { position, Position, Physical } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { GameEvent, newGameEvent } from '../../Event/GameEvent'
import { InMemoryEventBus } from '../../Event/infra/InMemoryEventBus'
import { NewWebClientEventInteractor } from '../infra/NewWebClientEventInteractor'
import { NewInMemoryClientEventInteractor } from '../infra/NewInMemoryClientEventInteractor'
import { NewInMemoryServerEventInteractor } from '../infra/NewInMemoryServerEventInteractor'
import { NewClientEventInteractor, NewServerEventInteractor } from './EventInteractor'
import { webServerPort } from '../../Systems/GameEventDispatcher/infra/ServerWebEventInteractor'

export interface NewClientEventIntegrationTestSuite {
    clientEventInteractor:NewClientEventInteractor
    clientEvents:GameEvent[]
}
export interface NewEventIntegrationTestSuite {
    adapterType: string;
    serverEventInteractor: NewServerEventInteractor
    clientsEventIntegrationTestSuite: NewClientEventIntegrationTestSuite[];
}
export const serverFullyQualifiedDomainName = 'localhost'
export const clientQty = 20

export const makeRestClientsEventIntegrationTestSuite = (qty:number) => [...Array(qty).keys()].map(value => makeRestClientEventIntegrationTestSuite(value.toString(), position(0, 0)))
export const makeInMemoryClientsEventIntegrationTestSuite = (qty:number) => [...Array(qty).keys()].map(value => makeInMemoryClientEventIntegrationTestSuite(value.toString(), position(0, 0)))
export const afterFunction = (testSuite: NewEventIntegrationTestSuite): Func => () => { testSuite.serverEventInteractor.stop() }
export const beforeFunction = (testSuite: NewEventIntegrationTestSuite): Func => () => {
    testSuite.clientsEventIntegrationTestSuite.forEach(clientEventIntegrationTestSuite => {
        if (clientEventIntegrationTestSuite.clientEventInteractor instanceof NewInMemoryClientEventInteractor)
            clientEventIntegrationTestSuite.clientEventInteractor.setServerEventInteractor(testSuite.serverEventInteractor)
    })
    if (testSuite.serverEventInteractor instanceof NewInMemoryServerEventInteractor) configureInMemoryClientsOnServer(testSuite.serverEventInteractor, testSuite)
    testSuite.serverEventInteractor.start()
    testSuite.clientsEventIntegrationTestSuite.forEach(clientEventIntegrationTestSuite => clientEventIntegrationTestSuite.clientEventInteractor.start())
}
const configureInMemoryClientsOnServer = (serverEventInteractor: NewInMemoryServerEventInteractor, testSuite:NewEventIntegrationTestSuite) =>
    serverEventInteractor.setClientEventInteractors(testSuite.clientsEventIntegrationTestSuite.map(clientEventIntegrationTestSuite => {
        if (clientEventIntegrationTestSuite.clientEventInteractor instanceof NewInMemoryClientEventInteractor)
            return clientEventIntegrationTestSuite.clientEventInteractor
        throw new Error(`Unsupported clientEventInteractor ${clientEventIntegrationTestSuite.clientEventInteractor.constructor.name}`)
    }))

export const makeInMemoryClientEventIntegrationTestSuite = (playerId:string, position:Position): NewClientEventIntegrationTestSuite => ({
    clientEventInteractor: new NewInMemoryClientEventInteractor(playerId, new InMemoryEventBus()),
    clientEvents: [newGameEvent(Action.attack, new Map([[EntityType.player, [playerId]]]), [new Physical(EntityId.playerAPointer, position, ShapeType.pointer)])]
})
export const makeRestClientEventIntegrationTestSuite = (playerId:string, position:Position): NewClientEventIntegrationTestSuite => ({
    clientEventInteractor: new NewWebClientEventInteractor(serverFullyQualifiedDomainName, webServerPort, playerId, new InMemoryEventBus()),
    clientEvents: [newGameEvent(Action.attack, new Map([[EntityType.player, [playerId]]]), [new Physical(EntityId.playerAPointer, position, ShapeType.pointer)])]
})
