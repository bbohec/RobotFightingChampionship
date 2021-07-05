import { describe, before, it } from 'mocha'
import { expect } from 'chai'
import { Game } from './Game'
import { newEvent } from '../../Events/port/GameEvents'
import { LifeCycle } from '../../Component/LifeCycle'
import { EntityType } from '../../Events/port/EntityType'
import { Action } from '../../Events/port/Action'
import { thenTheEntityIsOnRepository, whenEventOccurs } from '../../Events/port/test'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'
import { ClientGame } from '../../Systems/Game/ClientGame'

describe('Feature : Client Game', () => {
    describe('Scenario : Client Game Create', () => {
        const adapters = new FakeClientAdapters()
        const game = new ClientGame(adapters)
        const createMainMenuEvent = newEvent(Action.create, EntityType.nothing, EntityType.mainMenu)
        whenEventOccurs(game, newEvent(Action.create, EntityType.nothing, EntityType.clientGame))
        thenTheEntityIsOnRepository(adapters, Game)
        thenThenEntityIsCreated(adapters)
        it(`And the event "${createMainMenuEvent.action}" is sent to "${createMainMenuEvent.targetEntityType}"`, () => {
            expect(adapters.eventInteractor.hasEvent(createMainMenuEvent)).is.true
        })
    })
    describe('Scenario : Join simple match', () => {
        const adapters = new FakeClientAdapters()
        const game = new ClientGame(adapters)
        const player = 'Player B'
        const joinSimpleMatchClientEvent = newEvent(Action.wantToJoin, EntityType.nothing, EntityType.clientGame, undefined, player)
        const joinSimpleMatchServerEvent = newEvent(Action.wantToJoin, EntityType.nothing, EntityType.serverGame, undefined, player)
        const matchMakingShowEvent = newEvent(Action.show, EntityType.nothing, EntityType.matchMaking)
        const mainMenuHideEvent = newEvent(Action.hide, EntityType.nothing, EntityType.mainMenu)
        before(() => game.onGameEvent(newEvent(Action.create, EntityType.nothing, EntityType.clientGame)))
        it('Given the Client Game is created', () => {
            expect(adapters.entityInteractor.retrieveEntityByClass(Game).retrieveComponent(LifeCycle).isCreated).is.true
        })
        whenEventOccurs(game, joinSimpleMatchClientEvent)
        it(`Then an event is sent with message "${joinSimpleMatchServerEvent.action}" is sent to the "${joinSimpleMatchServerEvent.targetEntityType}"`, () => {
            expect(adapters.eventInteractor.hasEvent(joinSimpleMatchServerEvent)).is.true
        })
        it(`And an event is sent with message "${mainMenuHideEvent.action}" is sent to the "${mainMenuHideEvent.targetEntityType}"`, () => {
            expect(adapters.eventInteractor.hasEvent(mainMenuHideEvent)).is.true
        })
        it(`And an event is sent with message "${matchMakingShowEvent.action}" is sent to the "${matchMakingShowEvent.targetEntityType}"`, () => {
            expect(adapters.eventInteractor.hasEvent(matchMakingShowEvent)).is.true
        })
    })
})
function thenThenEntityIsCreated (adapters: FakeClientAdapters) {
    it('And the Client Game is created', () => {
        expect(adapters.entityInteractor.retrieveEntityByClass(Game).retrieveComponent(LifeCycle).isCreated).to.be.true
    })
}
