import { EntityIds, players, simpleMatchButtons, mainMenus } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent, whenEventOccurs } from '../../../test/unitTest/event'
import { matchGridDimension } from '../../ecs/components/Dimensional'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { makeLifeCycle } from '../../ecs/components/LifeCycle'
import { simpleMatchLobbyPosition, mainMenuPosition, defaultJoinSimpleMatchButtonPosition, makePhysical } from '../../ecs/components/Physical'
import { EntityBuilder } from '../../ecs/entity'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { createGridEvent, createTowerEvent, createRobotEvent, createPlayerNextTurnMatchButtonEvent, createPlayerSimpleMatchLobbyMenu, createMatchEvent } from '../create/create'
import { drawEvent } from '../draw/draw'
import { playerJoinMatchEvent, playerWantJoinSimpleMatchLobby } from './join'

feature(Action.join, () => {
    serverScenario(`${Action.join} 1`, playerJoinMatchEvent(EntityIds.playerA, EntityIds.match),
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.match).withEntityReferences(EntityType.match).save()
            .makeEntity(EntityIds.playerA).withEntityReferences(EntityType.player).save()
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
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.match).withEntityReferences(EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])).save()
            .makeEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([])).save()
            .makeEntity(EntityIds.playerB).withEntityReferences(EntityType.player, new Map([])).save()
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
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.playerA).withEntityReferences(EntityType.player, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]], [EntityType.mainMenu, [EntityIds.playerAMainMenu]]])).save()
            .makeEntity(EntityIds.simpleMatchLobby).withLifeCycle(true).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.button, [EntityIds.playerAJoinSimpleMatchButton]]])).withPhysical(simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .makeEntity(EntityIds.playerAMainMenu).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .makeEntity(EntityIds.playerAJoinSimpleMatchButton).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
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
        [], (game, adapters) => () => new EntityBuilder(adapters.componentRepository)
            .makeEntity(EntityIds.simpleMatchLobby).withLifeCycle(true).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.button, simpleMatchButtons]])).withPhysical(simpleMatchLobbyPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .makeEntity(mainMenus[0]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .makeEntity(mainMenus[1]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .makeEntity(mainMenus[2]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .makeEntity(mainMenus[3]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .makeEntity(mainMenus[4]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .makeEntity(mainMenus[5]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .makeEntity(mainMenus[6]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .makeEntity(mainMenus[7]).withPhysical(mainMenuPosition, ShapeType.mainMenu, true).save()
            .makeEntity(simpleMatchButtons[0]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .makeEntity(simpleMatchButtons[1]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .makeEntity(simpleMatchButtons[2]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .makeEntity(simpleMatchButtons[3]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .makeEntity(simpleMatchButtons[4]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .makeEntity(simpleMatchButtons[5]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .makeEntity(simpleMatchButtons[6]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .makeEntity(simpleMatchButtons[7]).withPhysical(defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, true).save()
            .makeEntity(players[0]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[0]]], [EntityType.mainMenu, [mainMenus[0]]]])).save()
            .makeEntity(players[1]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[1]]], [EntityType.mainMenu, [mainMenus[1]]]])).save()
            .makeEntity(players[2]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[2]]], [EntityType.mainMenu, [mainMenus[2]]]])).save()
            .makeEntity(players[3]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[3]]], [EntityType.mainMenu, [mainMenus[3]]]])).save()
            .makeEntity(players[4]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[4]]], [EntityType.mainMenu, [mainMenus[4]]]])).save()
            .makeEntity(players[5]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[5]]], [EntityType.mainMenu, [mainMenus[5]]]])).save()
            .makeEntity(players[6]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[6]]], [EntityType.mainMenu, [mainMenus[6]]]])).save()
            .makeEntity(players[7]).withEntityReferences(EntityType.player, new Map([[EntityType.button, [simpleMatchButtons[7]]], [EntityType.mainMenu, [mainMenus[7]]]])).save()

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