import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newEvent } from '../../Event/GameEvent'
export const victoryEvent = (matchId:string, victoryPlayerId:string) => newEvent(Action.victory, EntityType.player, EntityType.match, matchId, victoryPlayerId)
