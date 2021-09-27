import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { newGameEvent } from '../../Event/GameEvent'
export const createClientGameEvent = (playerId:string) => newGameEvent(Action.create, new Map([[EntityType.game, ['create']], [EntityType.player, [playerId]]]))
export const createServerGameEvent = newGameEvent(Action.create, new Map([[EntityType.game, ['create']]]))
export const createMatchEvent = (simpleMatchLobbyEntityId:string) => newGameEvent(Action.create, new Map([[EntityType.match, ['create']], [EntityType.simpleMatchLobby, [simpleMatchLobbyEntityId]]]))
export const createPlayerEvent = newGameEvent(Action.create, new Map([[EntityType.player, ['create']]]))
export const createTowerEvent = (playerId: string) => newGameEvent(Action.create, new Map([[EntityType.tower, ['create']], [EntityType.player, [playerId]]]))
export const createRobotEvent = (playerId: string) => newGameEvent(Action.create, new Map([[EntityType.robot, ['create']], [EntityType.player, [playerId]]]))
export const createMainMenuEvent = (gameId: string, mainMenuId: string, playerId:string) => newGameEvent(Action.create, new Map([[EntityType.game, [gameId]], [EntityType.mainMenu, [mainMenuId]], [EntityType.player, [playerId]]]))
export const createGridEvent = (matchId: string) => newGameEvent(Action.create, new Map([[EntityType.grid, ['create']], [EntityType.match, [matchId]]]))
export const createSimpleMatchLobbyEvent = (gameId: string, mainMenuId: string) => newGameEvent(Action.create, new Map([[EntityType.game, [gameId]], [EntityType.mainMenu, [mainMenuId]], [EntityType.simpleMatchLobby, ['create']]]))
export const createPlayerSimpleMatchLobbyButtonEvent = () => newGameEvent(Action.create, new Map())
export const createPlayerNextTurnMatchButtonEvent = () => newGameEvent(Action.create, new Map())
