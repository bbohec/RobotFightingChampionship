import { Controller } from '../../Components/Controller'
import { Dimensional } from '../../Components/Dimensional'
import { EntityReference, retrieveReferences } from '../../Components/EntityReference'
import { Hittable } from '../../Components/Hittable'
import { LifeCycle } from '../../Components/LifeCycle'
import { Offensive } from '../../Components/Offensive'
import { Phasing } from '../../Components/Phasing'
import { Physical } from '../../Components/Physical'
import { Component, ComponentType } from '../../Components/port/Component'
import { EntityType } from '../../Event/EntityType'
import { Entity } from '../Entity'
import { EntityInteractor } from '../ports/EntityInteractor'

export class InMemoryEntityRepository implements EntityInteractor {
    retrieveOffensive (entityId: string): Offensive {
        return this.retrieveEntityById(entityId).retreiveOffensive()
    }

    retrieveHittable (entityId: string): Hittable {
        return this.retrieveEntityById(entityId).retrieveHittable()
    }

    retrievePhysical (entityId: string): Physical {
        return this.retrieveEntityById(entityId).retreivePhysical()
    }

    retrieveLifeCycle (entityId: string):LifeCycle {
        return this.retrieveEntityById(entityId).retreiveLifeCycle()
    }

    retreivePhasing (entityId: string): Phasing {
        return this.retrieveEntityById(entityId).retrievePhasing()
    }

    retreiveEntityReference (entityId: string): EntityReference {
        return this.retrieveEntityById(entityId).retrieveEntityReference()
    }

    retreiveController (entityId: string): Controller {
        return this.retrieveEntityById(entityId).retrieveController()
    }

    retreiveDimensional (entityId: string): Dimensional {
        return this.retrieveEntityById(entityId).retrieveDimensional()
    }

    saveComponent (component: Component): void {
        const entity = this.retrieveEntityById(component.entityId)
        entity.saveComponent(component)
        this.saveEntity(entity)
    }

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
        const entityReferenceOriginEntity = this.retrieveEntityReference(originEntityId)
        if (!entityReferenceOriginEntity) throw new Error(missingentityReference(originEntityId))
        const entityReferenceTargetEntity = this.retrieveEntityReference(targetEntityId)
        if (!entityReferenceTargetEntity) throw new Error(missingentityReference(targetEntityId))
        entityReferenceOriginEntity.entityType.forEach(entityType => this.addReference(entityType, originEntityId, entityReferenceTargetEntity))
        entityReferenceTargetEntity.entityType.forEach(entityType => this.addReference(entityType, targetEntityId, entityReferenceOriginEntity))
    }

    retrieveEntityReference (entityId: string):EntityReference | undefined {
        return this.retrieveEntityById(entityId).retrieveEntityReference()
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
function missingentityReference (originEntityId: string): string | undefined {
    return `Entity ${originEntityId} missing entity reference component.`
}
