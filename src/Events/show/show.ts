import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { newGameEvent } from '../../Event/GameEvent'
import { Physical } from '../../Components/Physical'

export const showEvent = (targetEntityType: EntityType, targetEntityId: string, playerId:string, physicalComponent:Physical) => newGameEvent(Action.show, new Map([
    [targetEntityType, [targetEntityId]],
    [EntityType.player, [playerId]]
]), [physicalComponent])
