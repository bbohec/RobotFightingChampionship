import { EntityInteractor } from '../ports/EntityInteractor'
import { Entity } from '../Entity'
import { Component, ComponentType } from '../../Components/port/Component'
import { EntityReference, retrieveReferences } from '../../Components/EntityReference'
import { EntityType } from '../../Event/EntityType'

export class InMemoryEntityRepository implements EntityInteractor {
    retreiveAllComponents ():Component[] {
        const entities = [...this.entities.values()]
        return entities.map(entity => entity.retrieveComponents()).flat()
    }

    unlinkEntities (originEntityReference: EntityReference, targetEntityReference: EntityReference): void {
        this.deleteReference(originEntityReference, targetEntityReference.entityType, targetEntityReference.entityId)
        this.deleteReference(targetEntityReference, originEntityReference.entityType, originEntityReference.entityId)
    }

    hasEntity (entityId: string): boolean {
        return this.entities.has(entityId)
    }

    linkEntityToEntities (originEntityId: string, targetEntityIds: string[]): void {
        targetEntityIds.forEach(targetEntityId => this.linkEntities(originEntityId, targetEntityId))
    }

    linkEntities (originEntityId: string, targetEntityId: string): void {
        const entityReferenceOriginEntity = this.retrieveComponent<EntityReference>(originEntityId)
        const entityReferenceTargetEntity = this.retrieveComponent<EntityReference>(targetEntityId)
        entityReferenceOriginEntity.entityType.forEach(entityType => this.addReference(entityType, originEntityId, entityReferenceTargetEntity))
        entityReferenceTargetEntity.entityType.forEach(entityType => this.addReference(entityType, targetEntityId, entityReferenceOriginEntity))
    }

    addReference (entityType: EntityType, entityId:string, entityReference: EntityReference): void {
        let references = entityReference.entityReferences.get(entityType)
        if (references) {
            if (!references.some(referenceEntityIds => referenceEntityIds === entityId))references.push(entityId)
        } else { references = [entityId] }
        entityReference.entityReferences.set(entityType, references)
    }

    deleteReference (entityReference: EntityReference, entityTypes: EntityType[], entityIdToRemovefromReferences: string) {
        entityTypes.forEach(entityType => entityReference.entityReferences.set(entityType, retrieveReferences(entityReference, entityType).filter(reference => reference !== entityIdToRemovefromReferences)))
    }

    retrieveComponent<Class extends Component> (entityId: string): Class {
        if (this.hasEntityById(entityId)) return this.retrieveEntityById(entityId).retrieveComponent<Class>()
        throw new Error(cannotRetrieveComponentOnMissingEntity<Class>(entityId))
    }

    isEntityHasComponentsByEntityId (entityId: string): boolean {
        return this.retrieveEntityById(entityId).hasComponents()
    }

    deleteEntity (entityId: string) {
        this.entities.delete(entityId)
    }

    private retrieveEntityById (entityId: string): Entity {
        const entity = this.entities.get(entityId)
        if (entity) return entity
        const entityIds:string[] = []
        for (const key of this.entities.keys()) entityIds.push(key)
        throw new Error(missingEntityId(entityId, entityIds))
    }

    retrieveEntitiesThatHaveComponent (componentType:ComponentType): Entity[] {
        const entitiesWithComponent:Entity[] = []
        for (const entity of this.entities.values()) if (entity.hasComponent(componentType)) entitiesWithComponent.push(entity)
        return entitiesWithComponent
    }

    saveEntity (entity: Entity): void {
        this.entities.set(entity.id, entity)
    }

    addEntities (entities: Entity[]): void {
        for (const entity of entities) this.saveEntity(entity)
    }

    hasEntityById (entityId:string):boolean {
        return this.entities.has(entityId)
    }

    entities: Map<string, Entity> = new Map([])
}
export const missingEntityId = (entityId: string, entityIds?: string[]): string => `Entity with id '${entityId}' missing on entity repository. ${entityIds ? `Current entities: ${entityIds}` : ''}`
export const cannotRetrieveComponentOnMissingEntity = <T extends Component> (entityId: string): string => `Cannot retrieve component '${({} as T).componentType}'. The entity '${entityId}' is missing on Entity Repository.`
