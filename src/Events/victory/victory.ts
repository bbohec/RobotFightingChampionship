import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { newGameEvent } from '../../core/type/GameEvent'
export const victoryEvent = (matchId:string, victoryPlayerId:string) => newGameEvent(Action.victory, new Map([
    [EntityType.match, [matchId]],
    [EntityType.player, [victoryPlayerId]]
]))
