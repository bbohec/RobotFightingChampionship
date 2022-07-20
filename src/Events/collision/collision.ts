import { EntityReferences } from '../../Components/EntityReference'
import { Action } from '../../Event/Action'
import { newGameEvent } from '../../Event/GameEvent'

export const collisionGameEvent = (entityRefences: EntityReferences) => newGameEvent(Action.collision, entityRefences)
