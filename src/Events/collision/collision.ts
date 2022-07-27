import { EntityReferences } from '../../core/components/EntityReference'
import { Action } from '../../core/type/Action'
import { newGameEvent } from '../../core/type/GameEvent'

export const collisionGameEvent = (entityRefences: EntityReferences) => newGameEvent(Action.collision, entityRefences)
