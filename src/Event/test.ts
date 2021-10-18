import { describe, before, Func, it, Test, Suite } from 'mocha'
import { expect } from 'chai'
import { GameEvent } from './GameEvent'
import { GenericGameSystem } from '../Systems/Game/GenericGame'
import { PotentialClass } from '../Entities/ports/PotentialClass'
import { FakeClientAdapters } from '../Systems/Game/infra/FakeClientAdapters'
import { LifeCycle } from '../Components/LifeCycle'
import { TestStep } from './TestStep'
import { GenericAdapter } from '../Systems/Game/port/genericAdapters'
import { FakeServerAdapters } from '../Systems/Game/infra/FakeServerAdapters'
import { GenericComponent } from '../Components/GenericComponent'
import { Component } from '../Components/port/Component'
import { Action } from './Action'
import { ClientGameSystem } from '../Systems/Game/ClientGame'
import { ServerGameSystem } from '../Systems/Game/ServerGame'
import { Physical } from '../Components/Physical'
type ScenarioType = 'client' | 'server'
export const feature = (featureEventDescription:string, mochaSuite: (this: Suite) => void) => describe(featureEventDescription, mochaSuite)
export const featureEventDescription = (action:Action): string => `Feature : ${action} events`
export const scenarioEventDescription = (ref:string, event: GameEvent|GameEvent[], scenarioType:ScenarioType): string => ((Array.isArray(event))
    ? `
    Scenario ${ref} - ${scenarioType}:\n${event.map(event => `        Event action '${event.action}.'
        Entity references :'${stringifyWithDetailledSetAndMap(event.entityRefences)}'`).join('\n        And\n')}`
    : `
    Scenario ${ref} - ${scenarioType}:
        Event action '${event.action}.'
        Entity references :'${stringifyWithDetailledSetAndMap(event.entityRefences)}'
    `
)
export const whenEventOccurs = (game:GenericGameSystem, event:GameEvent) => it(eventMessage(event), () => game.onGameEvent(event))
export const theEntityIsOnRepository = (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    entityId: string
) => it(entityIdOnRepository(testStep, entityId),
    () => expect(adapters
        .entityInteractor
        .hasEntityById(entityId))
        .to.be.true)

export const theEntityIsNotOnRepository = (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    entityId: string
) => it(entityIdIsNotOnRepository(testStep, entityId),
    () => expect(adapters
        .entityInteractor
        .hasEntityById(entityId))
        .to.be.false)

export const theEntityIsCreated = (
    testStep:TestStep,
    adapters: GenericAdapter,
    potentialEntityId: string
) => it(entityIdCreated(testStep, potentialEntityId),
    () => expect(adapters
        .entityInteractor
        .retrieveEntityComponentByEntityId(potentialEntityId, LifeCycle)
        .isCreated)
        .to.be.true)
export const theEventIsSent = (
    testStep:TestStep,
    adapters: FakeClientAdapters | FakeServerAdapters,
    to:'server'|'client',
    gameEvent: GameEvent,
    eventSentQty?:number,
    skip?:boolean
) => (skip)
    ? it.skip(eventSentMessage(testStep, gameEvent, to, eventSentQty),
        () => expect(((to === 'client') ? adapters.eventInteractor.retrieveClientEvent(gameEvent) : adapters.eventInteractor.retrieveServerEvent(gameEvent))
            .length)
            .equal((eventSentQty) || 1))
    : it(eventSentMessage(testStep, gameEvent, to, eventSentQty),
        () => expect(((to === 'client') ? adapters.eventInteractor.retrieveClientEvent(gameEvent) : adapters.eventInteractor.retrieveServerEvent(gameEvent))
            .length)
            .equal((eventSentQty) || 1))
