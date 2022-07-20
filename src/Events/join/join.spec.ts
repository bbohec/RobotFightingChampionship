
import { matchGridDimension } from '../../Components/Dimensional'
import { makeEntityReference } from '../../Components/EntityReference'
import { defaultJoinSimpleMatchButtonPosition, mainMenuPosition, makePhysical, simpleMatchLobbyPosition } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds, mainMenus, players, simpleMatchButtons } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, theEntityIsCreated, theEntityIsOnRepository, thereIsServerComponents, whenEventOccured, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { createGridEvent, createMatchEvent, createPlayerNextTurnMatchButtonEvent, createPlayerSimpleMatchLobbyMenu, createRobotEvent, createTowerEvent } from '../create/create'
import { drawEvent } from '../draw/draw'
import { playerJoinMatchEvent, playerWantJoinSimpleMatchLobby } from './join'

feature(featureEventDescription(Action.join), () => {
    serverScenario(`${Action.join} 1`, playerJoinMatchEvent(EntityIds.playerA, EntityIds.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityIds.match),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map())
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [])
        ])
    serverScenario(`${Action.join} 2`, playerJoinMatchEvent(EntityIds.playerB, EntityIds.match),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([])).save()
        , [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, EntityIds.match),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]]))
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                createGridEvent(EntityIds.match, matchGridDimension),
                createTowerEvent(EntityIds.playerA),
                createTowerEvent(EntityIds.playerB),
                createRobotEvent(EntityIds.playerA),
                createRobotEvent(EntityIds.playerB),
                createPlayerNextTurnMatchButtonEvent(EntityIds.match, EntityIds.playerA),
                createPlayerNextTurnMatchButtonEvent(EntityIds.match, EntityIds.playerB)
            ])
        ])
    serverScenario(`${Action.join} 3`, playerWantJoinSimpleMatchLobby(EntityIds.playerA, EntityIds.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.simpleMatchLobby).withLifeCycle(true).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])).withPhysicalComponent(simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(EntityIds.playerAMainMenu).withPhysicalComponent(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(EntityIds.playerAJoinSimpleMatchButton).withPhysicalComponent(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])).save()
        , [
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, EntityIds.simpleMatchLobby),
            thereIsServerComponents(TestStep.And, [
                makePhysical(EntityIds.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true),
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]]))
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[0])
            ])
        ])
    serverScenario(`${Action.join} 4`, players.map(player => playerWantJoinSimpleMatchLobby(player, EntityIds.simpleMatchLobby)),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.simpleMatchLobby).withLifeCycle(true).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.button, simpleMatchButtons]])).withPhysicalComponent(simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true).save()
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
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, EntityIds.simpleMatchLobby),
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.button, simpleMatchButtons]]))
            ]),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[0], EntityIds.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[1], EntityIds.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[2], EntityIds.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[3], EntityIds.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[4], EntityIds.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[5], EntityIds.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[6], EntityIds.simpleMatchLobby)),
            (game, adapters) => whenEventOccurs(game, adapters, playerWantJoinSimpleMatchLobby(players[7], EntityIds.simpleMatchLobby)),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.player, players], [EntityType.button, simpleMatchButtons]]))
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                drawEvent(players[0], makePhysical(mainMenus[0], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(players[0], makePhysical(simpleMatchButtons[0], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[0]),
                drawEvent(players[1], makePhysical(mainMenus[1], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(players[1], makePhysical(simpleMatchButtons[1], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[1]),
                createMatchEvent(EntityIds.simpleMatchLobby),
                drawEvent(players[2], makePhysical(mainMenus[2], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(players[2], makePhysical(simpleMatchButtons[2], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[2]),
                drawEvent(players[3], makePhysical(mainMenus[3], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(players[3], makePhysical(simpleMatchButtons[3], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[3]),
                createMatchEvent(EntityIds.simpleMatchLobby),
                drawEvent(players[4], makePhysical(mainMenus[4], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(players[4], makePhysical(simpleMatchButtons[4], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[4]),
                drawEvent(players[5], makePhysical(mainMenus[5], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(players[5], makePhysical(simpleMatchButtons[5], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[5]),
                createMatchEvent(EntityIds.simpleMatchLobby),
                drawEvent(players[6], makePhysical(mainMenus[6], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(players[6], makePhysical(simpleMatchButtons[6], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[6]),
                drawEvent(players[7], makePhysical(mainMenus[7], mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(players[7], makePhysical(simpleMatchButtons[7], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[7]),
                createMatchEvent(EntityIds.simpleMatchLobby)
            ])
        ])
})
