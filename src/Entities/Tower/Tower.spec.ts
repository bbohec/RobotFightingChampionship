import {
    describe,
    // before,
    it
} from 'mocha'
import { expect } from 'chai'
import { LifeCycle } from '../../Component/LifeCycle'
import { newEvent } from '../../Events/port/GameEvents'
import { ServerGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ServerGameEventDispatcherSystem'
import { InMemorySystemRepository } from '../../Systems/Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../Systems/LifeCycle/infra/FakeIdentifierAdapter'
import { ServerLifeCycleSystem } from '../../Systems/LifeCycle/ServerLifeCycleSystem'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { Tower } from './Tower'
import { whenEventOccurs } from '../../Events/port/test'

const entityName = 'Tower'
describe(`Feature : ${entityName}`, () => {
    describe('On create', () => {
        const playerId = 'player'
        const towerId = 'tower'
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter([towerId]))
        const gameEventSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
        systemRepository.addSystem(lifeCycleSystem)
        systemRepository.addSystem(gameEventSystem)
        const createTowerEventPlayer = newEvent(Action.create, EntityType.nothing, EntityType.tower, undefined, playerId)
        const registerTowerOnPlayerEvent = newEvent(Action.register, EntityType.nothing, EntityType.player, playerId, towerId)
        it(`Given there is no ${entityName}`, () => {
            expect(() => entityRepository.retrieveEntityByClass(Tower)).to.throw()
        })
        whenEventOccurs(gameEventSystem, createTowerEventPlayer)
        it(`Then the ${entityName} is created`, () => {
            expect(entityRepository.retrieveEntityById(towerId).retrieveComponent(LifeCycle).isCreated).is.true
        })

        it(`And the event "${registerTowerOnPlayerEvent.action}" is sent to "${registerTowerOnPlayerEvent.targetEntityType}" for the game "${registerTowerOnPlayerEvent.originEntityId}"`, () => {
            expect(gameEventSystem.hasEvent(registerTowerOnPlayerEvent)).is.true
        })
    })
})