export const theEventIsNotSent = (
    testStep:TestStep,
    adapters: FakeClientAdapters | FakeServerAdapters,
    to:'client'|'server',
    gameEvent: GameEvent
) => it(eventNotSentMessage(testStep, gameEvent, to),
    () => expect(((to === 'client') ? adapters.eventInteractor.hasClientEvent(gameEvent) : adapters.eventInteractor.hasServerEvent(gameEvent)))
        .to.be.false)
export const theEntityWithIdHasTheExpectedComponent = <PotentialComponent extends Component> (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    entityId: string,
    potentialComponent:PotentialClass<PotentialComponent>,
    expectedComponent: GenericComponent
) => it(entityHasComponent<PotentialComponent>(testStep, entityId, potentialComponent, expectedComponent),
        () => {
            const component = adapters
                .entityInteractor
                .retrieveEntityComponentByEntityId(entityId, potentialComponent)
            expect(component).deep.equal(expectedComponent, componentDetailedComparisonMessage<PotentialComponent>(component, expectedComponent))
        })
export const theEntityWithIdDoNotHaveAnyComponent = <PotentialComponent extends Component> (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    entityId: string,
    potentialComponent:PotentialClass<PotentialComponent>,
    expectedComponent: GenericComponent
) => it(entityDontHaveComponent(testStep, entityId, expectedComponent),
        () => expect(adapters
            .entityInteractor
            .isEntityHasComponentsByEntityId(entityId)
        ).to.be.false)

export const stringifyWithDetailledSetAndMap = (value:any) => JSON.stringify(value, detailledStringifyForSetAndMap)
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
    () => expect(adapters
        .drawingInteractor
        .drawEntities.get(expectedPhysicalComponent.entityId))
        .to.not.be.deep.equal(expectedPhysicalComponent))
export const entityIsVisible = (
    testStep:TestStep,
    adapters: FakeClientAdapters,
    expectedPhysicalComponent:Physical
) => it(entityIsVisibleMessage(testStep, expectedPhysicalComponent.entityId),
    () => expect(adapters
        .drawingInteractor
        .drawEntities.get(expectedPhysicalComponent.entityId))
        .to.be.deep.equal(expectedPhysicalComponent))
export const serverScenario = (
    scenarioName:string,
    gameEvent:GameEvent|GameEvent[],
    beforeMochaFunc:((game:ServerGameSystem, adapters:FakeServerAdapters)=>Func)|undefined,
    tests:((game:ServerGameSystem, adapters:FakeServerAdapters)=>Test)[],
    nextIdentifiers?:string[],
    skip?:boolean
) => (skip)
    ? describe.skip(scenarioEventDescription(scenarioName, gameEvent, 'server'), () => {
        const { adapters, game } = createServer(nextIdentifiers)
        // eslint-disable-next-line no-unused-expressions
        if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
        tests.forEach(test => test(game, adapters))
    })
    : describe(scenarioEventDescription(scenarioName, gameEvent, 'server'), () => {
        const { adapters, game } = createServer(nextIdentifiers)
        // eslint-disable-next-line no-unused-expressions
        if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
        tests.forEach(test => test(game, adapters))
    })
export const clientScenario = (
    ref:string,
    gameEvent:GameEvent|GameEvent[],
    beforeMochaFunc:((game:ClientGameSystem, adapters:FakeClientAdapters)=>Func)|undefined,
    tests:((game:ClientGameSystem, adapters:FakeClientAdapters)=>Test)[],
    nextIdentifiers?:string[],
    skip?:boolean
) => (skip)
    ? describe.skip(scenarioEventDescription(ref, gameEvent, 'client'), () => {
        const { adapters, game } = createClient(nextIdentifiers)
        // eslint-disable-next-line no-unused-expressions
        if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
        tests.forEach(test => test(game, adapters))
    })
    : describe(scenarioEventDescription(ref, gameEvent, 'client'), () => {
        const { adapters, game } = createClient(nextIdentifiers)
        // eslint-disable-next-line no-unused-expressions
        if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
        tests.forEach(test => test(game, adapters))
    })

