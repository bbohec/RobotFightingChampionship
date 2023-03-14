import { Physical } from '../../ecs/components/Physical'
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'
export const drawEvent = (playerId:string, physicalComponent:Physical) => newGameEvent(Action.draw, new Map([
    [EntityType.unknown, [physicalComponent.entityId]],
    [EntityType.player, [playerId]]
]), [physicalComponent])
