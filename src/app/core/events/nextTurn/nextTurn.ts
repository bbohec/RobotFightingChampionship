import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'
export const nextTurnEvent = (matchId: string) => newGameEvent(Action.nextTurn, new Map([
    [EntityType.match, [matchId]]
]))
