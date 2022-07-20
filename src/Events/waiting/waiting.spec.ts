
import { makeEntityReference } from '../../Components/EntityReference'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds, expectedAddedPlayers, expectedStillWaitingPlayers } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { eventsAreSent, feature, featureEventDescription, serverScenario, thereIsServerComponents, whenEventOccured } from '../../Event/test'
import { TestStep } from '../../Event/TestStep'
import { playerJoinMatchEvent } from '../join/join'
import { matchWaitingForPlayers } from './waiting'

feature(featureEventDescription(Action.waitingForPlayers), () => {
    serverScenario(`${Action.waitingForPlayers} 1`, matchWaitingForPlayers(EntityIds.match, EntityIds.simpleMatchLobby),
        (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.simpleMatchLobby).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.player, [...expectedAddedPlayers, ...expectedStillWaitingPlayers]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.player, [...expectedAddedPlayers, ...expectedStillWaitingPlayers]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.player, [...expectedStillWaitingPlayers]]]))
            ]),
            (game, adapters) => eventsAreSent(TestStep.And, adapters, 'server', [
                playerJoinMatchEvent(expectedAddedPlayers[0], EntityIds.match),
                playerJoinMatchEvent(expectedAddedPlayers[1], EntityIds.match)
            ])
        ])
})
