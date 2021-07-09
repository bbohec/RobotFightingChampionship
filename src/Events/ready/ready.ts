import { Action } from '../port/Action'
import { EntityType } from '../port/EntityType'
import { newEvent } from '../port/GameEvents'

export const playerReadyForMatch = (matchId: string, playerId: string) => newEvent(Action.ready, EntityType.player, EntityType.match, matchId, playerId)
