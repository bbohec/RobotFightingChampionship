import { describe } from 'mocha'
import { Visible } from '../../Component/Visible'
import { Robot } from '../../Entities/Robot/Robot'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby/SimpleMatchLobby'
import { Tower } from '../../Entities/Tower/Tower'
import { ClientGameSystem } from '../../Systems/Game/ClientGame'
import { FakeClientAdapters } from '../../Systems/Game/infra/FakeClientAdapters'
import { FakeServerAdapters } from '../../Systems/Game/infra/FakeServerAdapters'
import { ServerGameSystem } from '../../Systems/Game/ServerGame'
import { Action } from '../port/Action'
import { scenarioEventDescription, theEntityIsNotOnRepository, whenEventOccurs, theEntityIsCreated, theEventIsSent, theEntityWithIdHasTheExpectedComponent, featureEventDescription, theEntityIsOnRepository, scenario } from '../port/test'
import { TestStep } from '../port/TestStep'
import { gridId, gameEntityId, mainMenuEntityId, matchId, playerAId, robotId, simpleMatchLobbyEntityId, towerId } from '../port/entityIds'
import { Playable } from '../../Component/Playable'
import { EntityReference } from '../../Component/EntityReference'
import { Player } from '../../Entities/Player/Player'
import { createPlayerEvent, createSimpleMatchLobbyEvent, createRobotEvent, createTowerEvent, createMatchEvent, createMainMenuEvent, createGameEvent } from '../../Systems/LifeCycle/GenericLifeCycleSystem'
import { matchWaitingForPlayers, registerGridEvent, registerRobotEvent, registerTowerEvent } from '../../Systems/Match/ServerMatchSystem'
import { Phasing } from '../../Component/Phasing'
import { Phase } from '../../Component/port/Phase'
import { Match } from '../../Entities/Match/Match'
import { MainMenu } from '../../Entities/MainMenu/MainMenu'
import { mainMenuShowEvent, mainMenuHideEvent, simpleMatchLobbyShow } from '../../Systems/Drawing/DrawingSystem'
import { Dimensional } from '../../Component/Dimensional'
import { Grid } from '../../Entities/Grid/Grid'
import { EntityType } from '../port/EntityType'
import { newEvent } from '../port/GameEvents'
import { Game } from '../../Entities/ClientGame/Game'

