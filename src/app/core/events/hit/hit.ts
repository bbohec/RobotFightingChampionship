import { EntityType } from '../../ecs/components/EntityReference'
import { EventKind } from '../../type/EventKind'
import { newGameEvent } from '../../type/GameEvent'
export const hitEvent = (attackerEntityId: string, defenderEntityId: string) =>
  newGameEvent(
    EventKind.hit,
    new Map([
      [EntityType.attacker, [attackerEntityId]],
      [EntityType.hittable, [defenderEntityId]],
    ]),
  )
