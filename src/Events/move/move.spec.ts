
import { Phasing, playerARobotPhase, playerATowerPhase, playerBRobotPhase, playerBTowerPhase } from '../../Components/Phasing'
import { Physical, playerARobotFirstPosition, playerATowerFirstPosition, playerBTowerFirstPosition, position } from '../../Components/Physical'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { badPlayerNotificationMessage, notEnoughActionPointNotificationMessage, notifyEvent, positionAlreadyOccupiedNotificationMessage, wrongUnitPhaseNotificationMessage } from '../notify/notify'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { moveEvent } from './move'
import { EntityId } from '../../Event/entityIds'
feature(featureEventDescription(Action.move), () => {
    serverScenario(`${Action.move} 1 - Move Game Event - Horizontal`, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx2y1),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(playerARobotFirstPosition).save()
            .buildEntity(EntityId.cellx2y1).withPhysicalComponent(position(2, 1)).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y1, Physical, new Physical(EntityId.cellx2y1, position(2, 1))),
            (game, adapters) => whenEventOccurs(game, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx2y1)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(2, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase(11)))
        ])
    serverScenario(`${Action.move} 2 - Move Game Event - Vertical`, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx1y2),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.cellx1y2).withPhysicalComponent(position(1, 2)).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(playerARobotFirstPosition).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y2, Physical, new Physical(EntityId.cellx1y2, position(1, 2))),
            (game, adapters) => whenEventOccurs(game, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx1y2)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(1, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase(11)))
        ])
    serverScenario(`${Action.move} 3 - Move Game Event - Diagonal`, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx2y2),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.cellx2y2).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(position(1, 2)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y2, Physical, new Physical(EntityId.cellx2y2, position(2, 2))),
            (game, adapters) => whenEventOccurs(game, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx2y2)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase(11)))
        ])
    serverScenario(`${Action.move} 4 - Can't Move Game Event - Tower already on destination cell`, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx2y2),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA, EntityId.playerB]).save()
            .buildEntity(EntityId.cellx2y2).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(playerATowerFirstPosition).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y2, Physical, new Physical(EntityId.cellx2y2, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(2, 2))),
            (game, adapters) => whenEventOccurs(game, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx2y2)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerA, positionAlreadyOccupiedNotificationMessage))
        ])
    serverScenario(`${Action.move} 5 - Can't Move Game Event - Tower of same player already on destination cell`, moveEvent(EntityId.playerB, EntityType.robot, EntityId.playerBRobot, EntityId.cellx2y2),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerBRobotPhase()).withPlayers([EntityId.playerA, EntityId.playerB]).save()
            .buildEntity(EntityId.cellx2y2).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerBRobot).withPhysicalComponent(position(1, 1)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBRobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, Physical, new Physical(EntityId.playerBRobot, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y2, Physical, new Physical(EntityId.cellx2y2, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(2, 2))),
            (game, adapters) => whenEventOccurs(game, moveEvent(EntityId.playerB, EntityType.robot, EntityId.playerBRobot, EntityId.cellx2y2)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerBRobot, Physical, new Physical(EntityId.playerBRobot, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBRobotPhase())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerB, positionAlreadyOccupiedNotificationMessage))
        ])
    serverScenario(`${Action.move} 6 - Can't Move Game Event - Robot of same player already on destination cell`, moveEvent(EntityId.playerB, EntityType.robot, EntityId.playerBTower, EntityId.cellx2y2),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerBTowerPhase()).withPlayers([EntityId.playerA, EntityId.playerB]).save()
            .buildEntity(EntityId.playerBRobot).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(1, 1)).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition).save()
            .buildEntity(EntityId.cellx2y2).withPhysicalComponent(position(2, 2)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBTowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, Physical, new Physical(EntityId.playerBRobot, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y2, Physical, new Physical(EntityId.cellx2y2, position(2, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(1, 1))),
            (game, adapters) => whenEventOccurs(game, moveEvent(EntityId.playerB, EntityType.tower, EntityId.playerBTower, EntityId.cellx2y2)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBTowerPhase())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerB, positionAlreadyOccupiedNotificationMessage))
        ])
    serverScenario(`${Action.move} 7 - Can't Move Game Event - No action points`, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx2y1),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase(0)).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(playerATowerFirstPosition).save()
            .buildEntity(EntityId.cellx2y1).withPhysicalComponent(position(2, 1)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase(0))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y1, Physical, new Physical(EntityId.cellx2y1, position(2, 1))),
            (game, adapters) => whenEventOccurs(game, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx2y1)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase(0))),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerA, notEnoughActionPointNotificationMessage))
        ])
    serverScenario(`${Action.move} 8 - Can't Move Game Event - Bad Player`, moveEvent(EntityId.playerB, EntityType.tower, EntityId.playerATower, EntityId.cellx2y1),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withPlayers([EntityId.playerA, EntityId.playerB]).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(playerBTowerFirstPosition).save()
            .buildEntity(EntityId.playerBRobot).save()
            .buildEntity(EntityId.cellx2y1).withPhysicalComponent(position(2, 1)).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y1, Physical, new Physical(EntityId.cellx2y1, position(2, 1))),
            (game, adapters) => whenEventOccurs(game, moveEvent(EntityId.playerB, EntityType.tower, EntityId.playerATower, EntityId.cellx2y1)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, playerATowerFirstPosition)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerB, badPlayerNotificationMessage(EntityId.playerB)))
        ])
    serverScenario(`${Action.move} 9 - Can't Move Game Event - Bad Unit`, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx2y1),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerARobotPhase()).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(1, 1)).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(position(24, 24)).save()
            .buildEntity(EntityId.cellx2y1).withPhysicalComponent(position(2, 1)).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(1, 1))),
            (game, adapters) => whenEventOccurs(game, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx2y1)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, position(1, 1))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, notifyEvent(EntityId.playerA, wrongUnitPhaseNotificationMessage(playerARobotPhase())))
        ])
})
