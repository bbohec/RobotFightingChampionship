import { Action } from '../port/Action'
import { EntityType } from '../port/EntityType'
import { newEvent } from '../port/GameEvents'

export const nextTurnEvent = (matchId: string) => newEvent(Action.nextTurn, EntityType.nothing, EntityType.nobody, matchId)
