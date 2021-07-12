import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { GameEvent, newEvent } from '../../Event/GameEvent'

export const matchWaitingForPlayers = (matchId:string):GameEvent => newEvent(Action.waitingForPlayers, EntityType.nothing, EntityType.simpleMatchLobby, undefined, matchId)
