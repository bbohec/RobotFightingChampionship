import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'

export const registerGridEvent = (matchId: string, gridId: string) => newGameEvent(Action.register, new Map([
    [EntityType.match, [matchId]],
    [EntityType.grid, [gridId]]
]))
export const registerTowerEvent = (towerId: string, playerId: string) => newGameEvent(Action.register, new Map([
    [EntityType.player, [playerId]],
    [EntityType.tower, [towerId]]
]))
export const registerRobotEvent = (robotId: string, playerId: string) => newGameEvent(Action.register, new Map([
    [EntityType.player, [playerId]],
    [EntityType.robot, [robotId]]
]))
