import { Action } from './Action'
import { EntityType } from './EntityType'
export interface GameEvent {
    action:Action
    targetEntityType:EntityType
    targetEntityId?:string
    originEntityId?:string
}
