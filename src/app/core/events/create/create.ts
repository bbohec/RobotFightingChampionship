import { EntityIds } from '../../../test/entityIds'
import { Dimension, makeDimensional } from '../../ecs/components/Dimensional'
import { Position, makePhysical } from '../../ecs/components/Physical'
import { EventKind } from '../../type/EventKind'
import { EntityType } from '../../ecs/components/EntityReference'
import { newGameEvent } from '../../type/GameEvent'
import { ShapeType } from '../../type/ShapeType'
export const createClientGameEvent = (playerId:string) => newGameEvent(EventKind.create, new Map([[EntityType.game, [EntityIds.create]], [EntityType.player, [playerId]]]))
export const createServerGameEvent = newGameEvent(EventKind.create, new Map([[EntityType.game, [EntityIds.create]]]))
export const createMatchEvent = (simpleMatchLobbyEntityId:string) => newGameEvent(EventKind.create, new Map([[EntityType.match, [EntityIds.create]], [EntityType.simpleMatchLobby, [simpleMatchLobbyEntityId]]]))
export const createPlayerEvent = newGameEvent(EventKind.create, new Map([[EntityType.player, [EntityIds.create]]]))
export const createTowerEvent = (playerId: string) => newGameEvent(EventKind.create, new Map([[EntityType.tower, [EntityIds.create]], [EntityType.player, [playerId]]]))
export const createRobotEvent = (playerId: string) => newGameEvent(EventKind.create, new Map([[EntityType.robot, [EntityIds.create]], [EntityType.player, [playerId]]]))
export const createMainMenuEvent = (gameId: string, playerId:string) => newGameEvent(EventKind.create, new Map([[EntityType.game, [gameId]], [EntityType.mainMenu, [EntityIds.create]], [EntityType.player, [playerId]]]))
export const createGridEvent = (matchId: string, dimension:Dimension) => newGameEvent(EventKind.create, new Map([[EntityType.grid, [EntityIds.create]], [EntityType.match, [matchId]]]), [makeDimensional(EntityIds.create, dimension)])
export const createSimpleMatchLobbyEvent = (gameId: string) => newGameEvent(EventKind.create, new Map([[EntityType.game, [gameId]], [EntityType.simpleMatchLobby, [EntityIds.create]]]))
export const createPlayerSimpleMatchLobbyButtonEvent = (simpleMatchLobbyId:string, playerId:string) => newGameEvent(EventKind.create, new Map([[EntityType.button, [EntityIds.create]], [EntityType.simpleMatchLobby, [simpleMatchLobbyId]], [EntityType.player, [playerId]]]))
export const createPlayerNextTurnMatchButtonEvent = (matchId:string, playerId:string) => newGameEvent(EventKind.create, new Map([[EntityType.button, [EntityIds.create]], [EntityType.match, [matchId]], [EntityType.player, [playerId]]]))
export const createPlayerSimpleMatchLobbyMenu = (playerId:string) => newGameEvent(EventKind.create, new Map([[EntityType.simpleMatchLobbyMenu, [EntityIds.create]], [EntityType.player, [playerId]]]))
export const createPlayerPointerEvent = (playerId:string) => newGameEvent(EventKind.create, new Map([[EntityType.player, [playerId]], [EntityType.pointer, [EntityIds.create]]]))
export const createCellEvent = (gridId:string, position:Position) => newGameEvent(EventKind.create, new Map([[EntityType.cell, [EntityIds.create]], [EntityType.grid, [gridId]]]), [makePhysical(EntityIds.create, position, ShapeType.cell, true)])
export const createVictoryEvent = (matchId:string) => newGameEvent(EventKind.create, new Map([[EntityType.match, [matchId]], [EntityType.victory, [EntityIds.victory]]]))
export const createDefeatEvent = (matchId:string) => newGameEvent(EventKind.create, new Map([[EntityType.match, [matchId]], [EntityType.defeat, [EntityIds.defeat]]]))
