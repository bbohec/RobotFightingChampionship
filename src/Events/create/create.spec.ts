
import { makeController } from '../../Components/Controller'
import { dimension, makeDimensional, matchGridDimension, matchOffsetOnGameScreen } from '../../Components/Dimensional'
import { makeEntityReference } from '../../Components/EntityReference'
import { makeHittable } from '../../Components/Hittable'
import { makeOffensive } from '../../Components/Offensive'
import { makePhasing, preparingGamePhase } from '../../Components/Phasing'
import { defaultJoinSimpleMatchButtonPosition, defaultPointerPosition, defeatPosition, mainMenuPosition, makePhysical, playerNextTurnButtonPosition, position, simpleMatchLobbyPosition, victoryPosition } from '../../Components/Physical'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, eventsAreSent, feature, featureEventDescription, serverScenario, theEntityIsCreated, theEntityIsNotOnRepository, theEntityIsOnRepository, thereIsClientComponents, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { drawEvent } from '../draw/draw'
import { registerNextTurnButtonEvent, registerPlayerEvent, registerPlayerPointerEvent, registerRobotEvent, registerSimpleMatchLobbyOnGame, registerTowerEvent } from '../register/register'
import { matchWaitingForPlayers } from '../waiting/waiting'
import { createCellEvent, createDefeatEvent, createGridEvent, createMainMenuEvent, createMatchEvent, createPlayerEvent, createPlayerNextTurnMatchButtonEvent, createPlayerPointerEvent, createPlayerSimpleMatchLobbyButtonEvent, createPlayerSimpleMatchLobbyMenu, createRobotEvent, createServerGameEvent, createSimpleMatchLobbyEvent, createTowerEvent, createVictoryEvent } from './create'

