import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { newGameEvent } from '../../Event/GameEvent'
import { Physical, Position } from '../../Components/Physical'
import { ShapeType } from '../../Components/port/ShapeType'
import { Dimension } from '../../Components/port/Dimension'
import { Dimensional } from '../../Components/Dimensional'
import { EntityId } from '../../Event/entityIds'
export const createClientGameEvent = (playerId:string) => newGameEvent(Action.create, new Map([[EntityType.game, [EntityId.create]], [EntityType.player, [playerId]]]))
export const createServerGameEvent = newGameEvent(Action.create, new Map([[EntityType.game, [EntityId.create]]]))
export const createMatchEvent = (simpleMatchLobbyEntityId:string) => newGameEvent(Action.create, new Map([[EntityType.match, [EntityId.create]], [EntityType.simpleMatchLobby, [simpleMatchLobbyEntityId]]]))
export const createPlayerEvent = newGameEvent(Action.create, new Map([[EntityType.player, [EntityId.create]]]))
export const createTowerEvent = (playerId: string) => newGameEvent(Action.create, new Map([[EntityType.tower, [EntityId.create]], [EntityType.player, [playerId]]]))
export const createRobotEvent = (playerId: string) => newGameEvent(Action.create, new Map([[EntityType.robot, [EntityId.create]], [EntityType.player, [playerId]]]))
export const createMainMenuEvent = (gameId: string, playerId:string) => newGameEvent(Action.create, new Map([[EntityType.game, [gameId]], [EntityType.mainMenu, [EntityId.create]], [EntityType.player, [playerId]]]))
export const createGridEvent = (matchId: string, dimension:Dimension) => newGameEvent(Action.create, new Map([[EntityType.grid, [EntityId.create]], [EntityType.match, [matchId]]]), [new Dimensional(EntityId.create, dimension)])
export const createSimpleMatchLobbyEvent = (gameId: string) => newGameEvent(Action.create, new Map([[EntityType.game, [gameId]], [EntityType.simpleMatchLobby, [EntityId.create]]]))
export const createPlayerSimpleMatchLobbyButtonEvent = (simpleMatchLobbyId:string, playerId:string) => newGameEvent(Action.create, new Map([[EntityType.button, [EntityId.create]], [EntityType.simpleMatchLobby, [simpleMatchLobbyId]], [EntityType.player, [playerId]]]))
export const createPlayerNextTurnMatchButtonEvent = (matchId:string, playerId:string) => newGameEvent(Action.create, new Map([[EntityType.button, [EntityId.create]], [EntityType.match, [matchId]], [EntityType.player, [playerId]]]))
export const createPlayerSimpleMatchLobbyMenu = (playerId:string) => newGameEvent(Action.create, new Map([[EntityType.simpleMatchLobbyMenu, [EntityId.create]], [EntityType.player, [playerId]]]))
export const createPlayerPointerEvent = (playerId:string) => newGameEvent(Action.create, new Map([[EntityType.player, [playerId]], [EntityType.pointer, [EntityId.create]]]))
export const createCellEvent = (gridId:string, position:Position) => newGameEvent(Action.create, new Map([[EntityType.cell, [EntityId.create]], [EntityType.grid, [gridId]]]), [new Physical(EntityId.create, position, ShapeType.cell, true)])
