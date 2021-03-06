import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'
export const moveEvent = (
    playerId:string,
    entityType: EntityType,
    entityId: string,
    cellDestinationId: string
) => newGameEvent(Action.move, new Map([
    [entityType, [entityId]],
    [EntityType.player, [playerId]],
    [EntityType.cell, [cellDestinationId]]
]))
