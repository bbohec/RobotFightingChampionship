import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { newGameEvent } from '../../core/type/GameEvent'

export const quitMatchEvent = (matchId: string, playerId: string) => newGameEvent(Action.quit, new Map([
    [EntityType.match, [matchId]],
    [EntityType.player, [playerId]]
]))
