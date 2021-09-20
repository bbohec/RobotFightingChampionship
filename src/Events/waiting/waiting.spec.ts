import { describe } from 'mocha'
import { Playable } from '../../Components/Playable'
import { Action } from '../../Event/Action'
import { expectedAddedPlayers, expectedStillWaitingPlayers, matchId, simpleMatchLobbyEntityId } from '../../Event/entityIds'
import { theEntityWithIdHasTheExpectedComponent, whenEventOccurs, theEventIsSent, featureEventDescription, serverScenario } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { playerJoinMatchEvent } from '../join/join'
import { matchWaitingForPlayers } from './waiting'
import { EntityBuilder } from '../../Entities/entityBuilder'

describe(featureEventDescription(Action.waitingForPlayers), () => {
    serverScenario(`${Action.waitingForPlayers} 1`, matchWaitingForPlayers(matchId, simpleMatchLobbyEntityId),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(simpleMatchLobbyEntityId).withPlayers([...expectedAddedPlayers, ...expectedStillWaitingPlayers]).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, [...expectedAddedPlayers, ...expectedStillWaitingPlayers])),
            (game, adapters) => whenEventOccurs(game, matchWaitingForPlayers(matchId, simpleMatchLobbyEntityId)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, simpleMatchLobbyEntityId, Playable, new Playable(simpleMatchLobbyEntityId, [...expectedStillWaitingPlayers])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, playerJoinMatchEvent(expectedAddedPlayers[0], matchId)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, playerJoinMatchEvent(expectedAddedPlayers[1], matchId))
        ])
})
