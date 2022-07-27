
import { makeEntityReference } from '../../Components/EntityReference'
import { EntityBuilder } from '../../Entities/entityBuilder'
import { Action } from '../../Event/Action'
import { EntityIds, expectedAddedPlayers, expectedStillWaitingPlayers } from '../../Event/entityIds'
import { EntityType } from '../../Event/EntityType'
import { TestStep } from '../../Event/TestStep'
import { feature } from '../../test/feature'
import { serverScenario } from '../../test/scenario'
import { thereIsServerComponents } from '../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../test/unitTest/event'
import { playerJoinMatchEvent } from '../join/join'
import { matchWaitingForPlayers } from './waiting'

feature(Action.waitingForPlayers, () => {
    serverScenario(`${Action.waitingForPlayers} 1`, matchWaitingForPlayers(EntityIds.match, EntityIds.simpleMatchLobby),
        [], (game, adapters) => () => new EntityBuilder(adapters.entityInteractor)
            .buildEntity(EntityIds.simpleMatchLobby).withEntityReferences(EntityType.simpleMatchLobby, new Map([[EntityType.player, [...expectedAddedPlayers, ...expectedStillWaitingPlayers]]])).save()
        , [
            thereIsServerComponents(TestStep.Given, [
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.player, [...expectedAddedPlayers, ...expectedStillWaitingPlayers]]]))
            ]),
            ...whenEventOccured(),
            thereIsServerComponents(TestStep.Then, [
                makeEntityReference(EntityIds.simpleMatchLobby, EntityType.simpleMatchLobby, new Map([[EntityType.player, [...expectedStillWaitingPlayers]]]))
            ]),
            eventsAreSent(TestStep.And, 'server', [
                playerJoinMatchEvent(expectedAddedPlayers[0], EntityIds.match),
                playerJoinMatchEvent(expectedAddedPlayers[1], EntityIds.match)
            ])
        ])
})
