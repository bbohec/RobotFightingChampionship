
import { gameScreenDimension } from '../../Components/Dimensional'
import { makeEntityReference } from '../../Components/EntityReference'
import { makePhasing, playerARobotAutoPlacementPhase, playerARobotPhase, playerATowerAutoPlacementPhase, playerATowerPhase, playerBRobotAutoPlacementPhase, playerBRobotPhase, playerBTowerAutoPlacementPhase, playerBTowerPhase } from '../../Components/Phasing'
import { makePhysical, playerARobotFirstPosition, playerATowerFirstPosition, playerBRobotFirstPosition, playerBTowerFirstPosition, position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, thereIsServerComponents, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { movingEntityNotSupported } from '../../Systems/Moving/MovingSystem'
import { drawEvent } from '../draw/draw'
import { nextTurnEvent } from '../nextTurn/nextTurn'
import { notEnoughActionPointNotificationMessage, notifyPlayerEvent, positionAlreadyOccupiedNotificationMessage, wrongPlayerPhaseNotificationMessage, wrongUnitPhaseNotificationMessage } from '../notifyPlayer/notifyPlayer'
import { moveEvent } from './move'

const gridFirstCellPosition = position(0, 0)
feature(featureEventDescription(Action.move), () => {
    serverScenario(`${Action.move} 1 - Robot Move Horizontaly`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx1y2),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerARobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysical(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true).withEntityReferences(EntityType.tower).save()
            .buildEntity(EntityIds.playerARobot).withPhysical(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityIds.cellx1y2).withPhysical(position(1, 2), ShapeType.cell, true).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true),
                makeEntityReference(EntityIds.playerATower, EntityType.tower),
                makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot),
                makePhysical(EntityIds.cellx1y2, position(1, 2), ShapeType.cell, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerARobotPhase(11)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true),
                makeEntityReference(EntityIds.playerATower, EntityType.tower),
                makePhysical(EntityIds.playerARobot, position(1, 2), ShapeType.robot, true),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot),
                makePhysical(EntityIds.cellx1y2, position(1, 2), ShapeType.cell, true)

            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerARobot, position(1, 2), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 2 - Robot Move Vertically`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y1),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerARobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysical(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true).withEntityReferences(EntityType.tower).save()
            .buildEntity(EntityIds.playerARobot).withPhysical(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityIds.cellx2y1).withPhysical(position(2, 1), ShapeType.cell, true).save()
        , [
            thereIsServerComponents(TestStep.And, [
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true),
                makeEntityReference(EntityIds.playerATower, EntityType.tower),
                makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot),
                makePhysical(EntityIds.cellx2y1, position(2, 1), ShapeType.cell, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerARobotPhase(11)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true),
                makeEntityReference(EntityIds.playerATower, EntityType.tower),
                makePhysical(EntityIds.playerARobot, position(2, 1), ShapeType.robot, true),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot),
                makePhysical(EntityIds.cellx2y1, position(2, 1), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerARobot, position(2, 1), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 3 - Robot Move Diagonally`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx1y1),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerARobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysical(position(1, 2), ShapeType.tower, true).withEntityReferences(EntityType.tower).save()
            .buildEntity(EntityIds.playerARobot).withPhysical(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityIds.cellx1y1).withPhysical(position(1, 1), ShapeType.cell, true).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, position(1, 2), ShapeType.tower, true),
                makeEntityReference(EntityIds.playerATower, EntityType.tower),
                makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot),
                makePhysical(EntityIds.cellx1y1, position(1, 1), ShapeType.cell, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerARobotPhase(11)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, position(1, 2), ShapeType.tower, true),
                makeEntityReference(EntityIds.playerATower, EntityType.tower),
                makePhysical(EntityIds.playerARobot, position(1, 1), ShapeType.robot, true),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot),
                makePhysical(EntityIds.cellx1y1, position(1, 1), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerARobot, position(1, 1), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 4 - Can't Move Game Event - Tower of other player already on destination cell`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y2),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerARobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysical(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerARobot).withPhysical(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true).save()
            .buildEntity(EntityIds.playerBTower).withPhysical(position(2, 2), ShapeType.tower, true).save()
            .buildEntity(EntityIds.cellx2y2).withPhysical(position(2, 2), ShapeType.cell, true).save()

        , [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true),
                makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true),
                makePhysical(EntityIds.playerBTower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.cellx2y2, position(2, 2), ShapeType.cell, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true),
                makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true),
                makePhysical(EntityIds.playerBTower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.cellx2y2, position(2, 2), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerA, positionAlreadyOccupiedNotificationMessage)])
        ])
    serverScenario(`${Action.move} 5 - Can't Move Game Event - Tower of same player already on destination cell`, moveEvent(EntityIds.playerB, EntityType.robot, EntityIds.playerBRobot, EntityIds.cellx2y2),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerBRobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysical(playerATowerFirstPosition(position(0, 0)), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerBRobot).withPhysical(position(1, 1), ShapeType.robot, true).save()
            .buildEntity(EntityIds.playerBTower).withPhysical(position(2, 2), ShapeType.tower, true).save()
            .buildEntity(EntityIds.cellx2y2).withPhysical(position(2, 2), ShapeType.cell, true).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerBRobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, playerATowerFirstPosition(position(0, 0)), ShapeType.tower, true),
                makePhysical(EntityIds.playerBRobot, position(1, 1), ShapeType.robot, true),
                makePhysical(EntityIds.playerBTower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.cellx2y2, position(2, 2), ShapeType.cell, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerBRobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, playerATowerFirstPosition(position(0, 0)), ShapeType.tower, true),
                makePhysical(EntityIds.playerBRobot, position(1, 1), ShapeType.robot, true),
                makePhysical(EntityIds.playerBTower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.cellx2y2, position(2, 2), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerB, positionAlreadyOccupiedNotificationMessage)])
        ])
    serverScenario(`${Action.move} 6 - Can't Move Game Event - Robot of the other player already on destination cell`, moveEvent(EntityIds.playerB, EntityType.robot, EntityIds.playerBRobot, EntityIds.cellx2y2),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerBRobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerARobot).withPhysical(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true).save()
            .buildEntity(EntityIds.playerATower).withPhysical(position(3, 4), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerBRobot).withPhysical(position(1, 2), ShapeType.robot, true).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityIds.playerBTower).withPhysical(position(1, 1), ShapeType.tower, true).save()
            .buildEntity(EntityIds.cellx2y2).withPhysical(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true).save()

        , [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerBRobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true),
                makePhysical(EntityIds.playerATower, position(3, 4), ShapeType.tower, true),
                makePhysical(EntityIds.playerBRobot, position(1, 2), ShapeType.robot, true),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot),
                makePhysical(EntityIds.playerBTower, position(1, 1), ShapeType.tower, true),
                makePhysical(EntityIds.cellx2y2, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerBRobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true),
                makePhysical(EntityIds.playerATower, position(3, 4), ShapeType.tower, true),
                makePhysical(EntityIds.playerBRobot, position(1, 2), ShapeType.robot, true),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot),
                makePhysical(EntityIds.playerBTower, position(1, 1), ShapeType.tower, true),
                makePhysical(EntityIds.cellx2y2, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerB, positionAlreadyOccupiedNotificationMessage)])
        ])
    serverScenario(`${Action.move} 7 - Can't Move Game Event - No action points`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y1),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerARobotPhase(0)).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerATower).withPhysical(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true).save()
            .buildEntity(EntityIds.playerARobot).withPhysical(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true).save()
            .buildEntity(EntityIds.cellx2y1).withPhysical(position(2, 1), ShapeType.cell, true).save()

        , [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerARobotPhase(0)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true),
                makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true),
                makePhysical(EntityIds.cellx2y1, position(2, 1), ShapeType.cell, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerARobotPhase(0)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true),
                makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true),
                makePhysical(EntityIds.cellx2y1, position(2, 1), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage)])
        ])
    serverScenario(`${Action.move} 8 - Can't Move Game Event - Bad Player`, moveEvent(EntityIds.playerB, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y1),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerARobotPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildRobot(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition)).save()
            .buildTower(EntityIds.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension)).save()
            .buildEntity(EntityIds.playerBRobot).save()
            .buildEntity(EntityIds.cellx2y1).withPhysical(position(2, 1), ShapeType.cell, true).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true),
                makePhysical(EntityIds.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true),
                makePhysical(EntityIds.cellx2y1, position(2, 1), ShapeType.cell, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true),
                makePhysical(EntityIds.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true),
                makePhysical(EntityIds.cellx2y1, position(2, 1), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerB, wrongPlayerPhaseNotificationMessage(EntityIds.playerB))])
        ])
    serverScenario(`${Action.move} 9 - Can't Move Game Event - Bad Unit`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y1),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildTower(EntityIds.playerATower, position(1, 1)).save()
            .buildRobot(EntityIds.playerARobot, position(24, 24)).save()
            .buildEntity(EntityIds.cellx2y1).withPhysical(position(24, 23), ShapeType.cell, true).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, position(1, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerARobot, position(24, 24), ShapeType.robot, true),
                makePhysical(EntityIds.cellx2y1, position(24, 23), ShapeType.cell, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, position(1, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerARobot, position(24, 24), ShapeType.robot, true),
                makePhysical(EntityIds.cellx2y1, position(24, 23), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [notifyPlayerEvent(EntityIds.playerA, wrongUnitPhaseNotificationMessage(playerATowerPhase()))])
        ])
    serverScenario(`${Action.move} 10 - Auto move on player A Tower Placement Phase`, moveEvent(EntityIds.playerA, EntityType.tower, EntityIds.playerATower, EntityIds.cellx1y1),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerATowerAutoPlacementPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildTower(EntityIds.playerATower, position(0, 0)).withEntityReferences(EntityType.tower).save()
            .buildRobot(EntityIds.playerARobot, position(0, 0)).save()
            .buildEntity(EntityIds.cellx1y1).withPhysical(playerATowerFirstPosition(gridFirstCellPosition), ShapeType.cell, true).save()
        , [
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerAutoPlacementPhase(999)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true),
                makeEntityReference(EntityIds.playerATower, EntityType.tower),
                makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, true),
                makePhysical(EntityIds.cellx1y1, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                nextTurnEvent(EntityIds.match),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true))
            ])
        ])
    serverScenario(`${Action.move} 11 - Auto move on player A Robot Placement Phase`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y2),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerARobotAutoPlacementPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildTower(EntityIds.playerATower, position(0, 0)).save()
            .buildRobot(EntityIds.playerARobot, position(0, 0)).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityIds.cellx2y2).withPhysical(playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true).save()
        , [
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerARobotAutoPlacementPhase(998)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, position(0, 0), ShapeType.tower, true),
                makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot),
                makePhysical(EntityIds.cellx2y2, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                nextTurnEvent(EntityIds.match),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 12 - Auto move on player B Tower Placement Phase`, moveEvent(EntityIds.playerB, EntityType.tower, EntityIds.playerBTower, EntityIds.cellx24y24),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerBTowerAutoPlacementPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildTower(EntityIds.playerATower, position(0, 0)).save()
            .buildRobot(EntityIds.playerARobot, position(0, 0)).save()
            .buildTower(EntityIds.playerBTower, position(0, 0)).withEntityReferences(EntityType.tower).save()
            .buildRobot(EntityIds.playerBRobot, position(0, 0)).save()
            .buildEntity(EntityIds.cellx24y24).withPhysical(playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.cell, true).save()
        , [
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerBTowerAutoPlacementPhase(940)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, position(0, 0), ShapeType.tower, true),
                makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, true),
                makePhysical(EntityIds.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower),
                makePhysical(EntityIds.playerBRobot, position(0, 0), ShapeType.robot, true),
                makePhysical(EntityIds.cellx24y24, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                nextTurnEvent(EntityIds.match),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true))
            ])
        ])
    serverScenario(`${Action.move} 13 - Auto move on player B Robot Placement Phase`, moveEvent(EntityIds.playerB, EntityType.robot, EntityIds.playerBRobot, EntityIds.cellx24y24),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerBRobotAutoPlacementPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])).save()
            .buildTower(EntityIds.playerATower, position(0, 0)).save()
            .buildRobot(EntityIds.playerARobot, position(0, 0)).save()
            .buildTower(EntityIds.playerBTower, position(0, 0)).save()
            .buildRobot(EntityIds.playerBRobot, position(0, 0)).withEntityReferences(EntityType.robot).save()
            .buildEntity(EntityIds.cellx24y24).withPhysical(playerBRobotFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.cell, true).save()
        , [
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerBRobotAutoPlacementPhase(941)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, position(0, 0), ShapeType.tower, true),
                makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, true),
                makePhysical(EntityIds.playerBTower, position(0, 0), ShapeType.tower, true),
                makePhysical(EntityIds.playerBRobot, playerBRobotFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.robot, true),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot),
                makePhysical(EntityIds.cellx24y24, playerBRobotFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                nextTurnEvent(EntityIds.match),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerBRobot, playerBRobotFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.robot, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBRobot, playerBRobotFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 14 - Tower can't move.`, moveEvent(EntityIds.playerB, EntityType.tower, EntityIds.playerBTower, EntityIds.cellx0y0),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withPhase(playerBTowerPhase()).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]]])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildTower(EntityIds.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension)).withEntityReferences(EntityType.tower).save()
            .buildEntity(EntityIds.cellx0y0).withPhysical(position(18, 57), ShapeType.cell, true).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerBTowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower),
                makePhysical(EntityIds.cellx0y0, position(18, 57), ShapeType.cell, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerBTowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower),
                makePhysical(EntityIds.cellx0y0, position(18, 57), ShapeType.cell, true)
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                notifyPlayerEvent(EntityIds.playerB, movingEntityNotSupported)
            ])
        ])
})
