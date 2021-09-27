import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'
export const nextTurnEvent = (matchId: string) => newGameEvent(Action.nextTurn, new Map([
    [EntityType.match, [matchId]]
]))
