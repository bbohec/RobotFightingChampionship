import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { Match } from './Match'
import { newEvent } from '../../Events/port/GameEvents'
import { LifeCycle } from '../../Component/LifeCycle'
import { Playable } from '../../Component/Playable'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { GameEvent } from '../../Events/port/GameEvent'
import { whenEventOccurs } from '../../Events/port/test'
import { EntityReference } from '../../Component/EntityReference'
import { Phasing } from '../../Component/Phasing'
import { Phase } from '../../Component/port/Phase'
import { ServerGame } from '../../Systems/Game/ServerGame'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
describe('Feature: Match', () => {
    const createMatchEvent = newEvent(Action.create, EntityType.nothing, EntityType.match)
    const playerAId = 'Player A'
    const playerBId = 'Player B'
    const matchId = '0000'
    describe('Scenario :On create', () => {
        const adapters = new FakeServerAdapters([matchId])
        const game = new ServerGame(adapters)
        const matchWaitingForPlayers = (matchId:string):GameEvent => newEvent(Action.waitingForPlayers, EntityType.match, EntityType.simpleMatchLobby, undefined, matchId)
        it('Given there is no match', () => {
            expect(() => adapters.entityInteractor.retrieveEntityByClass(Match)).to.throw()
        })
        whenEventOccurs(game, createMatchEvent)
        it('Then the match is created', () => {
            expect(adapters.entityInteractor.retrieveEntityByClass(Match).retrieveComponent(LifeCycle).isCreated).is.true
        })
        it('And the event "Waiting for players" is sent to "Simple Match Lobby"', () => {
            expect(adapters.eventInteractor.hasEvent(matchWaitingForPlayers(matchId))).is.true
        })
        it('And the Match has a Playable component without players.', () => {
            expect(adapters.entityInteractor.retrieveEntityByClass(Match).retrieveComponent(Playable).players.length).equal(0)
        })
        it('And the Match has a EntityReference component without references.', () => {
            expect(adapters.entityInteractor.retrieveEntityByClass(Match).retrieveComponent(EntityReference).entityReferences.size).equal(0)
        })
        it(`And the Match has a Phasing component with a current phase set to ${Phase.PreparingGame}.`, () => {
            expect(adapters.entityInteractor.retrieveEntityByClass(Match).retrieveComponent(Phasing).currentPhase).equal(Phase.PreparingGame)
        })
    })
    describe('Scenario :On event', () => {
        const playerJoinMatchEvent = (player:string, matchId:string): GameEvent => newEvent(Action.playerJoinMatch, EntityType.player, EntityType.match, matchId, player)
        describe('Scenario :On player join match as first player', () => {
            const adapters = new FakeServerAdapters([matchId])
            const game = new ServerGame(adapters)
            const playerAJoinMatchEvent = playerJoinMatchEvent(playerAId, matchId)
            before(() => game.onGameEvent(createMatchEvent))
            it(`Given a match with Id ${matchId}`, () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).id).equal(matchId)
            })
            it('And the match don\'t have players', () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).retrieveComponent(Playable).players.length).equal(0)
            })
            whenEventOccurs(game, playerAJoinMatchEvent)
            it(`Then the match has '${playerAId}' on it's players`, () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).retrieveComponent(Playable).players.includes(playerAId)).is.true
            })
        })
        describe('Scenario :On player join match as second player', () => {
            const adapters = new FakeServerAdapters([matchId])
            const game = new ServerGame(adapters)
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
                return game.onGameEvent(createMatchEvent)
                    .then(() => game.onGameEvent(playerAJoinMatchEvent))
            })
            it(`Given a match with Id ${matchId}`, () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).id).equal(matchId)
            })
            it(`And the match has '${playerA}' on it's players`, () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).retrieveComponent(Playable).players.includes(playerA)).is.true
            })
            whenEventOccurs(game, playerBJoinMatchEvent)
            it(`Then the match has '${playerB}' on it's players`, () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).retrieveComponent(Playable).players.includes(playerB)).is.true
            })
            expectedPlayerEvents.forEach(event => {
                it(`And the event "${event.action}" is sent to "${event.targetEntityType}" for the player "${event.originEntityId}"`, () => {
                    expect(adapters.eventInteractor.hasEvent(event)).is.true
                })
            })
            it(`And the event "${createGridEventForMatch.action}" is sent to "${createGridEventForMatch.targetEntityType}" for the game "${createGridEventForMatch.originEntityId}"`, () => {
                expect(adapters.eventInteractor.hasEvent(createGridEventForMatch)).is.true
            })
        })
        describe('On register Grid On Match Event ', () => {
            const adapters = new FakeServerAdapters([matchId])
            const game = new ServerGame(adapters)
            const gridId = 'grid'
            const event = newEvent(Action.register, EntityType.grid, EntityType.match, matchId, gridId)
            before(() => game.onGameEvent(createMatchEvent))
            it(`Given a match with Id ${matchId}`, () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).id).equal(matchId)
            })
            whenEventOccurs(game, event)
            it(`Then the Match has a Grid Reference with ${gridId}`, () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).retrieveComponent(EntityReference).entityReferences.has(gridId)).is.true
            })
        })
        describe('On player ready', () => {
            const adapters = new FakeServerAdapters([matchId])
            const game = new ServerGame(adapters)
            const playerReadyForMatchEvent = newEvent(Action.ready, EntityType.player, EntityType.match, matchId, playerAId)
            before(() => game.onGameEvent(createMatchEvent))
            it(`Given a match with Id ${matchId}`, () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).id).equal(matchId)
            })
            it(`And the match with Id ${matchId} has ${Phase.PreparingGame} current phase.`, () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).retrieveComponent(Phasing).currentPhase).equal(Phase.PreparingGame)
            })
            whenEventOccurs(game, playerReadyForMatchEvent)
            it(`Then the match with Id ${matchId} has ${Phase.PreparingGame} current phase.`, () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).retrieveComponent(Phasing).currentPhase).equal(Phase.PreparingGame)
            })
        })
        describe('On both players ready', () => {
            const adapters = new FakeServerAdapters([matchId])
            const game = new ServerGame(adapters)
            const playerAReadyForMatchEvent = newEvent(Action.ready, EntityType.player, EntityType.match, matchId, playerAId)
            const playerBReadyForMatchEvent = newEvent(Action.ready, EntityType.player, EntityType.match, matchId, playerBId)
            before(() => game.onGameEvent(createMatchEvent))
            it(`Given a match with Id ${matchId}`, () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).id).equal(matchId)
            })
            it(`And the match with Id ${matchId} has ${Phase.PreparingGame} current phase.`, () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).retrieveComponent(Phasing).currentPhase).equal(Phase.PreparingGame)
            })
            whenEventOccurs(game, playerAReadyForMatchEvent)
            whenEventOccurs(game, playerBReadyForMatchEvent)
            it('Then the current turn of the match is "Player A Tower Placement"', () => {
                expect(adapters.entityInteractor.retrieveEntityById(matchId).retrieveComponent(Phasing).currentPhase).equal('Player A Tower Placement')
            })
        })
    })
})
