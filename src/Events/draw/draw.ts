import { Physical } from '../../Components/Physical'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'
export const drawEvent = (playerId:string, physicalComponent:Physical) => newGameEvent(Action.draw, new Map([
    [EntityType.unknown, [physicalComponent.entityId]],
    [EntityType.player, [playerId]]
]), [physicalComponent])
