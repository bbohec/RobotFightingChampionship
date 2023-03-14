import { expect } from 'chai'
import { Test, it } from 'mocha'
import { GenericGameSystem } from '../../core/ecs/system'
import { EventBus } from '../../core/port/EventBus'
import { GameEvent } from '../../core/type/GameEvent'
import { InMemoryEventBus } from '../../infra/eventBus/InMemoryEventBus'
import { InMemoryClientEventInteractor } from '../../infra/eventInteractor/client/InMemoryClientEventInteractor'
import { InMemoryServerEventInteractor } from '../../infra/eventInteractor/server/InMemoryServerEventInteractor'
import { FakeClientGameAdapters } from '../../infra/game/client/FakeClientGameAdapters'
import { FakeServerAdapters } from '../../infra/game/server/FakeServerAdapters'
import { eventDetailedComparisonMessage, eventsAreSentMessage, eventMessage } from '../../messages'
import { TestStep } from '../TestStep'
import { UnitTestWithContext } from './unitTest'

export const eventsAreSent = (
    testStep:TestStep,
    to:'server'|string,
    expectedGameEvents: GameEvent[],
    skip?:boolean
) => (game:GenericGameSystem, adapters:FakeClientGameAdapters | FakeServerAdapters):Test => {
    const getEventBus = (eventInteractor: InMemoryServerEventInteractor | InMemoryClientEventInteractor):EventBus => {
        if (eventInteractor instanceof InMemoryClientEventInteractor) {
            if (to !== 'server') return eventInteractor.eventBus
            const serverEventInteractor = eventInteractor.serverEventInteractor
            if (!serverEventInteractor) throw new Error('serverEventInteractor not found')
            return serverEventInteractor.eventBus
        } else {
            if (to === 'server') return eventInteractor.eventBus
            const clientEventInteractors = eventInteractor.clientEventInteractors
            if (!clientEventInteractors) throw new Error('clientEventInteractor not found')
            const clientEventInteractor = clientEventInteractors.find(client => client.clientId === to)
            if (clientEventInteractor) return clientEventInteractor.eventBus
            throw new Error(`clientEventInteractor with clientId ${to} not found`)
        }
    }
    const eventBus = getEventBus(adapters.eventInteractor)
    if (eventBus instanceof InMemoryEventBus) {
        const identicalEventsTest = (events:GameEvent[]) => expect(events).deep.equal(expectedGameEvents, eventDetailedComparisonMessage(events, expectedGameEvents))
        return (skip)
            ? it.skip(eventsAreSentMessage(testStep, expectedGameEvents, to), () => identicalEventsTest(eventBus.events))
            : it(eventsAreSentMessage(testStep, expectedGameEvents, to), () => identicalEventsTest(eventBus.events))
    }
    throw new Error(`Unsupported event bus implementation : ${eventBus.constructor.name}`)
}

export const whenEventOccured = (): UnitTestWithContext[] => {
    return [(game, adapters, events) => {
        if (Array.isArray(events)) throw new Error('array not supported')
        return it(eventMessage(events), () => game.onGameEvent(events))
    }]
}

export const whenEventOccurs = (event:GameEvent) => (game:GenericGameSystem, adapters: FakeServerAdapters | FakeClientGameAdapters, events:GameEvent|GameEvent[]):Test => it(eventMessage(event), () => game.onGameEvent(event))
