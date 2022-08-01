import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { gameScreenDimension } from '../../ecs/components/Dimensional'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { playerARobotPhase, makePhasing, playerBRobotPhase, playerATowerPhase, playerATowerAutoPlacementPhase, playerARobotAutoPlacementPhase, playerBTowerAutoPlacementPhase, playerBRobotAutoPlacementPhase, playerBTowerPhase } from '../../ecs/components/Phasing'
import { position, playerATowerFirstPosition, playerARobotFirstPosition, makePhysical, playerBTowerFirstPosition, playerBRobotFirstPosition } from '../../ecs/components/Physical'
import { movingEntityNotSupported } from '../../ecs/systems/MovingSystem'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { drawEvent } from '../draw/draw'
import { nextTurnEvent } from '../nextTurn/nextTurn'
import { notifyPlayerEvent, positionAlreadyOccupiedNotificationMessage, notEnoughActionPointNotificationMessage, wrongPlayerPhaseNotificationMessage, wrongUnitPhaseNotificationMessage } from '../notifyPlayer/notifyPlayer'
import { moveEvent } from './move'

const gridFirstCellPosition = position(0, 0)
feature(Action.move, () => {
    serverScenario(`${Action.move} 1 - Robot Move Horizontaly`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx1y2),
        [], [
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
            eventsAreSent(TestStep.Then, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerARobot, position(1, 2), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 2 - Robot Move Vertically`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y1),
        [], [
            thereIsServerComponents(TestStep.Given, [
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
            eventsAreSent(TestStep.Then, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerARobot, position(2, 1), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 3 - Robot Move Diagonally`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx1y1),
        [], [
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
            eventsAreSent(TestStep.Then, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerARobot, position(1, 1), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 4 - Can't Move Game Event - Tower of other player already on destination cell`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y2),
        [], [
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
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerA, positionAlreadyOccupiedNotificationMessage)])
        ])
    serverScenario(`${Action.move} 5 - Can't Move Game Event - Tower of same player already on destination cell`, moveEvent(EntityIds.playerB, EntityType.robot, EntityIds.playerBRobot, EntityIds.cellx2y2),
        [], [
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
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerB, positionAlreadyOccupiedNotificationMessage)])
        ])
    serverScenario(`${Action.move} 6 - Can't Move Game Event - Robot of the other player already on destination cell`, moveEvent(EntityIds.playerB, EntityType.robot, EntityIds.playerBRobot, EntityIds.cellx2y2),
        [], [
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
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerB, positionAlreadyOccupiedNotificationMessage)])
        ])
    serverScenario(`${Action.move} 7 - Can't Move Game Event - No action points`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y1),
        [], [
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
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage)])
        ])
    serverScenario(`${Action.move} 8 - Can't Move Game Event - Bad Player`, moveEvent(EntityIds.playerB, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y1),
        [], [
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
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerB, wrongPlayerPhaseNotificationMessage(EntityIds.playerB))])
        ])
    serverScenario(`${Action.move} 9 - Can't Move Game Event - Bad Unit`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y1),
        [], [
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
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerA, wrongUnitPhaseNotificationMessage(playerATowerPhase()))])
        ])
    serverScenario(`${Action.move} 10 - Auto move on player A Tower Placement Phase`, moveEvent(EntityIds.playerA, EntityType.tower, EntityIds.playerATower, EntityIds.cellx1y1),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerAutoPlacementPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, position(0, 0), ShapeType.tower, true),
                makeEntityReference(EntityIds.playerATower, EntityType.tower),
                makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, true),
                makePhysical(EntityIds.cellx1y1, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.cell, true)
            ]),
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
            eventsAreSent(TestStep.Then, 'server', [
                nextTurnEvent(EntityIds.match),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerATower, playerATowerFirstPosition(gridFirstCellPosition), ShapeType.tower, true))
            ])
        ])
    serverScenario(`${Action.move} 11 - Auto move on player A Robot Placement Phase`, moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx2y2),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerARobotAutoPlacementPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, position(0, 0), ShapeType.tower, true),
                makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, true),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot),
                makePhysical(EntityIds.cellx2y2, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.cell, true)
            ]),
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
            eventsAreSent(TestStep.Then, 'server', [
                nextTurnEvent(EntityIds.match),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerARobot, playerARobotFirstPosition(gridFirstCellPosition), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 12 - Auto move on player B Tower Placement Phase`, moveEvent(EntityIds.playerB, EntityType.tower, EntityIds.playerBTower, EntityIds.cellx24y24),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerBTowerAutoPlacementPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, position(0, 0), ShapeType.tower, true),
                makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, true),
                makePhysical(EntityIds.playerBTower, position(0, 0), ShapeType.tower, true),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower),
                makePhysical(EntityIds.playerBRobot, position(0, 0), ShapeType.robot, true),
                makePhysical(EntityIds.cellx24y24, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.cell, true)
            ]),
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
            eventsAreSent(TestStep.Then, 'server', [
                nextTurnEvent(EntityIds.match),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBTower, playerBTowerFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.tower, true))
            ])
        ])
    serverScenario(`${Action.move} 13 - Auto move on player B Robot Placement Phase`, moveEvent(EntityIds.playerB, EntityType.robot, EntityIds.playerBRobot, EntityIds.cellx24y24),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerBRobotAutoPlacementPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]], [EntityType.match, [EntityIds.match]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]], [EntityType.match, [EntityIds.match]]])),
                makePhysical(EntityIds.playerATower, position(0, 0), ShapeType.tower, true),
                makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, true),
                makePhysical(EntityIds.playerBTower, position(0, 0), ShapeType.tower, true),
                makePhysical(EntityIds.playerBRobot, position(0, 0), ShapeType.robot, true),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot),
                makePhysical(EntityIds.cellx24y24, playerBRobotFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.cell, true)
            ]),
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
            eventsAreSent(TestStep.Then, 'server', [
                nextTurnEvent(EntityIds.match),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerBRobot, playerBRobotFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.robot, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.playerBRobot, playerBRobotFirstPosition(gridFirstCellPosition, gameScreenDimension), ShapeType.robot, true))
            ])
        ])
    serverScenario(`${Action.move} 14 - Tower can't move.`, moveEvent(EntityIds.playerB, EntityType.tower, EntityIds.playerBTower, EntityIds.cellx0y0),
        [], [
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
            eventsAreSent(TestStep.Then, 'server', [
                notifyPlayerEvent(EntityIds.playerB, movingEntityNotSupported)
            ])
        ])
})
