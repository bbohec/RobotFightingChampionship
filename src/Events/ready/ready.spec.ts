import { describe } from 'mocha'
import { Phasing } from '../../Component/Phasing'
import { Phase } from '../../Component/port/Phase'
import { createMatchEvent } from '../create/create'
import { playerReadyForMatch } from './ready'
import { Action } from '../port/Action'
import { matchId, playerAId, playerBId } from '../port/entityIds'
import { featureEventDescription, serverScenario, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, whenEventOccurs } from '../port/test'
import { TestStep } from '../port/TestStep'
describe(featureEventDescription(Action.ready), () => {
    serverScenario(playerReadyForMatch(matchId, playerAId), [matchId],
        (game) => () => game.onGameEvent(createMatchEvent), [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, matchId),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, Phase.PreparingGame)),
            (game, adapters) => whenEventOccurs(game, playerReadyForMatch(matchId, playerAId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, Phase.PreparingGame, new Set([playerAId])))
        ])
    serverScenario([playerReadyForMatch(matchId, playerAId), playerReadyForMatch(matchId, playerBId)], [matchId],
        (game) => () => game.onGameEvent(createMatchEvent), [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, matchId),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, Phase.PreparingGame)),
            (game, adapters) => whenEventOccurs(game, playerReadyForMatch(matchId, playerAId)),
            (game, adapters) => whenEventOccurs(game, playerReadyForMatch(matchId, playerBId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, Phase.PlayerA, new Set([playerAId, playerBId])))
        ])
})
