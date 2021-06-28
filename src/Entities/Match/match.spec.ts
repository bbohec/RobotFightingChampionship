import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { Match } from './Match'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { ServerGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ServerGameEventDispatcherSystem'
import { newEvent } from '../../Events/port/GameEvents'
import { LifeCycle } from '../../Component/LifeCycle'
import { InMemorySystemRepository } from '../../Systems/Generic/infra/InMemorySystemInteractor'
import { ServerLifeCycleSystem } from '../../Systems/LifeCycle/ServerLifeCycleSystem'
import { FakeIdentifierAdapter } from '../../Systems/LifeCycle/infra/FakeIdentifierAdapter'
import { Playable } from '../../Component/Playable'
import { MatchSystem } from '../../Systems/Match/MatchSystem'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { GameEvent } from '../../Events/port/GameEvent'
import { whenEventOccurs } from '../../Events/port/test'
// import { GridReference } from '../../Component/GridReference'
import { EntityReference } from '../../Component/EntityReference'
describe('Feature: Match', () => {
    const createMatchEvent = newEvent(Action.create, EntityType.nothing, EntityType.match)
    const playerId = 'Player A'
    const matchId = '0000'
    describe('Scenario :On create', () => {
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const serverGameEventSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
        const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter([matchId]))
        systemRepository.addSystem(serverGameEventSystem)
        systemRepository.addSystem(lifeCycleSystem)
        const matchWaitingForPlayers = (matchId:string):GameEvent => newEvent(Action.waitingForPlayers, EntityType.match, EntityType.simpleMatchLobby, undefined, matchId)
        it('Given there is no match', () => {
            expect(() => entityRepository.retrieveEntityByClass(Match)).to.throw()
        })
        whenEventOccurs(serverGameEventSystem, createMatchEvent)
        it('Then the match is created', () => {
            expect(entityRepository.retrieveEntityByClass(Match).retrieveComponent(LifeCycle).isCreated).is.true
        })
        it('And the event "Waiting for players" is sent to "Simple Match Lobby"', () => {
            expect(serverGameEventSystem.hasEvent(matchWaitingForPlayers(matchId))).is.true
        })
        it('And the Match has a Playable component without players.', () => {
            expect(entityRepository.retrieveEntityByClass(Match).retrieveComponent(Playable).players.length).equal(0)
        })
        it('And the Match has a EntityReference component without references.', () => {
            expect(entityRepository.retrieveEntityByClass(Match).retrieveComponent(EntityReference).entityReferences.size).equal(0)
        })
    })
    describe('Scenario :On event', () => {
        const playerJoinMatchEvent = (player:string, matchId:string): GameEvent => newEvent(Action.playerJoinMatch, EntityType.player, EntityType.match, matchId, player)
        describe('Scenario :On player join match as first player', () => {
            const entityRepository = new InMemoryEntityRepository()
            const systemRepository = new InMemorySystemRepository()
            const serverGameEventSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
            const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter([matchId]))
            const matchSystem = new MatchSystem(entityRepository, systemRepository)
            systemRepository.addSystem(serverGameEventSystem)
            systemRepository.addSystem(lifeCycleSystem)
            systemRepository.addSystem(matchSystem)
            const playerAJoinMatchEvent = playerJoinMatchEvent(playerId, matchId)
            before(() => serverGameEventSystem.onGameEvent(createMatchEvent))
            it(`Given a match with Id ${matchId}`, () => {
                expect(entityRepository.retrieveEntityById(matchId).id).equal(matchId)
            })
            it('And the match don\'t have players', () => {
                expect(entityRepository.retrieveEntityById(matchId).retrieveComponent(Playable).players.length).equal(0)
            })
            whenEventOccurs(serverGameEventSystem, playerAJoinMatchEvent)
            it(`Then the match has '${playerId}' on it's players`, () => {
                expect(entityRepository.retrieveEntityById(matchId).retrieveComponent(Playable).players.includes(playerId)).is.true
            })
        })
        describe('Scenario :On player join match as second player', () => {
            const entityRepository = new InMemoryEntityRepository()
            const systemRepository = new InMemorySystemRepository()
            const serverGameEventSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
            const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter([matchId]))
            const matchSystem = new MatchSystem(entityRepository, systemRepository)
            systemRepository.addSystem(serverGameEventSystem)
            systemRepository.addSystem(lifeCycleSystem)
            systemRepository.addSystem(matchSystem)
            const playerA = 'Player A'
            const playerAJoinMatchEvent = playerJoinMatchEvent(playerA, matchId)
            const playerB = 'Player B'
            const playerBJoinMatchEvent = playerJoinMatchEvent(playerB, matchId)
            const expectedPlayerEvents = [
                newEvent(Action.create, EntityType.nothing, EntityType.tower, undefined, playerA),
                newEvent(Action.create, EntityType.nothing, EntityType.tower, undefined, playerB),
                newEvent(Action.create, EntityType.nothing, EntityType.robot, undefined, playerA),
                newEvent(Action.create, EntityType.nothing, EntityType.robot, undefined, playerB)

            ]
            const createGridEventForMatch = newEvent(Action.create, EntityType.nothing, EntityType.grid, undefined, matchId)
            before(() => {
                return serverGameEventSystem.onGameEvent(createMatchEvent)
                    .then(() => serverGameEventSystem.onGameEvent(playerAJoinMatchEvent))
            })
            it(`Given a match with Id ${matchId}`, () => {
                expect(entityRepository.retrieveEntityById(matchId).id).equal(matchId)
            })
            it(`And the match has '${playerA}' on it's players`, () => {
                expect(entityRepository.retrieveEntityById(matchId).retrieveComponent(Playable).players.includes(playerA)).is.true
            })
            whenEventOccurs(serverGameEventSystem, playerBJoinMatchEvent)
            it(`Then the match has '${playerB}' on it's players`, () => {
                expect(entityRepository.retrieveEntityById(matchId).retrieveComponent(Playable).players.includes(playerB)).is.true
            })
            expectedPlayerEvents.forEach(event => {
                it(`And the event "${event.action}" is sent to "${event.targetEntityType}" for the player "${event.originEntityId}"`, () => {
                    expect(serverGameEventSystem.hasEvent(event)).is.true
                })
            })
            it(`And the event "${createGridEventForMatch.action}" is sent to "${createGridEventForMatch.targetEntityType}" for the game "${createGridEventForMatch.originEntityId}"`, () => {
                expect(serverGameEventSystem.hasEvent(createGridEventForMatch)).is.true
            })
        })
        describe('On register Grid On Match Event ', () => {
            const gridId = 'grid'
            const event = newEvent(Action.register, EntityType.grid, EntityType.match, matchId, gridId)
            const entityRepository = new InMemoryEntityRepository()
            const systemRepository = new InMemorySystemRepository()
            const gameEventSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
            const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter([matchId]))
            const matchSystem = new MatchSystem(entityRepository, systemRepository)
            systemRepository.addSystem(lifeCycleSystem)
            systemRepository.addSystem(gameEventSystem)
            systemRepository.addSystem(matchSystem)
            before(() => {
                return gameEventSystem.onGameEvent(createMatchEvent)
            })
            it(`Given a match with Id ${matchId}`, () => {
                expect(entityRepository.retrieveEntityById(matchId).id).equal(matchId)
            })
            whenEventOccurs(gameEventSystem, event)
            it(`Then the Match has a Grid Reference with ${gridId}`, () => {
                expect(entityRepository.retrieveEntityById(matchId).retrieveComponent(EntityReference).entityReferences.has(gridId)).is.true
            })
        })
        describe.skip('On player ready', () => {
            const entityRepository = new InMemoryEntityRepository()
            const systemRepository = new InMemorySystemRepository()
            const gameEventSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
            const playerReadyForMatchEvent = newEvent(Action.ready, EntityType.player, EntityType.match, 'MATCH', playerId)
            whenEventOccurs(gameEventSystem, playerReadyForMatchEvent)
        })
    })
})
