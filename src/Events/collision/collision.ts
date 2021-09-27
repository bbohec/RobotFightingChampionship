import { Action } from '../../Event/Action'
import { EntityReferences, newGameEvent } from '../../Event/GameEvent'
export const collisionGameEvent = (entityRefences: EntityReferences) => newGameEvent(Action.collision, entityRefences)
