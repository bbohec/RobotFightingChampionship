import {
  EntityIds,
  expectedAddedPlayers,
  expectedStillWaitingPlayers,
} from '../../../test/entityIds'
import { feature } from '../../../test/feature'
import { serverScenario } from '../../../test/scenario'
import { TestStep } from '../../../test/TestStep'
import { thereIsServerComponents } from '../../../test/unitTest/component'
import { eventsAreSent, whenEventOccured } from '../../../test/unitTest/event'
import { EntityType, makeEntityReference } from '../../ecs/components/EntityReference'
import { EventKind } from '../../type/EventKind'
import { playerJoinMatchEvent } from '../join/join'
import { matchWaitingForPlayers } from './waiting'

feature(EventKind.waitingForPlayers, () => {
  serverScenario(
    `${EventKind.waitingForPlayers} 1`,
    matchWaitingForPlayers(EntityIds.match, EntityIds.simpleMatchLobby),
    [],
    [
      thereIsServerComponents(TestStep.Given, [
        makeEntityReference(
          EntityIds.simpleMatchLobby,
          EntityType.simpleMatchLobby,
          new Map([[EntityType.player, [...expectedAddedPlayers, ...expectedStillWaitingPlayers]]]),
        ),
      ]),
      ...whenEventOccured(),
      thereIsServerComponents(TestStep.Then, [
        makeEntityReference(
          EntityIds.simpleMatchLobby,
          EntityType.simpleMatchLobby,
          new Map([[EntityType.player, [...expectedStillWaitingPlayers]]]),
        ),
      ]),
      eventsAreSent(TestStep.Then, 'server', [
        playerJoinMatchEvent(expectedAddedPlayers[0], EntityIds.match),
        playerJoinMatchEvent(expectedAddedPlayers[1], EntityIds.match),
      ]),
    ],
  )
})
