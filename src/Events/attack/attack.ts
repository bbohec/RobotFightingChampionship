import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { GameEvent, newEvent } from '../../Event/GameEvent'

export const attackEvent = (playerId:string, attackerId:string, targetId:string): GameEvent => newEvent(Action.attack, new Map([
    [EntityType.player, [playerId]],
    [EntityType.attacker, [attackerId]],
    [EntityType.target, [targetId]]
]))
