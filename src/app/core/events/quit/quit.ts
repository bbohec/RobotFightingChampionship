import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'

export const quitMatchEvent = (matchId: string, playerId: string) => newGameEvent(Action.quit, new Map([
    [EntityType.match, [matchId]],
    [EntityType.player, [playerId]]
]))
