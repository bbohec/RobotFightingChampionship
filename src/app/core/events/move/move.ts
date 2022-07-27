import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'
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
