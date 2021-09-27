import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'
export const hitEvent = (attackerEntityId: string, defenderEntityId: string) => newGameEvent(Action.hit, new Map([
    [EntityType.attacker, [attackerEntityId]],
    [EntityType.hittable, [defenderEntityId]]
]))
