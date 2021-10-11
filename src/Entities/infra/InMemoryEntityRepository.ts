import { EntityInteractor } from '../ports/EntityInteractor'
import { Entity } from '../Entity'
import { PotentialClass } from '../ports/PotentialClass'
import { Component } from '../../Components/port/Component'
import { stringifyWithDetailledSetAndMap } from '../../Event/test'
import { EntityReference } from '../../Components/EntityReference'
import { EntityType } from '../../Event/EntityType'

export class InMemoryEntityRepository implements EntityInteractor {
    linkEntityToEntities (originEntityId: string, targetEntityIds: string[]): void {
        // [[EntityType.match, [gameEvent.entityByEntityType(EntityType.match)]], [EntityType.player, [gameEvent.entityByEntityType(EntityType.player)]]]
        // this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.match), EntityReference).entityReferences.set(EntityType.button, [playerMatchButtonId])
        // this.interactWithEntities.retrieveEntityComponentByEntityId(gameEvent.entityByEntityType(EntityType.player), EntityReference).entityReferences.set(EntityType.button, [playerMatchButtonId])
        targetEntityIds.forEach(targetEntityId => this.linkEntities(originEntityId, targetEntityId))
    }

    linkEntities (originEntityId: string, targetEntityId: string): void {
        const entityReferenceOriginEntity = this.retrieveEntityComponentByEntityId(originEntityId, EntityReference)
        const entityReferenceTargetEntity = this.retrieveEntityComponentByEntityId(targetEntityId, EntityReference)
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

    retrieveEntityComponentByEntityId<Class extends Component> (entityId: string, potentialComponent: PotentialClass<Class>): Class {
        return this.retrieveEntityById(entityId).retrieveComponent(potentialComponent)
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
        throw new Error(missingEntityId(entityId, this.entities.values()))
    }

    retrieveEntitiesThatHaveComponent<PotentialComponent extends Component> (potentialComponent: PotentialClass<PotentialComponent>): Entity[] {
        const entitiesWithComponent:Entity[] = []
        for (const entity of this.entities.values()) if (entity.hasComponent(potentialComponent)) entitiesWithComponent.push(entity)
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
const missingEntityId = (entityId: string, entities: IterableIterator<Entity>): string => `Entity with id '${entityId}' missing on entity repository. Current entities: ${stringifyWithDetailledSetAndMap(entities)}`
