import {
    describe,
    // before,
    it
} from 'mocha'
import { expect } from 'chai'
import { newEvent } from '../../Events/port/GameEvents'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { ServerGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ServerGameEventDispatcherSystem'
import { InMemorySystemRepository } from '../../Systems/Generic/infra/InMemorySystemInteractor'
import { ServerLifeCycleSystem } from '../../Systems/LifeCycle/ServerLifeCycleSystem'
import { FakeIdentifierAdapter } from '../../Systems/LifeCycle/infra/FakeIdentifierAdapter'
import { LifeCycle } from '../../Component/LifeCycle'
import { Grid } from './Grid'
import { Dimension, Dimensional } from '../../Component/Dimensional'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { whenEventOccurs } from '../../Events/port/test'

const entityName = 'Grid'
describe(`Feature : ${entityName}`, () => {
    describe('On create', () => {
        const matchId = '0000'
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const gridId = 'grid'
        const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter([gridId]))
        systemRepository.addSystem(lifeCycleSystem)
        const gameEventSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
        systemRepository.addSystem(gameEventSystem)
        const expectedDimention:Dimension = { x: 25, y: 25 }
        const registerGridOnMatchEvent = newEvent(Action.register, EntityType.nothing, EntityType.match, matchId, gridId)
        const createGridEvent = (matchId:string) => newEvent(Action.create, EntityType.nothing, EntityType.grid, undefined, matchId)
        it(`Given there is no ${entityName}`, () => {
            expect(() => entityRepository.retrieveEntityByClass(Grid)).to.throw()
        })
        whenEventOccurs(gameEventSystem, createGridEvent(matchId))
        it(`Then the ${entityName} is created`, () => {
            expect(entityRepository.retrieveEntityById(gridId).retrieveComponent(LifeCycle).isCreated).is.true
        })
        it(`And the ${entityName} has the following dimensions : ${JSON.stringify(expectedDimention)}`, () => {
            expect(entityRepository.retrieveEntityById(gridId).retrieveComponent(Dimensional).dimensions).deep.equal(expectedDimention)
        })
        it(`And the event "${registerGridOnMatchEvent.action}" is sent to "${registerGridOnMatchEvent.targetEntityType}" for the game "${registerGridOnMatchEvent.originEntityId}"`, () => {
            expect(gameEventSystem.hasEvent(registerGridOnMatchEvent)).is.true
        })
    })
})
