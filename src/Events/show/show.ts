import { newEvent } from '../port/GameEvents'
import { EntityType } from '../port/EntityType'
import { Action } from '../port/Action'

export const showEvent = (targetEntityType: EntityType, targetEntityId?: string) => newEvent(Action.show, EntityType.nothing, targetEntityType, targetEntityId)
