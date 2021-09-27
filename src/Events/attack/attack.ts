import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { GameEvent, newGameEvent } from '../../Event/GameEvent'

export const attackEvent = (playerId:string, attackerId:string, targetId:string): GameEvent => newGameEvent(Action.attack, new Map([
    [EntityType.player, [playerId]],
    [EntityType.attacker, [attackerId]],
    [EntityType.target, [targetId]]
]))
