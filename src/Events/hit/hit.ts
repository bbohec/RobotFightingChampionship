import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newEvent } from '../../Event/GameEvent'
const hitEvent = (originEntityType: EntityType, originEntityId: string, targetEntityType: EntityType, targetEntityId: string) => newEvent(Action.hit, originEntityType, targetEntityType, targetEntityId, originEntityId)
export const robotHitTowerEvent = (robotEntityId:string, towerEntityId: string) => hitEvent(EntityType.robot, robotEntityId, EntityType.tower, towerEntityId)
