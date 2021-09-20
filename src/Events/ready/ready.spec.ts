import { describe } from 'mocha'
import { Phasing, preparingGamePhase } from '../../Components/Phasing'
import { playerReadyForMatch } from './ready'
import { Action } from '../../Event/Action'
import { matchId, playerAId, playerBId } from '../../Event/entityIds'
import { featureEventDescription, serverScenario, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { nextTurnEvent } from '../nextTurn/nextTurn'
import { EntityBuilder } from '../../Entities/entityBuilder'
describe(featureEventDescription(Action.ready), () => {
    serverScenario(`${Action.ready} 1`, playerReadyForMatch(matchId, playerAId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(preparingGamePhase()).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, matchId),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, preparingGamePhase())),
            (game, adapters) => whenEventOccurs(game, playerReadyForMatch(matchId, playerAId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, preparingGamePhase(), new Set([playerAId])))
        ])
    serverScenario(`${Action.ready} 2`, [playerReadyForMatch(matchId, playerAId), playerReadyForMatch(matchId, playerBId)],
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPhase(preparingGamePhase()).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, matchId),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, preparingGamePhase())),
            (game, adapters) => whenEventOccurs(game, playerReadyForMatch(matchId, playerAId)),
            (game, adapters) => whenEventOccurs(game, playerReadyForMatch(matchId, playerBId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, preparingGamePhase(), new Set([playerAId, playerBId]))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, nextTurnEvent(matchId))
        ])
})