describe(featureEventDescription(Action.create), () => {
    scenario(createGameEvent, 'client', [gameEntityId], undefined, [
        (game, adapters) => whenEventOccurs(game, createGameEvent),
        (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, gameEntityId),
        (game, adapters) => theEntityIsCreated(TestStep.And, adapters, gameEntityId),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, createMainMenuEvent(gameEntityId, 'unknown'))
    ])
    scenario(createGameEvent, 'server', [gameEntityId], undefined, [
        (game, adapters) => whenEventOccurs(game, createGameEvent),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, Game),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, createSimpleMatchLobbyEvent(gameEntityId, 'unknown'))
    ])
    describe('Scenario : Main Menu create', () => {
        const adapters = new FakeClientAdapters([gameEntityId, mainMenuEntityId])
        const game = new ClientGameSystem(adapters)
        whenEventOccurs(game, createMainMenuEvent(gameEntityId, mainMenuEntityId))
        theEntityIsOnRepository(TestStep.Then, adapters, MainMenu)
        theEntityIsCreated(TestStep.And, adapters, MainMenu)
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, gameEntityId, Visible, new Visible(gameEntityId))
        theEventIsSent(TestStep.And, adapters, mainMenuShowEvent(gameEntityId))
    })
    describe('Player : on create', () => {
        const adapters = new FakeServerAdapters([playerAId])
        const game = new ServerGameSystem(adapters)
        theEntityIsNotOnRepository(TestStep.Given, adapters, Player)
        whenEventOccurs(game, createPlayerEvent)
        theEntityIsCreated(TestStep.Then, adapters, Player)
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map()))
    })
    describe(scenarioEventDescription(createSimpleMatchLobbyEvent(gameEntityId, simpleMatchLobbyEntityId), 'client'), () => {
        const adapters = new FakeClientAdapters([simpleMatchLobbyEntityId])
        const game = new ClientGameSystem(adapters)
        theEntityIsNotOnRepository(TestStep.Given, adapters, SimpleMatchLobby)
        whenEventOccurs(game, createSimpleMatchLobbyEvent(gameEntityId, 'unknown'))
        theEntityIsCreated(TestStep.Then, adapters, simpleMatchLobbyEntityId)
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, simpleMatchLobbyEntityId, Visible, new Visible(simpleMatchLobbyEntityId))
        theEventIsSent(TestStep.And, adapters, simpleMatchLobbyShow)
        theEventIsSent(TestStep.And, adapters, mainMenuHideEvent(gameEntityId))
    })
    describe(scenarioEventDescription(createSimpleMatchLobbyEvent(gameEntityId, simpleMatchLobbyEntityId), 'server'), () => {
        const adapters = new FakeServerAdapters([simpleMatchLobbyEntityId])
        const game = new ServerGameSystem(adapters)
        theEntityIsNotOnRepository(TestStep.Given, adapters, SimpleMatchLobby)
        whenEventOccurs(game, createSimpleMatchLobbyEvent(gameEntityId, simpleMatchLobbyEntityId))
        theEntityIsCreated(TestStep.Then, adapters, simpleMatchLobbyEntityId)
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, []))
    })
    describe(scenarioEventDescription(createRobotEvent(playerAId), 'server'), () => {
        const adapters = new FakeServerAdapters([robotId])
        const game = new ServerGameSystem(adapters)
        theEntityIsNotOnRepository(TestStep.Given, adapters, Robot)
        whenEventOccurs(game, createRobotEvent(playerAId))
        theEntityIsCreated(TestStep.Then, adapters, robotId)
        theEventIsSent(TestStep.And, adapters, registerRobotEvent(robotId, playerAId))
    })
    describe(scenarioEventDescription(createTowerEvent(playerAId), 'server'), () => {
        const adapters = new FakeServerAdapters([towerId])
        const game = new ServerGameSystem(adapters)
        theEntityIsNotOnRepository(TestStep.Given, adapters, Tower)
        whenEventOccurs(game, createTowerEvent(playerAId))
        theEntityIsCreated(TestStep.Then, adapters, towerId)
        theEventIsSent(TestStep.And, adapters, registerTowerEvent(towerId, playerAId))
    })
    describe('Scenario :On create', () => {
        const adapters = new FakeServerAdapters([matchId])
        const game = new ServerGameSystem(adapters)
        theEntityIsNotOnRepository(TestStep.Given, adapters, Match)
        whenEventOccurs(game, createMatchEvent)
        theEntityIsCreated(TestStep.Then, adapters, Match)
        theEventIsSent(TestStep.And, adapters, matchWaitingForPlayers(matchId))
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Playable, new Playable(matchId, []))
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, EntityReference, new EntityReference(matchId, new Map()))
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, Phase.PreparingGame))
    })
    describe('On create', () => {
        const expectedDimention:Dimensional = new Dimensional(gridId, { x: 25, y: 25 })
        const createGridEvent = newEvent(Action.create, EntityType.nothing, EntityType.grid, undefined, matchId)
        const adapters = new FakeServerAdapters([gridId])
        const game = new ServerGameSystem(adapters)
        theEntityIsNotOnRepository(TestStep.Given, adapters, Grid)
        whenEventOccurs(game, createGridEvent)
        theEntityIsCreated(TestStep.Then, adapters, gridId)
        theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, gridId, Dimensional, expectedDimention)
        theEventIsSent(TestStep.And, adapters, registerGridEvent(matchId, gridId))
    })
})
