import { EntityInteractor } from '../ports/EntityInteractor'
import { Entity } from '../Entity'
import { Component } from '../../Components/port/Component'
import { EntityReference, retrieveReferences } from '../../Components/EntityReference'
import { EntityType } from '../../Event/EntityType'

export class InMemoryEntityRepository implements EntityInteractor {
    unlinkEntities (originEntityReference: EntityReference, targetEntityReference: EntityReference): void {
        this.deleteReference(originEntityReference, targetEntityReference.entityType, targetEntityReference.entityId)
        this.deleteReference(targetEntityReference, originEntityReference.entityType, originEntityReference.entityId)
    }

    isEntityExist (entityId: string): boolean {
        return this.entities.has(entityId)
    }

    linkEntityToEntities (originEntityId: string, targetEntityIds: string[]): void {
        // [[EntityType.match, [gameEvent.entityByEntityType(EntityType.match)]], [EntityType.player, [gameEvent.entityByEntityType(EntityType.player)]]]
        // this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), EntityReference).entityReferences.set(EntityType.button, [playerMatchButtonId])
        // this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.player), EntityReference).entityReferences.set(EntityType.button, [playerMatchButtonId])
        targetEntityIds.forEach(targetEntityId => this.linkEntities(originEntityId, targetEntityId))
    }

    linkEntities (originEntityId: string, targetEntityId: string): void {
        const entityReferenceOriginEntity = this.retrieveyComponentByEntityId<EntityReference>(originEntityId)
        const entityReferenceTargetEntity = this.retrieveyComponentByEntityId<EntityReference>(targetEntityId)
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

    retrieveyComponentByEntityId<Class extends Component> (entityId: string): Class {
        if (this.hasEntityById(entityId)) return this.retrieveEntityById(entityId).retrieveComponent<Class>()
        throw new Error(cannotRetrieveComponentOnMissingEntity<Class>(entityId))
    }

    isEntityHasComponentsByEntityId (entityId: string): boolean {
        return this.retrieveEntityById(entityId).hasComponents()
    }

    deleteEntityById (entityId: string) {
        this.entities.delete(entityId)
    }

    private retrieveEntityById (entityId: string): Entity {
        const entity = this.entities.get(entityId)
        if (entity) return entity
        const entityIds:string[] = []
        for (const key of this.entities.keys()) entityIds.push(key)
        throw new Error(missingEntityId(entityId, entityIds))
    }

    retrieveEntitiesThatHaveComponent<T extends Component> (): Entity[] {
        const entitiesWithComponent:Entity[] = []
        for (const entity of this.entities.values()) if (entity.hasComponent<T>()) entitiesWithComponent.push(entity)
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
