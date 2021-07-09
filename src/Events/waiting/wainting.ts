import { Action } from '../port/Action'
import { EntityType } from '../port/EntityType'
import { GameEvent } from '../port/GameEvent'
import { newEvent } from '../port/GameEvents'

export const matchWaitingForPlayers = (matchId:string):GameEvent => newEvent(Action.waitingForPlayers, EntityType.nothing, EntityType.simpleMatchLobby, undefined, matchId)
