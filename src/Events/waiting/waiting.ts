import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { GameEvent, newGameEvent } from '../../core/type/GameEvent'

export const matchWaitingForPlayers = (matchId:string, simpleMatchLobbyEntityId:string):GameEvent => newGameEvent(Action.waitingForPlayers, new Map([
    [EntityType.match, [matchId]],
    [EntityType.simpleMatchLobby, [simpleMatchLobbyEntityId]]
]))
