import { describe, it } from 'mocha'
import { expect } from 'chai'
import { LifeCycle } from '../../Component/LifeCycle'
import { newEvent } from '../../Events/port/GameEvents'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { whenEventOccurs } from '../../Events/port/test'
import { ServerGame } from '../../Systems/Game/ServerGame'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { Game } from './Game'

describe('Feature Server Game', () => {
    describe('Scenario : Server Game Create', () => {
        const adapters = new FakeServerAdapters()
        const game = new ServerGame(adapters)
        const createSimpleMatchLobbyEvent = newEvent(Action.create, EntityType.nothing, EntityType.simpleMatchLobby)
        whenEventOccurs(game, newEvent(Action.create, EntityType.nothing, EntityType.serverGame))
        it('Then the Server Game is created', () => {
            expect(adapters.entityInteractor.retrieveEntityByClass(Game).retrieveComponent(LifeCycle).isCreated).is.true
        })
        it(`And the event ${createSimpleMatchLobbyEvent.action} is sent to ${createSimpleMatchLobbyEvent.targetEntityType}`, () => {
            expect(adapters.eventInteractor.hasEvent(createSimpleMatchLobbyEvent)).is.true
        })
    })
})
