import { EntityType } from '../../ecs/components/EntityReference'
import { EventKind } from '../../type/EventKind'

import { newGameEvent } from '../../type/GameEvent'
export const playerReadyForMatch = (matchId: string, playerId: string) =>
  newGameEvent(
    EventKind.ready,
    new Map([
      [EntityType.match, [matchId]],
      [EntityType.player, [playerId]],
    ]),
  )
