import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { newGameEvent } from '../../core/type/GameEvent'
export const nextTurnEvent = (matchId: string) => newGameEvent(Action.nextTurn, new Map([
    [EntityType.match, [matchId]]
]))
