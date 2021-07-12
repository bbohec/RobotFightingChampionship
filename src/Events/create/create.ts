import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { action } from '../../Systems/LifeCycle/GenericLifeCycleSystem'
import { newEvent } from '../../Event/GameEvent'
export const createGameEvent = newEvent(Action.create, EntityType.nothing, EntityType.game)
export const createMainMenuEvent = (gameEntityId: string, mainMenuEntityId: string) => newEvent(Action.create, EntityType.nothing, EntityType.mainMenu, mainMenuEntityId, gameEntityId)
export const createGridEvent = (matchId: string) => newEvent(Action.create, EntityType.nothing, EntityType.grid, undefined, matchId)
export const createTowerEvent = (playerId: string) => newEvent(action, EntityType.nothing, EntityType.tower, undefined, playerId)
export const createRobotEvent = (playerId: string) => newEvent(action, EntityType.nothing, EntityType.robot, undefined, playerId)
export const createSimpleMatchLobbyEvent = (gameEntityId: string, mainMenuEntityId: string) => newEvent(action, EntityType.nothing, EntityType.simpleMatchLobby, gameEntityId, mainMenuEntityId)
export const createMatchEvent = newEvent(action, EntityType.nothing, EntityType.match)
export const createPlayerEvent = newEvent(action, EntityType.nothing, EntityType.player)
