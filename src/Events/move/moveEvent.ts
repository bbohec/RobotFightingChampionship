import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newEvent } from '../../Event/GameEvent'
export const moveEvent = (
    entityType: EntityType,
    entityId: string,
    cellDestinationId: string
) => newEvent(Action.move, new Map([
    [entityType, [entityId]],
    [EntityType.cell, [cellDestinationId]]
]))
