import { describe } from 'mocha'
import { Playable } from '../../Components/Playable'
import { createSimpleMatchLobbyEvent } from '../create/create'
import { Action } from '../../Event/Action'
import { expectedAddedPlayers, expectedStillWaitingPlayers, mainMenuEntityId, matchId, simpleMatchLobbyEntityId } from '../../Event/entityIds'
import { theEntityWithIdHasTheExpectedComponent, whenEventOccurs, theEventIsSent, featureEventDescription, serverScenario } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { playerJoinMatchEvent, playerWantJoinSimpleMatchLobby } from '../join/join'
import { matchWaitingForPlayers } from './waiting'

describe(featureEventDescription(Action.waitingForPlayers), () => {
    serverScenario(`${Action.waitingForPlayers} 1`, matchWaitingForPlayers(matchId, simpleMatchLobbyEntityId), [simpleMatchLobbyEntityId],
        (game, adapters) => () => game.onGameEvent(createSimpleMatchLobbyEvent(mainMenuEntityId, simpleMatchLobbyEntityId))
            .then(() => Promise.all([...expectedAddedPlayers, ...expectedStillWaitingPlayers].map(player => game.onGameEvent(playerWantJoinSimpleMatchLobby(player, simpleMatchLobbyEntityId))))), [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, [...expectedAddedPlayers, ...expectedStillWaitingPlayers])),
            (game, adapters) => whenEventOccurs(game, matchWaitingForPlayers(matchId, simpleMatchLobbyEntityId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, [...expectedStillWaitingPlayers])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, playerJoinMatchEvent(expectedAddedPlayers[0], matchId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, playerJoinMatchEvent(expectedAddedPlayers[1], matchId))
        ])
})
