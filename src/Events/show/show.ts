import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { newEvent } from '../../Event/GameEvent'
export const showEvent = (targetEntityType: EntityType, targetEntityId: string, playerId:string) => newEvent(Action.show, new Map([
    [targetEntityType, [targetEntityId]],
    [EntityType.player, [playerId]]
]))
