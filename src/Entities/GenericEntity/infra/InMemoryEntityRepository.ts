import { EntityInteractor } from '../ports/EntityInteractor'
import { GenericEntity } from '../GenericEntity'
import { PotentialClass } from '../ports/PotentialClass'
import { Component } from '../../../Components/port/Component'
import { stringifyWithDetailledSetAndMap } from '../../../Event/test'

export class InMemoryEntityRepository implements EntityInteractor {
    deleteEntityById (entityId: string) {
        this.entities.delete(entityId)
    }

    retrieveEntityById (entityId: string): GenericEntity {
        const entity = this.entities.get(entityId)
        if (entity) return entity
        throw new Error(`Entity with id '${entityId}' not found on entity repository. Current entities: ${stringifyWithDetailledSetAndMap(this.entities.values())}`)
    }

    retrieveEntitiesThatHaveComponent<PotentialEntity extends GenericEntity, PotentialComponent extends Component> (potentialEntity: PotentialClass<PotentialEntity>, potentialComponent: PotentialClass<PotentialComponent>): PotentialEntity[] {
        const entitiesWithComponent:PotentialEntity[] = []
        for (const entity of this.entities.values()) if (entity instanceof potentialEntity && entity.hasComponent(potentialComponent)) entitiesWithComponent.push(entity as PotentialEntity)
        return entitiesWithComponent
    }

    retrieveEntityByClass <Class extends GenericEntity> (potentialClass: PotentialClass<Class>): Class {
        for (const entity of this.entities.values()) if (entity instanceof potentialClass) return entity as Class
        throw new Error(`Entity '${potentialClass.name}' not found on entity repository. Current entities: ${stringifyWithDetailledSetAndMap(this.entities.values())}`)
    }

    addEntity (entity: GenericEntity): void {
        this.entities.set(entity.id, entity)
    }

    addEntities (entities: GenericEntity[]): void {
        for (const entity of entities) this.addEntity(entity)
    }

    hasEntityById (entityId:string):boolean {
        return this.entities.has(entityId)
    }

    hasEntityByClass <Class extends GenericEntity> (potentialClass: PotentialClass<Class>):boolean {
        for (const entity of this.entities.values()) if (entity instanceof potentialClass) return true
        return false
    }

    entities: Map<string, GenericEntity> = new Map([])
}
