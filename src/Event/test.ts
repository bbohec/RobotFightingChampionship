import chai from 'chai'
import { before, describe, Func, it, Suite, Test } from 'mocha'
import { GameEvent } from './GameEvent'

import { Physical } from '../Components/Physical'
import { Component } from '../Components/port/Component'
import { InMemoryClientEventInteractor } from '../EventInteractor/infra/client/InMemoryClientEventInteractor'
import { InMemoryServerEventInteractor } from '../EventInteractor/infra/server/InMemoryServerEventInteractor'
import { ClientGameSystem } from '../Systems/Game/ClientGame'
import { GenericGameSystem } from '../Systems/Game/GenericGame'
import { FakeClientAdapters } from '../Systems/Game/infra/FakeClientAdapters'
import { FakeServerAdapters } from '../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../Systems/Game/ServerGame'
import { stringifyWithDetailledSetAndMap } from './detailledStringify'
import { InMemoryEventBus } from './infra/InMemoryEventBus'
import { EventBus } from './port/EventBus'
import { TestStep } from './TestStep'
import { Action } from './Action'
import { featureEventDescription } from '../messages'

const { expect } = chai

type ScenarioType = 'client' | 'server'
type UnitTestWithContext = (game: GenericGameSystem, adapters: FakeServerAdapters | FakeClientAdapters, gameEvents: GameEvent | GameEvent[]) => Test

export const serverScenario = (
    title:string,
    gameEvent:GameEvent|GameEvent[],
    clientIds:string[],
    beforeMochaFunc:((game:ServerGameSystem, adapters:FakeServerAdapters)=>Func)|undefined,
    tests:((game:ServerGameSystem, adapters:FakeServerAdapters, gameEvent:GameEvent|GameEvent[])=>Test)[],
    nextIdentifiers?:string[],
    skip?:boolean
) => {
    const serverTestSuite = () => {
        const adapters = new FakeServerAdapters(clientIds, nextIdentifiers)
        const game = new ServerGameSystem(adapters)
        // eslint-disable-next-line no-unused-expressions
        if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
        tests.forEach(test => test(game, adapters, gameEvent))
    }
    return (skip)
        ? describe.skip(scenarioEventDescription(title, gameEvent, 'server', skip), serverTestSuite)
        : describe(scenarioEventDescription(title, gameEvent, 'server', skip), serverTestSuite)
}
export const clientScenario = (
    title:string,
    gameEvents:GameEvent|GameEvent[],
    clientId:string,
    beforeMochaFunc:((game:ClientGameSystem, adapters:FakeClientAdapters)=>Func)|undefined,
    tests:((game:ClientGameSystem, adapters:FakeClientAdapters, gameEvent:GameEvent|GameEvent[])=>Test)[],
    nextIdentifiers?:string[],
    skip?:boolean
) => {
    const clientTestSuite = () => {
        const adapters = new FakeClientAdapters(clientId, nextIdentifiers)
        const game = new ClientGameSystem(adapters)
        // eslint-disable-next-line no-unused-expressions
        if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
        tests.forEach(test => test(game, adapters, gameEvents))
    }
    return (skip)
        ? describe.skip(scenarioEventDescription(title, gameEvents, 'client', skip), clientTestSuite)
        : describe(scenarioEventDescription(title, gameEvents, 'client', skip), clientTestSuite)
}

export const feature = (action:Action, mochaSuite: (this: Suite) => void) => describe(featureEventDescription(action), mochaSuite)

const pendingTestPrefix = '[PENDING] '
export const scenarioEventDescription = (title:string, events: GameEvent|GameEvent[], scenarioType:ScenarioType, skip?:boolean): string =>
    ((Array.isArray(events))
        ? `
    ${(skip) ? pendingTestPrefix : ''}Scenario ${title} - ${scenarioType}:\n${events.map(event => `        Event action '${event.action}.'
        Entity references :'${stringifyWithDetailledSetAndMap(event.entityRefences)}'`).join('\n        And\n')}`
        : `
    ${(skip) ? pendingTestPrefix : ''}Scenario ${title} - ${scenarioType}:
        Event action '${events.action}.'
        Entity references :'${stringifyWithDetailledSetAndMap(events.entityRefences)}'
    `
    )

