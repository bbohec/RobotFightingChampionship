import { newEvent } from '../port/GameEvents'
import { Action } from '../port/Action'
import { EntityType } from '../port/EntityType'

export const registerGridEvent = (matchId: string, gridId: string) => newEvent(Action.register, EntityType.grid, EntityType.match, matchId, gridId)
export const registerTowerEvent = (towerId: string, playerId: string) => newEvent(Action.register, EntityType.tower, EntityType.player, playerId, towerId)
export const registerRobotEvent = (robotId: string, playerId: string) => newEvent(Action.register, EntityType.robot, EntityType.player, playerId, robotId)
