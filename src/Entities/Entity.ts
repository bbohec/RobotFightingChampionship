import { Component, ComponentName, isComponent } from '../Components/port/Component'
import { stringifyWithDetailledSetAndMap } from '../Event/detailledStringify'
import { ComponentManagement } from './ports/ComponentManagement'
import { EntityContract } from './ports/Entity'

export type EntityId = string

type EntityComponents = Map<ComponentName, Component>

export class Entity implements EntityContract, ComponentManagement {
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

    hasComponent <T extends Component> (): boolean {
        for (const component of this.components.values()) if (isComponent<T>(component)) return true
        return false
    }

    addComponent (component: Component):void {
        this.components.set(component.componentType, component)
    }

    addComponents (components: Component[]):void {
        for (const component of components) this.addComponent(component)
    }

    retrieveComponent <T extends Component> ():T {
        const component = this.components.get(({} as T).componentType)
        if (component && isComponent<T>(component)) return component as T
        throw new Error(componentMissingOnEntity<T>(this.id, this.components))
    }

    deleteComponent <T extends Component> ():void {
        const isDeleted = this.components.delete(this.retrieveComponent<T>().componentType)
        if (!isDeleted) throw new Error(componentNotDeleted<T>())
    }

    readonly id: string
    private components:EntityComponents = new Map()
}
const componentMissingOnEntity = <T extends Component> (id: string, components: EntityComponents): string => `Component '${({}as T).componentType}' missing on entity id '${id}'.\nAvailable components: ${stringifyWithDetailledSetAndMap(components)}`
const componentNotDeleted = <T extends Component> (): string => `Component '${({}as T).componentType}' is not deleted.`
