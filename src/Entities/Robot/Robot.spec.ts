import {
    describe,
    // before,
    it
} from 'mocha'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { expect } from 'chai'
import { newEvent } from '../../Events/port/GameEvents'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { whenEventOccurs } from '../../Events/port/test'
import { ServerGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ServerGameEventDispatcherSystem'
import { InMemorySystemRepository } from '../../Systems/Generic/infra/InMemorySystemInteractor'
import { ServerLifeCycleSystem } from '../../Systems/LifeCycle/ServerLifeCycleSystem'
import { FakeIdentifierAdapter } from '../../Systems/LifeCycle/infra/FakeIdentifierAdapter'
import { Robot } from './Robot'
import { LifeCycle } from '../../Component/LifeCycle'
describe('Feature : Robot', () => {
    describe('On create', () => {
        const player = 'Player A'
        const robotId = 'Robot'
        const createRobotEventPlayer = newEvent(Action.create, EntityType.nothing, EntityType.robot, undefined, player)
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const gameEventSystem = new ServerGameEventDispatcherSystem(systemRepository)
        const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, gameEventSystem, new FakeIdentifierAdapter([robotId]))
        systemRepository.addSystem(lifeCycleSystem)
        systemRepository.addSystem(gameEventSystem)
        const registerRobotOnPlayerEvent = newEvent(Action.register, EntityType.nothing, EntityType.player, player, robotId)
        it('Given there is no Robot', () => {
            expect(() => entityRepository.retrieveEntityByClass(Robot)).to.throw()
        })
        whenEventOccurs(gameEventSystem, createRobotEventPlayer)
        it('Then the Robot is created', () => {
            expect(entityRepository.retrieveEntityByClass(Robot).retrieveComponent(LifeCycle).isCreated).is.true
        })
        it(`And the event "${registerRobotOnPlayerEvent.action}" is sent to "${registerRobotOnPlayerEvent.targetEntityType}" for the game "${registerRobotOnPlayerEvent.originEntityId}"`, () => {
            expect(gameEventSystem.hasEvent(registerRobotOnPlayerEvent)).is.true
        })
    })
})
