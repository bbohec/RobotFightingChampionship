import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { newEvent } from '../../Events/port/GameEvents'
import { whenEventOccurs } from '../../Events/port/test'
import { ServerGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ServerGameEventDispatcherSystem'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { InMemorySystemRepository } from '../../Systems/Generic/infra/InMemorySystemInteractor'
import { ServerLifeCycleSystem } from '../../Systems/LifeCycle/ServerLifeCycleSystem'
import { FakeIdentifierAdapter } from '../../Systems/LifeCycle/infra/FakeIdentifierAdapter'
import { LifeCycle } from '../../Component/LifeCycle'
import { Player } from './Player'
import { MatchSystem } from '../../Systems/Match/MatchSystem'
import { EntityReference } from '../../Component/EntityReference'

describe('Feature Player', () => {
    const playerId = 'Player A'
    const towerId = 'Tower'
    const robotId = 'Robot'
    const createPlayerEvent = newEvent(Action.create, EntityType.nothing, EntityType.player)
    const registerTowerOnPlayerEvent = newEvent(Action.register, EntityType.tower, EntityType.player, playerId, towerId)
    const registerRobotOnPlayerEvent = newEvent(Action.register, EntityType.robot, EntityType.player, playerId, robotId)
    describe('Player : on create', () => {
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const eventDispatcherSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
        const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter([playerId]))
        systemRepository.addSystem(lifeCycleSystem)
        it('Given there is no player', () => {
            expect(() => entityRepository.retrieveEntityByClass(Player)).to.throw()
        })
        whenEventOccurs(eventDispatcherSystem, createPlayerEvent)
        it('Then the player is created', () => {
            expect(entityRepository.retrieveEntityByClass(Player).retrieveComponent(LifeCycle).isCreated).is.true
        })
        it('And the Match has a EntityReference component without references.', () => {
            expect(entityRepository.retrieveEntityByClass(Player).retrieveComponent(EntityReference).entityReferences.size).equal(0)
        })
    })
    describe('Player : on Register Tower', () => {
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const eventDispatcherSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
        const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter([playerId]))
        const matchSystem = new MatchSystem(entityRepository, systemRepository)
        systemRepository.addSystem(lifeCycleSystem)
        systemRepository.addSystem(matchSystem)
        before(() => eventDispatcherSystem.onGameEvent(createPlayerEvent))
        it(`Given a player with Id ${playerId}`, () => {
            expect(entityRepository.retrieveEntityById(playerId).id).equal(playerId)
        })
        whenEventOccurs(eventDispatcherSystem, registerTowerOnPlayerEvent)
        it(`Then the Player has a ${EntityType.tower} Reference with ${towerId}`, () => {
            expect(entityRepository.retrieveEntityById(playerId).retrieveComponent(EntityReference).entityReferences.get(towerId)).equal(EntityType.tower)
        })
    })
    describe('Player : on Register Robot', () => {
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const eventDispatcherSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
        const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter([playerId]))
        const matchSystem = new MatchSystem(entityRepository, systemRepository)
        systemRepository.addSystem(lifeCycleSystem)
        systemRepository.addSystem(matchSystem)
        before(() => eventDispatcherSystem.onGameEvent(createPlayerEvent))
        it(`Given a player with Id ${playerId}`, () => {
            expect(entityRepository.retrieveEntityById(playerId).id).equal(playerId)
        })
        whenEventOccurs(eventDispatcherSystem, registerRobotOnPlayerEvent)
        it(`Then the Player has a ${EntityType.robot} Reference with ${robotId}`, () => {
            expect(entityRepository.retrieveEntityById(playerId).retrieveComponent(EntityReference).entityReferences.get(robotId)).equal(EntityType.robot)
        })
    })
    describe.skip('Player : on Register Robot & Tower', () => {
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const eventDispatcherSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
        whenEventOccurs(eventDispatcherSystem, registerRobotOnPlayerEvent)
        whenEventOccurs(eventDispatcherSystem, registerTowerOnPlayerEvent)
        const playerReadyForMatch = newEvent(Action.ready, EntityType.player, EntityType.match, 'MATCH', playerId)
        it(`And the event "${playerReadyForMatch.action}" is sent to "${playerReadyForMatch.targetEntityType}" for the game "${playerReadyForMatch.originEntityId}"`, () => {
            expect(eventDispatcherSystem.hasEvent(playerReadyForMatch)).is.true
        })
    })
})
