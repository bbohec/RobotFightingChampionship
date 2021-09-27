import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { newGameEvent } from '../../Event/GameEvent'
export const showEvent = (targetEntityType: EntityType, targetEntityId: string, playerId:string) => newGameEvent(Action.show, new Map([
    [targetEntityType, [targetEntityId]],
    [EntityType.player, [playerId]]
]))
