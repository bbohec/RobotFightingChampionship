import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { playerARobotPhase, makePhasing, victoryPhase } from '../../ecs/components/Phasing'
import { victoryPosition, defeatPosition, makePhysical } from '../../ecs/components/Physical'
import { EntityBuilder } from '../../ecs/entity/entityBuilder'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { drawEvent } from '../draw/draw'
import { victoryEvent } from './victory'

feature(Action.victory, () => {
    serverScenario(`${Action.victory} 1`, victoryEvent(EntityIds.match, EntityIds.playerA),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.victory, [EntityIds.victory]], [EntityType.defeat, [EntityIds.defeat]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityIds.victory).withEntityReferences(EntityType.victory).withPhysical(victoryPosition, ShapeType.victory, false).save()
            .buildEntity(EntityIds.defeat).withEntityReferences(EntityType.defeat).withPhysical(defeatPosition, ShapeType.defeat, false).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player).save()
        , [
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.victory, [EntityIds.victory]], [EntityType.defeat, [EntityIds.defeat]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.victory, victoryPosition, ShapeType.victory, true),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makePhysical(EntityIds.defeat, defeatPosition, ShapeType.defeat, true),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.victory, [EntityIds.victory]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.defeat, [EntityIds.defeat]]]))
            ]),
            eventsAreSent(TestStep.And, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.victory, victoryPosition, ShapeType.victory, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.defeat, defeatPosition, ShapeType.defeat, true))
            ])
        ])
    serverScenario(`${Action.victory} 2`, victoryEvent(EntityIds.match, EntityIds.playerB),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.victory, [EntityIds.victory]], [EntityType.defeat, [EntityIds.defeat]]])).withPhase(playerARobotPhase()).save()
            .buildEntity(EntityIds.victory).withEntityReferences(EntityType.victory).withPhysical(victoryPosition, ShapeType.victory, false).save()
            .buildEntity(EntityIds.defeat).withEntityReferences(EntityType.defeat).withPhysical(defeatPosition, ShapeType.defeat, false).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player).save()
        , [
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.victory, [EntityIds.victory]], [EntityType.defeat, [EntityIds.defeat]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerB)),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makePhysical(EntityIds.victory, victoryPosition, ShapeType.victory, true),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.defeat, defeatPosition, ShapeType.defeat, true),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.defeat, [EntityIds.defeat]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.victory, [EntityIds.victory]]]))

            ]),
            eventsAreSent(TestStep.And, 'server', [
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.victory, victoryPosition, ShapeType.victory, true)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.defeat, defeatPosition, ShapeType.defeat, true))
            ])
        ])
})
