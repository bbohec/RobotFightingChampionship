import { Action } from './Action'
import { EntityType } from './EntityType'
export interface GameEvent {
    action:Action
    targetEntityType:EntityType
    targetEntityId?:string
    originEntityType: EntityType
    originEntityId?:string
}
export const MissingOriginEntityId = 'originEntityId is missing on game event.'
export const MissingTargetEntityId = 'targetEntityId is missing on game event.'
export const errorMessageOnUnknownEventAction = (systemName:string, gameEvent: GameEvent) => `${systemName} don't know what to do with game Event message '${gameEvent.action}' and destination '${gameEvent.targetEntityType}'.`
export const newEvent = (action:Action, originEntityType:EntityType, targetEntityType:EntityType, targetEntityId?:string, originEntityId?:string):GameEvent => ({ action, originEntityType, targetEntityType, targetEntityId, originEntityId })
