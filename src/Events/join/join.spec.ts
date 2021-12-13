
import { createGridEvent, createMatchEvent, createPlayerNextTurnMatchButtonEvent, createPlayerSimpleMatchLobbyMenu, createRobotEvent, createTowerEvent } from '../create/create'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, serverScenario, theEntityIsCreated, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, eventsAreSent, whenEventOccured, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { playerJoinMatchEvent, playerWantJoinSimpleMatchLobby } from './join'
import { EntityReference } from '../../Components/EntityReference'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId, mainMenus, players, simpleMatchButtons } from '../../Event/entityIds'
import { defaultJoinSimpleMatchButtonPosition, mainMenuPosition, Physical, simpleMatchLobbyPosition } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { drawEvent } from '../show/draw'
import { matchGridDimension } from '../../Components/port/Dimension'

feature(featureEventDescription(Action.join), () => {
    serverScenario(`${Action.join} 1`, playerJoinMatchEvent(EntityId.playerA, EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map())),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]]))),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.match, [EntityId.match]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [])
        ])
    serverScenario(`${Action.join} 2`, playerJoinMatchEvent(EntityId.playerB, EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]])).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA]]]))),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, EntityReference, new EntityReference(EntityId.match, EntityType.match, new Map([[EntityType.player, [EntityId.playerA, EntityId.playerB]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                createGridEvent(EntityId.match, matchGridDimension),
                createTowerEvent(EntityId.playerA),
                createTowerEvent(EntityId.playerB),
                createRobotEvent(EntityId.playerA),
                createRobotEvent(EntityId.playerB),
                createPlayerNextTurnMatchButtonEvent(EntityId.match, EntityId.playerA),
                createPlayerNextTurnMatchButtonEvent(EntityId.match, EntityId.playerB)
            ])
        ])
    serverScenario(`${Action.join} 3`, playerWantJoinSimpleMatchLobby(EntityId.playerA, EntityId.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.simpleMatchLobby).withLifeCycle(true).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]]])).withPhysicalComponent(simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(EntityId.playerAMainMenu).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(EntityId.playerAJoinSimpleMatchButton).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]], [EntityType.mainMenu, [EntityId.playerAMainMenu]]])).save()
        , [
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, EntityId.simpleMatchLobby),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Physical, new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, EntityReference, new EntityReference(EntityId.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]]]))),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.simpleMatchLobby, EntityReference, new EntityReference(EntityId.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.player, [EntityId.playerA]], [EntityType.button, [EntityId.playerAJoinSimpleMatchButton]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityType.mainMenu, EntityId.playerAMainMenu, EntityId.playerA, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityType.button, EntityId.playerAJoinSimpleMatchButton, EntityId.playerA, new Physical(EntityId.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[0])
            ])
        ])
    serverScenario(`${Action.join} 4`, players.map(player => playerWantJoinSimpleMatchLobby(player, EntityId.simpleMatchLobby)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.simpleMatchLobby).withLifeCycle(true).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.button, simpleMatchButtons]])).withPhysicalComponent(simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(mainMenus[0]).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[1]).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[2]).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[3]).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[4]).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[5]).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[6]).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[7]).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(simpleMatchButtons[0]).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[1]).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[2]).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[3]).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[4]).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[5]).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[6]).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[7]).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(players[0]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[0]]], [EntityType.mainMenu, [mainMenus[0]]]])).save()
            .buildEntity(players[1]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[1]]], [EntityType.mainMenu, [mainMenus[1]]]])).save()
            .buildEntity(players[2]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[2]]], [EntityType.mainMenu, [mainMenus[2]]]])).save()
            .buildEntity(players[3]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[3]]], [EntityType.mainMenu, [mainMenus[3]]]])).save()
            .buildEntity(players[4]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[4]]], [EntityType.mainMenu, [mainMenus[4]]]])).save()
            .buildEntity(players[5]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[5]]], [EntityType.mainMenu, [mainMenus[5]]]])).save()
            .buildEntity(players[6]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[6]]], [EntityType.mainMenu, [mainMenus[6]]]])).save()
            .buildEntity(players[7]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[7]]], [EntityType.mainMenu, [mainMenus[7]]]])).save()

        , [
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, EntityId.simpleMatchLobby),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, EntityReference, new EntityReference(EntityId.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.button, simpleMatchButtons]]))),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[0], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[1], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[2], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[3], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[4], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[5], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[6], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[7], EntityId.simpleMatchLobby)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.simpleMatchLobby, EntityReference, new EntityReference(EntityId.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.player, players], [EntityType.button, simpleMatchButtons]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityType.mainMenu, mainMenus[0], players[0], new Physical(mainMenus[0], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityType.button, simpleMatchButtons[0], players[0], new Physical(simpleMatchButtons[0], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[0]),
                drawEvent(EntityType.mainMenu, mainMenus[1], players[1], new Physical(mainMenus[1], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityType.button, simpleMatchButtons[1], players[1], new Physical(simpleMatchButtons[1], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[1]),
                createMatchEvent(EntityId.simpleMatchLobby),
                drawEvent(EntityType.mainMenu, mainMenus[2], players[2], new Physical(mainMenus[2], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityType.button, simpleMatchButtons[2], players[2], new Physical(simpleMatchButtons[2], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[2]),
                drawEvent(EntityType.mainMenu, mainMenus[3], players[3], new Physical(mainMenus[3], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityType.button, simpleMatchButtons[3], players[3], new Physical(simpleMatchButtons[3], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[3]),
                createMatchEvent(EntityId.simpleMatchLobby),
                drawEvent(EntityType.mainMenu, mainMenus[4], players[4], new Physical(mainMenus[4], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityType.button, simpleMatchButtons[4], players[4], new Physical(simpleMatchButtons[4], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[4]),
                drawEvent(EntityType.mainMenu, mainMenus[5], players[5], new Physical(mainMenus[5], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityType.button, simpleMatchButtons[5], players[5], new Physical(simpleMatchButtons[5], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[5]),
                createMatchEvent(EntityId.simpleMatchLobby),
                drawEvent(EntityType.mainMenu, mainMenus[6], players[6], new Physical(mainMenus[6], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityType.button, simpleMatchButtons[6], players[6], new Physical(simpleMatchButtons[6], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[6]),
                drawEvent(EntityType.mainMenu, mainMenus[7], players[7], new Physical(mainMenus[7], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityType.button, simpleMatchButtons[7], players[7], new Physical(simpleMatchButtons[7], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[7]),
                createMatchEvent(EntityId.simpleMatchLobby)
            ])
        ])
})
