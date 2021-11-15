
import { Playable } from '../../Components/Playable'
import { hideEvent } from '../hide/hide'
import { createGridEvent, createMatchEvent, createPlayerSimpleMatchLobbyMenu, createRobotEvent, createTowerEvent } from '../create/create'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { feature, featureEventDescription, serverScenario, theEntityIsCreated, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { playerJoinMatchEvent, playerWantJoinSimpleMatchLobby } from './join'
import { EntityReference } from '../../Components/EntityReference'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId, mainMenus, players, simpleMatchButtons } from '../../Event/entityIds'
import { Physical, simpleMatchLobbyPosition } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'

feature(featureEventDescription(Action.join), () => {
    serverScenario(`${Action.join} 1`, playerJoinMatchEvent(EntityId.playerA, EntityId.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.match).withPlayers([]).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityId.match),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.match, Playable, new Playable(EntityId.match, [])),
            (game, adapters) => whenEventOccurs(game, playerJoinMatchEvent(EntityId.playerA, EntityId.match)),
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
            (game, adapters) => whenEventOccurs(game, playerJoinMatchEvent(EntityId.playerB, EntityId.match)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.match, Playable, new Playable(EntityId.match, [EntityId.playerA, EntityId.playerB])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createTowerEvent(EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createRobotEvent(EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createTowerEvent(EntityId.playerB)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createRobotEvent(EntityId.playerB)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createGridEvent(EntityId.match))
        ])
    serverScenario(`${Action.join} 3`, playerWantJoinSimpleMatchLobby(EntityId.playerA, EntityId.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.simpleMatchLobby).withPlayers([]).withLifeCycle(true).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]]])).withPhysicalComponent(simpleMatchLobbyPosition, ShapeType.simpleMatchLobby).save()
            .buildEntity(EntityId.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityId.playerAJoinSimpleMatchButton]], [EntityType.mainMenu, [EntityId.playerAMainMenu]]])).save()
        , [
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, EntityId.simpleMatchLobby),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Physical, new Physical(EntityId.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(EntityId.playerA, EntityId.simpleMatchLobby)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, EntityId.simpleMatchLobby, Playable, new Playable(EntityId.simpleMatchLobby, [EntityId.playerA])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, EntityId.playerAMainMenu, EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.button, EntityId.playerAJoinSimpleMatchButton, EntityId.playerA)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createPlayerSimpleMatchLobbyMenu(players[0]))
        ])
    serverScenario(`${Action.join} 4`, players.map(player => playerWantJoinSimpleMatchLobby(player, EntityId.simpleMatchLobby)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.simpleMatchLobby).withPlayers([]).withLifeCycle(true).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.button, simpleMatchButtons]])).withPhysicalComponent(simpleMatchLobbyPosition, ShapeType.simpleMatchLobby).save()
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
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createMatchEvent(EntityId.simpleMatchLobby), players.length / 2 - (players.length % 2 / 2)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, mainMenus[0], players[0])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, mainMenus[1], players[1])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, mainMenus[2], players[2])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, mainMenus[3], players[3])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, mainMenus[4], players[4])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, mainMenus[5], players[5])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, mainMenus[6], players[6])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.mainMenu, mainMenus[7], players[7])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.button, simpleMatchButtons[0], players[0])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.button, simpleMatchButtons[1], players[1])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.button, simpleMatchButtons[2], players[2])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.button, simpleMatchButtons[3], players[3])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.button, simpleMatchButtons[4], players[4])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.button, simpleMatchButtons[5], players[5])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.button, simpleMatchButtons[6], players[6])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', hideEvent(EntityType.button, simpleMatchButtons[7], players[7])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createPlayerSimpleMatchLobbyMenu(players[0])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createPlayerSimpleMatchLobbyMenu(players[1])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createPlayerSimpleMatchLobbyMenu(players[2])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createPlayerSimpleMatchLobbyMenu(players[3])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createPlayerSimpleMatchLobbyMenu(players[4])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createPlayerSimpleMatchLobbyMenu(players[5])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createPlayerSimpleMatchLobbyMenu(players[6])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', createPlayerSimpleMatchLobbyMenu(players[7]))
        ])
})
