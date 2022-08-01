import { describe, before, it, after } from 'mocha'
import { expect } from 'chai'
import { InMemoryEventBus } from '../eventBus/InMemoryEventBus'
import { InMemoryServerEventInteractor } from './server/InMemoryServerEventInteractor'
import { EventIntegrationTestSuite, makeInMemoryClientsEventIntegrationTestSuite, clientQty, makeRestClientsEventIntegrationTestSuite, beforeFunction, afterFunction } from './test'
import { WebServerEventInteractor, defaultHTTPWebServerPort } from './server/WebServerEventInteractor'
import { ExpressWebServerInstance } from './server/ExpressWebServerInstance'
import express from 'express'
import { Log4jsLogger } from '../logger/log4jsLogger'
import { InMemoryClientEventInteractor } from './client/InMemoryClientEventInteractor'
import { EntityType } from '../../core/type/EntityType'
import { GameEvent } from '../../core/type/GameEvent'
import { detailedComparisonMessage } from '../../messages'

describe('Integration Test Suite - Event Interactor', () => {
    const testSuites:EventIntegrationTestSuite[] = [
        {
            adapterType: 'InMemory',
            serverEventInteractor: new InMemoryServerEventInteractor(new InMemoryEventBus(), new Array(clientQty).map((value, index) => new InMemoryClientEventInteractor(index.toLocaleString(), new InMemoryEventBus()))),
            clientsEventIntegrationTestSuite: makeInMemoryClientsEventIntegrationTestSuite(clientQty)
        },
        {
            adapterType: 'Rest',
            serverEventInteractor: new WebServerEventInteractor(new ExpressWebServerInstance(express(), defaultHTTPWebServerPort, new Log4jsLogger('expressInstance')), new InMemoryEventBus(), 1000, new Log4jsLogger('webServerEventInteractor')),
            clientsEventIntegrationTestSuite: makeRestClientsEventIntegrationTestSuite(clientQty)
        }
    ]
    testSuites.forEach(testSuite => {
        before(beforeFunction(testSuite))
        after(afterFunction(testSuite))
        describe(`Adapter Type - ${testSuite.adapterType}`, () => {
            const clientsEvents = ([] as GameEvent[]).concat(...testSuite.clientsEventIntegrationTestSuite.map(clientEventIntegrationTestSuite => clientEventIntegrationTestSuite.clientEvents))
            describe('Client send event to Server.', () => {
                const serverEventBus = testSuite.serverEventInteractor.eventBus
                if (serverEventBus instanceof InMemoryEventBus) {
                    it('Given the Server Event Interactor don\'t have event on server game events', () => {
                        expect(serverEventBus.events).not.include(clientsEvents)
                    })
                    testSuite.clientsEventIntegrationTestSuite.forEach(clientEventIntegrationTestSuite => {
                        it(`When client '${clientEventIntegrationTestSuite.clientEventInteractor.clientId}' send its events to server`, (done) => {
                            Promise.all(clientEventIntegrationTestSuite.clientEvents.map(event =>
                                clientEventIntegrationTestSuite.clientEventInteractor.sendEventToServer(event)
                            ))
                                .then(() => done())
                                .catch(error => done(error))
                        })
                    })

                    it('Then the Server Event Interactor has event on server game events', () => {
                        const serverEvents = serverEventBus.events
                        expect(serverEvents).deep.equal(clientsEvents, detailedComparisonMessage(serverEvents, clientsEvents))
                    })
                } else { throw new Error(`Unsupported event bus ${serverEventBus.constructor.name}`) }
            })
            describe('Server send event to Client.', () => {
                testSuite.clientsEventIntegrationTestSuite.forEach((clientEventIntegrationTestSuite, index) => {
                    const clientEventBus = clientEventIntegrationTestSuite.clientEventInteractor.eventBus
                    if (clientEventBus instanceof InMemoryEventBus)
                        it(`${(index === 0) ? 'Given' : 'And'} the Client Event Interactor with id '${clientEventIntegrationTestSuite.clientEventInteractor.clientId}' don't have event on client game events`, () => {
                            expect(clientEventBus.events.length).equal(0)
                        })
                    else throw new Error(`Unsupported event bus ${clientEventBus.constructor.name}`)
                })
                it('When the server send event to client', (done) => {
                    Promise.all(clientsEvents.map(event => testSuite.serverEventInteractor.sendEventToClient(event)))
                        .then(() => done())
                        .catch(error => done(error))
                }).timeout(30000)
                testSuite.clientsEventIntegrationTestSuite.forEach((clientEventIntegrationTestSuite, index) => {
                    const clientEventBus = clientEventIntegrationTestSuite.clientEventInteractor.eventBus
                    if (clientEventBus instanceof InMemoryEventBus)
                        it(`${(index === 0) ? 'Then' : 'And'} the Client Event Interactor with id '${clientEventIntegrationTestSuite.clientEventInteractor.clientId}' has event on client game events`, () => {
                            const clientEvents = clientEventBus.events
                            const expectedClientEvents = clientsEvents.filter(event => clientEventBus.entitiesByEntityType(event, EntityType.player).some(playerId => playerId === clientEventIntegrationTestSuite.clientEventInteractor.clientId))
                            expect(clientEvents).deep.equal(expectedClientEvents, detailedComparisonMessage(clientEvents, expectedClientEvents))
                        })
                    else throw new Error(`Unsupported event bus ${clientEventBus.constructor.name}`)
                })
            })
        })
    })
})
