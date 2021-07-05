import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { LifeCycle } from '../../Component/LifeCycle'
import { newEvent } from '../../Events/port/GameEvents'
import { SimpleMatchLobby } from './SimpleMatchLobby'
import { Visible } from '../../Component/Visible'
import { Playable } from '../../Component/Playable'
import { EntityType } from '../../Events/port/EntityType'
import { Action } from '../../Events/port/Action'
import { GameEvent } from '../../Events/port/GameEvent'
import { whenEventOccurs } from '../../Events/port/test'
import { ServerGame } from '../../Systems/Game/ServerGame'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'
import { ClientGame } from '../../Systems/Game/ClientGame'

describe('Feature: Simple Match Lobby', () => {
    const createSimpleMatchLobbyEvent = newEvent(Action.create, EntityType.nothing, EntityType.simpleMatchLobby)
    describe('Client', () => {
        describe('Scenarios: On Create', () => {
            const adapters = new FakeClientAdapters()
            const game = new ClientGame(adapters)
            const mainMenuHideEvent = newEvent(Action.hide, EntityType.nothing, EntityType.mainMenu)
            const simpleMatchLobbyShow = newEvent(Action.show, EntityType.nothing, EntityType.simpleMatchLobby)
            it('Given there is no Simple Match Lobby entity', () => {
                expect(() => adapters.entityInteractor.retrieveEntityByClass(SimpleMatchLobby)).to.throw()
            })
            whenEventOccurs(game, createSimpleMatchLobbyEvent)
            it('And the Simple Match Lobby is created', () => {
                expect(adapters.entityInteractor.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(LifeCycle).isCreated).is.true
            })
            it('And the Simple Match Lobby has a Visible component', () => {
                expect(adapters.entityInteractor.retrieveEntityByClass(SimpleMatchLobby).hasComponent(Visible)).is.true
            })
            it(`And the event message ${simpleMatchLobbyShow.action} is sent to destination ${simpleMatchLobbyShow.targetEntityType} `, () => {
                expect(adapters.eventInteractor.hasEvent(simpleMatchLobbyShow)).is.true
            })
            it(`And the event message ${mainMenuHideEvent.action} is sent to destination ${mainMenuHideEvent.targetEntityType} `, () => {
                expect(adapters.eventInteractor.hasEvent(mainMenuHideEvent)).is.true
            })
        })
    })
    describe('Server', () => {
        const playerWantJoinSimpleMatchLobby = (player:string) => newEvent(Action.wantToJoin, EntityType.nothing, EntityType.simpleMatchLobby, undefined, player)
        describe('Scenarios: On Create', () => {
            const adapters = new FakeServerAdapters()
            const game = new ServerGame(adapters)
            it('Given there is no Simple Match Lobby entity', () => {
                expect(() => adapters.entityInteractor.retrieveEntityByClass(SimpleMatchLobby)).to.throw()
            })
            whenEventOccurs(game, createSimpleMatchLobbyEvent)
            it('And the Simple Match Lobby is created', () => {
                expect(adapters.entityInteractor.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(LifeCycle).isCreated).is.true
            })
            it('And the Simple Match Lobby has a Waiting Area component', () => {
                expect(adapters.entityInteractor.retrieveEntityByClass(SimpleMatchLobby).hasComponent(Playable)).is.true
            })
        })
        describe('Scenorios : On events', () => {
            describe('Scenario :On one Player want to join simple match', () => {
                const adapters = new FakeServerAdapters()
                const game = new ServerGame(adapters)
                const player = 'Player A'
                before(() => game.onGameEvent(createSimpleMatchLobbyEvent))
                it('Given there is a Simple Match Lobby created', () => {
                    expect(adapters.entityInteractor.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(LifeCycle).isCreated).is.true
                })
                whenEventOccurs(game, playerWantJoinSimpleMatchLobby(player))
                it('Then the Simple Match Lobby has "Player A" ref on players', () => {
                    expect(adapters.entityInteractor.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players.some(playerid => playerid === player)).is.true
                })
            })
            describe('Scenario :On two Players want to join simple match', () => {
                const adapters = new FakeServerAdapters()
                const game = new ServerGame(adapters)
                const players = ['Player A', 'Player B', 'Player A', 'Player B', 'Player B', 'Player B', 'Player B', 'Player C']
                const expectedEventQty = players.length / 2 - (players.length % 2 / 2)
                const createMatchEvent = newEvent(Action.create, EntityType.nothing, EntityType.match)
                before(() => game.onGameEvent(createSimpleMatchLobbyEvent))
                it('Given there is a Simple Match Lobby created', () => {
                    expect(adapters.entityInteractor.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(LifeCycle).isCreated).is.true
                })
                players.forEach(player => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(player)))
                it(`Then the Simple Match Lobby has the following players on Waiting Area : ${players}`, () => {
                    expect(adapters.entityInteractor.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players).deep.equal(players)
                })
                it(`And the event with message ${createMatchEvent.action} and destination ${createMatchEvent.targetEntityType} is sent ${expectedEventQty} times.`, () => {
                    expect(adapters.eventInteractor.gameEvents.filter(event => event.action === createMatchEvent.action && event.targetEntityType === createMatchEvent.targetEntityType).length).equal(expectedEventQty)
                })
            })
            describe('Scenario :On Match Wait for Players', () => {
                describe('Enough players', () => {
                    const adapters = new FakeServerAdapters()
                    const game = new ServerGame(adapters)
                    const expectedAddedPlayers = ['Player A', 'Player B']
                    const expectedStillWaitingPlayers = ['Player C', 'Player D']
                    const matchId = '0000'
                    const matchWaitingForPlayers = (matchId:string):GameEvent => newEvent(Action.waitingForPlayers, EntityType.nothing, EntityType.simpleMatchLobby, undefined, matchId)
                    before(() => game.onGameEvent(createSimpleMatchLobbyEvent)
                        .then(() => Promise.all([...expectedAddedPlayers, ...expectedStillWaitingPlayers].map(player => game.onGameEvent(playerWantJoinSimpleMatchLobby(player)))))
                    )
                    it(`Given there is 4 players on the game registered on the following order: ${[...expectedAddedPlayers, ...expectedStillWaitingPlayers]}`, () => {
                        expect(adapters.entityInteractor.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players).deep.equal([...expectedAddedPlayers, ...expectedStillWaitingPlayers])
                    })
                    whenEventOccurs(game, matchWaitingForPlayers(matchId))
                    it(`Then there is the following players that are still waiting on the lobby: ${expectedStillWaitingPlayers}`, () => {
                        expect(adapters.entityInteractor.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players).deep.equal(expectedStillWaitingPlayers)
                    })
                    it('And there is 2 events \'Player join match\' for the \'0000\' Match', () => {
                        const playerJoinMatchEvent = (player:string, matchId:string): GameEvent => newEvent(Action.playerJoinMatch, EntityType.nothing, EntityType.match, matchId, player)
                        expect(adapters.eventInteractor.hasEvent(playerJoinMatchEvent(expectedAddedPlayers[0], matchId))).is.true
                        expect(adapters.eventInteractor.hasEvent(playerJoinMatchEvent(expectedAddedPlayers[1], matchId))).is.true
                    })
                })
            })
        })
    })
})
