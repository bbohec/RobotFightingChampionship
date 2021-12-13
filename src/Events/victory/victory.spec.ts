
import { EntityReference } from '../../Components/EntityReference'
import { Phasing, playerARobotPhase, victoryPhase } from '../../Components/Phasing'
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
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]], [EntityType.victory, [EntityId.victory]], [EntityType.defeat, [EntityId.defeat]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityId.victory).withEntityReferences(EntityType.victory).withPhysicalComponent(victoryPosition, ShapeType.victory, false).save()
            .buildEntity(EntityId.defeat).withEntityReferences(EntityType.defeat).withPhysicalComponent(defeatPosition, ShapeType.defeat, false).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, victoryPhase(EntityId.playerA))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.victory, EntityReference, new EntityReference(EntityId.victory, EntityType.victory, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.defeat, EntityReference, new EntityReference(EntityId.defeat, EntityType.defeat, new Map([[EntityType.player, [EntityId.playerB]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.victory, [EntityId.victory]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerB, EntityReference, new EntityReference(EntityId.playerB, EntityType.player, new Map([[EntityType.defeat, [EntityId.defeat]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityType.victory, EntityId.victory, EntityId.playerA, new Physical(EntityId.victory, victoryPosition, ShapeType.victory, true)),
                drawEvent(EntityType.defeat, EntityId.defeat, EntityId.playerB, new Physical(EntityId.defeat, defeatPosition, ShapeType.defeat, true))
            ])
        ])
    serverScenario(`${Action.victory} 2`, victoryEvent(EntityId.match, EntityId.playerB),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]], [EntityType.victory, [EntityId.victory]], [EntityType.defeat, [EntityId.defeat]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityId.victory).withEntityReferences(EntityType.victory).withPhysicalComponent(victoryPosition, ShapeType.victory, false).save()
            .buildEntity(EntityId.defeat).withEntityReferences(EntityType.defeat).withPhysicalComponent(defeatPosition, ShapeType.defeat, false).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, victoryPhase(EntityId.playerB))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.victory, EntityReference, new EntityReference(EntityId.victory, EntityType.victory, new Map([[EntityType.player, [EntityId.playerB]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.defeat, EntityReference, new EntityReference(EntityId.defeat, EntityType.defeat, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.defeat, [EntityId.defeat]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerB, EntityReference, new EntityReference(EntityId.playerB, EntityType.player, new Map([[EntityType.victory, [EntityId.victory]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityType.victory, EntityId.victory, EntityId.playerB, new Physical(EntityId.victory, victoryPosition, ShapeType.victory, true)),
                drawEvent(EntityType.defeat, EntityId.defeat, EntityId.playerA, new Physical(EntityId.defeat, defeatPosition, ShapeType.defeat, true))
            ])
        ])
})
