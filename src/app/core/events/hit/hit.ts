import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'
export const hitEvent = (attackerEntityId: string, defenderEntityId: string) => newGameEvent(Action.hit, new Map([
    [EntityType.attacker, [attackerEntityId]],
    [EntityType.hittable, [defenderEntityId]]
]))
