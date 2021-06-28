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
describe('Feature: Match', () => {
    const createMatchEvent = newEvent(Action.create, EntityType.match)
    describe('Scenario :On create', () => {
        const matchId = '0000'
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const serverGameEventSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
        const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter([matchId]))
        systemRepository.addSystem(serverGameEventSystem)
        systemRepository.addSystem(lifeCycleSystem)
        const matchWaitingForPlayers = (matchId:string):GameEvent => newEvent(Action.waitingForPlayers, EntityType.simpleMatchLobby, undefined, matchId)
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
    })
    describe('Scenario :On event', () => {
        const playerJoinMatchEvent = (player:string, matchId:string): GameEvent => newEvent(Action.playerJoinMatch, EntityType.match, matchId, player)
        describe('Scenario :On player join match as first player', () => {
            const matchId = '0000'
            const entityRepository = new InMemoryEntityRepository()
            const systemRepository = new InMemorySystemRepository()
            const serverGameEventSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
            const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter([matchId]))
            const matchSystem = new MatchSystem(entityRepository, systemRepository)
            systemRepository.addSystem(serverGameEventSystem)
            systemRepository.addSystem(lifeCycleSystem)
            systemRepository.addSystem(matchSystem)
            const player = 'Player A'
            const playerAJoinMatchEvent = playerJoinMatchEvent(player, matchId)
            before(() => serverGameEventSystem.onGameEvent(createMatchEvent))
            it(`Given a match with Id ${matchId}`, () => {
                expect(entityRepository.retrieveEntityById(matchId).id).equal(matchId)
            })
            it('And the match don\'t have players', () => {
                expect(entityRepository.retrieveEntityById(matchId).retrieveComponent(Playable).players.length).equal(0)
            })
            whenEventOccurs(serverGameEventSystem, playerAJoinMatchEvent)
            it(`Then the match has '${player}' on it's players`, () => {
                expect(entityRepository.retrieveEntityById(matchId).retrieveComponent(Playable).players.includes(player)).is.true
            })
        })
        describe('Scenario :On player join match as second player', () => {
            const matchId = '0000'
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
            const createTowerEventPlayerA = newEvent(Action.create, EntityType.tower, undefined, playerA)
            const createTowerEventPlayerB = newEvent(Action.create, EntityType.tower, undefined, playerB)
            const createRobotEventPlayerA = newEvent(Action.create, EntityType.robot, undefined, playerA)
            const createRobotEventPlayerB = newEvent(Action.create, EntityType.robot, undefined, playerB)
            const createGridEventForMatch = newEvent(Action.create, EntityType.grid, undefined, matchId)
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
            it(`And the event "${createTowerEventPlayerA.action}" is sent to "${createTowerEventPlayerA.targetEntityType}" for the player "${createTowerEventPlayerA.originEntityId}"`, () => {
                expect(serverGameEventSystem.hasEvent(createTowerEventPlayerA)).is.true
            })
            it(`And the event "${createTowerEventPlayerB.action}" is sent to "${createTowerEventPlayerB.targetEntityType}" for the player "${createTowerEventPlayerB.originEntityId}"`, () => {
                expect(serverGameEventSystem.hasEvent(createTowerEventPlayerB)).is.true
            })
            it(`And the event "${createRobotEventPlayerA.action}" is sent to "${createRobotEventPlayerA.targetEntityType}" for the player "${createRobotEventPlayerA.originEntityId}"`, () => {
                expect(serverGameEventSystem.hasEvent(createRobotEventPlayerA)).is.true
            })
            it(`And the event "${createRobotEventPlayerB.action}" is sent to "${createRobotEventPlayerB.targetEntityType}" for the player "${createRobotEventPlayerB.originEntityId}"`, () => {
                expect(serverGameEventSystem.hasEvent(createRobotEventPlayerB)).is.true
            })
            it(`And the event "${createGridEventForMatch.action}" is sent to "${createGridEventForMatch.targetEntityType}" for the game "${createGridEventForMatch.originEntityId}"`, () => {
                expect(serverGameEventSystem.hasEvent(createGridEventForMatch)).is.true
            })
        })
        describe.skip('On register Grid On Match Event ', () => {
            const gridId = 'grid'
            const matchId = 'match'
            const event = newEvent(Action.register, EntityType.match, matchId, gridId)
            const entityRepository = new InMemoryEntityRepository()
            const systemRepository = new InMemorySystemRepository()
            const gameEventSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
            whenEventOccurs(gameEventSystem, event)
        })
    })
})

/*
Match launch >>> 2 player joined
    >>> Match create Match Entities > Tower x2 / Robot x2 / Grid / 2x Teams
    >>> Turn based system
    >>> On Player action

Event System > Send Client to Server / Send Server to Client / Send locally
*/
