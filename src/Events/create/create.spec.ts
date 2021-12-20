
import { Action } from '../../Event/Action'
import { theEntityIsNotOnRepository, theEntityIsCreated, eventsAreSent, theEntityWithIdHasTheExpectedComponent, featureEventDescription, theEntityIsOnRepository, serverScenario, feature, clientScenario, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { EntityReference } from '../../Components/EntityReference'
import { createPlayerEvent, createSimpleMatchLobbyEvent, createRobotEvent, createTowerEvent, createMainMenuEvent, createGridEvent, createMatchEvent, createServerGameEvent, createPlayerSimpleMatchLobbyButtonEvent, createPlayerNextTurnMatchButtonEvent, createPlayerPointerEvent, createPlayerSimpleMatchLobbyMenu, createCellEvent, createVictoryEvent, createDefeatEvent } from './create'
import { registerNextTurnButtonEvent, registerPlayerEvent, registerPlayerPointerEvent, registerRobotEvent, registerSimpleMatchLobbyOnGame, registerTowerEvent } from '../register/register'
import { Dimensional } from '../../Components/Dimensional'
import { EntityType } from '../../Event/EntityType'
import { Hittable } from '../../Components/Hittable'
import { Offensive } from '../../Components/Offensive'
import { matchWaitingForPlayers } from '../waiting/waiting'
import { Phasing, preparingGamePhase } from '../../Components/Phasing'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId } from '../../Event/entityIds'
import { defaultJoinSimpleMatchButtonPosition, defaultPointerPosition, defeatPosition, mainMenuPosition, Physical, playerNextTurnButtonPosition, position, simpleMatchLobbyPosition, victoryPosition } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { Controller } from '../../Components/Controller'
import { ControlStatus } from '../../Components/port/ControlStatus'
import { drawEvent } from '../draw/draw'
import { dimension, matchGridDimension, matchOffsetOnGameScreen } from '../../Components/port/Dimension'

