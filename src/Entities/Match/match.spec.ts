import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { Match } from './Match'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { ServerGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ServerGameEventDispatcherSystem'
import { createMatchEvent, MatchWaitingForPlayers, playerJoinMatch } from '../../Events/port/GameEvents'
import { LifeCycle } from '../../Component/LifeCycle'
import { InMemorySystemRepository } from '../../Systems/Generic/infra/InMemorySystemInteractor'
import { ServerLifeCycleSystem } from '../../Systems/LifeCycle/ServerLifeCycleSystem'
import { FakeIdentifierAdapter } from '../../Systems/LifeCycle/infra/FakeIdentifierAdapter'
import { Playable } from '../../Component/Playable'
import { MatchSystem } from '../../Systems/Match/MatchSystem'

describe('Feature: Match', () => {
    describe('Scenario :On create', () => {
        const matchId = '0000'
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const serverGameEventSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
        const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter([matchId]))
        systemRepository.addSystem(serverGameEventSystem)
        systemRepository.addSystem(lifeCycleSystem)
        it('Given there is no match', () => {
            expect(() => entityRepository.retrieveEntityByClass(Match)).to.throw()
        })
        it(`On event with message '${createMatchEvent.message}' and destination '${createMatchEvent.destination}'`, () => {
            return serverGameEventSystem.onGameEvent(createMatchEvent)
        })
        it('Then the match is created', () => {
            expect(entityRepository.retrieveEntityByClass(Match).retrieveComponent(LifeCycle).isCreated).is.true
        })
        it('Then the event "Waiting for players" is sent to "Simple Match Lobby"', () => {
            expect(serverGameEventSystem.hasEvent(MatchWaitingForPlayers(matchId))).is.true
        })
        it('And the Match has a Playable component without players.', () => {
            expect(entityRepository.retrieveEntityByClass(Match).retrieveComponent(Playable).players.length).equal(0)
        })
    })
    describe('Scenario :On event', () => {
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
            const playerJoinMatchEvent = playerJoinMatch(player, matchId)
            before(() => serverGameEventSystem.onGameEvent(createMatchEvent))
            it(`Given a match with Id ${matchId}`, () => {
                expect(entityRepository.retrieveEntityById(matchId).id).equal(matchId)
            })
            it('And the match don\'t have players', () => {
                expect(entityRepository.retrieveEntityById(matchId).retrieveComponent(Playable).players.length).equal(0)
            })
            it(`When event '${playerJoinMatchEvent.message}' for '${playerJoinMatchEvent.destination}'`, () => {
                return serverGameEventSystem.onGameEvent(playerJoinMatchEvent)
            })
            it(`Then the match has '${player}' on it's players`, () => {
                expect(entityRepository.retrieveEntityById(matchId).retrieveComponent(Playable).players.includes(player)).is.true
            })
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
