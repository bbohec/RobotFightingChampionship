import { describe } from 'mocha'
import { Playable } from '../../Component/Playable'
import { createMatchEvent, createSimpleMatchLobbyEvent } from '../create/create'
import { Action } from '../port/Action'
import { expectedAddedPlayers, expectedStillWaitingPlayers, mainMenuEntityId, matchId, simpleMatchLobbyEntityId } from '../port/entityIds'
import { theEntityWithIdHasTheExpectedComponent, whenEventOccurs, theEventIsSent, featureEventDescription, serverScenario, theEntityIsCreated, theEntityIsNotOnRepository } from '../port/test'
import { TestStep } from '../port/TestStep'
import { playerJoinMatchEvent, playerWantJoinSimpleMatchLobby } from '../join/join'
import { EntityReference } from '../../Component/EntityReference'
import { Phasing } from '../../Component/Phasing'
import { PhaseType } from '../../Component/port/Phase'
import { Match } from '../../Entities/Match'
import { matchWaitingForPlayers } from './wainting'
const action = Action.waitingForPlayers
describe(featureEventDescription(action), () => {
    serverScenario(matchWaitingForPlayers(matchId), [matchId], undefined, [
        (game, adapters) => theEntityIsNotOnRepository(TestStep.Given, adapters, Match),
        (game, adapters) => whenEventOccurs(game, createMatchEvent),
        (game, adapters) => theEntityIsCreated(TestStep.Then, adapters, Match),
        (game, adapters) => theEventIsSent(TestStep.And, adapters, matchWaitingForPlayers(matchId)),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Playable, new Playable(matchId, [])),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, EntityReference, new EntityReference(matchId, new Map())),
        (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.And, adapters, matchId, Phasing, new Phasing(matchId, PhaseType.PreparingGame))
    ])
    serverScenario(matchWaitingForPlayers(matchId), [simpleMatchLobbyEntityId],
        (game, adapters) => () => game.onGameEvent(createSimpleMatchLobbyEvent(mainMenuEntityId, simpleMatchLobbyEntityId))
            .then(() => Promise.all([...expectedAddedPlayers, ...expectedStillWaitingPlayers].map(player => game.onGameEvent(playerWantJoinSimpleMatchLobby(player))))), [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, [...expectedAddedPlayers, ...expectedStillWaitingPlayers])),
            (game, adapters) => whenEventOccurs(game, matchWaitingForPlayers(matchId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, [...expectedStillWaitingPlayers])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, playerJoinMatchEvent(expectedAddedPlayers[0], matchId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, playerJoinMatchEvent(expectedAddedPlayers[1], matchId))
        ])
})
