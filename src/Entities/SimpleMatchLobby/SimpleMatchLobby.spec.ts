import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { LifeCycle } from '../../Component/LifeCycle'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { createSimpleMatchLobbyEvent, PlayerWantJoinSimpleMatch, createMatchEvent, MatchWaitingForPlayers, playerJoinMatch, MainMenuHide, simpleMatchLobbyShow } from '../../Events/port/GameEvents'
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

describe('Feature: Simple Match Lobby', () => {
    describe('Client', () => {
        describe('Scenarios: On Create', () => {
            const entityRepository = new InMemoryEntityRepository()
            const systemRepository = new InMemorySystemRepository()
            const lifeCycleSystem = new ClientLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter())
            const gameEventDispatcherSystem = new ClientGameEventDispatcherSystem(entityRepository, systemRepository)
            systemRepository.addSystem(lifeCycleSystem)
            systemRepository.addSystem(gameEventDispatcherSystem)
            it('Given there is no Simple Match Lobby entity', () => {
                expect(() => entityRepository.retrieveEntityByClass(SimpleMatchLobby)).to.throw()
            })
            it(`When there is an event '${createSimpleMatchLobbyEvent.message}' with destination '${createSimpleMatchLobbyEvent.destination}'`, () => {
                return gameEventDispatcherSystem.onGameEvent(createSimpleMatchLobbyEvent)
            })
            it('And the Simple Match Lobby is created', () => {
                expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(LifeCycle).isCreated).is.true
            })
            it('And the Simple Match Lobby has a Visible component', () => {
                expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).hasComponent(Visible)).is.true
            })
            it(`And the event message ${simpleMatchLobbyShow.message} is sent to destination ${simpleMatchLobbyShow.destination} `, () => {
                expect(gameEventDispatcherSystem.hasEvent(simpleMatchLobbyShow)).is.true
            })
            it(`And the event message ${MainMenuHide.message} is sent to destination ${MainMenuHide.destination} `, () => {
                expect(gameEventDispatcherSystem.hasEvent(MainMenuHide)).is.true
            })
        })
    })
    describe('Server', () => {
        describe('Scenarios: On Create', () => {
            const entityRepository = new InMemoryEntityRepository()
            const systemRepository = new InMemorySystemRepository()
            const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter())
            const serverGameEventDispatcherSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
            systemRepository.addSystem(lifeCycleSystem)
            systemRepository.addSystem(serverGameEventDispatcherSystem)
            it('Given there is no Simple Match Lobby entity', () => {
                expect(() => entityRepository.retrieveEntityByClass(SimpleMatchLobby)).to.throw()
            })
            it(`When there is an event '${createSimpleMatchLobbyEvent.message}' with destination '${createSimpleMatchLobbyEvent.destination}'`, () => {
                return serverGameEventDispatcherSystem.onGameEvent(createSimpleMatchLobbyEvent)
            })
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
                const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter())
                const waitingAreaSystem = new WaitingAreaSystem(entityRepository, systemRepository)
                const serverGameEventDispatcherSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
                systemRepository.addSystem(lifeCycleSystem)
                systemRepository.addSystem(serverGameEventDispatcherSystem)
                systemRepository.addSystem(waitingAreaSystem)
                const player = 'Player A'
                before(() => serverGameEventDispatcherSystem.onGameEvent(createSimpleMatchLobbyEvent))
                it('Given there is a Simple Match Lobby created', () => {
                    expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(LifeCycle).isCreated).is.true
                })
                it(`When event '${PlayerWantJoinSimpleMatch(player, 'Simple Match Lobby').message}' for '${PlayerWantJoinSimpleMatch(player, 'Simple Match Lobby').destination}'`, () => {
                    return serverGameEventDispatcherSystem.onGameEvent(PlayerWantJoinSimpleMatch(player, 'Simple Match Lobby'))
                })
                it('Then the Simple Match Lobby has "Player A" ref on players', () => {
                    expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players.some(playerid => playerid === player)).is.true
                })
            })
            describe('Scenario :On two Players want to join simple match', () => {
                const entityRepository = new InMemoryEntityRepository()
                const systemRepository = new InMemorySystemRepository()
                const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter())
                const waitingAreaSystem = new WaitingAreaSystem(entityRepository, systemRepository)
                const serverGameEventDispatcherSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
                systemRepository.addSystem(lifeCycleSystem)
                systemRepository.addSystem(serverGameEventDispatcherSystem)
                systemRepository.addSystem(waitingAreaSystem)
                const players = ['Player A', 'Player B', 'Player A', 'Player B', 'Player B', 'Player B', 'Player B', 'Player C']
                const expectedEventQty = players.length / 2 - (players.length % 2 / 2)
                before(() => serverGameEventDispatcherSystem.onGameEvent(createSimpleMatchLobbyEvent))
                it('Given there is a Simple Match Lobby created', () => {
                    expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(LifeCycle).isCreated).is.true
                })
                players.forEach(player => it(`When events '${PlayerWantJoinSimpleMatch(player, 'Simple Match Lobby').message}' for '${PlayerWantJoinSimpleMatch(player, 'Simple Match Lobby').destination}'`, () => {
                    return serverGameEventDispatcherSystem.onGameEvent(PlayerWantJoinSimpleMatch(player, 'Simple Match Lobby'))
                }))
                it(`Then the Simple Match Lobby has the following players on Waiting Area : ${players}`, () => {
                    expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players).deep.equal(players)
                })
                it(`And the event with message ${createMatchEvent.message} and destination ${createMatchEvent.destination} is sent ${expectedEventQty} times.`, () => {
                    expect(serverGameEventDispatcherSystem.gameEvents.filter(event => event.message === createMatchEvent.message && event.destination === createMatchEvent.destination).length).equal(expectedEventQty)
                })
            })
            describe('Scenario :On Match Wait for Players', () => {
                describe('Enough players', () => {
                    const entityRepository = new InMemoryEntityRepository()
                    const systemRepository = new InMemorySystemRepository()
                    const lifeCycleSystem = new ServerLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter())
                    const waitingAreaSystem = new WaitingAreaSystem(entityRepository, systemRepository)
                    const serverGameEventDispatcherSystem = new ServerGameEventDispatcherSystem(entityRepository, systemRepository)
                    systemRepository.addSystem(lifeCycleSystem)
                    systemRepository.addSystem(serverGameEventDispatcherSystem)
                    systemRepository.addSystem(waitingAreaSystem)
                    const expectedAddedPlayers = ['Player A', 'Player B']
                    const expectedStillWaitingPlayers = ['Player C', 'Player D']
                    before(() => serverGameEventDispatcherSystem.onGameEvent(createSimpleMatchLobbyEvent))
                    it(`Given there is 4 players on the game registered on the following order: ${[...expectedAddedPlayers, ...expectedStillWaitingPlayers]}`, () => {
                        return Promise.all([...expectedAddedPlayers, ...expectedStillWaitingPlayers].map(player => serverGameEventDispatcherSystem.onGameEvent(PlayerWantJoinSimpleMatch(player, 'Simple Match Lobby'))))
                            .then(() => expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players).deep.equal([...expectedAddedPlayers, ...expectedStillWaitingPlayers]))
                    })
                    it(`When event '${MatchWaitingForPlayers('0000').message}' for '${MatchWaitingForPlayers('0000').destination}'`, () => {
                        return serverGameEventDispatcherSystem.onGameEvent(MatchWaitingForPlayers('0000'))
                    })
                    it(`Then there is the following players that are still waiting on the lobby: ${expectedStillWaitingPlayers}`, () => {
                        expect(entityRepository.retrieveEntityByClass(SimpleMatchLobby).retrieveComponent(Playable).players).deep.equal(expectedStillWaitingPlayers)
                    })
                    it('And there is 2 events \'Player join match\' for the \'0000\' Match', () => {
                        expect(serverGameEventDispatcherSystem.hasEvent(playerJoinMatch(expectedAddedPlayers[0], '0000'))).is.true
                        expect(serverGameEventDispatcherSystem.hasEvent(playerJoinMatch(expectedAddedPlayers[1], '0000'))).is.true
                    })
                })
            })
        })
    })
})
