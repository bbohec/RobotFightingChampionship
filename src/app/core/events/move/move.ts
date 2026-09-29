import { EventKind } from '../../type/EventKind'
import { EntityType } from '../../ecs/components/EntityReference'
import { newGameEvent } from '../../type/GameEvent'
export const moveEvent = (
    playerId:string,
    entityType: EntityType,
    entityId: string,
    cellDestinationId: string
) => newGameEvent(EventKind.move, new Map([
    [entityType, [entityId]],
    [EntityType.player, [playerId]],
    [EntityType.cell, [cellDestinationId]]
]))
