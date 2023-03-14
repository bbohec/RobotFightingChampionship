import { missingEntityId } from '../../../infra/entity/InMemoryEntityRepository'
import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { makeController } from '../../ecs/components/Controller'
import { ControlStatus } from '../../type/ControlStatus'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { playerATowerPhase, makePhasing, playerARobotPhase, victoryPhase } from '../../ecs/components/Phasing'
import { makePhysical, position } from '../../ecs/components/Physical'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { attackEvent } from '../attack/attack'
import { joinSimpleMatchLobby } from '../join/join'
import { moveEvent } from '../move/move'
import { nextTurnEvent } from '../nextTurn/nextTurn'
import { notifyServerEvent } from '../notifyServer/notifyServer'
import { quitMatchEvent } from '../quit/quit'
import { collisionGameEvent } from './collision'

feature(Action.collision, () => {
    serverScenario(`${Action.collision} 1 - Collision with player activated pointer &  player join simple match button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.playerAJoinSimpleMatchButton]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ]),
            ...whenEventOccured(),
            eventsAreSent(TestStep.Then, 'server', [joinSimpleMatchLobby(EntityIds.playerA, EntityIds.playerAMainMenu, EntityIds.simpleMatchLobby)]),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ])
        ])
    serverScenario(`${Action.collision} 2 - Collision with player idle pointer &  player join simple match button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.playerAJoinSimpleMatchButton]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ])
        ])
    serverScenario(`${Action.collision} 3 - Collision with player pointer &  player end turn button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.playerANextTurnButton]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.match, [EntityIds.match]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, playerATowerPhase()),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.match, [EntityIds.match]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [nextTurnEvent(EntityIds.match)])
        ])
    serverScenario(`${Action.collision} 4 - Collision with player pointer &  match cell`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [moveEvent(EntityIds.playerA, EntityType.robot, EntityIds.playerARobot, EntityIds.cellx1y1)])
        ])
    serverScenario(`${Action.collision} 5 - Collision with player pointer &  match cell & Tower`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1, EntityIds.playerBTower]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [attackEvent(EntityIds.playerA, EntityIds.playerARobot, EntityIds.playerBTower)])
        ])
    serverScenario(`${Action.collision} 6 - Collision with player pointer &  match cell & Robot`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1, EntityIds.playerBRobot]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [attackEvent(EntityIds.playerA, EntityIds.playerARobot, EntityIds.playerBRobot)])
        ])
    serverScenario(`${Action.collision} 7 - Collision with 2 player activated pointer &  2 player join simple match button`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.playerAJoinSimpleMatchButton, EntityIds.playerBPointer, EntityIds.playerBJoinSimpleMatchButton]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.button, [EntityIds.playerBJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerBPointer]], [EntityType.mainMenu, [EntityIds.playerBMainMenu]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerBPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeController(EntityIds.playerBPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])),
                makeEntityReference(EntityIds.playerBJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerB]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerAPointer]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.button, [EntityIds.playerBJoinSimpleMatchButton]], [EntityType.pointer, [EntityIds.playerBPointer]], [EntityType.mainMenu, [EntityIds.playerBMainMenu]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerBPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeController(EntityIds.playerBPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]])),
                makeEntityReference(EntityIds.playerBJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.player, [EntityIds.playerB]], [EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [
                joinSimpleMatchLobby(EntityIds.playerA, EntityIds.playerAMainMenu, EntityIds.simpleMatchLobby),
                joinSimpleMatchLobby(EntityIds.playerB, EntityIds.playerBMainMenu, EntityIds.simpleMatchLobby)
            ])
        ])
    serverScenario(`${Action.collision} 8 - Collision with player activated pointer and visible defeat`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.defeat]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.defeat, position(0, 0), ShapeType.defeat, true),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.defeat, position(0, 0), ShapeType.defeat, true),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle)
            ]),
            eventsAreSent(TestStep.Then, 'server', [
                quitMatchEvent(EntityIds.match, EntityIds.playerA)
            ])
        ])
    serverScenario(`${Action.collision} 9 - Collision with player activated pointer and invisible defeat`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.defeat]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.defeat, position(0, 0), ShapeType.defeat, false),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.defeat, position(0, 0), ShapeType.defeat, false),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle)
            ]),
            eventsAreSent(TestStep.Then, 'server', [])
        ])
    serverScenario(`${Action.collision} 10 - Collision with player activated pointer and visible victory`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerBPointer, EntityIds.victory]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerB]]])),
                makePhysical(EntityIds.victory, position(0, 0), ShapeType.victory, true),
                makeEntityReference(EntityIds.playerBPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeController(EntityIds.playerBPointer, ControlStatus.Active)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerB]]])),
                makePhysical(EntityIds.victory, position(0, 0), ShapeType.victory, true),
                makeEntityReference(EntityIds.playerBPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeController(EntityIds.playerBPointer, ControlStatus.Idle)
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [
                quitMatchEvent(EntityIds.match, EntityIds.playerB)
            ])
        ])
    serverScenario(`${Action.collision} 11 - Collision with player activated pointer and invisible victory`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerBPointer, EntityIds.victory]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerB]]])),
                makePhysical(EntityIds.victory, position(0, 0), ShapeType.victory, false),
                makeEntityReference(EntityIds.playerBPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeController(EntityIds.playerBPointer, ControlStatus.Active)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerB]]])),
                makePhysical(EntityIds.victory, position(0, 0), ShapeType.victory, false),
                makeEntityReference(EntityIds.playerBPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeController(EntityIds.playerBPointer, ControlStatus.Idle)
            ]),
            eventsAreSent(TestStep.Then, 'server', [])
        ])
    serverScenario(`${Action.collision} 12 - Collision with player pointer &  match cell & Robot on victory phase`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1, EntityIds.playerBRobot]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBRobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [])
        ])
    serverScenario(`${Action.collision} 13 - Collision with player pointer &  match cell & Tower on victory phase`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1, EntityIds.playerBTower]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map()),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map()),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [])
        ])
    serverScenario(`${Action.collision} 14 - Collision with player pointer &  player end turn button on victory phase`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.playerANextTurnButton]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.match, [EntityIds.match]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.match, [EntityIds.match]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [])
        ])
    serverScenario(`${Action.collision} 15 - Collision with player pointer &  match cell on victory phase`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, victoryPhase(EntityIds.playerA)),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [])
        ])
    serverScenario(`${Action.collision} 16 - Collision with victory player activated pointer and visible victory & defeat`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerBPointer, EntityIds.victory, EntityIds.defeat]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerBPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeController(EntityIds.playerBPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.defeat, position(0, 0), ShapeType.defeat, true),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerB]]])),
                makePhysical(EntityIds.victory, position(0, 0), ShapeType.victory, true),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerBPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeController(EntityIds.playerBPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.defeat, position(0, 0), ShapeType.defeat, true),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerB]]])),
                makePhysical(EntityIds.victory, position(0, 0), ShapeType.victory, true),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerB]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [quitMatchEvent(EntityIds.match, EntityIds.playerB)])
        ])
    serverScenario(`${Action.collision} 17 - Collision with defeat player activated pointer and visible victory & defeat`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.victory, EntityIds.defeat]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.defeat, position(0, 0), ShapeType.defeat, true),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerB]]])),
                makePhysical(EntityIds.victory, position(0, 0), ShapeType.victory, true),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.defeat, position(0, 0), ShapeType.defeat, true),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.match, [EntityIds.match]], [EntityType.player, [EntityIds.playerB]]])),
                makePhysical(EntityIds.victory, position(0, 0), ShapeType.victory, true),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [quitMatchEvent(EntityIds.match, EntityIds.playerA)])
        ])
    serverScenario(`${Action.collision} 18 - Do nothing on collision with destroyed entities`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.cellx0y0, EntityIds.playerATower]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.cellx0y0, EntityType.cell)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.cellx0y0, EntityType.cell)
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [notifyServerEvent(missingEntityId(EntityIds.playerATower))])
        ])
    serverScenario(`${Action.collision} 19 - Collision with player pointer &  match cell & Tower & Other Match Tower`, collisionGameEvent(new Map([[EntityType.unknown, [EntityIds.playerAPointer, EntityIds.cellx1y1, EntityIds.playerBTower, EntityIds.playerCTower]]])),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Active),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerCTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerC]]])),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))

            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle),
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]], [EntityType.grid, [EntityIds.grid]]])),
                makePhasing(EntityIds.match, playerARobotPhase()),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]], [EntityType.cell, [EntityIds.cellx1y1]]])),
                makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map()),
                makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerCTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerC]]])),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))

            ]),
            eventsAreSent(TestStep.Then, 'server', [attackEvent(EntityIds.playerA, EntityIds.playerARobot, EntityIds.playerBTower)])
        ])
})
