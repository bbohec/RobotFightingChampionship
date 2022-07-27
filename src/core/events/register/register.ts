import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'

export const registerSimpleMatchLobbyOnGame = (gameId:string, simpleMatchLobbyId:string) => newGameEvent(Action.register, new Map([[EntityType.game, [gameId]], [EntityType.simpleMatchLobby, [simpleMatchLobbyId]]]))

export const registerTowerEvent = (towerId: string, playerId: string) => newGameEvent(Action.register, new Map([
    [EntityType.player, [playerId]],
    [EntityType.tower, [towerId]]
]))
export const registerRobotEvent = (robotId: string, playerId: string) => newGameEvent(Action.register, new Map([
    [EntityType.player, [playerId]],
    [EntityType.robot, [robotId]]
]))
export const registerPlayerEvent = (playerId:string) => newGameEvent(Action.register, new Map([[EntityType.player, [playerId]]]))
export const registerPlayerOnGameEvent = (playerId:string, gameId:string) => newGameEvent(Action.register, new Map([[EntityType.player, [playerId]], [EntityType.game, [gameId]]]))
export const registerPlayerPointerEvent = (playerPointerId:string, playerId:string) => newGameEvent(Action.register, new Map([
    [EntityType.pointer, [playerPointerId]],
    [EntityType.player, [playerId]]
]))
export const registerNextTurnButtonEvent = (playerId:string, matchId:string, nextTurnButtonId:string) => newGameEvent(Action.register, new Map([
    [EntityType.player, [playerId]],
    [EntityType.match, [matchId]],
    [EntityType.nextTurnButton, [nextTurnButtonId]]
]))
