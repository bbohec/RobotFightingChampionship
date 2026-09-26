import { EventKind } from '../../type/EventKind'
import { EntityType } from '../../ecs/components/EntityReference'
import { GameEvent, newGameEvent } from '../../type/GameEvent'

export const attackEvent = (playerId:string, attackerId:string, targetId:string): GameEvent => newGameEvent(EventKind.attack, new Map([
    [EntityType.player, [playerId]],
    [EntityType.attacker, [attackerId]],
    [EntityType.target, [targetId]]
]))
