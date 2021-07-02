import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { ClientGame } from './ClientGame'
import { InMemoryEntityRepository } from '../GenericEntity/infra/InMemoryEntityRepository'
import { ClientGameEventDispatcherSystem } from '../../Systems/GameEventDispatcher/ClientGameEventDispatcherSystem'
import { newEvent } from '../../Events/port/GameEvents'
import { ClientLifeCycleSystem } from '../../Systems/LifeCycle/ClientLifeCycleSystem'
import { LifeCycle } from '../../Component/LifeCycle'
import { InMemorySystemRepository } from '../../Systems/Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../Systems/LifeCycle/infra/FakeIdentifierAdapter'
import { ClientMatchSystem } from '../../Systems/Match/ClientMatchSystem'
import { EntityType } from '../../Events/port/EntityType'
import { Action } from '../../Events/port/Action'
import { whenEventOccurs } from '../../Events/port/test'

describe('Feature : Client Game', () => {
    describe('Scenario : Client Game Create', () => {
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const gameEventDispatcherSystem = new ClientGameEventDispatcherSystem(systemRepository)
        systemRepository.addSystem(gameEventDispatcherSystem)
        systemRepository.addSystem(new ClientLifeCycleSystem(entityRepository, gameEventDispatcherSystem, new FakeIdentifierAdapter(['Client Game'])))
        const createMainMenuEvent = newEvent(Action.create, EntityType.nothing, EntityType.mainMenu)
        whenEventOccurs(gameEventDispatcherSystem, newEvent(Action.create, EntityType.nothing, EntityType.clientGame))
        it('Then the Client Game is on entities repository', () => {
            expect(() => entityRepository.retrieveEntityByClass(ClientGame)).to.not.throw()
        })
        it('And the Client Game is created', () => {
            expect(entityRepository.retrieveEntityByClass(ClientGame).retrieveComponent(LifeCycle).isCreated).to.be.true
        })
        it(`And the event "${createMainMenuEvent.action}" is sent to "${createMainMenuEvent.targetEntityType}"`, () => {
            expect(gameEventDispatcherSystem.hasEvent(createMainMenuEvent)).is.true
        })
    })
    describe('Scenario : Join simple match', () => {
        const entityRepository = new InMemoryEntityRepository()
        const systemRepository = new InMemorySystemRepository()
        const gameEventDispatcherSystem = new ClientGameEventDispatcherSystem(systemRepository)
        systemRepository.addSystem(gameEventDispatcherSystem)
        systemRepository.addSystem(new ClientLifeCycleSystem(entityRepository, gameEventDispatcherSystem, new FakeIdentifierAdapter(['Client Game'])))
        systemRepository.addSystem(new ClientMatchSystem(entityRepository, gameEventDispatcherSystem))
        const player = 'Player B'
        const joinSimpleMatchClientEvent = newEvent(Action.wantToJoin, EntityType.nothing, EntityType.clientGame, undefined, player)
        const joinSimpleMatchServerEvent = newEvent(Action.wantToJoin, EntityType.nothing, EntityType.serverGame, undefined, player)
        const matchMakingShowEvent = newEvent(Action.show, EntityType.nothing, EntityType.matchMaking)
        const mainMenuHideEvent = newEvent(Action.hide, EntityType.nothing, EntityType.mainMenu)
        before(() => gameEventDispatcherSystem.onGameEvent(newEvent(Action.create, EntityType.nothing, EntityType.clientGame)))
        it('Given the Client Game is created', () => {
            expect(entityRepository.retrieveEntityByClass(ClientGame).retrieveComponent(LifeCycle).isCreated).is.true
        })
        whenEventOccurs(gameEventDispatcherSystem, joinSimpleMatchClientEvent)
        it(`Then an event is sent with message "${joinSimpleMatchServerEvent.action}" is sent to the "${joinSimpleMatchServerEvent.targetEntityType}"`, () => {
            expect(gameEventDispatcherSystem.hasEvent(joinSimpleMatchServerEvent)).is.true
        })
        it(`And an event is sent with message "${mainMenuHideEvent.action}" is sent to the "${mainMenuHideEvent.targetEntityType}"`, () => {
            expect(gameEventDispatcherSystem.hasEvent(mainMenuHideEvent)).is.true
        })
        it(`And an event is sent with message "${matchMakingShowEvent.action}" is sent to the "${matchMakingShowEvent.targetEntityType}"`, () => {
            expect(gameEventDispatcherSystem.hasEvent(matchMakingShowEvent)).is.true
        })
    })
})
