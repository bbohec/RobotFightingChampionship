
import { Action } from '../../Event/Action'
import { theEntityWithIdHasTheExpectedComponent, eventsAreSent, featureEventDescription, serverScenario, feature, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { playerJoinMatchEvent } from '../join/join'
import { matchWaitingForPlayers } from './waiting'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { EntityId, expectedAddedPlayers, expectedStillWaitingPlayers } from '../../Event/entityIds'
import { EntityReference } from '../../Components/EntityReference'
import { EntityType } from '../../Event/EntityType'

feature(featureEventDescription(Action.waitingForPlayers), () => {
    serverScenario(`${Action.waitingForPlayers} 1`, matchWaitingForPlayers(EntityId.match, EntityId.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityId.simpleMatchLobby).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.player, [...expectedAddedPlayers, ...expectedStillWaitingPlayers]]])).save()
        , [
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Given, adapters, EntityId.simpleMatchLobby, EntityReference, new EntityReference(EntityId.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.player, [...expectedAddedPlayers, ...expectedStillWaitingPlayers]]]))),
            ...whenEventOccured(),
            (game, adapters) => theEntityWithIdHasTheExpectedComponent(TestStep.Then, adapters, EntityId.simpleMatchLobby, EntityReference, new EntityReference(EntityId.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.player, [...expectedStillWaitingPlayers]]]))),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                playerJoinMatchEvent(expectedAddedPlayers[0], EntityId.match),
                playerJoinMatchEvent(expectedAddedPlayers[1], EntityId.match)
            ])
        ])
})
