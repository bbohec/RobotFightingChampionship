import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newEvent } from '../../Event/GameEvent'
export const hitEvent = (attackerEntityId: string, defenderEntityId: string) => newEvent(Action.hit, new Map([
    [EntityType.attacker, [attackerEntityId]],
    [EntityType.hittable, [defenderEntityId]]
]))
