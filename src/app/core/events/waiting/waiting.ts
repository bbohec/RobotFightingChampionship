import { EntityType } from '../../ecs/components/EntityReference'
import { EventKind } from '../../type/EventKind'
import { type GameEvent, newGameEvent } from '../../type/GameEvent'

export const matchWaitingForPlayers = (
  matchId: string,
  simpleMatchLobbyEntityId: string,
): GameEvent =>
  newGameEvent(
    EventKind.waitingForPlayers,
    new Map([
      [EntityType.match, [matchId]],
      [EntityType.simpleMatchLobby, [simpleMatchLobbyEntityId]],
    ]),
  )
