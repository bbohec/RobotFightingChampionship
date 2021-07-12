import { Action } from '../port/Action'
import { EntityType } from '../port/EntityType'
import { newEvent } from '../port/GameEvents'
export const victoryEvent = (matchId:string, victoryPlayerId:string) => newEvent(Action.victory, EntityType.player, EntityType.match, matchId, victoryPlayerId)
