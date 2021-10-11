import { Phase } from '../../Components/port/Phase'
import { Action } from '../../Event/Action'
import { EntityType } from '../../Event/EntityType'
import { newGameEvent } from '../../Event/GameEvent'
export const badPlayerEventNotificationMessage = (badPlayerId:string):string => `This is not "${badPlayerId}" player client.`
export const wrongPlayerPhaseNotificationMessage = (badPlayerId:string):string => `This is not "${badPlayerId}" phase.`
export const wrongUnitPhaseNotificationMessage = (currentPhase:Phase):string => `Wrong phase. Currently playing "${currentPhase.phaseType}" phase of unit "${currentPhase.currentUnitId}".`
export const outOfRangeNotificationMessage:string = 'The target is out of Range.'
export const notEnoughActionPointNotificationMessage:string = 'Not enough action point.'
export const positionAlreadyOccupiedNotificationMessage:string = 'The position is already occupied.'
export const wrongPlayerNotificationMessage = (playerId:string, notification: string): string => `The notification '${notification}' should be sent to player '${playerId}'.`
export const notifyEvent = (playerId: string, message:string) => newGameEvent(Action.notify, new Map([[EntityType.player, [playerId]], [EntityType.message, [message]]]))
