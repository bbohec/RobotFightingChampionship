import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { GameEvent, newGameEvent } from '../../Event/GameEvent'

export const matchWaitingForPlayers = (matchId:string, simpleMatchLobbyEntityId:string):GameEvent => newGameEvent(Action.waitingForPlayers, new Map([
    [EntityType.match, [matchId]],
    [EntityType.simpleMatchLobby, [simpleMatchLobbyEntityId]]
]))
