import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'

export const registerSimpleMatchLobbyOnGame = (gameId:string, simpleMatchLobbyId:string) => newGameEvent(Action.register, new Map([[EntityType.game, [gameId]], [EntityType.simpleMatchLobby, [simpleMatchLobbyId]]]))

export const registerGridEvent = (matchId: string, gridId: string) => newGameEvent(Action.register, new Map([
    [EntityType.match, [matchId]],
    [EntityType.grid, [gridId]]
]))
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
