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
describe('Feature : Robot', () => {
    describe('On create', () => {
        const player = 'Player A'
        const createRobotEventPlayer = newEvent(Action.create, EntityType.robot, undefined, player)
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const gameEventSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
        const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter())
        systemRepository.addSystem(lifeCycleSystem)
        it('Given there is no Robot', () => {
            expect(() => entityRepository.retrieveEntityByClass(Robot)).to.throw()
        })

        whenEventOccurs(gameEventSystem, createRobotEventPlayer)
        it.skip('Then the Robot is created', () => {
            // expect(entityRepository.retrieveEntityByClass(Match).retrieveComponent(LifeCycle).isCreated).is.true
        })
    })
})
