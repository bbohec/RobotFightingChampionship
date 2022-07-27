import { Physical } from '../../core/components/Physical'
import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { newGameEvent } from '../../core/type/GameEvent'
export const drawEvent = (playerId:string, physicalComponent:Physical) => newGameEvent(Action.draw, new Map([
    [EntityType.unknown, [physicalComponent.entityId]],
    [EntityType.player, [playerId]]
]), [physicalComponent])
