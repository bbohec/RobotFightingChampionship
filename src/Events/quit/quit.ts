import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'

export const quitMatchEvent = (matchId: string, playerId: string) => newGameEvent(Action.quit, new Map([
    [EntityType.match, [matchId]],
    [EntityType.player, [playerId]]
]))
