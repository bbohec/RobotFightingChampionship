import { GameEvent } from './GameEvent'
import { EntityType } from './EntityType'
import { Action } from './Action'

export const errorMessageOnUnknownEventAction = (systemName:string, gameEvent: GameEvent) => `${systemName} don't know what to do with game Event message '${gameEvent.action}' and destination '${gameEvent.targetEntityType}'.`
export const MissingOriginEntityId = 'originEntityId is missing on game event.'
export const MissingTargetEntityId = 'targetEntityId is missing on game event.'

export const newEvent = (action:Action, targetEntityType:EntityType, targetEntityId?:string, originEntityId?:string):GameEvent => ({ action, targetEntityType, targetEntityId, originEntityId })
// export const createGridEvent = (match:string):GameEvent => ({ action: Action.create, targetEntityType: EntityType.grid, originEntityId: match })
// export const registerGridOnMatch = (matchId:string, gridId:string):GameEvent => ({ action: Action.register, targetEntityType: EntityType.match, targetEntityId: matchId, originEntityId: gridId })
