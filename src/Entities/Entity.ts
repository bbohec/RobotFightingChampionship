import { Controller, toController } from '../core/components/Controller'
import { Dimensional, toDimensional } from '../core/components/Dimensional'
import { EntityReference, toEntityReference } from '../core/components/EntityReference'
import { Hittable, toHittable } from '../core/components/Hittable'
import { LifeCycle, toLifeCycle } from '../core/components/LifeCycle'
import { Offensive, toOffensive } from '../core/components/Offensive'
import { Phasing, toPhasing } from '../core/components/Phasing'
import { Physical, toPhysical } from '../core/components/Physical'
import { ComponentType } from '../core/component/ComponentType'
import { Component } from '../core/component/Component'
import { componentMissingOnEntity } from '../messages'
import { ComponentManagement } from './ports/ComponentManagement'
import { EntityContract } from './ports/Entity'

export type EntityId = string

export type EntityComponents = Map<ComponentType, Component>

export class Entity implements EntityContract, ComponentManagement {
    hasComponent (componentType: ComponentType): boolean {
        return this.components.has(componentType)
    }

    constructor (id:EntityId) {
        this.id = id
    }

    retrieveComponents (): Component[] {
        return [...this.components.values()]
    }

    deleteAllComponents () {
        this.components.clear()
    }

    saveComponent (component: Component):void {
        this.components.set(component.componentType, component)
    }

    saveComponents (components: Component[]):void {
        for (const component of components) this.saveComponent(component)
    }

    retrieveController ():Controller {
        const component = this.components.get('Controller')
        if (component) return toController(component)
        throw new Error(`Controller component missing on entity ${this.id}`)
    }

    retrieveDimensional ():Dimensional {
        const component = this.components.get('Dimensional')
        if (component) return toDimensional(component)
        throw new Error(`Dimensional component missing on entity ${this.id}`)
    }

    retrievePhasing (): Phasing {
        const component = this.components.get('Phasing')
        if (component) return toPhasing(component)
        throw new Error(`Phasing component missing on entity ${this.id}`)
    }

    retreivePhysical (): Physical {
        const component = this.components.get('Physical')
        if (component) return toPhysical(component)
        throw new Error(`Physical component missing on entity ${this.id}`)
    }

    retrieveEntityReference (): EntityReference {
        const component = this.components.get('EntityReference')
        if (component) return toEntityReference(component)
        throw new Error(`EntityReference component missing on entity ${this.id}`)
    }

    retreiveLifeCycle (): LifeCycle {
        const component = this.components.get('LifeCycle')
        if (component) return toLifeCycle(component)
        throw new Error(`LifeCycle component missing on entity ${this.id}`)
    }

    toComponent<T> (componentType:ComponentType, validator:(component:Component)=>T) : T {
        const component = this.components.get(componentType)
        if (component) return validator(component)
        throw new Error(`${componentType} component missing on entity ${this.id}`)
    }

    retreiveOffensive (): Offensive {
        return this.toComponent('Offensive', toOffensive)
    }

    retrieveHittable (): Hittable {
        return this.toComponent('Hittable', toHittable)
    }

    deleteComponent (componentType:ComponentType):void {
        const isDeleted = this.components.delete(componentType)
        if (!isDeleted) throw new Error(componentMissingOnEntity(this.id, this.components))
    }

    readonly id: string
    private components:EntityComponents = new Map()
}
