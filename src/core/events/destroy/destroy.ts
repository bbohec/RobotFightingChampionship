import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'
export const destroyMatchEvent = (matchId: string) => destroyEvent(EntityType.match, matchId)
export const destroyRobotEvent = (robotId: string) => destroyEvent(EntityType.robot, robotId)
export const destroyTowerEvent = (towerId: string) => destroyEvent(EntityType.tower, towerId)
export const destroyGridEvent = (gridId:string) => destroyEvent(EntityType.grid, gridId)
export const destroyVictoryEvent = (victoryId:string) => destroyEvent(EntityType.victory, victoryId)
export const destroyDefeatEvent = (defeatId:string) => destroyEvent(EntityType.defeat, defeatId)
export const destroyNextTurnButtonEvent = (nextTurnButtonId:string) => destroyEvent(EntityType.nextTurnButton, nextTurnButtonId)
export const destroyCellEvent = (cellId:string) => destroyEvent(EntityType.cell, cellId)
export const destroySimpleMatchLobbyMenuEvent = (simpleMatchLobbyMenuId:string) => destroyEvent(EntityType.simpleMatchLobbyMenu, simpleMatchLobbyMenuId)

const destroyEvent = (entityType:EntityType, entityId: string) => newGameEvent(Action.destroy, new Map([[entityType, [entityId]]]))
