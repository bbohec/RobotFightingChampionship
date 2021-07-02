import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { LifeCycle } from '../../Component/LifeCycle'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { newEvent } from '../../Events/port/GameEvents'
import { ServerGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ServerGameEventDispatcherSystem'
import { InMemorySystemRepository } from '../../Systems/Generic/infra/InMemorySystemInteractor'
import { ServerLifeCycleSystem } from '../../Systems/LifeCycle/ServerLifeCycleSystem'
import { WaitingAreaSystem } from '../../Systems/WaitingArea/WaitingAreaSystem'
import { SimpleMatchLobby } from './SimpleMatchLobby'
import { ClientLifeCycleSystem } from '../../Systems/LifeCycle/ClientLifeCycleSystem'
import { ClientGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ClientGameEventDispatcherSystem'
import { Visible } from '../../Component/Visible'
import { FakeIdentifierAdapter } from '../../Systems/LifeCycle/infra/FakeIdentifierAdapter'
import { Playable } from '../../Component/Playable'
import { EntityType } from '../../Events/port/EntityType'
import { Action } from '../../Events/port/Action'
import { GameEvent } from '../../Events/port/GameEvent'
import { whenEventOccurs } from '../../Events/port/test'

describe('Feature: Simple Match Lobby', () => {
    const createSimpleMatchLobbyEvent = newEvent(Action.create, EntityType.nothing, EntityType.simpleMatchLobby)
    describe('Client', () => {
        describe('Scenarios: On Create', () => {
            const entityRepository = new InMemoryEntityRepository()
            const systemRepository = new InMemorySystemRepository()
            const gameEventDispatcherSystem = new ClientGameEventDispatcherSystem(systemRepository)
            const lifeCycleSystem = new ClientLifeCycleSystem(entityRepository, gameEventDispatcherSystem, new FakeIdentifierAdapter())
            systemRepository.addSystem(lifeCycleSystem)
            systemRepository.addSystem(gameEventDispatcherSystem)
            const mainMenuHideEvent = newEvent(Action.hide, EntityType.nothing, EntityType.mainMenu)
            const simpleMatchLobbyShow = newEvent(Action.show, EntityType.nothing, EntityType.simpleMatchLobby)
            it('Given there is no Simple Match Lobby entity', () => {
                expect(() => entityRepository.retrieveEntityByClass(SimpleMatchLobby)).to.throw()
            })
            whenEventOccurs(gameEventDispatcherSystem, createSimpleMatchLobbyEvent)
            it('And the Simple Match Lobby is created', () => {
                expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(LifeCycle).isCreated).is.true
            })
            it('And the Simple Match Lobby has a Visible component', () => {
                expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).hasComponent(Visible)).is.true
            })
            it(`And the event message ${simpleMatchLobbyShow.action} is sent to destination ${simpleMatchLobbyShow.targetEntityType} `, () => {
                expect(gameEventDispatcherSystem.hasEvent(simpleMatchLobbyShow)).is.true
            })
            it(`And the event message ${mainMenuHideEvent.action} is sent to destination ${mainMenuHideEvent.targetEntityType} `, () => {
                expect(gameEventDispatcherSystem.hasEvent(mainMenuHideEvent)).is.true
            })
        })
    })
    describe('Server', () => {
        const playerWantJoinSimpleMatchLobby = (player:string) => newEvent(Action.wantToJoin, EntityType.nothing, EntityType.simpleMatchLobby, undefined, player)
        describe('Scenarios: On Create', () => {
            const entityRepository = new InMemoryEntityRepository()
            const systemRepository = new InMemorySystemRepository()
            const serverGameEventDispatcherSystem = new ServerGameEventDispatcherSystem(systemRepository)
            const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, serverGameEventDispatcherSystem, new FakeIdentifierAdapter())
            systemRepository.addSystem(lifeCycleSystem)
            systemRepository.addSystem(serverGameEventDispatcherSystem)
            it('Given there is no Simple Match Lobby entity', () => {
                expect(() => entityRepository.retrieveEntityByClass(SimpleMatchLobby)).to.throw()
            })
            whenEventOccurs(serverGameEventDispatcherSystem, createSimpleMatchLobbyEvent)
            it('And the Simple Match Lobby is created', () => {
                expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(LifeCycle).isCreated).is.true
            })
            it('And the Simple Match Lobby has a Waiting Area component', () => {
                expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).hasComponent(Playable)).is.true
            })
        })
        describe('Scenorios : On events', () => {
            describe('Scenario :On one Player want to join simple match', () => {
                const entityRepository = new InMemoryEntityRepository()
                const systemRepository = new InMemorySystemRepository()
                const serverGameEventDispatcherSystem = new ServerGameEventDispatcherSystem(systemRepository)
                const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, serverGameEventDispatcherSystem, new FakeIdentifierAdapter())
                const waitingAreaSystem = new WaitingAreaSystem(entityRepository, serverGameEventDispatcherSystem)
                systemRepository.addSystem(lifeCycleSystem)
                systemRepository.addSystem(serverGameEventDispatcherSystem)
                systemRepository.addSystem(waitingAreaSystem)
                const player = 'Player A'
                before(() => serverGameEventDispatcherSystem.onGameEvent(createSimpleMatchLobbyEvent))
                it('Given there is a Simple Match Lobby created', () => {
                    expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(LifeCycle).isCreated).is.true
                })
                whenEventOccurs(serverGameEventDispatcherSystem, playerWantJoinSimpleMatchLobby(player))
                it('Then the Simple Match Lobby has "Player A" ref on players', () => {
                    expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players.some(playerid => playerid === player)).is.true
                })
            })
            describe('Scenario :On two Players want to join simple match', () => {
                const entityRepository = new InMemoryEntityRepository()
                const systemRepository = new InMemorySystemRepository()
                const serverGameEventDispatcherSystem = new ServerGameEventDispatcherSystem(systemRepository)
                const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, serverGameEventDispatcherSystem, new FakeIdentifierAdapter())
                const waitingAreaSystem = new WaitingAreaSystem(entityRepository, serverGameEventDispatcherSystem)
                systemRepository.addSystem(lifeCycleSystem)
                systemRepository.addSystem(serverGameEventDispatcherSystem)
                systemRepository.addSystem(waitingAreaSystem)
                const players = ['Player A', 'Player B', 'Player A', 'Player B', 'Player B', 'Player B', 'Player B', 'Player C']
                const expectedEventQty = players.length / 2 - (players.length % 2 / 2)
                const createMatchEvent = newEvent(Action.create, EntityType.nothing, EntityType.match)
                before(() => serverGameEventDispatcherSystem.onGameEvent(createSimpleMatchLobbyEvent))
                it('Given there is a Simple Match Lobby created', () => {
                    expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(LifeCycle).isCreated).is.true
                })
                players.forEach(player => whenEventOccurs(serverGameEventDispatcherSystem, playerWantJoinSimpleMatchLobby(player)))
                it(`Then the Simple Match Lobby has the following players on Waiting Area : ${players}`, () => {
                    expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players).deep.equal(players)
                })
                it(`And the event with message ${createMatchEvent.action} and destination ${createMatchEvent.targetEntityType} is sent ${expectedEventQty} times.`, () => {
                    expect(serverGameEventDispatcherSystem.gameEvents.filter(event => event.action === createMatchEvent.action && event.targetEntityType === createMatchEvent.targetEntityType).length).equal(expectedEventQty)
                })
            })
            describe('Scenario :On Match Wait for Players', () => {
                describe('Enough players', () => {
                    const entityRepository = new InMemoryEntityRepository()
                    const systemRepository = new InMemorySystemRepository()
                    const serverGameEventDispatcherSystem = new ServerGameEventDispatcherSystem(systemRepository)
                    const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, serverGameEventDispatcherSystem, new FakeIdentifierAdapter())
                    const waitingAreaSystem = new WaitingAreaSystem(entityRepository, serverGameEventDispatcherSystem)
                    systemRepository.addSystem(lifeCycleSystem)
                    systemRepository.addSystem(serverGameEventDispatcherSystem)
                    systemRepository.addSystem(waitingAreaSystem)
                    const expectedAddedPlayers = ['Player A', 'Player B']
                    const expectedStillWaitingPlayers = ['Player C', 'Player D']
                    const matchId = '0000'
                    const matchWaitingForPlayers = (matchId:string):GameEvent => newEvent(Action.waitingForPlayers, EntityType.nothing, EntityType.simpleMatchLobby, undefined, matchId)
                    before(() => serverGameEventDispatcherSystem.onGameEvent(createSimpleMatchLobbyEvent))
                    it(`Given there is 4 players on the game registered on the following order: ${[...expectedAddedPlayers, ...expectedStillWaitingPlayers]}`, () => {
                        return Promise.all([...expectedAddedPlayers, ...expectedStillWaitingPlayers].map(player => serverGameEventDispatcherSystem.onGameEvent(playerWantJoinSimpleMatchLobby(player))))
                            .then(() => expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players).deep.equal([...expectedAddedPlayers, ...expectedStillWaitingPlayers]))
                    })
                    whenEventOccurs(serverGameEventDispatcherSystem, matchWaitingForPlayers(matchId))
                    it(`Then there is the following players that are still waiting on the lobby: ${expectedStillWaitingPlayers}`, () => {
                        expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players).deep.equal(expectedStillWaitingPlayers)
                    })
                    it('And there is 2 events \'Player join match\' for the \'0000\' Match', () => {
                        const playerJoinMatchEvent = (player:string, matchId:string): GameEvent => newEvent(Action.playerJoinMatch, EntityType.nothing, EntityType.match, matchId, player)
                        expect(serverGameEventDispatcherSystem.hasEvent(playerJoinMatchEvent(expectedAddedPlayers[0], matchId))).is.true
                        expect(serverGameEventDispatcherSystem.hasEvent(playerJoinMatchEvent(expectedAddedPlayers[1], matchId))).is.true
                    })
                })
            })
        })
    })
})
