import { describe } from 'mocha'
import { Phasing, playerATowerPhase } from '../../Components/Phasing'
import { Physical, playerATowerFirstPosition, position } from '../../Components/Physical'
import { MatchPlayer, PhaseType } from '../../Components/port/Phase'
import { Action } from '../../Event/Action'
import { cellx2y2Id, matchId, playerATowerId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { moveEvent } from './moveEvent'

/*
    - Case déjà occupé
    - Hors zone de jeu
    - Assez de point d'action
    - pas le bon tour
    - pas nos unités
*/

describe(featureEventDescription(Action.move), () => {
    serverScenario(`${Action.move} 1 - Move Game Event`, moveEvent(EntityType.tower, playerATowerId, cellx2y2Id), [], undefined, [
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, playerATowerPhase())),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, playerATowerId, Physical, new Physical(playerATowerId, playerATowerFirstPosition)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, cellx2y2Id, Physical, new Physical(cellx2y2Id, position(2, 2))),
        (game, adapters) => whenEventOccurs(game, moveEvent(EntityType.tower, playerATowerId, cellx2y2Id)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerATowerId, Physical, new Physical(playerATowerId, position(2, 2))),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, matchId, Phasing, new Phasing(matchId, { phaseType: PhaseType.Tower, matchPlayer: MatchPlayer.A, actionPoints: 9 }))
        // (game, adapters) => theEventIsSent(TestStep.And, adapters, hitEvent(towerPlayerAId, towerPlayerBId))
    ], true)
})
