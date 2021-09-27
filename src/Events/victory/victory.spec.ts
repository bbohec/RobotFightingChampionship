
import { Phasing, playerARobotPhase, playerAVictoryPhase, playerBVictoryPhase } from '../../Components/Phasing'
import { Playable } from '../../Components/Playable'
import { Entity } from '../../Entities/Entity'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { showEvent } from '../show/show'
import { victoryEvent } from './victory'
feature(featureEventDescription(Action.victory), () => {
    serverScenario(`${Action.victory} 1`, victoryEvent(EntityId.match, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA, EntityId.playerB]).withPhase(playerARobotPhase()).save()
        , [
            (game, adapters) => whenEventOccurs(game, victoryEvent(EntityId.match, EntityId.playerA)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerAVictoryPhase)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.victory, EntityId.victory, EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.defeat, EntityId.defeat, EntityId.playerB))
        ])
    serverScenario(`${Action.victory} 2`, victoryEvent(EntityId.match, EntityId.playerB),
        (game, adapters) => () => {
            const match = new Entity(EntityId.match)
            match.addComponent(new Phasing(EntityId.match, playerARobotPhase()))
            match.addComponent(new Playable(EntityId.match, [EntityId.playerA, EntityId.playerB]))
            adapters.entityInteractor.saveEntity(match)
        }
        , [
            (game, adapters) => whenEventOccurs(game, victoryEvent(EntityId.match, EntityId.playerB)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBVictoryPhase)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.victory, EntityId.victory, EntityId.playerB)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.defeat, EntityId.defeat, EntityId.playerA))
        ])
})
