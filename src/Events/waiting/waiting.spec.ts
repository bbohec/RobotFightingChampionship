
import { Playable } from '../../Components/Playable'
import { Action } from '../../Event/Action'
import { theEntityWithIdHasTheExpectedComponent, whenEventOccurs, theEventIsSent, featureEventDescription, serverScenario, feature } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { playerJoinMatchEvent } from '../join/join'
import { matchWaitingForPlayers } from './waiting'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId, expectedAddedPlayers, expectedStillWaitingPlayers } from '../../Event/entityIds'

feature(featureEventDescription(Action.waitingForPlayers), () => {
    serverScenario(`${Action.waitingForPlayers} 1`, matchWaitingForPlayers(EntityId.match, EntityId.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.simpleMatchLobby).withPlayers([...expectedAddedPlayers, ...expectedStillWaitingPlayers]).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.simpleMatchLobby, Playable, new Playable(EntityId.simpleMatchLobby, [...expectedAddedPlayers, ...expectedStillWaitingPlayers])),
            (game, adapters) => whenEventOccurs(game, matchWaitingForPlayers(EntityId.match, EntityId.simpleMatchLobby)),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.simpleMatchLobby, Playable, new Playable(EntityId.simpleMatchLobby, [...expectedStillWaitingPlayers])),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', playerJoinMatchEvent(expectedAddedPlayers[0], EntityId.match)),
            (game, adapters) => theEventIsSent(TestStep.And, adapters, 'server', playerJoinMatchEvent(expectedAddedPlayers[1], EntityId.match))
        ])
})
