import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'
export const playerReadyForMatch = (matchId: string, playerId: string) => newGameEvent(Action.ready, new Map([
    [EntityType.match, [matchId]],
    [EntityType.player, [playerId]]
]))
