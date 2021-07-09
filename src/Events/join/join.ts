import { Action } from '../port/Action'
import { EntityType } from '../port/EntityType'
import { newEvent } from '../port/GameEvents'
export const playerWantJoinSimpleMatchLobby = (player: string) => newEvent(Action.join, EntityType.nothing, EntityType.simpleMatchLobby, undefined, player)
export const joinSimpleMatchLobby = (playerId: string, mainMenuEntityId: string) => newEvent(Action.join, EntityType.player, EntityType.simpleMatchLobby, mainMenuEntityId, playerId)
export const joinSimpleMatchServerEvent = (playerId: string) => newEvent(Action.join, EntityType.nothing, EntityType.game, undefined, playerId)
export const playerJoinMatchEvent = (playerId:string, matchId:string) => newEvent(Action.join, EntityType.nothing, EntityType.match, matchId, playerId)
