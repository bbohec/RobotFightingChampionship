import { Action } from '../port/Action'
import { EntityType } from '../port/EntityType'
import { newEvent } from '../port/GameEvents'

const hitEvent = (originEntityType: EntityType, originEntityId: string, targetEntityType: EntityType, targetEntityId: string) => newEvent(Action.hit, originEntityType, targetEntityType, targetEntityId, originEntityId)
export const robotHitTowerEvent = (robotEntityId:string, towerEntityId: string) => hitEvent(EntityType.robot, robotEntityId, EntityType.tower, towerEntityId)
