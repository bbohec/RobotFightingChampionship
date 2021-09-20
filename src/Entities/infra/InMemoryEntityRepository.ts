import { EntityInteractor } from '../ports/EntityInteractor'
import { Entity } from '../Entity'
import { PotentialClass } from '../ports/PotentialClass'
import { Component } from '../../Components/port/Component'
import { stringifyWithDetailledSetAndMap } from '../../Event/test'

export class InMemoryEntityRepository implements EntityInteractor {
    retrieveEntityComponentByEntityId<Class extends Component> (entityId: string, potentialComponent: PotentialClass<Class>): Class {
        return this.retrieveEntityById(entityId).retrieveComponent(potentialComponent)
    }

    deleteEntityById (entityId: string) {
        this.entities.delete(entityId)
    }

    retrieveEntityById (entityId: string): Entity {
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
