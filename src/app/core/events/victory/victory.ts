import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'
export const victoryEvent = (matchId:string, victoryPlayerId:string) => newGameEvent(Action.victory, new Map([
    [EntityType.match, [matchId]],
    [EntityType.player, [victoryPlayerId]]
]))
