import { Component, ComponentType } from '../../core/ecs/component'
import { Controller, toController } from '../../core/ecs/components/Controller'
import { Dimensional, toDimensional } from '../../core/ecs/components/Dimensional'
import { EntityReference, toEntityReference } from '../../core/ecs/components/EntityReference'
import { Hittable, toHittable } from '../../core/ecs/components/Hittable'
import { LifeCycle, toLifeCycle } from '../../core/ecs/components/LifeCycle'
import { Offensive, toOffensive } from '../../core/ecs/components/Offensive'
import { Phasing, toPhasing } from '../../core/ecs/components/Phasing'
import { Physical, toPhysical } from '../../core/ecs/components/Physical'
import { EntityId } from '../../core/ecs/entity'
import { ComponentRepository } from '../../core/port/ComponentRepository'

export class InMemoryComponentRepository implements ComponentRepository {
    retreiveAllComponents ():Component[] {
        return Array.from(this.components.values()).map(componentType => Array.from(componentType.values())).flat()
    }

    retrievePhysicals (entities: string[] | undefined): (Physical| undefined)[] {
        const physicals = this.components.get('Physical') as Map<string, Physical>|undefined
        return physicals
            ? entities
                ? entities.map(entity => physicals.get(entity))
                : [...physicals.values()]
            : []
    }

    retrieveEntityReferences (entities: string[] | undefined): (EntityReference | undefined)[] {
        const entityReferences = this.components.get('EntityReference') as Map<string, EntityReference>|undefined
        return entityReferences
            ? entities
                ? entities.map(entity => entityReferences.get(entity))
                : [...entityReferences.values()]
            : []
    }

    retrieveOffensive (entityId: string): Offensive {
        return this.toComponent('Offensive', toOffensive, entityId)
    }

    retrieveHittable (entityId: string): Hittable {
        return this.toComponent('Hittable', toHittable, entityId)
    }

    retrievePhysical (entityId: string): Physical {
        return this.toComponent('Physical', toPhysical, entityId)
    }

    retrieveLifeCycle (entityId: string): LifeCycle {
        return this.toComponent('LifeCycle', toLifeCycle, entityId)
    }

    retrieveController (entityId: string): Controller {
        return this.toComponent('Controller', toController, entityId)
    }

    retrieveDimensional (entityId: string): Dimensional {
        return this.toComponent('Dimensional', toDimensional, entityId)
    }

    retrieveEntityReference (entityId: string): EntityReference {
        return this.toComponent('EntityReference', toEntityReference, entityId)
    }

    retrievePhasing (entityId: string): Phasing {
        return this.toComponent('Phasing', toPhasing, entityId)
    }

    private toComponent<T> (componentType:ComponentType, validator:(component:Component)=>T, entityId:EntityId) : T {
        const componentTypeRepository = this.components.get(componentType)
        if (componentTypeRepository) {
            const component = componentTypeRepository.get(entityId)
            if (component) return validator(component)
            throw new Error(`The component '${componentType}' is missing on entity ${entityId}.`)
        }
        throw new Error(`There is no '${componentType}' components.`)
    }

    saveComponent (component: Component): void {
        const componentType = this.components.get(component.componentType)
        componentType
            ? componentType.set(component.entityId, component)
            : this.components.set(component.componentType, new Map<string, Component>().set(component.entityId, component))
    }

    saveComponents (components: Component[]): void {
        components.forEach(component => this.saveComponent(component))
    }

    deleteEntityComponents (entityId: string): void {
        this.components.forEach(componentType => componentType.delete(entityId))
    }

    entitiesWithType (componentType: ComponentType): EntityId[] {
        const componentTypeRepository = this.components.get(componentType)
        return Array.from(componentTypeRepository ? componentTypeRepository.keys() : [])
    }

    private components: Map<ComponentType, Map<EntityId, Component>> = new Map()
}