export const whenEventOccured = (): UnitTestWithContext[] => [(game, adapters, gameEvents) => {
    if (Array.isArray(gameEvents)) throw new Error('array not supported')
    return whenEventOccurs(game, adapters, gameEvents)
}]
export const whenEventOccurs = (game:GenericGameSystem, adapters: FakeServerAdapters | FakeClientAdapters, event:GameEvent):Test => it(eventMessage(event), () => game.onGameEvent(event))
export const theEntityIsOnRepository = (
    testStep:TestStep,
    adapters: FakeServerAdapters|FakeClientAdapters,
    entityId: string
) => it(entityIdOnRepository(testStep, entityId),
    () => expect(adapters
        .entityInteractor
        .hasEntityById(entityId))
        .to.be.true)

export const theEntityIsNotOnRepository = (
    testStep:TestStep,
    adapters: FakeServerAdapters|FakeClientAdapters,
    entityId: string
) => it(entityIdIsNotOnRepository(testStep, entityId),
    () => expect(adapters
        .entityInteractor
        .hasEntityById(entityId))
        .to.be.false)

export const eventsAreSent = (
    testStep:TestStep,
    adapters: FakeClientAdapters | FakeServerAdapters,
    to:'server'|string,
    expectedGameEvents: GameEvent[],
    skip?:boolean
) => {
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

/*
export const theEventIsSent = (
    testStep:TestStep,
    adapters: FakeClientAdapters | FakeServerAdapters,
    to:'server'|'client',
    gameEvent: GameEvent,
    eventSentQty?:number,
    skip?:boolean
) => {
    const eventBus = adapters.eventInteractor.eventBus
    if (eventBus instanceof InMemoryEventBus) return (skip)
        ? it.skip(eventSentMessage(testStep, gameEvent, to, eventSentQty),
            () => expect((eventBus.retrieveEvent(gameEvent))
                .length)
                .equal((eventSentQty) || 1))
        : it(eventSentMessage(testStep, gameEvent, to, eventSentQty),
            () => expect((eventBus.retrieveEvent(gameEvent))
                .length)
                .equal((eventSentQty) || 1))
    throw new Error(`Unsupported event bus implementation : ${eventBus.constructor.name}`)
}

export const theEventIsNotSent = (
    testStep:TestStep,
    adapters: FakeClientAdapters | FakeServerAdapters,
    to:'client'|'server',
    gameEvent: GameEvent
) => it(eventNotSentMessage(testStep, gameEvent, to),
    () => {
        const eventBus = adapters.eventInteractor.eventBus
        if (eventBus instanceof InMemoryEventBus) return expect((eventBus.hasEvent(gameEvent))).to.be.false
        throw new Error(`Unsupported event bus implementation : ${eventBus.constructor.name}`)
    })
*/

export const thereIsServerComponents = (
    testStep:TestStep,
    expectedComponents: Component[]
) => (game:ServerGameSystem, adapters:FakeServerAdapters) => it(hasComponents(testStep, expectedComponents),
    () => {
        const components = adapters
            .entityInteractor.retreiveAllComponents()
        expect(components).deep.equal(expectedComponents, componentDetailedComparisonMessage(components, expectedComponents))
    })

export const thereIsClientComponents = (
    testStep:TestStep,
    expectedComponents: Component[]
) => (game:ClientGameSystem, adapters:FakeClientAdapters) => it(hasComponents(testStep, expectedComponents),
    () => {
        const components = adapters
            .entityInteractor.retreiveAllComponents()
        expect(components).deep.equal(expectedComponents, componentDetailedComparisonMessage(components, expectedComponents))
    })

export const thereIsANotification = (
    testStep:TestStep,
    adapters: FakeClientAdapters,
    notification:string
) => it(thereIsANotificationMessage(testStep, notification),
    () => expect(adapters
        .notificationInteractor
        .notifications)
        .include(notification))
export const entityIsNotVisible = (
    testStep:TestStep,
    adapters: FakeClientAdapters,
    expectedPhysicalComponent:Physical
) => it(entityIsNotVisibleMessage(testStep, expectedPhysicalComponent.entityId),
    () => expect(adapters.drawingInteractor.drawEntities.get(expectedPhysicalComponent.entityId))
        .to.not.be.deep.equal(expectedPhysicalComponent))
export const entityIsVisible = (
    testStep:TestStep,
    adapters: FakeClientAdapters,
    expectedPhysicalComponent:Physical
) => it(entityIsVisibleMessage(testStep, expectedPhysicalComponent.entityId),
    () => expect(adapters.drawingInteractor.drawEntities.get(expectedPhysicalComponent.entityId))
        .to.be.deep.equal(expectedPhysicalComponent))
export const theControllerAdapterIsInteractive = (
    testStep:TestStep,
    adapters: FakeClientAdapters
) => it(theControllerAdapterIsInteractiveMessage(testStep),
    () => expect(adapters.controllerAdapter.isInteractive)
        .to.be.true)
export const theControllerAdapterIsNotInteractive = (
    testStep:TestStep,
    adapters: FakeClientAdapters
) => it(theControllerAdapterIsNotInteractiveMessage(testStep),
    () => expect(adapters.controllerAdapter.isInteractive)
        .to.be.false)

export const detailedComparisonMessage = (thing:unknown, expectedThing:unknown):string => `DETAILS\nexpected >>>>>>>> ${stringifyWithDetailledSetAndMap(thing)} \nto deeply equal > ${stringifyWithDetailledSetAndMap(expectedThing)} \n`
const eventDetailedComparisonMessage = (gameEvents: GameEvent[], expectedGameEvents: GameEvent[]): string => `DETAILS
    expected >>> ${stringifyWithDetailledSetAndMap(expectedGameEvents)}
    actual >>>>> ${stringifyWithDetailledSetAndMap(gameEvents)} \n`
const componentDetailedComparisonMessage = (components: Component[], expectedComponents: Component[]): string => `DETAILS
expected >>>>>>>>>>>
    ${expectedComponents.map(component => stringifyWithDetailledSetAndMap(component)).join('\n    ')}}
actual >>>>
    ${components.map(component => stringifyWithDetailledSetAndMap(component)).join('\n    ')}\n`
// const entityDontHaveComponent = (testStep: TestStep, entityId: string): string => `${testStep} the entity with id '${entityId}' don't have any component.`

const hasComponents = (testStep: TestStep, expectedComponents: Component[]): string => `${testStep} there is components :
    ${stringifyWithDetailledSetAndMap(expectedComponents)}`

const entityIdOnRepository = (testStep: TestStep, potentialEntityOrEntityId: string): string => `${testStep} there is an entity with id '${potentialEntityOrEntityId}' on entities repository.`
const entityIdIsNotOnRepository = (testStep: TestStep, potentialEntityOrEntityId: string): string => `${testStep} there is no entity with id '${potentialEntityOrEntityId}' on entities repository.`
// const entityIdCreated = (testStep: TestStep, potentialEntityClassOrId: string): string => `${testStep} the entity with id '${potentialEntityClassOrId}' is created.`

const eventMessage = (event:GameEvent): string => `When the event action '${event.action}' occurs with entity references '${stringifyWithDetailledSetAndMap(event.entityRefences)}'.`
// const eventNotSentMessage = (testStep: TestStep, gameEvent: GameEvent, to:'client'|'server'): string => `${testStep} the event with action '${gameEvent.action}' is not sent to '${to}' with the following entity references:'${stringifyWithDetailledSetAndMap(gameEvent.entityRefences)}.`
// const eventSentMessage = (testStep: TestStep, gameEvent: GameEvent, to:'client'|'server', eventSentQty: number | undefined): string => `${testStep} the event with action '${gameEvent.action}' is sent to '${to}' with the following entity references:'${stringifyWithDetailledSetAndMap(gameEvent.entityRefences)}'${(eventSentQty) ? ` ${eventSentQty} times.` : '.'}`

const eventsAreSentMessage = (testStep: TestStep, gameEvents: GameEvent[], to:'server'|string): string =>
    (gameEvents.length === 0)
        ? `${testStep} no events are sent to '${to}.`
        : `${testStep} following events are sent to '${to}' :\n${gameEvents.map(gameEvent => stringifyWithDetailledSetAndMap(gameEvent)).join('\n')}'`

const entityIsNotVisibleMessage = (testStep: TestStep, entityId: string): string => `${testStep} the entity with id '${entityId}' is not visible.`
const entityIsVisibleMessage = (testStep: TestStep, entityId: string): string => `${testStep} the entity with id '${entityId}' is visible.`
const theControllerAdapterIsInteractiveMessage = (testStep: TestStep): string => `${testStep} the controller adapter is interactive.`
const theControllerAdapterIsNotInteractiveMessage = (testStep: TestStep): string => `${testStep} the controller adapter is not interactive.`
const thereIsANotificationMessage = (testStep: TestStep, notification: string): string => `${testStep} there is a notification : '${notification}'`
