import { EntityType } from '../type/EntityType'
import { Component } from '../component/Component'
import { GenericComponent } from '../component/GenericComponent'
import { EntityId } from '../entity/Entity'
import { componentIsNot, noEntityTypeOnEntityReference, multipleEntityTypeOnEntityReference, multipleEntitiesReferencedByEntityType, missingEntityReferenceByEntityType } from '../../messages'

export type EntityReferences = Map<EntityType, Array<string>>

export type EntityReference = GenericComponent<'EntityReference', {
    entityReferences:EntityReferences
    entityType :EntityType[]
}>

const isEntityReference = (component:Component): component is EntityReference => {
    return component.componentType === 'EntityReference'
}

export const toEntityReference = (component:Component): EntityReference => {
    if (isEntityReference(component)) return component as EntityReference
    throw new Error(componentIsNot(component, 'EntityReference'))
}

export const makeEntityReference = (entityId: string, entityType:EntityType|EntityType[], entityReferences:EntityReferences = new Map()): EntityReference => ({
    componentType: 'EntityReference',
    entityId,
    entityReferences,
    entityType: Array.isArray(entityType) ? entityType : [entityType]
})

export const retrieveEntityType = (entityReference:EntityReference, entityId:EntityId): EntityType => {
    if (entityReference.entityType.length === 1) return entityReference.entityType[0]
    if (entityReference.entityType.length === 0) throw new Error(noEntityTypeOnEntityReference(entityId, entityReference.entityType))
    throw new Error(multipleEntityTypeOnEntityReference(entityId, entityReference.entityType))
}

export const retrieveReference = (entityReference:EntityReference, referenceEntityType:EntityType) => {
    const references = retrieveReferences(entityReference, referenceEntityType)
    if (references.length === 1) return references[0]
    if (references.length > 1) throw new Error(multipleEntitiesReferencedByEntityType(referenceEntityType, entityReference, retrieveReferences(entityReference, referenceEntityType)))
    throw new Error(missingEntityReferenceByEntityType(referenceEntityType, entityReference))
}

export const retrieveReferences = (entityReference:EntityReference, entityType:EntityType) => {
    const entityReferences = entityReference.entityReferences.get(entityType)
    if (entityReferences) return entityReferences
    throw new Error(missingEntityReferenceByEntityType(entityType, entityReference))
}

export const hasReferences = (entityReference:EntityReference, entityType:EntityType) => {
    const entityReferences = entityReference.entityReferences.get(entityType)
    if (!entityReferences || entityReferences.length === 0) return false
    return true
}
