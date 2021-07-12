import { describe } from 'mocha'
import { Visible } from '../../Component/Visible'
import { Action } from '../port/Action'
import { theEntityIsNotOnRepository, whenEventOccurs, theEntityIsCreated, theEventIsSent, theEntityWithIdHasTheExpectedComponent, featureEventDescription, theEntityIsOnRepository, serverScenario, clientScenario } from '../port/test'
import { TestStep } from '../port/TestStep'
import { gridId, gameEntityId, mainMenuEntityId, matchId, playerAId, robotId, simpleMatchLobbyEntityId, towerId } from '../port/entityIds'
import { Playable } from '../../Component/Playable'
import { EntityReference } from '../../Component/EntityReference'
import { createPlayerEvent, createSimpleMatchLobbyEvent, createRobotEvent, createTowerEvent, createMainMenuEvent, createGameEvent, createGridEvent } from './create'
import { registerGridEvent, registerRobotEvent, registerTowerEvent } from '../register/register'
import { showEvent } from '../show/show'
import { hideEvent } from '../hide/hide'
import { Dimensional } from '../../Component/Dimensional'
import { EntityType } from '../port/EntityType'
import { Game } from '../../Entities/Game'
import { Grid } from '../../Entities/Grid'
import { MainMenu } from '../../Entities/MainMenu'
import { Player } from '../../Entities/Player'
import { Robot } from '../../Entities/Robot'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby'
import { Tower } from '../../Entities/Tower'
import { Hittable } from '../../Component/Hittable'
import { Offensive } from '../../Systems/Hit/HitSystem'

describe(featureEventDescription(Action.create), () => {
    clientScenario(createGameEvent, [gameEntityId], undefined, [
        (game, adapters) => whenEventOccurs(game, createGameEvent),
        (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, gameEntityId),
        (game, adapters) => theEntityIsCreated(TestStep.And, adapters, gameEntityId),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, createMainMenuEvent(gameEntityId, 'unknown'))
    ])
    clientScenario(createMainMenuEvent(gameEntityId, mainMenuEntityId), [gameEntityId, mainMenuEntityId], undefined, [
        (game, adapters) => whenEventOccurs(game, createMainMenuEvent(gameEntityId, mainMenuEntityId)),
        (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, MainMenu),
        (game, adapters) => theEntityIsCreated(TestStep.And, adapters, MainMenu),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, gameEntityId, Visible, new Visible(gameEntityId)),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.mainMenu, gameEntityId))
    ])
    clientScenario(createSimpleMatchLobbyEvent(gameEntityId, 'unknown'), [simpleMatchLobbyEntityId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, SimpleMatchLobby),
        (game, adapters) => whenEventOccurs(game, createSimpleMatchLobbyEvent(gameEntityId, 'unknown')),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, simpleMatchLobbyEntityId),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, simpleMatchLobbyEntityId, Visible, new Visible(simpleMatchLobbyEntityId)),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.simpleMatchLobby, simpleMatchLobbyEntityId)),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, hideEvent(EntityType.mainMenu, gameEntityId))
    ])
    serverScenario(createGameEvent, [gameEntityId], undefined, [
        (game, adapters) => whenEventOccurs(game, createGameEvent),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, Game),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, createSimpleMatchLobbyEvent(gameEntityId, 'unknown'))
    ])
    serverScenario(createPlayerEvent, [playerAId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, Player),
        (game, adapters) => whenEventOccurs(game, createPlayerEvent),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, Player),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map()))
    ])
    serverScenario(createSimpleMatchLobbyEvent(gameEntityId, simpleMatchLobbyEntityId), [simpleMatchLobbyEntityId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, SimpleMatchLobby),
        (game, adapters) => whenEventOccurs(game, createSimpleMatchLobbyEvent(gameEntityId, simpleMatchLobbyEntityId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, simpleMatchLobbyEntityId),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, []))
    ])
    serverScenario(createRobotEvent(playerAId), [robotId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, Robot),
        (game, adapters) => whenEventOccurs(game, createRobotEvent(playerAId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, robotId),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, registerRobotEvent(robotId, playerAId)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, robotId, Hittable, new Hittable(robotId, 50)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, robotId, Offensive, new Offensive(robotId, 20))
    ])
    serverScenario(createTowerEvent(playerAId), [towerId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, Tower),
        (game, adapters) => whenEventOccurs(game, createTowerEvent(playerAId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, towerId),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, registerTowerEvent(towerId, playerAId)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, towerId, Hittable, new Hittable(towerId, 100)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, towerId, Offensive, new Offensive(towerId, 5))
    ])

    serverScenario(createGridEvent(matchId), [gridId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, Grid),
        (game, adapters) => whenEventOccurs(game, createGridEvent(matchId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, gridId),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, gridId, Dimensional, new Dimensional(gridId, { x: 25, y: 25 })),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, registerGridEvent(matchId, gridId))
    ])
})
