import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { newEvent } from '../../Event/GameEvent'
export const hideEvent = (targetEntityType: EntityType, targetEntityId?: string) => newEvent(Action.hide, EntityType.nothing, targetEntityType, targetEntityId)
