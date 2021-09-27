import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'
export const playerWantJoinSimpleMatchLobby = (playerId: string, simpleMachtLobbyEntityId:string) => newGameEvent(Action.join, new Map([
    [EntityType.player, [playerId]],
    [EntityType.simpleMatchLobby, [simpleMachtLobbyEntityId]]
]))
export const joinSimpleMatchLobby = (playerId: string, mainMenuId: string, simpleMachtLobbyEntityId:string) => newGameEvent(Action.join, new Map([
    [EntityType.player, [playerId]],
    [EntityType.mainMenu, [mainMenuId]],
    [EntityType.simpleMatchLobby, [simpleMachtLobbyEntityId]]
]))
export const joinSimpleMatchServerEvent = (playerId: string, simpleMachtLobbyEntityId:string) => newGameEvent(Action.join, new Map([
    [EntityType.player, [playerId]],
    [EntityType.simpleMatchLobby, [simpleMachtLobbyEntityId]]
]))
export const playerJoinMatchEvent = (playerId:string, matchId:string) => newGameEvent(Action.join, new Map([
    [EntityType.player, [playerId]],
    [EntityType.match, [matchId]]
]))