const createClient = (nextIdentifiers?:string[]):{adapters:FakeClientAdapters, game:ClientGameSystem} => {
    const adapters = new FakeClientAdapters(nextIdentifiers)
    const game = new ClientGameSystem(adapters)
    return { adapters, game }
}
const createServer = (nextIdentifiers?:string[]):{adapters:FakeServerAdapters, game:ServerGameSystem} => {
    const adapters = new FakeServerAdapters(nextIdentifiers)
    const game = new ServerGameSystem(adapters)
    return { adapters, game }
}
const detailledStringifyForSetAndMap = (key:string, value:any):any => (value instanceof Set)
    ? [...value.values()]
    : (value instanceof Map)
        ? mapToObjectLiteral(value)
        : value
const entityDontHaveComponent = (testStep: TestStep, entityId: string, expectedComponent: GenericComponent): string => `${testStep} the entity with id '${entityId}' don't have any component. 
    ${stringifyWithDetailledSetAndMap(expectedComponent)}`
const entityHasComponent = <PotentialComponent extends Component> (testStep: TestStep, entityId: string, potentialComponent: PotentialClass<PotentialComponent>, expectedComponent: GenericComponent): string => `${testStep} the entity with id '${entityId}' has the expected '${potentialComponent.name}' component : 
    ${stringifyWithDetailledSetAndMap(expectedComponent)}`
const entityIdOnRepository = (testStep: TestStep, potentialEntityOrEntityId: string): string => `${testStep} there is an entity with id '${potentialEntityOrEntityId}' on entities repository.`
const entityIdIsNotOnRepository = (testStep: TestStep, potentialEntityOrEntityId: string): string => `${testStep} there is no entity with id '${potentialEntityOrEntityId}' on entities repository.`
const entityIdCreated = (testStep: TestStep, potentialEntityClassOrId: string): string => `${testStep} the entity with id '${potentialEntityClassOrId}' is created.`
const componentDetailedComparisonMessage = <PotentialComponent extends Component> (component: PotentialComponent, expectedComponent: GenericComponent): string => `DETAILS\nexpected >>>>>>>> ${stringifyWithDetailledSetAndMap(component)} \nto deeply equal > ${stringifyWithDetailledSetAndMap(expectedComponent)} \n`

export const detailedComparisonMessage = (thing:unknown, expectedThing:unknown):string => `DETAILS\nexpected >>>>>>>> ${stringifyWithDetailledSetAndMap(thing)} \nto deeply equal > ${stringifyWithDetailledSetAndMap(expectedThing)} \n`
const eventMessage = (event:GameEvent): string => `When the event action '${event.action}' occurs with entity references '${stringifyWithDetailledSetAndMap(event.entityRefences)}'.`
const eventNotSentMessage = (testStep: TestStep, gameEvent: GameEvent, to:'client'|'server'): string => `${testStep} the event with action '${gameEvent.action}' is not sent to '${to}' with the following entity references:'${stringifyWithDetailledSetAndMap(gameEvent.entityRefences)}.`
const eventSentMessage = (testStep: TestStep, gameEvent: GameEvent, to:'client'|'server', eventSentQty: number | undefined): string => `${testStep} the event with action '${gameEvent.action}' is sent to '${to}' with the following entity references:'${stringifyWithDetailledSetAndMap(gameEvent.entityRefences)}'${(eventSentQty) ? ` ${eventSentQty} times.` : '.'}`
const mapToObjectLiteral = (value: Map<any, any>): any => Array.from(value).reduce((obj: any, [key, value]) => {
    obj[key] = value
    return obj
}, {})
const entityIsNotVisibleMessage = (testStep: TestStep, entityId: string): string => `${testStep} the entity with id '${entityId}' is not visible.`
const entityIsVisibleMessage = (testStep: TestStep, entityId: string): string => `${testStep} the entity with id '${entityId}' is visible.`
const thereIsANotificationMessage = (testStep: TestStep, notification: string): string => `${testStep} there is a notification : '${notification}'`
