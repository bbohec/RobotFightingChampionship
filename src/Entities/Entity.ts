import { Component, ComponentType, isComponent, toComponent } from '../Components/port/Component'
import { stringifyWithDetailledSetAndMap } from '../Event/detailledStringify'
import { ComponentManagement } from './ports/ComponentManagement'
import { EntityContract } from './ports/Entity'

export type EntityId = string

type EntityComponents = Map<ComponentType, Component>

export class Entity implements EntityContract, ComponentManagement {
    retrieveComponents (): Component[] {
        return [...this.components.values()]
    }

    constructor (id:EntityId) {
        this.id = id
    }

    deleteAllComponents () {
        this.components.clear()
    }

    hasComponents (): boolean {
        if (this.components.size > 0) return true
        return false
    }

    hasComponent (componentType:ComponentType): boolean {
        return this.components.has(componentType)
    }

    saveComponent (component: Component):void {
        this.components.set(component.componentType, component)
    }

    saveComponents (components: Component[]):void {
        for (const component of components) this.saveComponent(component)
    }

    retrieveComponent <T extends Component> ():T {
        for (const component of this.components.values())
            if (isComponent<T>(component)) return toComponent<T>(component)
        throw new Error(componentMissingOnEntity(this.id, this.components))
    }

    deleteComponent (componentType:ComponentType):void {
        const isDeleted = this.components.delete(componentType)
        if (!isDeleted) throw new Error(componentMissingOnEntity(this.id, this.components))
    }

    readonly id: string
    private components:EntityComponents = new Map()
}
const componentMissingOnEntity = (id: string, components: EntityComponents): string => `Component missing on entity id '${id}'. Available components: \n${stringifyWithDetailledSetAndMap(components)}`