feature(featureEventDescription(Action.create), () => {
    clientScenario(`${Action.create} 1 - Create Player Client`, createPlayerEvent, EntityId.playerA,
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerA),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.playerA),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map())),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'client', [registerPlayerEvent(EntityId.playerA)])
        ],
        [EntityId.playerA])
    serverScenario(`${Action.create} 2 - Create Main Menu Event`, createMainMenuEvent(EntityId.game, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map()).save()
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerAMainMenu),
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.playerA),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.playerAMainMenu),
            (game, adapters) => theEntityIsCreated(TestStep.And, adapters, EntityId.playerAMainMenu),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAMainMenu, EntityReference, new EntityReference(EntityId.playerAMainMenu, EntityType.mainMenu, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAMainMenu, Physical, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [drawEvent(EntityId.playerA, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true))])
        ],
        [EntityId.playerAMainMenu])
    serverScenario(`${Action.create} 3 - Create Game Event`, createServerGameEvent, undefined, [
        ...whenEventOccured(),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.game),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.game, EntityReference, new EntityReference(EntityId.game, EntityType.game, new Map())),
        (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [createSimpleMatchLobbyEvent(EntityId.game)])
    ], [EntityId.game])

    serverScenario(`${Action.create} 4 - Create Simple Match Lobby Event`, createSimpleMatchLobbyEvent(EntityId.game), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.simpleMatchLobby),
        ...whenEventOccured(),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.simpleMatchLobby),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, EntityReference, new EntityReference(EntityId.simpleMatchLobby, EntityType.simpleMatchLobby, new Map())),
        (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [registerSimpleMatchLobbyOnGame(EntityId.game, EntityId.simpleMatchLobby)])
    ], [EntityId.simpleMatchLobby])
    serverScenario(`${Action.create} 5 - Create Robot Event`, createRobotEvent(EntityId.playerA), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerARobot),
        ...whenEventOccured(),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.playerARobot),
        (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [registerRobotEvent(EntityId.playerARobot, EntityId.playerA)]),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Hittable, new Hittable(EntityId.playerARobot, 50)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Offensive, new Offensive(EntityId.playerARobot, 20)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerARobot, Physical, new Physical(EntityId.playerARobot, position(0, 0), ShapeType.robot, true))
    ], [EntityId.playerARobot])
    serverScenario(`${Action.create} 6 - Create Tower Event`, createTowerEvent(EntityId.playerA), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerBTower),
        ...whenEventOccured(),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.playerBTower),
        (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [registerTowerEvent(EntityId.playerBTower, EntityId.playerA)]),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Hittable, new Hittable(EntityId.playerBTower, 100)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Offensive, new Offensive(EntityId.playerBTower, 5)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerBTower, Physical, new Physical(EntityId.playerBTower, position(0, 0), ShapeType.tower, true))
    ], [EntityId.playerBTower])
    serverScenario(`${Action.create} 7 - Create Grid Event`, createGridEvent(EntityId.match, dimension(3, 2)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match).save()
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.grid),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.grid),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, Dimensional, new Dimensional(EntityId.grid, dimension(3, 2))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, EntityReference, new EntityReference(EntityId.grid, EntityType.grid, new Map([[EntityType.match, [EntityId.match]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                createCellEvent(EntityId.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen - 1), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen - 1))),
                createCellEvent(EntityId.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen - 1), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen))),
                createCellEvent(EntityId.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen - 1))),
                createCellEvent(EntityId.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen))),
                createCellEvent(EntityId.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen + 1), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen - 1))),
                createCellEvent(EntityId.grid, position(Math.floor(matchGridDimension.x / 2 + matchOffsetOnGameScreen + 1), Math.floor(matchGridDimension.y / 2 + matchOffsetOnGameScreen)))
            ])
        ], [EntityId.grid])
    serverScenario(`${Action.create} 8 - Create Match Event`, createMatchEvent(EntityId.simpleMatchLobby), undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.match),
        ...whenEventOccured(),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.match),
        (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
            matchWaitingForPlayers(EntityId.match, EntityId.simpleMatchLobby),
            createVictoryEvent(EntityId.match),
            createDefeatEvent(EntityId.match)
        ]),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map())),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Phasing, new Phasing(EntityId.match, preparingGamePhase))

    ], [EntityId.match])
    serverScenario(`${Action.create} 9 - Create Player Simple Match Lobby Button`, createPlayerSimpleMatchLobbyButtonEvent(EntityId.simpleMatchLobby, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.mainMenu, [EntityId.playerAMainMenu]]])).save()
            .buildEntity(EntityId.playerAMainMenu).withEntityReferences(EntityType.mainMenu, new Map()).save()
            .buildEntity(EntityId.simpleMatchLobby).withEntityReferences(EntityType.simpleMatchLobby, new Map()).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.mainMenu, [EntityId.playerAMainMenu]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, EntityReference, new EntityReference(EntityId.simpleMatchLobby, EntityType.simpleMatchLobby, new Map())),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerAJoinSimpleMatchButton),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.playerAJoinSimpleMatchButton),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAJoinSimpleMatchButton, EntityReference, new EntityReference(EntityId.playerAJoinSimpleMatchButton, EntityType.button, new Map([[EntityType.simpleMatchLobby, [EntityId.simpleMatchLobby]], [EntityType.player, [EntityId.playerA]], [EntityType.mainMenu, [EntityId.playerAMainMenu]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.mainMenu, [EntityId.playerAMainMenu]], [EntityType.button, [EntityId.playerAJoinSimpleMatchButton]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAMainMenu, EntityReference, new EntityReference(EntityId.playerAMainMenu, EntityType.mainMenu, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, EntityReference, new EntityReference(EntityId.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAJoinSimpleMatchButton, Physical, new Physical(EntityId.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [drawEvent(EntityId.playerA, new Physical(EntityId.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true))])
        ], [EntityId.playerAJoinSimpleMatchButton])
    serverScenario(`${Action.create} 10 - Create Player Next Turn Match Button`, createPlayerNextTurnMatchButtonEvent(EntityId.match, EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map()).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map()).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map())),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map())),
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerANextTurnButton),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, EntityId.playerANextTurnButton),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, Physical, new Physical(EntityId.playerANextTurnButton, playerNextTurnButtonPosition, ShapeType.nextTurnButton, false)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerANextTurnButton, EntityReference, new EntityReference(EntityId.playerANextTurnButton, EntityType.nextTurnButton, new Map())),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                registerNextTurnButtonEvent(EntityId.playerA, EntityId.match, EntityId.playerANextTurnButton)
            ])
        ], [EntityId.playerANextTurnButton])
    serverScenario(`${Action.create} 11 - Create Pointer Event`, createPlayerPointerEvent(EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, EntityId.playerAPointer),
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.playerAPointer),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.pointer, [EntityId.playerAPointer]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, EntityReference, new EntityReference(EntityId.playerAPointer, EntityType.pointer, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Physical, new Physical(EntityId.playerAPointer, defaultPointerPosition, ShapeType.pointer, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerAPointer, Controller, new Controller(EntityId.playerAPointer, ControlStatus.Idle)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [registerPlayerPointerEvent(EntityId.playerAPointer, EntityId.playerA)])
        ], [EntityId.playerAPointer])
    serverScenario(`${Action.create} 12 - Create Simple Match Lobby Menu`, createPlayerSimpleMatchLobbyMenu(EntityId.playerA),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.mainMenu, [EntityId.playerAMainMenu]], [EntityType.button, [EntityId.playerAJoinSimpleMatchButton]]])).save()
            .buildEntity(EntityId.playerAMainMenu).withEntityReferences(EntityType.mainMenu, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]]])).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(EntityId.playerAJoinSimpleMatchButton).withEntityReferences(EntityType.button).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.playerASimpleMatchLobbyMenu),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.mainMenu, [EntityId.playerAMainMenu]], [EntityType.button, [EntityId.playerAJoinSimpleMatchButton]], [EntityType.simpleMatchLobbyMenu, [EntityId.playerASimpleMatchLobbyMenu]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerASimpleMatchLobbyMenu, EntityReference, new EntityReference(EntityId.playerASimpleMatchLobbyMenu, EntityType.simpleMatchLobbyMenu, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerASimpleMatchLobbyMenu, Physical, new Physical(EntityId.playerASimpleMatchLobbyMenu, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyMenu, true)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityId.playerA, new Physical(EntityId.playerASimpleMatchLobbyMenu, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyMenu, true)),
                drawEvent(EntityId.playerA, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityId.playerA, new Physical(EntityId.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false))
            ])
        ], [EntityId.playerASimpleMatchLobbyMenu])
    serverScenario(`${Action.create} 13 - Create Cell`, createCellEvent(EntityId.grid, position(1, 1)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.grid).withEntityReferences(EntityType.grid, new Map([[EntityType.match, [EntityId.match]]])).save()
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]]])).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.cellx1y1),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y1, Physical, new Physical(EntityId.cellx1y1, position(1, 1), ShapeType.cell, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.cellx1y1, EntityReference, new EntityReference(EntityId.cellx1y1, EntityType.cell, new Map([[EntityType.grid, [EntityId.grid]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.grid, EntityReference, new EntityReference(EntityId.grid, EntityType.grid, new Map([[EntityType.cell, [EntityId.cellx1y1]], [EntityType.match, [EntityId.match]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityId.playerA, new Physical(EntityId.cellx1y1, position(1, 1), ShapeType.cell, true)),
                drawEvent(EntityId.playerB, new Physical(EntityId.cellx1y1, position(1, 1), ShapeType.cell, true))
            ])
        ], [EntityId.cellx1y1])
    serverScenario(`${Action.create} 14 - Create Victory`, createVictoryEvent(EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.victory),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.victory, Physical, new Physical(EntityId.victory, victoryPosition, ShapeType.victory, false)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.victory, EntityReference, new EntityReference(EntityId.victory, EntityType.victory, new Map([[EntityType.match, [EntityId.match]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.victory, [EntityId.victory]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [])
        ], [EntityId.victory])
    serverScenario(`${Action.create} 15 - Create Defeat`, createDefeatEvent(EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match).save()
        , [
            ...whenEventOccured(),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, EntityId.defeat),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.defeat, Physical, new Physical(EntityId.defeat, defeatPosition, ShapeType.defeat, false)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.defeat, EntityReference, new EntityReference(EntityId.defeat, EntityType.defeat, new Map([[EntityType.match, [EntityId.match]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.defeat, [EntityId.defeat]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [])
        ], [EntityId.defeat])
})
