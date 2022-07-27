import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'
export const playerReadyForMatch = (matchId: string, playerId: string) => newGameEvent(Action.ready, new Map([
    [EntityType.match, [matchId]],
    [EntityType.player, [playerId]]
]))
