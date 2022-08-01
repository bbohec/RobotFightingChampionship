import { EntityIds } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { clientScenario, serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsClientComponents, thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { makeController } from '../../ecs/components/Controller'
import { ControlStatus } from '../../type/ControlStatus'
import { dimension, makeDimensional, matchGridDimension, matchOffsetOnGameScreen } from '../../ecs/components/Dimensional'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { makeHittable } from '../../ecs/components/Hittable'
import { makeLifeCycle } from '../../ecs/components/LifeCycle'
import { makeOffensive } from '../../ecs/components/Offensive'
import { makePhasing, preparingGamePhase } from '../../ecs/components/Phasing'
import { makePhysical, mainMenuPosition, position, defaultJoinSimpleMatchButtonPosition, playerNextTurnButtonPosition, defaultPointerPosition, simpleMatchLobbyPosition, victoryPosition, defeatPosition } from '../../ecs/components/Physical'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { drawEvent } from '../draw/draw'
import { registerPlayerEvent, registerSimpleMatchLobbyOnGame, registerRobotEvent, registerTowerEvent, registerNextTurnButtonEvent, registerPlayerPointerEvent } from '../register/register'
import { matchWaitingForPlayers } from '../waiting/waiting'
import { createPlayerEvent, createMainMenuEvent, createServerGameEvent, createSimpleMatchLobbyEvent, createRobotEvent, createTowerEvent, createGridEvent, createCellEvent, createMatchEvent, createVictoryEvent, createDefeatEvent, createPlayerSimpleMatchLobbyButtonEvent, createPlayerNextTurnMatchButtonEvent, createPlayerPointerEvent, createPlayerSimpleMatchLobbyMenu } from './create'

feature(Action.create, () => {
    clientScenario(`${Action.create} 1 - Create Player Client`, createPlayerEvent, EntityIds.playerA,
        [
            thereIsClientComponents(TestStep.Given, []),
            ...whenEventOccured(),
            thereIsClientComponents(TestStep.Then, [
                makeLifeCycle(EntityIds.playerA),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map())
            ]),
            eventsAreSent(TestStep.AndThen, 'client', [registerPlayerEvent(EntityIds.playerA)])
        ],
        [EntityIds.playerA])
    serverScenario(`${Action.create} 2 - Create Main Menu Event`, createMainMenuEvent(EntityIds.game, EntityIds.playerA),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeLifeCycle(EntityIds.playerAMainMenu),
                makeEntityReference(EntityIds.playerAMainMenu, EntityType.mainMenu, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true))])
        ],
        [EntityIds.playerAMainMenu])
    serverScenario(`${Action.create} 3 - Create Game Event`, createServerGameEvent, [], [
        thereIsServerComponents(TestStep.Given, []),
        ...whenEventOccured(),
        thereIsServerComponents(TestStep.Then, [
            makeLifeCycle(EntityIds.game),
            makeEntityReference(EntityIds.game, EntityType.game, new Map())
        ]),
        eventsAreSent(TestStep.AndThen, 'server', [createSimpleMatchLobbyEvent(EntityIds.game)])
    ], [EntityIds.game])

    serverScenario(`${Action.create} 4 - Create Simple Match Lobby Event`, createSimpleMatchLobbyEvent(EntityIds.game), [], [
        thereIsServerComponents(TestStep.Given, []),
        ...whenEventOccured(),
        thereIsServerComponents(TestStep.Then, [
            makeLifeCycle(EntityIds.simpleMatchLobby),
            makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map())
        ]),
        eventsAreSent(TestStep.AndThen, 'server', [registerSimpleMatchLobbyOnGame(EntityIds.game, EntityIds.simpleMatchLobby)])
    ], [EntityIds.simpleMatchLobby])
    serverScenario(`${Action.create} 5 - Create Robot Event`, createRobotEvent(EntityIds.playerA), [], [
        thereIsServerComponents(TestStep.Given, []),
        ...whenEventOccured(),
        eventsAreSent(TestStep.Then, 'server', [registerRobotEvent(EntityIds.playerARobot, EntityIds.playerA)]),
        thereIsServerComponents(TestStep.AndThen, [
            makeLifeCycle(EntityIds.playerARobot),
            makeHittable(EntityIds.playerARobot, 50),
            makeOffensive(EntityIds.playerARobot, 20),
            makeEntityReference(EntityIds.playerARobot, EntityType.robot, new Map([[EntityType.player, [EntityIds.playerA]]])),
            makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, true)
        ])
    ], [EntityIds.playerARobot])
    serverScenario(`${Action.create} 6 - Create Tower Event`, createTowerEvent(EntityIds.playerA), [], [
        thereIsServerComponents(TestStep.Given, []),
        ...whenEventOccured(),
        eventsAreSent(TestStep.Then, 'server', [registerTowerEvent(EntityIds.playerBTower, EntityIds.playerA)]),
        thereIsServerComponents(TestStep.AndThen, [
            makeLifeCycle(EntityIds.playerBTower),
            makeHittable(EntityIds.playerBTower, 100),
            makeOffensive(EntityIds.playerBTower, 5),
            makeEntityReference(EntityIds.playerBTower, EntityType.tower, new Map([[EntityType.player, [EntityIds.playerA]]])),
            makePhysical(EntityIds.playerBTower, position(0, 0), ShapeType.tower, true)
        ])
    ], [EntityIds.playerBTower])
    serverScenario(`${Action.create} 7 - Create Grid Event`, createGridEvent(EntityIds.match, dimension(3, 2)),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.grid, [EntityIds.grid]]])),
                makeLifeCycle(EntityIds.grid),
                makeDimensional(EntityIds.grid, dimension(3, 2)),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [
                createCellEvent(EntityIds.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen - 1), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen - 1))),
                createCellEvent(EntityIds.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen - 1), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen))),
                createCellEvent(EntityIds.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen - 1))),
                createCellEvent(EntityIds.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen))),
                createCellEvent(EntityIds.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen + 1), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen - 1))),
                createCellEvent(EntityIds.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen + 1), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen)))
            ])
        ], [EntityIds.grid])
    serverScenario(`${Action.create} 8 - Create Match Event`, createMatchEvent(EntityIds.simpleMatchLobby), [], [
        thereIsServerComponents(TestStep.Given, []),
        ...whenEventOccured(),
        eventsAreSent(TestStep.Given, 'server', [
            matchWaitingForPlayers(EntityIds.match, EntityIds.simpleMatchLobby),
            createVictoryEvent(EntityIds.match),
            createDefeatEvent(EntityIds.match)
        ]),
        thereIsServerComponents(TestStep.Then, [
            makeLifeCycle(EntityIds.match),
            makeEntityReference(EntityIds.match, EntityType.match, new Map()),
            makePhasing(EntityIds.match, preparingGamePhase)
        ])

    ], [EntityIds.match])
    serverScenario(`${Action.create} 9 - Create Player Simple Match Lobby Button`, createPlayerSimpleMatchLobbyButtonEvent(EntityIds.simpleMatchLobby, EntityIds.playerA),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeEntityReference(EntityIds.playerAMainMenu, EntityType.mainMenu),
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.mainMenu, [EntityIds.playerAMainMenu]], [EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])),
                makeEntityReference(EntityIds.playerAMainMenu, EntityType.mainMenu, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])),
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])),
                makeLifeCycle(EntityIds.playerAJoinSimpleMatchButton),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]], [EntityType.player, [EntityIds.playerA]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true))])
        ], [EntityIds.playerAJoinSimpleMatchButton])
    serverScenario(`${Action.create} 10 - Create Player Next Turn Match Button`, createPlayerNextTurnMatchButtonEvent(EntityIds.match, EntityIds.playerA),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map())
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map()),
                makeEntityReference(EntityIds.match, EntityType.match, new Map()),
                makeLifeCycle(EntityIds.playerANextTurnButton),
                makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map()),
                makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [
                registerNextTurnButtonEvent(EntityIds.playerA, EntityIds.match, EntityIds.playerANextTurnButton)
            ])
        ], [EntityIds.playerANextTurnButton])
    serverScenario(`${Action.create} 11 - Create Pointer Event`, createPlayerPointerEvent(EntityIds.playerA),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.pointer, [EntityIds.playerAPointer]]])),
                makeLifeCycle(EntityIds.playerAPointer),
                makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.playerAPointer, defaultPointerPosition, ShapeType.pointer, true),
                makeController(EntityIds.playerAPointer, ControlStatus.Idle)
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [registerPlayerPointerEvent(EntityIds.playerAPointer, EntityIds.playerA)])
        ], [EntityIds.playerAPointer])
    serverScenario(`${Action.create} 12 - Create Simple Match Lobby Menu`, createPlayerSimpleMatchLobbyMenu(EntityIds.playerA),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.mainMenu, [EntityIds.playerAMainMenu]], [EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])),
                makeEntityReference(EntityIds.playerAMainMenu, EntityType.mainMenu, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])),
                makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button),
                makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.mainMenu, [EntityIds.playerAMainMenu]], [EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]])),
                makeEntityReference(EntityIds.playerAMainMenu, EntityType.mainMenu, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])),
                makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true),
                makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button),
                makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true),
                makeLifeCycle(EntityIds.playerASimpleMatchLobbyMenu),
                makeEntityReference(EntityIds.playerASimpleMatchLobbyMenu, EntityType.simpleMatchLobbyMenu, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makePhysical(EntityIds.playerASimpleMatchLobbyMenu, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyMenu, true)
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerASimpleMatchLobbyMenu, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyMenu, true)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false))
            ])
        ], [EntityIds.playerASimpleMatchLobbyMenu])
    serverScenario(`${Action.create} 13 - Create Cell`, createCellEvent(EntityIds.grid, position(1, 1)),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx1y1]], [EntityType.match, [EntityIds.match]]])),
                makeLifeCycle(EntityIds.cellx1y1),
                makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]])),
                makePhysical(EntityIds.cellx1y1, position(1, 1), ShapeType.cell, true)
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.cellx1y1, position(1, 1), ShapeType.cell, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.cellx1y1, position(1, 1), ShapeType.cell, true))
            ])
        ], [EntityIds.cellx1y1])
    serverScenario(`${Action.create} 14 - Create Victory`, createVictoryEvent(EntityIds.match),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.victory, [EntityIds.victory]]])),
                makeLifeCycle(EntityIds.victory),
                makePhysical(EntityIds.victory, victoryPosition, ShapeType.victory, false),
                makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [])
        ], [EntityIds.victory])
    serverScenario(`${Action.create} 15 - Create Defeat`, createDefeatEvent(EntityIds.match),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.defeat, [EntityIds.defeat]]])),
                makeLifeCycle(EntityIds.defeat),
                makePhysical(EntityIds.defeat, defeatPosition, ShapeType.defeat, false),
                makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            eventsAreSent(TestStep.AndThen, 'server', [])
        ], [EntityIds.defeat])
})
