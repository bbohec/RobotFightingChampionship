import { Physical } from '../../ecs/components/Physical'
import { EventKind } from '../../type/EventKind'
import { EntityType } from '../../ecs/components/EntityReference'
import { newGameEvent } from '../../type/GameEvent'
export const drawEvent = (playerId:string, physicalComponent:Physical) => newGameEvent(EventKind.draw, new Map([
    [EntityType.unknown, [physicalComponent.entityId]],
    [EntityType.player, [playerId]]
]), [physicalComponent])
