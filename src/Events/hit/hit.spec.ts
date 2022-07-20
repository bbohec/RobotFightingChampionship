
import { makeEntityReference } from '../../Components/EntityReference'
import { makeHittable } from '../../Components/Hittable'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, thereIsServerComponents, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { victoryEvent } from '../victory/victory'
import { hitEvent } from './hit'
feature(featureEventDescription(Action.hit), () => {
    serverScenario(`${Action.hit} 1 - Robot Hit Tower`, hitEvent(EntityIds.playerARobot, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerARobot).withDamagePoints(20).save()
            .buildEntity(EntityIds.playerBTower).withHitPoints(100).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeHittable(EntityIds.playerBTower, 100)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeHittable(EntityIds.playerBTower, 80)
            ])
        ])

    serverScenario(`${Action.hit} 2 - Robot Kill Tower`, hitEvent(EntityIds.playerARobot, EntityIds.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])).withDamagePoints(20).save()
            .buildEntity(EntityIds.playerBTower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])).withHitPoints(100).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeHittable(EntityIds.playerBTower, 100),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeHittable(EntityIds.playerBTower, 0)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [victoryEvent(EntityIds.match, EntityIds.playerA)])
        ])
    serverScenario(`${Action.hit} 3 - Robot Kill Robot`, hitEvent(EntityIds.playerARobot, EntityIds.playerBRobot),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerARobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])).withDamagePoints(20).save()
            .buildEntity(EntityIds.playerBRobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])).withHitPoints(50).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeHittable(EntityIds.playerBRobot, 50),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeHittable(EntityIds.playerBRobot, -10)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [victoryEvent(EntityIds.match, EntityIds.playerA)])
        ])
    serverScenario(`${Action.hit} 4 - Tower Kill Robot`, hitEvent(EntityIds.playerATower, EntityIds.playerBRobot),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerATower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])).withDamagePoints(5).save()
            .buildEntity(EntityIds.playerBRobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])).withHitPoints(50).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeHittable(EntityIds.playerBRobot, 50),
                makeEntityReference(EntityIds.playerATower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeHittable(EntityIds.playerBRobot, 0)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [victoryEvent(EntityIds.match, EntityIds.playerA)])
        ])
    serverScenario(`${Action.hit} 5 - Tower Kill Tower`, hitEvent(EntityIds.playerBTower, EntityIds.playerATower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerATower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])).withHitPoints(100).save()
            .buildEntity(EntityIds.playerBTower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])).withDamagePoints(5).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeHittable(EntityIds.playerATower, 100),
                makeEntityReference(EntityIds.playerATower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeHittable(EntityIds.playerATower, 0)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [victoryEvent(EntityIds.match, EntityIds.playerB)])
        ])
    serverScenario(`${Action.hit} 6 - Friendly Fire`, hitEvent(EntityIds.playerATower, EntityIds.playerBRobot), undefined, [
        ...whenEventOccured()
    ], undefined, true)
})
