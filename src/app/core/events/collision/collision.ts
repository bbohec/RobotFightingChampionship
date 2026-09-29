import { EntityReferences } from '../../ecs/components/EntityReference'
import { EventKind } from '../../type/EventKind'
import { newGameEvent } from '../../type/GameEvent'

export const collisionGameEvent = (entityRefences: EntityReferences) => newGameEvent(EventKind.collision, entityRefences)
