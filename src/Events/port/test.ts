import { describe, before, Func, it, Test } from 'mocha'
import { expect } from 'chai'
import { GameEvent } from './GameEvent'
import { GenericGameSystem } from '../../Systems/Game/GenericGame'
import { Entity } from '../../Entities/GenericEntity/ports/Entity'
import { PotentialClass } from '../../Entities/GenericEntity/ports/PotentialClass'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'
import { LifeCycle } from '../../Component/LifeCycle'
import { TestStep } from './TestStep'
import { GenericAdapter } from '../../Systems/Game/port/genericAdapters'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { GenericComponent } from '../../Component/GenericComponent'
import { Component } from '../../Component/port/Component'
import { Action } from './Action'
import { ClientGameSystem } from '../../Systems/Game/ClientGame'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'
export const featureEventDescription = (action:Action): string => `Feature : ${action} events`
export const scenarioEventDescription = (event: GameEvent|GameEvent[], gameType:'client'|'server'): string => ((Array.isArray(event))
    ? `
    Scenario - ${gameType}:\n${event.map(event => `        Event action '${event.action}.'
        Target entity type '${event.targetEntityType}' with Id '${event.targetEntityId}'. 
        Origin entity type '${event.originEntityType}' with Id '${event.originEntityId}'.`).join('\n        And\n')}`
    : `
    Scenario - ${gameType}:
        Event action '${event.action}.'
        Target entity type '${event.targetEntityType}' with Id '${event.targetEntityId}'. 
        Origin entity type '${event.originEntityType}' with Id '${event.originEntityId}'.
    `
)
export const whenEventOccurs = (eventDispatcherSystem:GenericGameSystem, event:GameEvent) => it(eventMessage(event), () => eventDispatcherSystem.onGameEvent(event))
const eventMessage = (event:GameEvent): string => `When the event action '${event.action}' occurs with origin entity '${event.originEntityType}' to target entity '${event.targetEntityType}'.`

export const theEntityIsOnRepository = <PotentialEntity extends Entity> (
    testStep:TestStep,
    adapters: GenericAdapter,
    potentialEntityOrEntityId: PotentialClass<PotentialEntity> | string
) => (typeof potentialEntityOrEntityId === 'string')
        ? it(`${testStep} there is an entity with id '${potentialEntityOrEntityId}' on entities repository.`,
            () => expect(() => adapters
                .entityInteractor
                .retrieveEntityById(potentialEntityOrEntityId))
                .to.not.throw())
        : it(`${testStep} there is a '${potentialEntityOrEntityId.name}' entity on entities repository.`,
            () => expect(() => adapters
                .entityInteractor
                .retrieveEntityByClass(potentialEntityOrEntityId))
                .to.not.throw())

export const theEntityIsNotOnRepository = <PotentialEntity extends Entity> (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    potentialEntity: PotentialClass<PotentialEntity>
) => it(`${testStep} there is no ${potentialEntity.name} entity on entities repository.`,
        () => expect(() => adapters
            .entityInteractor
            .retrieveEntityByClass(potentialEntity))
            .to.throw())

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
    eventSentQty?:number
) => it(`${testStep} the event with action '${gameEvent.action}' is sent to the '${gameEvent.targetEntityType}'${(eventSentQty) ? ` ${eventSentQty} times.` : '.'}`,
    () => expect(adapters
        .eventInteractor
        .retrieveEvent(gameEvent).length)
        .equal((eventSentQty) || 1))

export const theEntityWithIdHasTheExpectedComponent = <PotentialComponent extends Component> (
    testStep:TestStep,
    adapters: FakeServerAdapters,
    entityId: string,
    potentialComponent:PotentialClass<PotentialComponent>,
    expectedComponent: GenericComponent
) => it(`${testStep} the entity with id '${entityId}' has the expected '${potentialComponent.name}' component : 
            ${JSON.stringify(expectedComponent)}`,
    () => {
        const component = adapters
            .entityInteractor
            .retrieveEntityById(entityId)
            .retrieveComponent(potentialComponent)
        expect(component).deep.equal(expectedComponent, `DETAILS\nexpected >>>>>>>> ${JSON.stringify(expectedComponent, detailledStringifyForSetAndMap)} \nto deeply equal > ${JSON.stringify(component, detailledStringifyForSetAndMap)} \n`)
    })

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
    gameEvent:GameEvent|GameEvent[],
    nextIdentifiers:string[]|undefined,
    beforeMochaFunc:((game:ServerGameSystem, adapters:FakeServerAdapters)=>Func)|undefined,
    tests:((game:ServerGameSystem, adapters:FakeServerAdapters)=>Test)[]
) => describe(scenarioEventDescription(gameEvent, 'server'), () => {
    const { adapters, game } = createServer(nextIdentifiers)
    // eslint-disable-next-line no-unused-expressions
    if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
    tests.forEach(test => test(game, adapters))
})
export const clientScenario = (
    gameEvent:GameEvent|GameEvent[],
    nextIdentifiers:string[]|undefined,
    beforeMochaFunc:((game:ClientGameSystem, adapters:FakeServerAdapters)=>Func)|undefined,
    tests:((game:ClientGameSystem, adapters:FakeClientAdapters)=>Test)[]
) => describe(scenarioEventDescription(gameEvent, 'client'), () => {
    const { adapters, game } = createClient(nextIdentifiers)
    // eslint-disable-next-line no-unused-expressions
    if (beforeMochaFunc)before(beforeMochaFunc(game, adapters))
    tests.forEach(test => test(game, adapters))
})
