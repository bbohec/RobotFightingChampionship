import { describe } from 'mocha'
import { Playable } from '../../Components/Playable'
import { showEvent } from '../show/show'
import { hideEvent } from '../hide/hide'
import { createGameEvent, createGridEvent, createMainMenuEvent, createMatchEvent, createPlayerEvent, createRobotEvent, createSimpleMatchLobbyEvent, createTowerEvent } from '../create/create'
import { Action } from '../../Event/Action'
import { gameEntityId, mainMenuEntityId, matchId, playerAId, playerBId, players, simpleMatchLobbyEntityId } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { clientScenario, featureEventDescription, serverScenario, theEntityIsCreated, theEntityIsOnRepository, theEntityWithIdHasTheExpectedComponent, theEventIsSent, whenEventOccurs } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { joinSimpleMatchLobby, joinSimpleMatchServerEvent, playerJoinMatchEvent, playerWantJoinSimpleMatchLobby } from './join'
import { EntityReference } from '../../Components/EntityReference'
import { Player } from '../../Entities/Player'
describe(featureEventDescription(Action.join), () => {
    clientScenario(`${Action.join} 1`, joinSimpleMatchLobby(playerAId, mainMenuEntityId, simpleMatchLobbyEntityId), [gameEntityId],
        (game, adapters) => () => {
            adapters.entityInteractor.addEntity(new Player(playerAId))
            return game.onGameEvent(createGameEvent).then(() => game.onGameEvent(createMainMenuEvent(gameEntityId, mainMenuEntityId)))
        },
        [
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, gameEntityId),
            (game, adapters) => whenEventOccurs(game, joinSimpleMatchLobby(playerAId, mainMenuEntityId, simpleMatchLobbyEntityId)),
            (game, adapters) => theEventIsSent(TestStep.Then, adapters, joinSimpleMatchServerEvent(playerAId, simpleMatchLobbyEntityId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, hideEvent(EntityType.mainMenu, mainMenuEntityId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, showEvent(EntityType.matchMaking, simpleMatchLobbyEntityId, playerAId))
        ]
    )
    serverScenario(`${Action.join} 2`, playerJoinMatchEvent(playerAId, matchId), [matchId, playerAId],
        (game) => () => game.onGameEvent(createMatchEvent(simpleMatchLobbyEntityId))
            .then(() => game.onGameEvent(createPlayerEvent)), [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, matchId),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Playable, new Playable(matchId, [])),
            (game, adapters) => whenEventOccurs(game, playerJoinMatchEvent(playerAId, matchId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Playable, new Playable(matchId, [playerAId])),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, playerAId, EntityReference, new EntityReference(playerAId, new Map([[EntityType.match, [matchId]]])))
        ])
    serverScenario(`${Action.join} 3`, playerJoinMatchEvent(playerBId, matchId), [matchId, playerAId, playerBId],
        (game) => () => game.onGameEvent(createMatchEvent(simpleMatchLobbyEntityId))
            .then(() => game.onGameEvent(createPlayerEvent))
            .then(() => game.onGameEvent(createPlayerEvent))
            .then(() => game.onGameEvent(playerJoinMatchEvent(playerAId, matchId))), [
            (game, adapters) => theEntityIsOnRepository(TestStep.Given, adapters, matchId),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Playable, new Playable(matchId, [playerAId])),
            (game, adapters) => whenEventOccurs(game, playerJoinMatchEvent(playerBId, matchId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, matchId, Playable, new Playable(matchId, [playerAId, playerBId])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createTowerEvent(playerAId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createRobotEvent(playerAId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createTowerEvent(playerBId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createRobotEvent(playerBId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createGridEvent(matchId))
        ])
    serverScenario(`${Action.join} 4`, playerWantJoinSimpleMatchLobby(playerAId, simpleMatchLobbyEntityId), [simpleMatchLobbyEntityId],
        (game) => () => game.onGameEvent(createSimpleMatchLobbyEvent(mainMenuEntityId, 'unknown')), [
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, simpleMatchLobbyEntityId),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(playerAId, simpleMatchLobbyEntityId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, [playerAId]))
        ])
    serverScenario(`${Action.join} 5`, players.map(player => playerWantJoinSimpleMatchLobby(player, simpleMatchLobbyEntityId)), [simpleMatchLobbyEntityId],
        (game) => () => game.onGameEvent(createSimpleMatchLobbyEvent(mainMenuEntityId, 'unknown')), [
            (game, adapters) => theEntityIsCreated(TestStep.Given, adapters, simpleMatchLobbyEntityId),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[0], simpleMatchLobbyEntityId)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[1], simpleMatchLobbyEntityId)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[2], simpleMatchLobbyEntityId)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[3], simpleMatchLobbyEntityId)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[4], simpleMatchLobbyEntityId)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[5], simpleMatchLobbyEntityId)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[6], simpleMatchLobbyEntityId)),
            (game, adapters) => whenEventOccurs(game, playerWantJoinSimpleMatchLobby(players[7], simpleMatchLobbyEntityId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, players)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, createMatchEvent(simpleMatchLobbyEntityId), players.length / 2 - (players.length % 2 / 2))
        ])
})
