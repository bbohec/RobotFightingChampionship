import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { newGameEvent } from '../../core/type/GameEvent'
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
