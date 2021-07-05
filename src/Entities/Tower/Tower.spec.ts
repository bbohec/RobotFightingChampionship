import {
    describe,
    // before,
    it
} from 'mocha'
import { expect } from 'chai'
import { LifeCycle } from '../../Component/LifeCycle'
import { newEvent } from '../../Events/port/GameEvents'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { Tower } from './Tower'
import { whenEventOccurs } from '../../Events/port/test'
import { ServerGame } from '../../Systems/Game/ServerGame'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'

const entityName = 'Tower'
describe(`Feature : ${entityName}`, () => {
    describe('On create', () => {
        const playerId = 'player'
        const towerId = 'tower'
        const adapters = new FakeServerAdapters([towerId])
        const game = new ServerGame(adapters)
        const createTowerEventPlayer = newEvent(Action.create, EntityType.nothing, EntityType.tower, undefined, playerId)
        const registerTowerOnPlayerEvent = newEvent(Action.register, EntityType.nothing, EntityType.player, playerId, towerId)
        it(`Given there is no ${entityName}`, () => {
            expect(() => adapters.entityInteractor.retrieveEntityByClass(Tower)).to.throw()
        })
        whenEventOccurs(game, createTowerEventPlayer)
        it(`Then the ${entityName} is created`, () => {
            expect(adapters.entityInteractor.retrieveEntityById(towerId).retrieveComponent(LifeCycle).isCreated).is.true
        })

        it(`And the event "${registerTowerOnPlayerEvent.action}" is sent to "${registerTowerOnPlayerEvent.targetEntityType}" for the game "${registerTowerOnPlayerEvent.originEntityId}"`, () => {
            expect(adapters.eventInteractor.hasEvent(registerTowerOnPlayerEvent)).is.true
        })
    })
})
