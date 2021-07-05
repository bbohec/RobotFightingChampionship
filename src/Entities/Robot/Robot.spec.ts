import {
    describe,
    // before,
    it
} from 'mocha'
import { Action } from '../../Events/port/Action'
import { EntityType } from '../../Events/port/EntityType'
import { expect } from 'chai'
import { newEvent } from '../../Events/port/GameEvents'
import { whenEventOccurs } from '../../Events/port/test'
import { Robot } from './Robot'
import { LifeCycle } from '../../Component/LifeCycle'
import { ServerGame } from '../../Systems/Game/ServerGame'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
describe('Feature : Robot', () => {
    describe('On create', () => {
        const player = 'Player A'
        const robotId = 'Robot'
        const createRobotEventPlayer = newEvent(Action.create, EntityType.nothing, EntityType.robot, undefined, player)
        const adapters = new FakeServerAdapters([robotId])
        const game = new ServerGame(adapters)
        const registerRobotOnPlayerEvent = newEvent(Action.register, EntityType.nothing, EntityType.player, player, robotId)
        it('Given there is no Robot', () => {
            expect(() => adapters.entityInteractor.retrieveEntityByClass(Robot)).to.throw()
        })
        whenEventOccurs(game, createRobotEventPlayer)
        it('Then the Robot is created', () => {
            expect(adapters.entityInteractor.retrieveEntityByClass(Robot).retrieveComponent(LifeCycle).isCreated).is.true
        })
        it(`And the event "${registerRobotOnPlayerEvent.action}" is sent to "${registerRobotOnPlayerEvent.targetEntityType}" for the game "${registerRobotOnPlayerEvent.originEntityId}"`, () => {
            expect(adapters.eventInteractor.hasEvent(registerRobotOnPlayerEvent)).is.true
        })
    })
})
