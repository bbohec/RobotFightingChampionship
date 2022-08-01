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
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { ShapeType } from '../../type/ShapeType'
import { createGridEvent, createTowerEvent, createRobotEvent, createPlayerNextTurnMatchButtonEvent, createPlayerSimpleMatchLobbyMenu, createMatchEvent } from '../create/create'
import { drawEvent } from '../draw/draw'
import { playerJoinMatchEvent, playerWantJoinSimpleMatchLobby } from './join'

feature(Action.join, () => {
    serverScenario(`${Action.join} 1`, playerJoinMatchEvent(EntityIds.playerA, EntityIds.match),
        [], [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map()),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map())
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.match, EntityType.match, new Map([[EntityType.player, [EntityIds.playerA]]])),
                makeEntityReference(EntityIds.playerA, EntityType.player, new Map([[EntityType.match, [EntityIds.match]]]))
            ]),
            eventsAreSent(TestStep.Then, 'server', [])
        ])
    serverScenario(`${Action.join} 2`, playerJoinMatchEvent(EntityIds.playerB, EntityIds.match),
        [], [
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
            eventsAreSent(TestStep.Then, 'server', [
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
        [], [
            thereIsServerComponents(TestStep.Given, [
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
            eventsAreSent(TestStep.Then, 'server', [
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAMainMenu, mainMenuPosition, ShapeType.mainMenu, false)),
                drawEvent(EntityIds.playerA, makePhysical(EntityIds.playerAJoinSimpleMatchButton, defaultJoinSimpleMatchButtonPosition, ShapeType.simpleMatchLobbyButton, false)),
                createPlayerSimpleMatchLobbyMenu(players[0])
            ])
        ])
    serverScenario(`${Action.join} 4`, players.map(player => playerWantJoinSimpleMatchLobby(player, EntityIds.simpleMatchLobby)),
        [], [
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
            eventsAreSent(TestStep.Then, 'server',
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
