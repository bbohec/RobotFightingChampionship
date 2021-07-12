import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newEvent } from '../../Event/GameEvent'
export const playerWantJoinSimpleMatchLobby = (player: string) => newEvent(Action.join, EntityType.nothing, EntityType.simpleMatchLobby, undefined, player)
export const joinSimpleMatchLobby = (playerId: string, mainMenuEntityId: string) => newEvent(Action.join, EntityType.player, EntityType.simpleMatchLobby, mainMenuEntityId, playerId)
export const joinSimpleMatchServerEvent = (playerId: string) => newEvent(Action.join, EntityType.nothing, EntityType.game, undefined, playerId)
export const playerJoinMatchEvent = (playerId:string, matchId:string) => newEvent(Action.join, EntityType.nothing, EntityType.match, matchId, playerId)
