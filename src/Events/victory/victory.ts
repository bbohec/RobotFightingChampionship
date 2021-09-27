import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'
export const victoryEvent = (matchId:string, victoryPlayerId:string) => newGameEvent(Action.victory, new Map([
    [EntityType.match, [matchId]],
    [EntityType.player, [victoryPlayerId]]
]))