feature(featureEventDescription(Action.create), () => {
    clientScenario(`${Action.create} 1 - Create Player Client`, createPlayerEvent, EntityIds.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityIds.playerA),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityIds.playerA),
            thereIsClientComponents(TestStep.And, EntityIds.playerA, makeEntityReference(EntityIds.playerA, EntityType.player, new Map())),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'client', [registerPlayerEvent(EntityIds.playerA)])
        ],
        [EntityIds.playerA])
    serverScenario(`${Action.create} 2 - Create Main Menu Event`, createMainMenuEvent(EntityIds.game, EntityIds.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map()).save()
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityIds.playerAMainMenu),
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityIds.playerA),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityIds.playerAMainMenu),
            (game, adapters) => theEntityIsCreated(TestStep.And, adapters, EntityIds.playerAMainMenu),
            thereIsClientComponents(TestStep.And, EntityIds.playerAMainMenu, makeEntityReference(EntityIds.playerAMainMenu, EntityType.mainMenu, new Map([[EntityType.player, [EntityIds.playerA]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.playerAMainMenu, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true))])
        ],
        [EntityIds.playerAMainMenu])
    serverScenario(`${Action.create} 3 - Create Game Event`, createServerGameEvent, undefined, [
        ...whenEventOccured(),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityIds.game),
        thereIsClientComponents(TestStep.And, EntityIds.game, makeEntityReference(EntityIds.game, EntityType.game, new Map())),
        (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [createSimpleMatchLobbyEvent(EntityIds.game)])
    ], [EntityIds.game])

    serverScenario(`${Action.create} 4 - Create Simple Match Lobby Event`, createSimpleMatchLobbyEvent(EntityIds.game), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityIds.simpleMatchLobby),
        ...whenEventOccured(),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityIds.simpleMatchLobby),
        thereIsClientComponents(TestStep.And, EntityIds.simpleMatchLobby, makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map())),
        (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [registerSimpleMatchLobbyOnGame(EntityIds.game, EntityIds.simpleMatchLobby)])
    ], [EntityIds.simpleMatchLobby])
    serverScenario(`${Action.create} 5 - Create Robot Event`, createRobotEvent(EntityIds.playerA), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityIds.playerARobot),
        ...whenEventOccured(),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityIds.playerARobot),
        (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [registerRobotEvent(EntityIds.playerARobot, EntityIds.playerA)]),
        thereIsClientComponents(TestStep.And, EntityIds.playerARobot, makeHittable(EntityIds.playerARobot, 50)),
        thereIsClientComponents(TestStep.And, EntityIds.playerARobot, makeOffensive(EntityIds.playerARobot, 20)),
        thereIsClientComponents(TestStep.And, EntityIds.playerARobot, makePhysical(EntityIds.playerARobot, position(0, 0), ShapeType.robot, true))
    ], [EntityIds.playerARobot])
    serverScenario(`${Action.create} 6 - Create Tower Event`, createTowerEvent(EntityIds.playerA), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityIds.playerBTower),
        ...whenEventOccured(),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityIds.playerBTower),
        (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [registerTowerEvent(EntityIds.playerBTower, EntityIds.playerA)]),
        thereIsClientComponents(TestStep.And, EntityIds.playerBTower, makeHittable(EntityIds.playerBTower, 100)),
        thereIsClientComponents(TestStep.And, EntityIds.playerBTower, makeOffensive(EntityIds.playerBTower, 5)),
        thereIsClientComponents(TestStep.And, EntityIds.playerBTower, makePhysical(EntityIds.playerBTower, position(0, 0), ShapeType.tower, true))
    ], [EntityIds.playerBTower])
    serverScenario(`${Action.create} 7 - Create Grid Event`, createGridEvent(EntityIds.match, dimension(3, 2)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match).save()
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityIds.grid),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityIds.grid),
            thereIsClientComponents(TestStep.And, EntityIds.grid, makeDimensional(EntityIds.grid, dimension(3, 2))),
            thereIsClientComponents(TestStep.And, EntityIds.grid, makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.match, [EntityIds.match]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.match, makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.grid, [EntityIds.grid]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                createCellEvent(EntityIds.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen - 1), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen - 1))),
                createCellEvent(EntityIds.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen - 1), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen))),
                createCellEvent(EntityIds.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen - 1))),
                createCellEvent(EntityIds.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen))),
                createCellEvent(EntityIds.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen + 1), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen - 1))),
                createCellEvent(EntityIds.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen + 1), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen)))
            ])
        ], [EntityIds.grid])
    serverScenario(`${Action.create} 8 - Create Match Event`, createMatchEvent(EntityIds.simpleMatchLobby), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityIds.match),
        ...whenEventOccured(),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityIds.match),
        (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
            matchWaitingForPlayers(EntityIds.match, EntityIds.simpleMatchLobby),
            createVictoryEvent(EntityIds.match),
            createDefeatEvent(EntityIds.match)
        ]),
        thereIsClientComponents(TestStep.And, EntityIds.match, makeEntityReference(EntityIds.match, EntityType.match, new Map())),
        thereIsClientComponents(TestStep.And, EntityIds.match, makePhasing(EntityIds.match, preparingGamePhase))

    ], [EntityIds.match])
    serverScenario(`${Action.create} 9 - Create Player Simple Match Lobby Button`, createPlayerSimpleMatchLobbyButtonEvent(EntityIds.simpleMatchLobby, EntityIds.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.mainMenu, [EntityIds.playerAMainMenu]]])).save()
            .buildEntity(EntityIds.playerAMainMenu).withEntityReferences(EntityType.mainMenu, new Map()).save()
            .buildEntity(EntityIds.simpleMatchLobby).withEntityReferences(EntityType.simpleMatchLobby, new Map()).save()
        , [
            thereIsClientComponents(TestStep.And, EntityIds.playerA, makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.mainMenu, [EntityIds.playerAMainMenu]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.simpleMatchLobby, makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map())),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityIds.playerAJoinSimpleMatchButton),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityIds.playerAJoinSimpleMatchButton),
            thereIsClientComponents(TestStep.And, EntityIds.playerAJoinSimpleMatchButton, makeEntityReference(EntityIds.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.simpleMatchLobby, [EntityIds.simpleMatchLobby]], [EntityType.player, [EntityIds.playerA]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.playerA, makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.mainMenu, [EntityIds.playerAMainMenu]], [EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.playerAMainMenu, makeEntityReference(EntityIds.playerAMainMenu, EntityType.mainMenu, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.simpleMatchLobby, makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.playerAJoinSimpleMatchButton, makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true))])
        ], [EntityIds.playerAJoinSimpleMatchButton])
    serverScenario(`${Action.create} 10 - Create Player Next Turn Match Button`, createPlayerNextTurnMatchButtonEvent(EntityIds.match, EntityIds.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map()).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map()).save()
        , [
            thereIsClientComponents(TestStep.And, EntityIds.playerA, makeEntityReference(EntityIds.playerA, EntityType.player, new Map())),
            thereIsClientComponents(TestStep.And, EntityIds.match, makeEntityReference(EntityIds.match, EntityType.match, new Map())),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityIds.playerANextTurnButton),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityIds.playerANextTurnButton),
            thereIsClientComponents(TestStep.And, EntityIds.playerANextTurnButton, makePhysical(EntityIds.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
            thereIsClientComponents(TestStep.And, EntityIds.playerANextTurnButton, makeEntityReference(EntityIds.playerANextTurnButton, EntityType.nextTurnButton, new Map())),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                registerNextTurnButtonEvent(EntityIds.playerA, EntityIds.match, EntityIds.playerANextTurnButton)
            ])
        ], [EntityIds.playerANextTurnButton])
    serverScenario(`${Action.create} 11 - Create Pointer Event`, createPlayerPointerEvent(EntityIds.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityIds.playerAPointer),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityIds.playerAPointer),
            thereIsClientComponents(TestStep.And, EntityIds.playerA, makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.pointer, [EntityIds.playerAPointer]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.playerAPointer, makeEntityReference(EntityIds.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityIds.playerA]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.playerAPointer, makePhysical(EntityIds.playerAPointer, defaultPointerPosition, ShapeType.pointer, true)),
            thereIsClientComponents(TestStep.And, EntityIds.playerAPointer, makeController(EntityIds.playerAPointer, ControlStatus.Idle)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [registerPlayerPointerEvent(EntityIds.playerAPointer, EntityIds.playerA)])
        ], [EntityIds.playerAPointer])
    serverScenario(`${Action.create} 12 - Create Simple Match Lobby Menu`, createPlayerSimpleMatchLobbyMenu(EntityIds.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.mainMenu, [EntityIds.playerAMainMenu]], [EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])).save()
            .buildEntity(EntityIds.playerAMainMenu).withEntityReferences(EntityType.mainMenu, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(EntityIds.playerAJoinSimpleMatchButton).withEntityReferences(EntityType.button).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityIds.playerASimpleMatchLobbyMenu),
            thereIsClientComponents(TestStep.And, EntityIds.playerA, makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.mainMenu, [EntityIds.playerAMainMenu]], [EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.simpleMatchLobbyMenu, [EntityIds.playerASimpleMatchLobbyMenu]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.playerASimpleMatchLobbyMenu, makeEntityReference(EntityIds.playerASimpleMatchLobbyMenu, EntityType.simpleMatchLobbyMenu, new Map([[EntityType.player, [EntityIds.playerA]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.playerASimpleMatchLobbyMenu, makePhysical(EntityIds.playerASimpleMatchLobbyMenu, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyMenu, true)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerASimpleMatchLobbyMenu, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyMenu, true)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false))
            ])
        ], [EntityIds.playerASimpleMatchLobbyMenu])
    serverScenario(`${Action.create} 13 - Create Cell`, createCellEvent(EntityIds.grid, position(1, 1)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityIds.match]]])).save()
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityIds.cellx1y1),
            thereIsClientComponents(TestStep.And, EntityIds.cellx1y1, makePhysical(EntityIds.cellx1y1, position(1, 1), ShapeType.cell, true)),
            thereIsClientComponents(TestStep.And, EntityIds.cellx1y1, makeEntityReference(EntityIds.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityIds.grid]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.grid, makeEntityReference(EntityIds.grid, EntityType.grid, new Map([[EntityType.cell, [EntityIds.cellx1y1]], [EntityType.match, [EntityIds.match]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.cellx1y1, position(1, 1), ShapeType.cell, true)),
                drawEvent(EntityIds.playerB, makePhysical(EntityIds.cellx1y1, position(1, 1), ShapeType.cell, true))
            ])
        ], [EntityIds.cellx1y1])
    serverScenario(`${Action.create} 14 - Create Victory`, createVictoryEvent(EntityIds.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityIds.victory),
            thereIsClientComponents(TestStep.And, EntityIds.victory, makePhysical(EntityIds.victory, victoryPosition, ShapeType.victory, false)),
            thereIsClientComponents(TestStep.And, EntityIds.victory, makeEntityReference(EntityIds.victory, EntityType.victory, new Map([[EntityType.match, [EntityIds.match]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.match, makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.victory, [EntityIds.victory]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [])
        ], [EntityIds.victory])
    serverScenario(`${Action.create} 15 - Create Defeat`, createDefeatEvent(EntityIds.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityIds.defeat),
            thereIsClientComponents(TestStep.And, EntityIds.defeat, makePhysical(EntityIds.defeat, defeatPosition, ShapeType.defeat, false)),
            thereIsClientComponents(TestStep.And, EntityIds.defeat, makeEntityReference(EntityIds.defeat, EntityType.defeat, new Map([[EntityType.match, [EntityIds.match]]]))),
            thereIsClientComponents(TestStep.And, EntityIds.match, makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.defeat, [EntityIds.defeat]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [])
        ], [EntityIds.defeat])
})
