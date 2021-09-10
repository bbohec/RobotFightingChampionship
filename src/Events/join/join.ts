import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newEvent } from '../../Event/GameEvent'
export const playerWantJoinSimpleMatchLobby = (playerId: string, simpleMachtLobbyEntityId:string) => newEvent(Action.join, new Map([
    [EntityType.player, [playerId]],
    [EntityType.simpleMatchLobby, [simpleMachtLobbyEntityId]]
]))
export const joinSimpleMatchLobby = (playerId: string, mainMenuEntityId: string, simpleMachtLobbyEntityId:string) => newEvent(Action.join, new Map([
    [EntityType.player, [playerId]],
    [EntityType.mainMenu, [mainMenuEntityId]],
    [EntityType.simpleMatchLobby, [simpleMachtLobbyEntityId]]
]))
export const joinSimpleMatchServerEvent = (playerId: string, simpleMachtLobbyEntityId:string) => newEvent(Action.join, new Map([
    [EntityType.player, [playerId]],
    [EntityType.simpleMatchLobby, [simpleMachtLobbyEntityId]]
]))
export const playerJoinMatchEvent = (playerId:string, matchId:string) => newEvent(Action.join, new Map([
    [EntityType.player, [playerId]],
    [EntityType.match, [matchId]]
]))
