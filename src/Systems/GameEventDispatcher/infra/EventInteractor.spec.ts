import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { newGameEvent } from '../../../Event/GameEvent'
import { Action } from '../../../Event/Action'
import { InMemoryEventRepository } from './InMemoryEventRepository'
import { EventIntegrationTestSuite } from '../port/EventIntegrationTestSuite'
import { ClientRestEventInteractor } from './ClientRestEventInteractor'
import { ServerRestEventInteractor } from './ServerRestEventInteractor'
import { EntityType } from '../../../Event/EntityType'
import { EntityId } from '../../../Event/entityIds'
import { Physical, position } from '../../../Components/Physical'
import { ShapeType } from '../../../Components/port/ShapeType'

describe('Integration Test Suite - Event Interactor', () => {
    const testSuites:EventIntegrationTestSuite[] = [
        {
            adapterType: 'InMemory',
            serverEventInteractor: new InMemoryEventRepository(),
            clientEventInteractor: new InMemoryEventRepository()
        },
        {
            adapterType: 'Rest',
            serverEventInteractor: new ServerRestEventInteractor(),
            clientEventInteractor: new ClientRestEventInteractor()
        }
    ]
    testSuites.forEach(testSuite => {
        before(() => {
            if (testSuite.adapterType === 'InMemory') {
                testSuite.clientEventInteractor.setServerEventInteractor(testSuite.serverEventInteractor)
                testSuite.serverEventInteractor.setClientEventInteractor(testSuite.clientEventInteractor)
            }
        })
        const event = newGameEvent(Action.attack, new Map([[EntityType.player, [EntityId.playerA]]]), [new Physical(EntityId.playerA, position(0, 0), ShapeType.pointer)])
        describe(`Adapter Type - ${testSuite.adapterType}`, () => {
            describe('Client send event to Server.', () => {
                it('Given the Server Event Interactor don\'t have event on server game events', () => {
                    expect(testSuite.serverEventInteractor.serverGameEvents).not.include(event)
                })
                it('When the client send event to server', () => {
                    testSuite.clientEventInteractor.sendEventToServer(event)
                })
                it('Then the Server Event Interactor has event on server game events', () => {
                    expect(testSuite.serverEventInteractor.serverGameEvents[0]).deep.equal(event)
                })
            })
            describe('Server send event to Client.', () => {
                it('Given the Server Event Interactor don\'t have event on server game events', () => {
                    expect(testSuite.clientEventInteractor.clientGameEvents).not.include(event)
                })
                it('When the server send event to client', () => {
                    testSuite.serverEventInteractor.sendEventToClient(event)
                })
                it('Then the Client Event Interactor has event on client game events', () => {
                    expect(testSuite.clientEventInteractor.clientGameEvents).include(event)
                })
            })
        })
    })
})
