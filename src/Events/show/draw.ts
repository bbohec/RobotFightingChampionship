import { Physical } from '../../Components/Physical'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'
export const drawEvent = (targetEntityType: EntityType, targetEntityId: string, playerId:string, physicalComponent:Physical) => newGameEvent(Action.draw, new Map([
    [targetEntityType, [targetEntityId]],
    [EntityType.player, [playerId]]
]), [physicalComponent])
