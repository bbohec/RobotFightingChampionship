import { describe, before, Func, it, Test } from 'mocha'
import { expect } from 'chai'
import { GameEvent } from './GameEvent'
import { GenericGameSystem } from '../Systems/Game/GenericGame'
import { Entity } from '../Entities/GenericEntity/ports/Entity'
import { PotentialClass } from '../Entities/GenericEntity/ports/PotentialClass'
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
export const featureEventDescription = (action:Action): string => `Feature : ${action} events`
export const scenarioEventDescription = (ref:string, event: GameEvent|GameEvent[], gameType:'client'|'server'): string => ((Array.isArray(event))
    ? `
    Scenario ${ref} - ${gameType}:\n${event.map(event => `        Event action '${event.action}.'
        Entity references :'${stringifyWithDetailledSetAndMap(event.entityRefences)}'`).join('\n        And\n')}`
    : `
    Scenario ${ref} - ${gameType}:
        Event action '${event.action}.'
        Entity references :'${stringifyWithDetailledSetAndMap(event.entityRefences)}'
    `
)
export const whenEventOccurs = (game:GenericGameSystem, event:GameEvent) => it(eventMessage(event), () => game.onGameEvent(event))
const eventMessage = (event:GameEvent): string => `When the event action '${event.action}' occurs with entity references '${stringifyWithDetailledSetAndMap(event.entityRefences)}'.`

export const theEntityIsOnRepository = <PotentialEntity extends Entity> (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    potentialEntityOrEntityId: PotentialClass<PotentialEntity> | string
) => (typeof potentialEntityOrEntityId === 'string')
        ? it(`${testStep} there is an entity with id '${potentialEntityOrEntityId}' on entities repository.`,
            () => expect(adapters
                .entityInteractor
                .hasEntityById(potentialEntityOrEntityId))
                .to.be.true)
        : it(`${testStep} there is a '${potentialEntityOrEntityId.name}' entity on entities repository.`,
            () => expect(adapters
                .entityInteractor
                .hasEntityByClass(potentialEntityOrEntityId))
                .to.be.true)

export const theEntityIsNotOnRepository = <PotentialEntity extends Entity> (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    potentialEntityOrEntityId: PotentialClass<PotentialEntity>|string
) => (typeof potentialEntityOrEntityId === 'string')
        ? it(`${testStep} there is no entity with id '${potentialEntityOrEntityId}' on entities repository.`,
            () => expect(adapters
                .entityInteractor
                .hasEntityById(potentialEntityOrEntityId))
                .to.be.false)
        : it(`${testStep} there is no ${potentialEntityOrEntityId.name} entity on entities repository.`,
            () => expect(adapters
                .entityInteractor
                .hasEntityByClass(potentialEntityOrEntityId))
                .to.be.false)

export const theEntityIsCreated = <PotentialEntity extends Entity> (
    testStep:TestStep,
    adapters: GenericAdapter,
    potentialEntityClassOrId: PotentialClass<PotentialEntity>|string
) => (typeof potentialEntityClassOrId === 'string')
        ? it(`${testStep} the entity with id '${potentialEntityClassOrId}' is created.`,
            () => expect(adapters
                .entityInteractor
                .retrieveEntityById(potentialEntityClassOrId)
                .retrieveComponent(LifeCycle)
                .isCreated)
                .to.be.true)
        : it(`${testStep} the '${potentialEntityClassOrId.name}' entity is created.`,
            () => expect(adapters
                .entityInteractor
                .retrieveEntityByClass(potentialEntityClassOrId)
                .retrieveComponent(LifeCycle)
                .isCreated)
                .to.be.true)

export const theEventIsSent = (
    testStep:TestStep,
    adapters: FakeClientAdapters | FakeServerAdapters,
    gameEvent: GameEvent,
    eventSentQty?:number,
    skip?:boolean
) => (skip)
    ? it.skip(`${testStep} the event with action '${gameEvent.action}' is sent with the following entity references:'${stringifyWithDetailledSetAndMap(gameEvent.entityRefences)}'${(eventSentQty) ? ` ${eventSentQty} times.` : '.'}`,
        () => expect(adapters
            .eventInteractor
            .retrieveEvent(gameEvent).length)
            .equal((eventSentQty) || 1))
    : it(`${testStep} the event with action '${gameEvent.action}' is sent with the following entity references:'${stringifyWithDetailledSetAndMap(gameEvent.entityRefences)}'${(eventSentQty) ? ` ${eventSentQty} times.` : '.'}`,
        () => expect(adapters
            .eventInteractor
            .retrieveEvent(gameEvent).length)
            .equal((eventSentQty) || 1))

