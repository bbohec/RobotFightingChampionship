import { Action } from '../../core/type/Action'
import { EntityType } from '../../core/type/EntityType'
import { GameEvent, newGameEvent } from '../../core/type/GameEvent'

export const attackEvent = (playerId:string, attackerId:string, targetId:string): GameEvent => newGameEvent(Action.attack, new Map([
    [EntityType.player, [playerId]],
    [EntityType.attacker, [attackerId]],
    [EntityType.target, [targetId]]
]))
