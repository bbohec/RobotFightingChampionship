import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { GameEvent, newEvent } from '../../Event/GameEvent'

export const matchWaitingForPlayers = (matchId:string, simpleMatchLobbyEntityId:string):GameEvent => newEvent(Action.waitingForPlayers, new Map([
    [EntityType.match, [matchId]],
    [EntityType.simpleMatchLobby, [simpleMatchLobbyEntityId]]
]))
