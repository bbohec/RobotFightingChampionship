import { describe } from 'mocha'
import { Phasing } from '../../Components/Phasing'
import { PhaseType } from '../../Components/port/Phase'
import { createMatchEvent } from '../create/create'
import { playerReadyForMatch } from './ready'
import { Action } from '../../Event/Action'
import { matchId, playerAId, playerBId } from '../../Event/entityIds'
import { featureEventDescription, serverScenario, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { nextTurnEvent } from '../nextTurn/nextTurnEvent'
describe(featureEventDescription(Action.ready), () => {
    serverScenario(playerReadyForMatch(matchId, playerAId), [matchId],
        (game) => () => game.onGameEvent(createMatchEvent), [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, matchId),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, PhaseType.PreparingGame)),
            (game, adapters) => whenEventOccurs(game, playerReadyForMatch(matchId, playerAId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, PhaseType.PreparingGame, new Set([playerAId])))
        ])
    serverScenario([playerReadyForMatch(matchId, playerAId), playerReadyForMatch(matchId, playerBId)], [matchId],
        (game) => () => game.onGameEvent(createMatchEvent), [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, matchId),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, PhaseType.PreparingGame)),
            (game, adapters) => whenEventOccurs(game, playerReadyForMatch(matchId, playerAId)),
            (game, adapters) => whenEventOccurs(game, playerReadyForMatch(matchId, playerBId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, PhaseType.PreparingGame, new Set([playerAId, playerBId]))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, nextTurnEvent(matchId))
        ])
})
