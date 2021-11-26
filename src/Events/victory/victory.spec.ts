
import { Phasing, playerARobotPhase, playerAVictoryPhase, playerBVictoryPhase } from '../../Components/Phasing'
import { defeatPosition, Physical, victoryPosition } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, eventsAreSent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { drawEvent } from '../show/draw'
import { victoryEvent } from './victory'
feature(featureEventDescription(Action.victory), () => {
    serverScenario(`${Action.victory} 1`, victoryEvent(EntityId.match, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA, EntityId.playerB]).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityId.victory).withPhysicalComponent(victoryPosition, ShapeType.victory, false).save()
            .buildEntity(EntityId.defeat).withPhysicalComponent(defeatPosition, ShapeType.defeate, false).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerAVictoryPhase)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityType.victory, EntityId.victory, EntityId.playerA, new Physical(EntityId.victory, victoryPosition, ShapeType.victory, true)),
                drawEvent(EntityType.defeat, EntityId.defeat, EntityId.playerB, new Physical(EntityId.defeat, defeatPosition, ShapeType.defeate, true))
            ])
        ])
    serverScenario(`${Action.victory} 2`, victoryEvent(EntityId.match, EntityId.playerB),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA, EntityId.playerB]).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityId.victory).withPhysicalComponent(victoryPosition, ShapeType.victory, false).save()
            .buildEntity(EntityId.defeat).withPhysicalComponent(defeatPosition, ShapeType.defeate, false).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBVictoryPhase)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityType.victory, EntityId.victory, EntityId.playerB, new Physical(EntityId.victory, victoryPosition, ShapeType.victory, true)),
                drawEvent(EntityType.defeat, EntityId.defeat, EntityId.playerA, new Physical(EntityId.defeat, defeatPosition, ShapeType.defeate, true))
            ])
        ])
})
