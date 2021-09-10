import { describe } from 'mocha'
import { Visible } from '../../Components/Visible'
import { Action } from '../../Event/Action'
import { theEntityIsNotOnRepository, whenEventOccurs, theEntityIsCreated, theEventIsSent, theEntityWithIdHasTheExpectedComponent, featureEventDescription, theEntityIsOnRepository, serverScenario, clientScenario } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { gridId, gameEntityId, mainMenuEntityId, matchId, playerAId, playerARobotId, simpleMatchLobbyEntityId, playerBTowerId } from '../../Event/entityIds'
import { Playable } from '../../Components/Playable'
import { EntityReference } from '../../Components/EntityReference'
import { createPlayerEvent, createSimpleMatchLobbyEvent, createRobotEvent, createTowerEvent, createMainMenuEvent, createGameEvent, createGridEvent, createMatchEvent } from './create'
import { registerGridEvent, registerRobotEvent, registerTowerEvent } from '../register/register'
import { showEvent } from '../show/show'
import { hideEvent } from '../hide/hide'
import { Dimensional } from '../../Components/Dimensional'
import { EntityType } from '../../Event/EntityType'
import { Game } from '../../Entities/Game'
import { Grid } from '../../Entities/Grid'
import { MainMenu } from '../../Entities/MainMenu'
import { Player } from '../../Entities/Player'
import { Robot } from '../../Entities/Robot'
import { SimpleMatchLobby } from '../../Entities/SimpleMatchLobby'
import { Tower } from '../../Entities/Tower'
import { Hittable } from '../../Components/Hittable'
import { Offensive } from '../../Components/Offensive'
import { Match } from '../../Entities/Match'
import { matchWaitingForPlayers } from '../waiting/waiting'
import { Phasing, preparingGamePhase } from '../../Components/Phasing'
describe(featureEventDescription(Action.create), () => {
    clientScenario(`${Action.create} 1 - Create Game Event`, createGameEvent, [gameEntityId], undefined, [
        (game, adapters) => whenEventOccurs(game, createGameEvent),
        (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, gameEntityId),
        (game, adapters) => theEntityIsCreated(TestStep.And, adapters, gameEntityId),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, createMainMenuEvent(gameEntityId, 'unknown'))
    ])
    clientScenario(`${Action.create} 2 - Create Main Menu Event`, createMainMenuEvent(gameEntityId, mainMenuEntityId), [gameEntityId, mainMenuEntityId],
        (game, adapters) => () => {
            const player = new Player(playerAId)
            adapters.entityInteractor.addEntity(player)
        }, [
            (game, adapters) => whenEventOccurs(game, createMainMenuEvent(gameEntityId, mainMenuEntityId)),
            (game, adapters) => theEntityIsOnRepository(TestStep.Then, adapters, MainMenu),
            (game, adapters) => theEntityIsCreated(TestStep.And, adapters, MainMenu),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, gameEntityId, Visible, new Visible(gameEntityId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.mainMenu, gameEntityId, playerAId))
        ])
    clientScenario(`${Action.create} 3 - Create Simple Match Lobby Event`, createSimpleMatchLobbyEvent(gameEntityId, mainMenuEntityId), [simpleMatchLobbyEntityId],
        (game, adapters) => () => {
            const player = new Player(playerAId)
            adapters.entityInteractor.addEntity(player)
        }, [
            (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, SimpleMatchLobby),
            (game, adapters) => whenEventOccurs(game, createSimpleMatchLobbyEvent(gameEntityId, mainMenuEntityId)),
            (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, simpleMatchLobbyEntityId),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, simpleMatchLobbyEntityId, Visible, new Visible(simpleMatchLobbyEntityId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.simpleMatchLobby, simpleMatchLobbyEntityId, playerAId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hideEvent(EntityType.mainMenu, mainMenuEntityId))
        ])
    serverScenario(`${Action.create} 4 - Create Game Event`, createGameEvent, [gameEntityId], undefined, [
        (game, adapters) => whenEventOccurs(game, createGameEvent),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, Game),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, createSimpleMatchLobbyEvent(gameEntityId, 'create'))
    ])
    serverScenario(`${Action.create} 5 - Create Player Event`, createPlayerEvent, [playerAId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, Player),
        (game, adapters) => whenEventOccurs(game, createPlayerEvent),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, Player),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map()))
    ])
    serverScenario(`${Action.create} 6 - Create Simple Match Lobby Event`, createSimpleMatchLobbyEvent(gameEntityId, simpleMatchLobbyEntityId), [simpleMatchLobbyEntityId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, SimpleMatchLobby),
        (game, adapters) => whenEventOccurs(game, createSimpleMatchLobbyEvent(gameEntityId, simpleMatchLobbyEntityId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, simpleMatchLobbyEntityId),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, []))
    ])
    serverScenario(`${Action.create} 7 - Create Robot Event`, createRobotEvent(playerAId), [playerARobotId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, Robot),
        (game, adapters) => whenEventOccurs(game, createRobotEvent(playerAId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, playerARobotId),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, registerRobotEvent(playerARobotId, playerAId)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerARobotId, Hittable, new Hittable(playerARobotId, 50)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerARobotId, Offensive, new Offensive(playerARobotId, 20))
    ])
    serverScenario(`${Action.create} 8 - Create Tower Event`, createTowerEvent(playerAId), [playerBTowerId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, Tower),
        (game, adapters) => whenEventOccurs(game, createTowerEvent(playerAId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, playerBTowerId),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, registerTowerEvent(playerBTowerId, playerAId)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Hittable, new Hittable(playerBTowerId, 100)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, playerBTowerId, Offensive, new Offensive(playerBTowerId, 5))
    ])

    serverScenario(`${Action.create} 9 - Create Grid Event`, createGridEvent(matchId), [gridId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, Grid),
        (game, adapters) => whenEventOccurs(game, createGridEvent(matchId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, gridId),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, gridId, Dimensional, new Dimensional(gridId, { x: 25, y: 25 })),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, registerGridEvent(matchId, gridId))
    ])
    serverScenario(`${Action.create} 10`, createMatchEvent(simpleMatchLobbyEntityId), [matchId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, Match),
        (game, adapters) => whenEventOccurs(game, createMatchEvent(simpleMatchLobbyEntityId)),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, Match),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, matchWaitingForPlayers(matchId, simpleMatchLobbyEntityId)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Playable, new Playable(matchId, [])),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, EntityReference, new EntityReference(matchId, new Map())),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, preparingGamePhase()))
    ])
})
