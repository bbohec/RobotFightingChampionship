
import { Phasing, playerARobotPhase, playerAVictoryPhase, playerBVictoryPhase } from '../../Components/Phasing'
import { defeatPosition, Physical, victoryPosition } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
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
            .buildEntity(EntityId.victory).withPhysicalComponent(victoryPosition, ShapeType.victory).save()
            .buildEntity(EntityId.defeat).withPhysicalComponent(defeatPosition, ShapeType.defeate).save()
        , [
            (game, adapters) => whenEventOccurs(game, victoryEvent(EntityId.match, EntityId.playerA)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerAVictoryPhase)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.victory, EntityId.victory, EntityId.playerA, new Physical(EntityId.victory, victoryPosition, ShapeType.victory))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.defeat, EntityId.defeat, EntityId.playerB, new Physical(EntityId.defeat, defeatPosition, ShapeType.defeate)))
        ])
    serverScenario(`${Action.victory} 2`, victoryEvent(EntityId.match, EntityId.playerB),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA, EntityId.playerB]).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityId.victory).withPhysicalComponent(victoryPosition, ShapeType.victory).save()
            .buildEntity(EntityId.defeat).withPhysicalComponent(defeatPosition, ShapeType.defeate).save()
        , [
            (game, adapters) => whenEventOccurs(game, victoryEvent(EntityId.match, EntityId.playerB)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBVictoryPhase)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.victory, EntityId.victory, EntityId.playerB, new Physical(EntityId.victory, victoryPosition, ShapeType.victory))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', showEvent(EntityType.defeat, EntityId.defeat, EntityId.playerA, new Physical(EntityId.defeat, defeatPosition, ShapeType.defeate)))
        ])
})
