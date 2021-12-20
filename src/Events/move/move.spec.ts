
import { Phasing, playerARobotAutoPlacementPhase, playerARobotPhase, playerATowerAutoPlacementPhase, playerATowerPhase, playerBRobotAutoPlacementPhase, playerBRobotPhase, playerBTowerAutoPlacementPhase, playerBTowerPhase } from '../../Components/Phasing'
import { Physical, playerARobotFirstPosition, playerATowerFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition, position } from '../../Components/Physical'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, theEntityWithIdHasTheExpectedComponent, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { wrongPlayerPhaseNotificationMessage, notEnoughActionPointNotificationMessage, notifyPlayerEvent, positionAlreadyOccupiedNotificationMessage, wrongUnitPhaseNotificationMessage } from '../notifyPlayer/notifyPlayer'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { moveEvent } from './move'
import { EntityId } from '../../Event/entityIds'
import { ShapeType } from '../../Components/port/ShapeType'
import { nextTurnEvent } from '../nextTurn/nextTurn'
import { gameScreenDimension } from '../../Components/port/Dimension'
import { drawEvent } from '../draw/draw'
import { movingEntityNotSupported } from '../../Systems/Moving/MovingSystem'

const gridFirstCellPosition = position(0, 0)
feature(featureEventDescription(Action.move), () => {
    serverScenario(`${Action.move} 1 - Robot Move Horizontaly`, moveEvent(EntityId.playerA, EntityType.robot, EntityId.playerARobot, EntityId.cellx1y2),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerARobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true).withEntityReferences(EntityType.tower).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityId.cellx1y2).withPhysicalComponent(position(1, 2), ShapeType.cell, true).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, position(2, 2), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y2, Physical, new Physical(EntityId.cellx1y2, position(1, 2), ShapeType.cell, true)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, position(1, 2), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase(11))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityId.playerA, new Physical(EntityId.playerARobot, position(1, 2), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 2 - Robot Move Vertically`, moveEvent(EntityId.playerA, EntityType.robot, EntityId.playerARobot, EntityId.cellx2y1),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerARobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.cellx2y1).withPhysicalComponent(position(2, 1), ShapeType.cell, true).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true).withEntityReferences(EntityType.tower).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, position(2, 2), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y1, Physical, new Physical(EntityId.cellx2y1, position(2, 1), ShapeType.cell, true)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, position(2, 1), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase(11))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityId.playerA, new Physical(EntityId.playerARobot, position(2, 1), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 3 - Robot Move Diagonally`, moveEvent(EntityId.playerA, EntityType.robot, EntityId.playerARobot, EntityId.cellx1y1),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerARobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.cellx1y1).withPhysicalComponent(position(1, 1), ShapeType.cell, true).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(1, 2), ShapeType.tower, true).withEntityReferences(EntityType.tower).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y1, Physical, new Physical(EntityId.cellx1y1, position(1, 1), ShapeType.cell, true)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, position(1, 1), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase(11))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityId.playerA, new Physical(EntityId.playerARobot, position(1, 1), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 4 - Can't Move Game Event - Tower of other player already on destination cell`, moveEvent(EntityId.playerA, EntityType.robot, EntityId.playerARobot, EntityId.cellx2y2),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerARobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]]])).save()
            .buildEntity(EntityId.cellx2y2).withPhysicalComponent(position(2, 2), ShapeType.cell, true).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(2, 2), ShapeType.tower, true).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y2, Physical, new Physical(EntityId.cellx2y2, position(2, 2), ShapeType.cell, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(2, 2), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityId.playerA, positionAlreadyOccupiedNotificationMessage)])
        ])
    serverScenario(`${Action.move} 5 - Can't Move Game Event - Tower of same player already on destination cell`, moveEvent(EntityId.playerB, EntityType.robot, EntityId.playerBRobot, EntityId.cellx2y2),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerBRobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]]])).save()
            .buildEntity(EntityId.cellx2y2).withPhysicalComponent(position(2, 2), ShapeType.cell, true).save()
            .buildEntity(EntityId.playerBRobot).withPhysicalComponent(position(1, 1), ShapeType.robot, true).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(2, 2), ShapeType.tower, true).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition(position(0, 0)), ShapeType.tower, true).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBRobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, Physical, new Physical(EntityId.playerBRobot, position(1, 1), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y2, Physical, new Physical(EntityId.cellx2y2, position(2, 2), ShapeType.cell, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(2, 2), ShapeType.tower, true)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerBRobot, Physical, new Physical(EntityId.playerBRobot, position(1, 1), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBRobotPhase())),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityId.playerB, positionAlreadyOccupiedNotificationMessage)])
        ])
    serverScenario(`${Action.move} 6 - Can't Move Game Event - Robot of the other player already on destination cell`, moveEvent(EntityId.playerB, EntityType.robot, EntityId.playerBRobot, EntityId.cellx2y2),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerBRobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]]])).save()
            .buildEntity(EntityId.playerBRobot).withPhysicalComponent(position(1, 2), ShapeType.robot, true).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityId.playerBTower).withPhysicalComponent(position(1, 1), ShapeType.tower, true).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(position(3, 4), ShapeType.tower, true).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true).save()
            .buildEntity(EntityId.cellx2y2).withPhysicalComponent(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBRobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBRobot, Physical, new Physical(EntityId.playerBRobot, position(1, 2), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y2, Physical, new Physical(EntityId.cellx2y2, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerBRobot, Physical, new Physical(EntityId.playerBRobot, position(1, 2), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBRobotPhase())),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityId.playerB, positionAlreadyOccupiedNotificationMessage)])
        ])
    serverScenario(`${Action.move} 7 - Can't Move Game Event - No action points`, moveEvent(EntityId.playerA, EntityType.robot, EntityId.playerARobot, EntityId.cellx2y1),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerARobotPhase(0)).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerATower).withPhysicalComponent(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true).save()
            .buildEntity(EntityId.playerARobot).withPhysicalComponent(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true).save()
            .buildEntity(EntityId.cellx2y1).withPhysicalComponent(position(2, 1), ShapeType.cell, true).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase(0))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y1, Physical, new Physical(EntityId.cellx2y1, position(2, 1), ShapeType.cell, true)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase(0))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityId.playerA, notEnoughActionPointNotificationMessage)])
        ])
    serverScenario(`${Action.move} 8 - Can't Move Game Event - Bad Player`, moveEvent(EntityId.playerB, EntityType.robot, EntityId.playerARobot, EntityId.cellx2y1),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerARobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]]])).save()
            .buildRobot(EntityId.playerARobot, playerARobotFirstPosition(gridFirstCellPosition)).save()
            .buildTower(EntityId.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension)).save()
            .buildEntity(EntityId.playerBRobot).save()
            .buildEntity(EntityId.cellx2y1).withPhysicalComponent(position(2, 1), ShapeType.cell, true).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]], [EntityType.match, [EntityId.match]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx2y1, Physical, new Physical(EntityId.cellx2y1, position(2, 1), ShapeType.cell, true)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerARobotPhase())),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityId.playerB, wrongPlayerPhaseNotificationMessage(EntityId.playerB))])
        ])
    serverScenario(`${Action.move} 9 - Can't Move Game Event - Bad Unit`, moveEvent(EntityId.playerA, EntityType.robot, EntityId.playerARobot, EntityId.cellx2y1),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildTower(EntityId.playerATower, position(1, 1)).save()
            .buildRobot(EntityId.playerARobot, position(24, 24)).save()
            .buildEntity(EntityId.cellx2y1).withPhysicalComponent(position(24, 23), ShapeType.cell, true).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, position(24, 24), ShapeType.robot, true)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, position(24, 24), ShapeType.robot, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerATowerPhase())),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityId.playerA, wrongUnitPhaseNotificationMessage(playerATowerPhase()))])
        ])
    serverScenario(`${Action.move} 10 - Auto move on player A Tower Placement Phase`, moveEvent(EntityId.playerA, EntityType.tower, EntityId.playerATower, EntityId.cellx1y1),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerATowerAutoPlacementPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildTower(EntityId.playerATower, position(0, 0)).withEntityReferences(EntityType.tower).save()
            .buildRobot(EntityId.playerARobot, position(0, 0)).save()
            .buildEntity(EntityId.cellx1y1).withPhysicalComponent(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.cell, true).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerATower, Physical, new Physical(EntityId.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                nextTurnEvent(EntityId.match),
                drawEvent(EntityId.playerA, new Physical(EntityId.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true))
            ])
        ])
    serverScenario(`${Action.move} 11 - Auto move on player A Robot Placement Phase`, moveEvent(EntityId.playerA, EntityType.robot, EntityId.playerARobot, EntityId.cellx2y2),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerARobotAutoPlacementPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildTower(EntityId.playerATower, position(0, 0)).save()
            .buildRobot(EntityId.playerARobot, position(0, 0)).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityId.cellx2y2).withPhysicalComponent(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                nextTurnEvent(EntityId.match),
                drawEvent(EntityId.playerA, new Physical(EntityId.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 12 - Auto move on player B Tower Placement Phase`, moveEvent(EntityId.playerB, EntityType.tower, EntityId.playerBTower, EntityId.cellx24y24),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerBTowerAutoPlacementPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildTower(EntityId.playerATower, position(0, 0)).save()
            .buildRobot(EntityId.playerARobot, position(0, 0)).save()
            .buildTower(EntityId.playerBTower, position(0, 0)).withEntityReferences(EntityType.tower).save()
            .buildRobot(EntityId.playerBRobot, position(0, 0)).save()
            .buildEntity(EntityId.cellx24y24).withPhysicalComponent(playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.cell, true).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                nextTurnEvent(EntityId.match),
                drawEvent(EntityId.playerA, new Physical(EntityId.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true)),
                drawEvent(EntityId.playerB, new Physical(EntityId.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true))
            ])
        ])
    serverScenario(`${Action.move} 13 - Auto move on player B Robot Placement Phase`, moveEvent(EntityId.playerB, EntityType.robot, EntityId.playerBRobot, EntityId.cellx24y24),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPhase(playerBRobotAutoPlacementPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerATower]], [EntityType.robot, [EntityId.playerARobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityId.playerBTower]], [EntityType.robot, [EntityId.playerBRobot]], [EntityType.match, [EntityId.match]]])).save()
            .buildTower(EntityId.playerATower, position(0, 0)).save()
            .buildRobot(EntityId.playerARobot, position(0, 0)).save()
            .buildTower(EntityId.playerBTower, position(0, 0)).save()
            .buildRobot(EntityId.playerBRobot, position(0, 0)).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityId.cellx24y24).withPhysicalComponent(playerBRobotFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.cell, true).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerBRobot, Physical, new Physical(EntityId.playerBRobot, playerBRobotFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.robot, true)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                nextTurnEvent(EntityId.match),
                drawEvent(EntityId.playerA, new Physical(EntityId.playerBRobot, playerBRobotFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.robot, true)),
                drawEvent(EntityId.playerB, new Physical(EntityId.playerBRobot, playerBRobotFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 14 - Tower can't move.`, moveEvent(EntityId.playerB, EntityType.tower, EntityId.playerBTower, EntityId.cellx0y0),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.cellx0y0).withPhysicalComponent(position(18, 57), ShapeType.cell, true).save()
            .buildEntity(EntityId.match).withPhase(playerBTowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerB]]])).save()
            .buildTower(EntityId.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension)).withEntityReferences(EntityType.tower).save()

        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBTowerPhase())),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, playerBTowerPhase())),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                notifyPlayerEvent(EntityId.playerB, movingEntityNotSupported)
            ])
        ])
})
