import { EntityType } from '../../Event/EntityType'
import { Action } from '../../Event/Action'
import { newGameEvent } from '../../Event/GameEvent'
export const hideEvent = (targetEntityType: EntityType, targetEntityId: string, playerId:string) =>
    newGameEvent(Action.hide, new Map([[targetEntityType, [targetEntityId]], [EntityType.player, [playerId]]]))
