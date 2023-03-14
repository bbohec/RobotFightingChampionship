import { componentIsNot, missingEntityReferenceByEntityType, multipleEntitiesReferencedByEntityType, multipleEntityTypeOnEntityReference, noEntityTypeOnEntityReference } from '../../../messages'
import { ComponentRepository } from '../../port/ComponentRepository'
import { EntityType } from '../../type/EntityType'
import { Component, GenericComponent } from '../component'
import { EntityId } from '../entity'

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

export const unlinkEntities = (originEntityReference: EntityReference, targetEntityReference: EntityReference): void => {
    deleteReference(originEntityReference, targetEntityReference.entityType, targetEntityReference.entityId)
    deleteReference(targetEntityReference, originEntityReference.entityType, originEntityReference.entityId)
}
const deleteReference = (entityReference: EntityReference, entityTypes: EntityType[], entityIdToRemovefromReferences: string) => {
    entityTypes.forEach(entityType => entityReference.entityReferences.set(entityType, retrieveReferences(entityReference, entityType).filter(reference => reference !== entityIdToRemovefromReferences)))
}

export const linkEntityToEntities = (componentRepository:ComponentRepository, originEntityId: string, targetEntityIds: string[]): void => {
    targetEntityIds.forEach(targetEntityId => linkEntities(componentRepository, originEntityId, targetEntityId))
}

const linkEntities = (componentRepository:ComponentRepository, originEntityId: string, targetEntityId: string): void => {
    const entityReferenceOriginEntity = componentRepository.retrieveComponent(originEntityId, 'EntityReference')
    const entityReferenceTargetEntity = componentRepository.retrieveComponent(targetEntityId, 'EntityReference')
    entityReferenceOriginEntity.entityType.forEach(entityType => addReference(entityType, originEntityId, entityReferenceTargetEntity))
    entityReferenceTargetEntity.entityType.forEach(entityType => addReference(entityType, targetEntityId, entityReferenceOriginEntity))
}

const addReference = (entityType: EntityType, entityId:string, entityReference: EntityReference): void => {
    let references = entityReference.entityReferences.get(entityType)
    if (references) {
        if (!references.some(referenceEntityIds => referenceEntityIds === entityId))references.push(entityId)
    } else { references = [entityId] }
    entityReference.entityReferences.set(entityType, references)
}
