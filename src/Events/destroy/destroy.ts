import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'
export const destroyMatchEvent = (matchId: string) => destroyEvent(EntityType.match, matchId)
export const destroyRobotEvent = (robotId: string) => destroyEvent(EntityType.robot, robotId)
export const destroyTowerEvent = (towerId: string) => destroyEvent(EntityType.tower, towerId)
const destroyEvent = (entityType:EntityType, entityId: string) => newGameEvent(Action.destroy, new Map([[entityType, [entityId]]]))
