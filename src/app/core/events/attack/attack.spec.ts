import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { playerATowerPhase, makePhasing, playerBTowerPhase, playerARobotPhase, playerBRobotPhase, defaultActionPoints, weaponAttackActionPoints } from '../../ecs/components/Phasing'
import { position, makePhysical } from '../../ecs/components/Physical'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { hitEvent } from '../hit/hit'
import { notifyPlayerEvent, wrongUnitPhaseNotificationMessage, wrongPlayerPhaseNotificationMessage, outOfRangeNotificationMessage, notEnoughActionPointNotificationMessage } from '../notifyPlayer/notifyPlayer'
import { attackEvent } from './attack'

/*
    - Friendly Fire?
    - Réduction de dommage sur la distance ?
*/

feature(Action.attack, () => {
    serverScenario(`${Action.attack} 1 - Attack Game Event - playerA Tower`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerARobot, position(2, 2), ShapeType.robot, true),
                makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(3, 2), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase(8)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerARobot, position(2, 2), ShapeType.robot, true),
                makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(3, 2), ShapeType.tower, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [hitEvent(EntityIds.playerATower, EntityIds.playerBTower)])
        ])
    serverScenario(`${Action.attack} 2 - Attack Game Event - playerB Tower`, attackEvent(EntityIds.playerB, EntityIds.playerBTower, EntityIds.playerATower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerBTowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(3, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBRobot, position(4, 2), ShapeType.robot, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerBTowerPhase(8)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(3, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBRobot, position(4, 2), ShapeType.robot, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [hitEvent(EntityIds.playerBTower, EntityIds.playerATower)])
        ])
    serverScenario(`${Action.attack} 3 - Attack Game Event - playerA Robot`, attackEvent(EntityIds.playerA, EntityIds.playerARobot, EntityIds.playerBRobot),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerARobot, position(2, 2), ShapeType.robot, true),
                makePhysical(EntityIds.playerBRobot, position(3, 2), ShapeType.robot, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerARobotPhase(8)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerARobot, position(2, 2), ShapeType.robot, true),
                makePhysical(EntityIds.playerBRobot, position(3, 2), ShapeType.robot, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [hitEvent(EntityIds.playerARobot, EntityIds.playerBRobot)])
        ])
    serverScenario(`${Action.attack} 4 - Attack Game Event - playerB Robot`, attackEvent(EntityIds.playerB, EntityIds.playerBRobot, EntityIds.playerARobot),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerBRobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]]])),
                makePhysical(EntityIds.playerARobot, position(2, 2), ShapeType.robot, true),
                makePhysical(EntityIds.playerBRobot, position(3, 2), ShapeType.robot, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerBRobotPhase(8)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]]])),
                makePhysical(EntityIds.playerARobot, position(2, 2), ShapeType.robot, true),
                makePhysical(EntityIds.playerBRobot, position(3, 2), ShapeType.robot, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [hitEvent(EntityIds.playerBRobot, EntityIds.playerARobot)])
        ])
    serverScenario(`${Action.attack} 5 - Can't Attack : Bad Phase for tower player A`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(3, 2), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(3, 2), ShapeType.tower, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerA, wrongUnitPhaseNotificationMessage(playerARobotPhase()))])
        ])
    serverScenario(`${Action.attack} 6 - Can't Attack: Bad Player`, attackEvent(EntityIds.playerB, EntityIds.playerBTower, EntityIds.playerATower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(3, 2), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerBTower]], [EntityType.robot, [EntityIds.playerBRobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(3, 2), ShapeType.tower, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerB, wrongPlayerPhaseNotificationMessage(EntityIds.playerB))])
        ])
    serverScenario(`${Action.attack} 7 - Can't Attack : Out of Range - Horizontal 1`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(24, 2), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(24, 2), ShapeType.tower, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerA, outOfRangeNotificationMessage)])
        ])
    serverScenario(`${Action.attack} 8 - Can't Attack : Out of Range - Horizontal 2`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(24, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(1, 1), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(24, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(1, 1), ShapeType.tower, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerA, outOfRangeNotificationMessage)])
        ])
    serverScenario(`${Action.attack} 9 - Can Attack : On Range - Horizontal 3 - Max Range`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(11, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(1, 1), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase(8)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(11, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(1, 1), ShapeType.tower, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [hitEvent(EntityIds.playerATower, EntityIds.playerBTower)])
        ])
    serverScenario(`${Action.attack} 10 - Can't Attack : Out of Range - Vertical 1`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(1, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(1, 24), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(1, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(1, 24), ShapeType.tower, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerA, outOfRangeNotificationMessage)])
        ])
    serverScenario(`${Action.attack} 11 - Can't Attack : Out of Range - Vertical 2`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(1, 3), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(24, 3), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(1, 3), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(24, 3), ShapeType.tower, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerA, outOfRangeNotificationMessage)])
        ])
    serverScenario(`${Action.attack} 12 - Can Attack : On Range - Vertical 3 - Max Range`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(1, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(1, 11), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase(8)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(1, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(1, 11), ShapeType.tower, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [hitEvent(EntityIds.playerATower, EntityIds.playerBTower)])
        ])
    serverScenario(`${Action.attack} 13 - Can't Attack : Out of Range - Diagonal`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(24, 24), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 2), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(24, 24), ShapeType.tower, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerA, outOfRangeNotificationMessage)])
        ])
    serverScenario(`${Action.attack} 14 - Can Attack : On Range - Diagonal - Max Range`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(11, 4), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase(defaultActionPoints - weaponAttackActionPoints)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(11, 4), ShapeType.tower, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [hitEvent(EntityIds.playerATower, EntityIds.playerBTower)])
        ])
    serverScenario(`${Action.attack} 15 - Can Attack : Reduce action point`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(11, 4), ShapeType.tower, true)
            ]),
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, 'server', [hitEvent(EntityIds.playerATower, EntityIds.playerBTower)]),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase(defaultActionPoints - weaponAttackActionPoints)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(11, 4), ShapeType.tower, true)
            ])
        ])
    serverScenario(`${Action.attack} 16 - Can't Attack : Not enough action point`, attackEvent(EntityIds.playerA, EntityIds.playerATower, EntityIds.playerBTower),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase(weaponAttackActionPoints - 1)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(11, 4), ShapeType.tower, true)
            ]),

            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase(weaponAttackActionPoints - 1)),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]], [EntityType.tower, [EntityIds.playerATower]], [EntityType.robot, [EntityIds.playerARobot]]])),
                makePhysical(EntityIds.playerATower, position(2, 1), ShapeType.tower, true),
                makePhysical(EntityIds.playerBTower, position(11, 4), ShapeType.tower, true)
            ]),
            eventsAreSent(TestStep.Then, 'server', [notifyPlayerEvent(EntityIds.playerA, notEnoughActionPointNotificationMessage)])
        ])
})
