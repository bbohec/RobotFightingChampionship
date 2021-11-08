import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { newGameEvent } from '../../Event/GameEvent'
export const createClientGameEvent = (playerId:string) => newGameEvent(Action.create, new Map([[EntityType.game, ['create']], [EntityType.player, [playerId]]]))
export const createServerGameEvent = newGameEvent(Action.create, new Map([[EntityType.game, ['create']]]))
export const createMatchEvent = (simpleMatchLobbyEntityId:string) => newGameEvent(Action.create, new Map([[EntityType.match, ['create']], [EntityType.simpleMatchLobby, [simpleMatchLobbyEntityId]]]))
export const createPlayerEvent = newGameEvent(Action.create, new Map([[EntityType.player, ['create']]]))
export const createTowerEvent = (playerId: string) => newGameEvent(Action.create, new Map([[EntityType.tower, ['create']], [EntityType.player, [playerId]]]))
export const createRobotEvent = (playerId: string) => newGameEvent(Action.create, new Map([[EntityType.robot, ['create']], [EntityType.player, [playerId]]]))
export const createMainMenuEvent = (gameId: string, playerId:string) => newGameEvent(Action.create, new Map([[EntityType.game, [gameId]], [EntityType.mainMenu, ['create']], [EntityType.player, [playerId]]]))
export const createGridEvent = (matchId: string) => newGameEvent(Action.create, new Map([[EntityType.grid, ['create']], [EntityType.match, [matchId]]]))
export const createSimpleMatchLobbyEvent = (gameId: string) => newGameEvent(Action.create, new Map([[EntityType.game, [gameId]], [EntityType.simpleMatchLobby, ['create']]]))
export const createPlayerSimpleMatchLobbyButtonEvent = (simpleMatchLobbyId:string, playerId:string) => newGameEvent(Action.create, new Map([[EntityType.button, ['create']], [EntityType.simpleMatchLobby, [simpleMatchLobbyId]], [EntityType.player, [playerId]]]))
export const createPlayerNextTurnMatchButtonEvent = (matchId:string, playerId:string) => newGameEvent(Action.create, new Map([[EntityType.button, ['create']], [EntityType.match, [matchId]], [EntityType.player, [playerId]]]))
export const createPlayerPointerEvent = (playerId:string) => newGameEvent(Action.create, new Map([[EntityType.player, [playerId]], [EntityType.pointer, ['create']]]))
