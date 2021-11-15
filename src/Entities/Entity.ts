import { GenericComponent } from '../Components/GenericComponent'
import { Component } from '../Components/port/Component'
import { stringifyWithDetailledSetAndMap } from '../Event/detailledStringify'
import { ComponentManagement } from './ports/ComponentManagement'
import { EntityContract } from './ports/Entity'
import { PotentialClass } from './ports/PotentialClass'
export class Entity implements EntityContract, ComponentManagement {
    constructor (id:string) {
        this.id = id
    }

    deleteAllComponents () {
        this.components.clear()
    }

    hasComponents (): boolean {
        if (this.components.size > 0) return true
        return false
    }

    hasComponent (potentialComponent: PotentialClass<Component>): boolean {
        for (const component of this.components.values()) if (component instanceof potentialComponent) return true
        return false
    }

    addComponent (component: Component):void {
        this.components.add(component)
    }

    addComponents (components: Component[]):void {
        for (const component of components) this.addComponent(component)
    }

    retrieveComponent <Class extends GenericComponent> (potentialComponent: PotentialClass<Class>):Class {
        for (const component of this.components.values()) if (component instanceof potentialComponent) return component as Class
        throw new Error(componentMissingOnEntity<Class>(potentialComponent, this.id, this.components))
    }

    deleteComponent <Class extends Component> (potentialComponent: PotentialClass<Class>):void {
        const isDeleted = this.components.delete(this.retrieveComponent(potentialComponent))
        if (!isDeleted) throw new Error(componentNotDeleted<Class>(potentialComponent))
    }

    readonly id: string
    private components:Set<Component> = new Set<Component>()
}
const componentMissingOnEntity = <Class extends Component> (potentialComponent: PotentialClass<Class>, id: string, components: Set<Component>): string => `Component '${potentialComponent.name}' missing on entity id '${id}'.\nAvailable components: ${stringifyWithDetailledSetAndMap(components)}`
const componentNotDeleted = <Class extends Component> (potentialComponent: PotentialClass<Class>): string => `Component '${potentialComponent.name}' is not deleted.`
