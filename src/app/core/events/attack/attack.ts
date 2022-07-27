import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { GameEvent, newGameEvent } from '../../type/GameEvent'

export const attackEvent = (playerId:string, attackerId:string, targetId:string): GameEvent => newGameEvent(Action.attack, new Map([
    [EntityType.player, [playerId]],
    [EntityType.attacker, [attackerId]],
    [EntityType.target, [targetId]]
]))
