import { EntityReferences } from '../ecs/components/EntityReference'
import { Component } from '../ecs/component'
import { Action } from './Action'
import { stringifyWithDetailledSetAndMap } from '../../messages'

export type GameEvent = {
    action:Action
    entityRefences:EntityReferences
    components:Component[]
    message?:string
}

export const MissingOriginEntityId = 'originEntityId is missing on game event.'
export const MissingTargetEntityId = 'targetEntityId is missing on game event.'
export const errorMessageOnUnknownEventAction = (systemName:string, gameEvent: GameEvent) => `The system '${systemName}' don't know what to do with :
- game Event message : '${gameEvent.action}'
- entity references : '${stringifyWithDetailledSetAndMap(gameEvent.entityRefences)}'
- component : '${stringifyWithDetailledSetAndMap(gameEvent.components)}'`

export const newGameEvent = (action:Action, entityRefences:EntityReferences, components:Component[] = [], message?:string):GameEvent => ({ action, entityRefences, components, message })
