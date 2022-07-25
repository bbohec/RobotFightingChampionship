import { EntityReference, EntityReferences } from './Components/EntityReference'
import { Component, ComponentType } from './Components/port/Component'
import { Phase } from './Components/port/Phase'
import { EntityComponents } from './Entities/Entity'
import { Action } from './Event/Action'
import { stringifyWithDetailledSetAndMap } from './Event/detailledStringify'
import { EntityType } from './Event/EntityType'
import { GameEvent } from './Event/GameEvent'

export const gameEventNotFoundOnEventInteractor = (expectedEvent: GameEvent, existingEvents: GameEvent[], to:'client'|'server'): string =>
    `The following game event is not found on '${to}' event repository:\n${stringifyWithDetailledSetAndMap(expectedEvent)}
    List of current ${to} events:\n${existingEvents.map(event => stringifyWithDetailledSetAndMap(event)).join('\n')}`
export function missingCurrentUnitIdOnPhase (currentPhase: Phase): string {
    return `Missing currentUnitId on phase ${currentPhase.phaseType}.`
}
export const componentIsNot = (component: Component, componentType:ComponentType): string => `${component} is not ${componentType}.`

export const missingEntityReferenceByEntityType = (entityRefType: EntityType, entityReference:EntityReference): string => `There is not entity type '${entityRefType}' on entity references component of entity '${entityReference.entityType}' with id '${entityReference.entityId}'.`
export const multipleEntitiesReferencedByEntityType = (referenceEntityType: EntityType, entityReference: EntityReference, references:string []): string => `There is multiples '${referenceEntityType}' references for entity type on entity references component of the '${entityReference.entityType}' entity '${entityReference.entityId}' : ${references}`
export const noEntityTypeOnEntityReference = (entityId: string, entityType:EntityType[]): string => `There is no entity type for the '${entityType}' entity '${entityId}'.`
export const multipleEntityTypeOnEntityReference = (entityId: string, entityTypes:EntityType[]): string => `There is multiple entity types for entity '${entityId}' : ${entityTypes}`
export const componentMissingOnEntity = (id: string, components: EntityComponents): string => `Component missing on entity id '${id}'. Available components: \n${stringifyWithDetailledSetAndMap(components)}`
export const entityAlreadyBuild = 'Entity already built on builder. Forget save()?'
export const noEntitiesReferenced = (entityType: EntityType, action: Action, entityReferences: EntityReferences): string => `No entities referenced with type '${entityType}' on event with action '${action}'.\n Actual references: ${stringifyWithDetailledSetAndMap(entityReferences)}`
export const noEntityReferenced = (entityType: EntityType): string => `No '${entityType}' entities is not supported.`
export const multipleEntityReferenced = (entityType: EntityType): string => `Multiple '${entityType}' entities referenced.`
export const featureEventDescription = (action:Action): string => `Feature : ${action} events`
