import { Component, ComponentType } from '../../core/ecs/component'
import { EntityReference } from '../../core/ecs/components/EntityReference'
import { Physical } from '../../core/ecs/components/Physical'
import { EntityId } from '../../core/ecs/entity'
import { ComponentRepository } from '../../core/port/ComponentRepository'

type ComponentByIdByType = { [T in ComponentType]: Map<EntityId, Extract<Component, {componentType: T}>> }

export class InMemoryComponentRepository implements ComponentRepository {
    retrieveComponent<C extends ComponentType> (id: EntityId, componentType: C): Extract<Component, {componentType: C}> {
        const component = this.componentsByTypeById[componentType].get(id)
        if (component) return component
        throw new Error(`Component '${componentType}' missing for entity '${id}'.`)
    }

    retreiveAllComponents ():Component[] {
        return Object.entries(this.componentsByTypeById).map(([componentType, componentsById]) => [...componentsById.values()]).flat()
    }

    retrievePhysicals (entities: string[] | undefined): (Physical| undefined)[] {
        return entities
            ? entities.map(entity => this.componentsByTypeById.Physical.get(entity))
            : [...this.componentsByTypeById.Physical.values()]
    }

    retrieveEntityReferences (entityIds: EntityId[] | undefined): (EntityReference | undefined)[] {
        return entityIds
            ? entityIds.map(entityId => this.componentsByTypeById.EntityReference.get(entityId))
            : [...this.componentsByTypeById.EntityReference.values()]
    }

    saveComponent <T extends ComponentType> (component: Extract<Component, {componentType: T}>): void {
        const map = this.componentsByTypeById[component.componentType] as Map<EntityId, Component>
        map.set(component.entityId, component)
    }

    saveComponents (components: Component[]): void {
        components.forEach(component => this.saveComponent(component))
    }

    deleteEntityComponents (entityId: EntityId): void {
        Object.values(this.componentsByTypeById)
            .forEach((componentsById) => componentsById.delete(entityId))
    }

    entitiesWithType (componentType: ComponentType): EntityId[] {
        return Object.keys(this.componentsByTypeById[componentType])
    }

    private componentsByTypeById: ComponentByIdByType = {
        Controller: new Map(),
        Dimensional: new Map(),
        EntityReference: new Map(),
        Hittable: new Map(),
        LifeCycle: new Map(),
        Loopable: new Map(),
        Offensive: new Map(),
        Phasing: new Map(),
        Physical: new Map()
    }
}
