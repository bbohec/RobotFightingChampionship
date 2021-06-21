import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { ClientGame } from './ClientGame'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { ClientGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ClientGameEventDispatcherSystem'
import { PlayerWantJoinSimpleMatch, createClientGameEvent, createMainMenuEvent, MainMenuHide, MatchMakingShowEvent } from '../../Events/port/GameEvents'
import { ClientLifeCycleSystem } from '../../Systems/LifeCycle/ClientLifeCycleSystem'
import { LifeCycle } from '../../Component/LifeCycle'
import { InMemorySystemRepository } from '../../Systems/Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../Systems/LifeCycle/infra/FakeIdentifierAdapter'
import { ClientMatchMakingSystem } from '../../Systems/Match/ClientMatchSystem'

describe('Feature : Client Game', () => {
    describe('Scenario : Client Game Create', () => {
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const gameEventDispatcherSystem = new ClientGameEventDispatcherSystem(entityRepository, systemRepository)
        systemRepository.addSystem(gameEventDispatcherSystem)
        systemRepository.addSystem(new ClientLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter(['Client Game'])))
        it('When the Client Game is created', () => {
            return gameEventDispatcherSystem.onGameEvent(createClientGameEvent)
        })
        it('Then the Client Game is on entities repository', () => {
            expect(() => entityRepository.retrieveEntityByClass(ClientGame)).to.not.throw()
        })
        it('And the Client Game is created', () => {
            expect(entityRepository.retrieveEntityByClass(ClientGame).retrieveComponent(LifeCycle).isCreated).to.be.true
        })
        it(`And the event "${createMainMenuEvent.message}" is sent to "${createMainMenuEvent.destination}"`, () => {
            expect(gameEventDispatcherSystem.hasEvent(createMainMenuEvent)).is.true
        })
    })
    describe('Scenario : Join simple match', () => {
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const gameEventDispatcherSystem = new ClientGameEventDispatcherSystem(entityRepository, systemRepository)
        systemRepository.addSystem(gameEventDispatcherSystem)
        systemRepository.addSystem(new ClientLifeCycleSystem(entityRepository, systemRepository, new FakeIdentifierAdapter(['Client Game'])))
        systemRepository.addSystem(new ClientMatchMakingSystem(entityRepository, systemRepository))
        const joinSimpleMatchClientEvent = PlayerWantJoinSimpleMatch('Player A', 'Client Game')
        const joinSimpleMatchServerEvent = PlayerWantJoinSimpleMatch('Player A', 'Server Game')
        before(() => gameEventDispatcherSystem.onGameEvent(createClientGameEvent))
        it('Given the Client Game is created', () => {
            expect(entityRepository.retrieveEntityByClass(ClientGame).retrieveComponent(LifeCycle).isCreated).is.true
        })
        it(`When the clientGameEventSystem receive an event message "${joinSimpleMatchClientEvent.message}" with destination "${joinSimpleMatchClientEvent.destination}"`, () => {
            return gameEventDispatcherSystem.onGameEvent(joinSimpleMatchClientEvent)
        })
        it(`Then an event is sent with message "${joinSimpleMatchServerEvent.message}" is sent to the "${joinSimpleMatchServerEvent.destination}"`, () => {
            expect(gameEventDispatcherSystem.hasEvent(joinSimpleMatchServerEvent)).is.true
        })
        it(`And an event is sent with message "${MainMenuHide.message}" is sent to the "${MainMenuHide.destination}"`, () => {
            expect(gameEventDispatcherSystem.hasEvent(MainMenuHide)).is.true
        })
        it(`And an event is sent with message "${MatchMakingShowEvent.message}" is sent to the "${MatchMakingShowEvent.destination}"`, () => {
            expect(gameEventDispatcherSystem.hasEvent(MatchMakingShowEvent)).is.true
        })
    })
})
