
import { Action } from '../../type/Action'
import { EntityType } from '../../type/EntityType'
import { newGameEvent } from '../../type/GameEvent'
import { Phase } from '../../type/Phase'
export const badPlayerEventNotificationMessage = (badPlayerId:string):string => `This is not "${badPlayerId}" player client.`
export const wrongPlayerPhaseNotificationMessage = (badPlayerId:string):string => `This is not "${badPlayerId}" phase.`
export const wrongUnitPhaseNotificationMessage = (currentPhase:Phase):string => `Wrong phase. Currently playing "${currentPhase.phaseType}" phase of unit "${currentPhase.currentUnitId}".`
export const outOfRangeNotificationMessage:string = 'The target is out of Range.'
export const notEnoughActionPointNotificationMessage:string = 'Not enough action point.'
export const positionAlreadyOccupiedNotificationMessage:string = 'The position is already occupied.'
export const wrongPlayerNotificationMessage = (playerId:string, notification: string): string => `The notification '${notification}' should be sent to player '${playerId}'.`
export const notifyPlayerEvent = (playerId: string, message:string) => newGameEvent(Action.notifyPlayer, new Map([[EntityType.player, [playerId]], [EntityType.message, [message]]]))
