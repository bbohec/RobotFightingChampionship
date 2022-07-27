import { EntityReferences } from '../../ecs/components/EntityReference'
import { Action } from '../../type/Action'
import { newGameEvent } from '../../type/GameEvent'

export const collisionGameEvent = (entityRefences: EntityReferences) => newGameEvent(Action.collision, entityRefences)
