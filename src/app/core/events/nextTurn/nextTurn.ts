import { EntityType } from '../../ecs/components/EntityReference'
import { EventKind } from '../../type/EventKind'
import { newGameEvent } from '../../type/GameEvent'
export const nextTurnEvent = (matchId: string) =>
  newGameEvent(EventKind.nextTurn, new Map([[EntityType.match, [matchId]]]))