export const theEventIsNotSent = (
    testStep:TestStep,
    adapters: FakeClientAdapters | FakeServerAdapters,
    gameEvent: GameEvent
) => it(`${testStep} the event with action '${gameEvent.action}' is not sent with the following entity references:'${stringifyWithDetailledSetAndMap(gameEvent.entityRefences)}.`,
    () => expect(adapters
        .eventInteractor
        .hasEvent(gameEvent))
        .to.be.false)

export const theEntityWithIdHasTheExpectedComponent = <PotentialComponent extends Component> (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    entityId: string,
    potentialComponent:PotentialClass<PotentialComponent>,
    expectedComponent: GenericComponent
) => it(`${testStep} the entity with id '${entityId}' has the expected '${potentialComponent.name}' component : 
            ${stringifyWithDetailledSetAndMap(expectedComponent)}`,
    () => {
        const component = adapters
            .entityInteractor
            .retrieveEntityById(entityId)
            .retrieveComponent(potentialComponent)
        expect(component).deep.equal(expectedComponent, `DETAILS\nexpected >>>>>>>> ${stringifyWithDetailledSetAndMap(component)} \nto deeply equal > ${stringifyWithDetailledSetAndMap(expectedComponent)} \n`)
    })
export const theEntityWithIdDoNotHaveAnyComponent = <PotentialComponent extends Component> (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    entityId: string,
    potentialComponent:PotentialClass<PotentialComponent>,
    expectedComponent: GenericComponent
) => it(`${testStep} the entity with id '${entityId}' don't have any component. 
                ${stringifyWithDetailledSetAndMap(expectedComponent)}`,
    () => expect(adapters
        .entityInteractor
        .retrieveEntityById(entityId)
        .hasComponents()).to.be.false)

export const stringifyWithDetailledSetAndMap = (value:any) => JSON.stringify(value, detailledStringifyForSetAndMap)
const detailledStringifyForSetAndMap = (key:string, value:any):any => (value instanceof Set)
    ? [...value.values()]
    : (value instanceof Map)
        ? mapToObjectLiteral(value)
        : value
function mapToObjectLiteral (value: Map<any, any>): any {
    return Array.from(value).reduce((obj: any, [key, value]) => {
        obj[key] = value
        return obj
    }, {})
}

export const entityIsNotVisible = (
    testStep:TestStep,
    adapters: FakeClientAdapters,
    entityId:string
) => it(`${testStep} the entity with id '${entityId}' is not visible.`,
    () => expect(adapters
        .drawingInteractor
        .drawIds
        .some(id => id === entityId))
        .to.be.false)
export const entityIsVisible = (
    testStep:TestStep,
    adapters: FakeClientAdapters,
    entityId:string
) => it(`${testStep} the entity with id '${entityId}' is visible.`,
    () => expect(adapters
        .drawingInteractor
        .drawIds
        .some(id => id === entityId))
        .to.be.true)

function createClient (nextIdentifiers?:string[]):{adapters:FakeClientAdapters, game:ClientGameSystem} {
    const adapters = new FakeClientAdapters(nextIdentifiers)
    const game = new ClientGameSystem(adapters)
    return { adapters, game }
}
function createServer (nextIdentifiers?:string[]):{adapters:FakeServerAdapters, game:ServerGameSystem} {
    const adapters = new FakeServerAdapters(nextIdentifiers)
    const game = new ServerGameSystem(adapters)
    return { adapters, game }
}
export const serverScenario = (
    ref:string,
    gameEvent:GameEvent|GameEvent[],
    nextIdentifiers:string[]|undefined,
    beforeMochaFunc:((game:ServerGameSystem, adapters:FakeServerAdapters)=>Func)|undefined,
    tests:((game:ServerGameSystem, adapters:FakeServerAdapters)=>Test)[],
    skip?:boolean
) => (skip)
    ? describe.skip(scenarioEventDescription(ref, gameEvent, 'server'), () => {
        const { adapters, game } = createServer(nextIdentifiers)
        // eslint-disable-next-line no-unused-expressions
        if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
        tests.forEach(test => test(game, adapters))
    })
    : describe(scenarioEventDescription(ref, gameEvent, 'server'), () => {
        const { adapters, game } = createServer(nextIdentifiers)
        // eslint-disable-next-line no-unused-expressions
        if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
        tests.forEach(test => test(game, adapters))
    })
export const clientScenario = (
    ref:string,
    gameEvent:GameEvent|GameEvent[],
    nextIdentifiers:string[]|undefined,
    beforeMochaFunc:((game:ClientGameSystem, adapters:FakeServerAdapters)=>Func)|undefined,
    tests:((game:ClientGameSystem, adapters:FakeClientAdapters)=>Test)[]
) => describe(scenarioEventDescription(ref, gameEvent, 'client'), () => {
    const { adapters, game } = createClient(nextIdentifiers)
    // eslint-disable-next-line no-unused-expressions
    if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
    tests.forEach(test => test(game, adapters))
})
