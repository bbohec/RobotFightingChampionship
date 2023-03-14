import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { GameEvent, newGameEvent } from '../../type/GameEvent'

export const matchWaitingForPlayers = (matchId:string, simpleMatchLobbyEntityId:string):GameEvent => newGameEvent(Action.waitingForPlayers, new Map([
    [EntityType.match, [matchId]],
    [EntityType.simpleMatchLobby, [simpleMatchLobbyEntityId]]
]))
