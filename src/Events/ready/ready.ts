import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { newGameEvent } from '../../core/type/GameEvent'
export const playerReadyForMatch = (matchId: string, playerId: string) => newGameEvent(Action.ready, new Map([
    [EntityType.match, [matchId]],
    [EntityType.player, [playerId]]
]))
