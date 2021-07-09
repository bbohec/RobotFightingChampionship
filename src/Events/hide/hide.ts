import { newEvent } from '../port/GameEvents'
import { EntityType } from '../port/EntityType'
import { Action } from '../port/Action'

export const hideEvent = (targetEntityType: EntityType, targetEntityId?: string) => newEvent(Action.hide, EntityType.nothing, targetEntityType, targetEntityId)
