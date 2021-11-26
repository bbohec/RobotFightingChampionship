
import { Action } from '../../Event/Action'
import { feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, eventsAreSent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { Hittable } from '../../Components/Hittable'
import { hitEvent } from './hit'
import { EntityReference } from '../../Components/EntityReference'
import { EntityType } from '../../Event/EntityType'
import { victoryEvent } from '../victory/victory'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId } from '../../Event/entityIds'
feature(featureEventDescription(Action.hit), () => {
    serverScenario(`${Action.hit} 1 - Robot Hit Tower`, hitEvent(EntityId.playerARobot, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerARobot).withDamagePoints(20).save()
            .buildEntity(EntityId.playerBTower).withHitPoints(100).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerBTower, Hittable, new Hittable(EntityId.playerBTower, 100)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerBTower, Hittable, new Hittable(EntityId.playerBTower, 80))
        ])

    serverScenario(`${Action.hit} 2 - Robot Kill Tower`, hitEvent(EntityId.playerARobot, EntityId.playerBTower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA, EntityId.playerB]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityId.playerA]]])).withDamagePoints(20).save()
            .buildEntity(EntityId.playerBTower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityId.playerB]]])).withHitPoints(100).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerBTower, Hittable, new Hittable(EntityId.playerBTower, 100)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, EntityReference, new EntityReference(EntityId.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, EntityReference, new EntityReference(EntityId.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityId.playerB]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.match, [EntityId.match]]]))),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerBTower, Hittable, new Hittable(EntityId.playerBTower, 0)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [victoryEvent(EntityId.match, EntityId.playerA)])
        ])
    serverScenario(`${Action.hit} 3 - Robot Kill Robot`, hitEvent(EntityId.playerARobot, EntityId.playerBRobot),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA, EntityId.playerB]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerARobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityId.playerA]]])).withDamagePoints(20).save()
            .buildEntity(EntityId.playerBRobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityId.playerB]]])).withHitPoints(50).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerBRobot, Hittable, new Hittable(EntityId.playerBRobot, 50)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, EntityReference, new EntityReference(EntityId.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, EntityReference, new EntityReference(EntityId.playerBRobot, EntityType.robot, new Map([[EntityType.player, [EntityId.playerB]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.match, [EntityId.match]]]))),
            ...whenEventOccured(),
            ...whenEventOccured(),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerBRobot, Hittable, new Hittable(EntityId.playerBRobot, -10)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [victoryEvent(EntityId.match, EntityId.playerA)])
        ])
    serverScenario(`${Action.hit} 4 - Tower Kill Robot`, hitEvent(EntityId.playerATower, EntityId.playerBRobot),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA, EntityId.playerB]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerATower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityId.playerA]]])).withDamagePoints(5).save()
            .buildEntity(EntityId.playerBRobot).withEntityReferences(EntityType.robot, new Map([[EntityType.player, [EntityId.playerB]]])).withHitPoints(50).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerBRobot, Hittable, new Hittable(EntityId.playerBRobot, 50)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, EntityReference, new EntityReference(EntityId.playerATower, EntityType.tower, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, EntityReference, new EntityReference(EntityId.playerBRobot, EntityType.robot, new Map([[EntityType.player, [EntityId.playerB]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.match, [EntityId.match]]]))),
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
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerBRobot, Hittable, new Hittable(EntityId.playerBRobot, 0)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [victoryEvent(EntityId.match, EntityId.playerA)])
        ])
    serverScenario(`${Action.hit} 5 - Tower Kill Tower`, hitEvent(EntityId.playerBTower, EntityId.playerATower),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA, EntityId.playerB]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerATower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityId.playerA]]])).withHitPoints(100).save()
            .buildEntity(EntityId.playerBTower).withEntityReferences(EntityType.tower, new Map([[EntityType.player, [EntityId.playerB]]])).withDamagePoints(5).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerATower, Hittable, new Hittable(EntityId.playerATower, 100)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, EntityReference, new EntityReference(EntityId.playerATower, EntityType.tower, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, EntityReference, new EntityReference(EntityId.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityId.playerB]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerB, EntityReference, new EntityReference(EntityId.playerB, EntityType.player, new Map([[EntityType.match, [EntityId.match]]]))),
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
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerATower, Hittable, new Hittable(EntityId.playerATower, 0)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [victoryEvent(EntityId.match, EntityId.playerB)])
        ])
    serverScenario(`${Action.hit} 6 - Friendly Fire`, hitEvent(EntityId.playerATower, EntityId.playerBRobot), undefined, [
        ...whenEventOccured()
    ], undefined, true)
})
