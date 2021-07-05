import { EntityInteractor } from '../ports/EntityInteractor'
import { GenericEntity } from '../GenericEntity'
import { PotentialClass } from '../ports/PotentialClass'
import { Component } from '../../../Component/port/Component'

export class InMemoryEntityRepository implements EntityInteractor {
    retrieveEntityById (entityId: string): GenericEntity {
        for (const entity of this.entities.values()) if (entity.id === entityId) return entity
        throw new Error(`Entity with id '${entityId}' not found on entity repository.`)
    }

    retrieveEntitiesThatHaveComponent<PotentialEntity extends GenericEntity, PotentialComponent extends Component> (potentialEntity: PotentialClass<PotentialEntity>, potentialComponent: PotentialClass<PotentialComponent>): PotentialEntity[] {
        const entitiesWithComponent:PotentialEntity[] = []
        for (const entity of this.entities.values()) if (entity instanceof potentialEntity && entity.hasComponent(potentialComponent)) entitiesWithComponent.push(entity as PotentialEntity)
        return entitiesWithComponent
    }

    retrieveEntityByClass <Class extends GenericEntity> (potentialClass: PotentialClass<Class>): Class {
        for (const entity of this.entities.values()) if (entity instanceof potentialClass) return entity as Class
        throw new Error(`Entity '${potentialClass.name}' not found on entity repository.`)
    }

    addEntity (Entity: GenericEntity): void {
        this.entities.add(Entity)
    }

    entities: Set<GenericEntity> = new Set([])
}
