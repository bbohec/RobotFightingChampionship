import { EntityType } from '../../ecs/components/EntityReference'
import { EventKind } from '../../type/EventKind'
import { newGameEvent } from '../../type/GameEvent'
export const victoryEvent = (matchId: string, victoryPlayerId: string) =>
  newGameEvent(
    EventKind.victory,
    new Map([
      [EntityType.match, [matchId]],
      [EntityType.player, [victoryPlayerId]],
    ]),
  )
