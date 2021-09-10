import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { newEvent } from '../../Event/GameEvent'
export const createGameEvent = newEvent(Action.create, new Map([[EntityType.game, ['create']]]))
export const createMatchEvent = (simpleMatchLobbyEntityId:string) => newEvent(Action.create, new Map([[EntityType.match, ['create']], [EntityType.simpleMatchLobby, [simpleMatchLobbyEntityId]]]))
export const createPlayerEvent = newEvent(Action.create, new Map([[EntityType.player, ['create']]]))
export const createTowerEvent = (playerId: string) => newEvent(Action.create, new Map([[EntityType.tower, ['create']], [EntityType.player, [playerId]]]))
export const createRobotEvent = (playerId: string) => newEvent(Action.create, new Map([[EntityType.robot, ['create']], [EntityType.player, [playerId]]]))
export const createMainMenuEvent = (gameEntityId: string, mainMenuEntityId: string) => newEvent(Action.create, new Map([[EntityType.game, [gameEntityId]], [EntityType.mainMenu, [mainMenuEntityId]]]))
export const createGridEvent = (matchId: string) => newEvent(Action.create, new Map([[EntityType.grid, ['create']], [EntityType.match, [matchId]]]))
export const createSimpleMatchLobbyEvent = (gameEntityId: string, mainMenuEntityId: string) => newEvent(Action.create, new Map([[EntityType.game, [gameEntityId]], [EntityType.mainMenu, [mainMenuEntityId]], [EntityType.simpleMatchLobby, ['create']]]))
