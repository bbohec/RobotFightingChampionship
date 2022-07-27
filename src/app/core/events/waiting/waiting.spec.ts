import { EntityIds, expectedAddedPlayers, expectedStillWaitingPlayers } from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { whenEventOccured, eventsAreSent } from '../../../test/unitTest/event'
import { makeEntityReference } from '../../ecs/components/EntityReference'
import { EntityBuilder } from '../../ecs/entity/entityBuilder'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
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
