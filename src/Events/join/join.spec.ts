
import { Playable } from '../../Components/Playable'
import { createGridEvent, createMatchEvent, createPlayerSimpleMatchLobbyMenu, createRobotEvent, createTowerEvent } from '../create/create'
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
import { gridDimension } from '../../Components/port/Dimension'

feature(featureEventDescription(Action.join), () => {
    serverScenario(`${Action.join} 1`, playerJoinMatchEvent(EntityId.playerA, EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Playable, new Playable(EntityId.match, [])),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Playable, new Playable(EntityId.match, [EntityId.playerA])),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.playerA, EntityReference, new EntityReference(EntityId.playerA, EntityType.player, new Map([[EntityType.match, [EntityId.match]]])))
        ])
    serverScenario(`${Action.join} 2`, playerJoinMatchEvent(EntityId.playerB, EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([EntityId.playerA]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([])).save()
            .buildEntity(EntityId.playerB).withEntityReferences(EntityType.player, new Map([])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Playable, new Playable(EntityId.match, [EntityId.playerA])),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Playable, new Playable(EntityId.match, [EntityId.playerA, EntityId.playerB])),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                createGridEvent(EntityId.match, gridDimension),
                createTowerEvent(EntityId.playerA),
                createTowerEvent(EntityId.playerB),
                createRobotEvent(EntityId.playerA),
                createRobotEvent(EntityId.playerB)

            ])
        ])
    serverScenario(`${Action.join} 3`, playerWantJoinSimpleMatchLobby(EntityId.playerA, EntityId.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.simpleMatchLobby).withPlayers([]).withLifeCycle(true).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]]])).withPhysicalComponent(simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(EntityId.playerAMainMenu).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(EntityId.playerAJoinSimpleMatchButton).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]], [EntityType.mainMenu, [EntityId.playerAMainMenu]]])).save()
        , [
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, EntityId.simpleMatchLobby),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Physical, new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true)),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Playable, new Playable(EntityId.simpleMatchLobby, [EntityId.playerA])),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityType.mainMenu, EntityId.playerAMainMenu, EntityId.playerA, new Physical(EntityId.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityType.button, EntityId.playerAJoinSimpleMatchButton, EntityId.playerA, new Physical(EntityId.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[0])
            ])
        ])
    serverScenario(`${Action.join} 4`, players.map(player => playerWantJoinSimpleMatchLobby(player, EntityId.simpleMatchLobby)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.simpleMatchLobby).withPlayers([]).withLifeCycle(true).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.button, simpleMatchButtons]])).withPhysicalComponent(simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true).save()
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
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[0], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[1], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[2], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[3], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[4], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[5], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[6], EntityId.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[7], EntityId.simpleMatchLobby)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Playable, new Playable(EntityId.simpleMatchLobby, players)),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                ...players.map((player, index) => drawEvent(EntityType.button, simpleMatchButtons[index], player, new Physical(simpleMatchButtons[index], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false))),
                ...players.map((player, index) => drawEvent(EntityType.mainMenu, mainMenus[index], player, new Physical(mainMenus[index], mainMenuPosition, ShapeType.mainMenu, false))),
                ...players.map(player => createPlayerSimpleMatchLobbyMenu(player)),
                createMatchEvent(EntityId.simpleMatchLobby),
                createMatchEvent(EntityId.simpleMatchLobby),
                createMatchEvent(EntityId.simpleMatchLobby),
                createMatchEvent(EntityId.simpleMatchLobby)
            ])
        ])
})
