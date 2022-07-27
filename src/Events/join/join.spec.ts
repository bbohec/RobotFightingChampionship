
import { matchGridDimension } from '../../Components/Dimensional'
import { makeEntityReference } from '../../Components/EntityReference'
import { makeLifeCycle } from '../../Components/LifeCycle'
import { defaultJoinSimpleMatchButtonPosition, mainMenuPosition, makePhysical, simpleMatchLobbyPosition } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds, mainMenus, players, simpleMatchButtons } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'

import { TestStep } from '../../Event/TestStep'
import { feature } from '../../test/feature'
import { serverScenario } from '../../test/scenario'
import { thereIsServerComponents } from '../../test/unitTest/component'
import { whenEventOccured, eventsAreSent, whenEventOccurs } from '../../test/unitTest/event'
import { createGridEvent, createMatchEvent, createPlayerNextTurnMatchButtonEvent, createPlayerSimpleMatchLobbyMenu, createRobotEvent, createTowerEvent } from '../create/create'
import { drawEvent } from '../draw/draw'
import { playerJoinMatchEvent, playerWantJoinSimpleMatchLobby } from './join'

feature(Action.join, () => {
    serverScenario(`${Action.join} 1`, playerJoinMatchEvent(EntityIds.playerA, EntityIds.match),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map()),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map())
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            eventsAreSent(TestStep.And, 'server', [])
        ])
    serverScenario(`${Action.join} 2`, playerJoinMatchEvent(EntityIds.playerB, EntityIds.match),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([])).save()
            .buildEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map()),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map())
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA, EntityIds.playerB]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map()),
                makeEntityReference(EntityIds.playerB, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            eventsAreSent(TestStep.And, 'server', [
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
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])).save()
            .buildEntity(EntityIds.simpleMatchLobby).withLifeCycle(true).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])).withPhysical(simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(EntityIds.playerAMainMenu).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(EntityIds.playerAJoinSimpleMatchButton).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
        , [
            thereIsServerComponents(TestStep.And, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeLifeCycle(EntityIds.simpleMatchLobby, true),
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])),
                makePhysical(EntityIds.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true),
                makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true),
                makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])),
                makeLifeCycle(EntityIds.simpleMatchLobby, true),
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.player, [EntityIds.playerA]], [EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])),
                makePhysical(EntityIds.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true),
                makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, true),
                makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)
            ]),
            eventsAreSent(TestStep.And, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[0])
            ])
        ])
    serverScenario(`${Action.join} 4`, players.map(player => playerWantJoinSimpleMatchLobby(player, EntityIds.simpleMatchLobby)),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.simpleMatchLobby).withLifeCycle(true).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.button, simpleMatchButtons]])).withPhysical(simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(mainMenus[0]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[1]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[2]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[3]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[4]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[5]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[6]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(mainMenus[7]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .buildEntity(simpleMatchButtons[0]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[1]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[2]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[3]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[4]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[5]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[6]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(simpleMatchButtons[7]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .buildEntity(players[0]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[0]]], [EntityType.mainMenu, [mainMenus[0]]]])).save()
            .buildEntity(players[1]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[1]]], [EntityType.mainMenu, [mainMenus[1]]]])).save()
            .buildEntity(players[2]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[2]]], [EntityType.mainMenu, [mainMenus[2]]]])).save()
            .buildEntity(players[3]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[3]]], [EntityType.mainMenu, [mainMenus[3]]]])).save()
            .buildEntity(players[4]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[4]]], [EntityType.mainMenu, [mainMenus[4]]]])).save()
            .buildEntity(players[5]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[5]]], [EntityType.mainMenu, [mainMenus[5]]]])).save()
            .buildEntity(players[6]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[6]]], [EntityType.mainMenu, [mainMenus[6]]]])).save()
            .buildEntity(players[7]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[7]]], [EntityType.mainMenu, [mainMenus[7]]]])).save()

        , [
            thereIsServerComponents(TestStep.Given, [
                makeLifeCycle(EntityIds.simpleMatchLobby, true),
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.button, simpleMatchButtons]])),
                makePhysical(EntityIds.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true),
                ...mainMenus.map(mainMenu => makePhysical(mainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
                ...simpleMatchButtons.map(simpleMatchButton => makePhysical(simpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)),
                ...players.map((player, index) => makeEntityReference(player, EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[index]]], [EntityType.mainMenu, [mainMenus[index]]]])))
            ]),
            ...players.map(player => whenEventOccurs(playerWantJoinSimpleMatchLobby(player, EntityIds.simpleMatchLobby))),
            thereIsServerComponents(TestStep.Then, [
                makeLifeCycle(EntityIds.simpleMatchLobby, true),
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.player, players], [EntityType.button, simpleMatchButtons]])),
                makePhysical(EntityIds.simpleMatchLobby, simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true),
                ...mainMenus.map(mainMenu => makePhysical(mainMenu, mainMenuPosition, ShapeType.mainMenu, true)),
                ...simpleMatchButtons.map(simpleMatchButton => makePhysical(simpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true)),
                ...players.map((player, index) => makeEntityReference(player, EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[index]]], [EntityType.mainMenu, [mainMenus[index]]]])))
            ]),
            eventsAreSent(TestStep.And, 'server',
                players.map((player, index) => {
                    const events = []
                    events.push(drawEvent(player, makePhysical(mainMenus[index], mainMenuPosition, ShapeType.mainMenu, false)))
                    events.push(drawEvent(player, makePhysical(simpleMatchButtons[index], defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)))
                    events.push(createPlayerSimpleMatchLobbyMenu(player))
                    if ((index + 1) % 2 === 0) events.push(createMatchEvent(EntityIds.simpleMatchLobby))
                    return events
                }).flat()
            )
        ])
})
