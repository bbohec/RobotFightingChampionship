import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newEvent } from '../../Event/GameEvent'
export const nextTurnEvent = (matchId: string) => newEvent(Action.nextTurn, EntityType.nothing, EntityType.nobody, matchId)
