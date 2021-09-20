import { describe } from 'mocha'
import { Phasing, playerARobotPhase, playerAVictoryPhase, playerBVictoryPhase } from '../../Components/Phasing'
import { Playable } from '../../Components/Playable'
import { Entity } from '../../Entities/Entity'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { playerAId, matchId, playerBId, victoryEntityId, defeatEntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { showEvent } from '../show/show'
import { victoryEvent } from './victory'
describe(featureEventDescription(Action.victory), () => {
    serverScenario(`${Action.victory} 1`, victoryEvent(matchId, playerAId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(matchId).withPlayers([playerAId, playerBId]).withPhase(playerARobotPhase()).save()
        , [
            (game, adapters) => whenEventOccurs(game, victoryEvent(matchId, playerAId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Phasing, new Phasing(matchId, playerAVictoryPhase())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.victory, victoryEntityId, playerAId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.defeat, defeatEntityId, playerBId))
        ])
    serverScenario(`${Action.victory} 2`, victoryEvent(matchId, playerBId),
        (game, adapters) => () => {
            const match = new Entity(matchId)
            match.addComponent(new Phasing(matchId, playerARobotPhase()))
            match.addComponent(new Playable(matchId, [playerAId, playerBId]))
            adapters.entityInteractor.saveEntity(match)
        }
        , [
            (game, adapters) => whenEventOccurs(game, victoryEvent(matchId, playerBId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Phasing, new Phasing(matchId, playerBVictoryPhase())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.victory, victoryEntityId, playerBId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.defeat, defeatEntityId, playerAId))
        ])
})
