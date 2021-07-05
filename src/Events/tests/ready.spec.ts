import { describe, before } from 'mocha'
import { Phasing } from '../../Component/Phasing'
import { Phase } from '../../Component/port/Phase'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'
import { createMatchEvent } from '../../Systems/LifeCycle/GenericLifeCycleSystem'
import { playerReadyForMatch } from '../../Systems/Phasing/PhasingSystem'
import { Action } from '../port/Action'
import { matchId, playerAId, playerBId } from '../port/entityIds'
import { featureEventDescription, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, whenEventOccurs } from '../port/test'
import { TestStep } from '../port/TestStep'
describe(featureEventDescription(Action.ready), () => {
    describe('On player ready', () => {
        const adapters = new FakeServerAdapters([matchId])
        const game = new ServerGameSystem(adapters)
        before(() => game.onGameEvent(createMatchEvent))
        theEntityIsOnRepository(TestStep.Given, adapters, matchId)
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, Phase.PreparingGame))
        whenEventOccurs(game, playerReadyForMatch(matchId, playerAId))
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, Phase.PreparingGame, new Set([playerAId])))
    })
    describe('On both players ready', () => {
        const adapters = new FakeServerAdapters([matchId])
        const game = new ServerGameSystem(adapters)
        before(() => game.onGameEvent(createMatchEvent))
        theEntityIsOnRepository(TestStep.Given, adapters, matchId)
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, Phase.PreparingGame))
        whenEventOccurs(game, playerReadyForMatch(matchId, playerAId))
        whenEventOccurs(game, playerReadyForMatch(matchId, playerBId))
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, Phase.PlayerA, new Set([playerAId, playerBId])))
    })
})
