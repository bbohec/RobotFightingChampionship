import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { newEvent } from '../../Event/GameEvent'
export const showEvent = (targetEntityType: EntityType, targetEntityId?: string) => newEvent(Action.show, EntityType.nothing, targetEntityType, targetEntityId)
