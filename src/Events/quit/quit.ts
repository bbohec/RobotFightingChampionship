import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newEvent } from '../../Event/GameEvent'

export const quitMatchEvent = (matchId: string, playerId: string) => newEvent(Action.quit, new Map([
    [EntityType.match, [matchId]],
    [EntityType.player, [playerId]]
]))
