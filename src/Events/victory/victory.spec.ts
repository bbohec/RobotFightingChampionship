
import { makeEntityReference } from '../../Components/EntityReference'
import { makePhasing, playerARobotPhase, victoryPhase } from '../../Components/Phasing'
import { defeatPosition, makePhysical, victoryPosition } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, thereIsServerComponents, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { drawEvent } from '../draw/draw'
import { victoryEvent } from './victory'
feature(featureEventDescription(Action.victory), () => {
    serverScenario(`${Action.victory} 1`, victoryEvent(EntityIds.match, EntityIds.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.victory, [EntityIds.victory]], [EntityType.defeat, [EntityIds.defeat]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityIds.victory).withEntityReferences(EntityType.victory).withPhysicalComponent(victoryPosition, ShapeType.victory, false).save()
            .buildEntity(EntityIds.defeat).withEntityReferences(EntityType.defeat).withPhysicalComponent(defeatPosition, ShapeType.defeat, false).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player).save()
        , [
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.victory, [EntityIds.victory]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.defeat, [EntityIds.defeat]]]))
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.victory, victoryPosition, ShapeType.victory, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.defeat, defeatPosition, ShapeType.defeat, true))
            ])
        ])
    serverScenario(`${Action.victory} 2`, victoryEvent(EntityIds.match, EntityIds.playerB),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.victory, [EntityIds.victory]], [EntityType.defeat, [EntityIds.defeat]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityIds.victory).withEntityReferences(EntityType.victory).withPhysicalComponent(victoryPosition, ShapeType.victory, false).save()
            .buildEntity(EntityIds.defeat).withEntityReferences(EntityType.defeat).withPhysicalComponent(defeatPosition, ShapeType.defeat, false).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player).save()
        , [
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerB)),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.defeat, [EntityIds.defeat]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.victory, [EntityIds.victory]]]))

            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.victory, victoryPosition, ShapeType.victory, true)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.defeat, defeatPosition, ShapeType.defeat, true))
            ])
        ])
})
