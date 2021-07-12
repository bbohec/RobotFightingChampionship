import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newEvent } from '../../Event/GameEvent'
export const playerReadyForMatch = (matchId: string, playerId: string) => newEvent(Action.ready, EntityType.player, EntityType.match, matchId, playerId)
