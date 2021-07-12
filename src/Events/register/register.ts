import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newEvent } from '../../Event/GameEvent'

export const registerGridEvent = (matchId: string, gridId: string) => newEvent(Action.register, EntityType.grid, EntityType.match, matchId, gridId)
export const registerTowerEvent = (towerId: string, playerId: string) => newEvent(Action.register, EntityType.tower, EntityType.player, playerId, towerId)
export const registerRobotEvent = (robotId: string, playerId: string) => newEvent(Action.register, EntityType.robot, EntityType.player, playerId, robotId)
