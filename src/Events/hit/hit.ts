import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { newGameEvent } from '../../core/type/GameEvent'
export const hitEvent = (attackerEntityId: string, defenderEntityId: string) => newGameEvent(Action.hit, new Map([
    [EntityType.attacker, [attackerEntityId]],
    [EntityType.hittable, [defenderEntityId]]
]))
