import { Controller, toController } from '../components/Controller'
import { Dimensional, toDimensional } from '../components/Dimensional'
import { LifeCycle, toLifeCycle } from '../components/LifeCycle'
import { Physical, toPhysical } from '../components/Physical'
import { ComponentType } from '../component/ComponentType'
import { Component } from '../component/Component'
import { noEntitiesReferenced, multipleEntityReferenced, noEntityReferenced } from '../../messages'
import { EntityType } from '../type/EntityType'
import { GameEvent } from '../type/GameEvent'

export class GameEventHandler {
    retrievePhysical (event:GameEvent, entityId:string):Physical {
        const physical = event.components.find(component => component.componentType === 'Physical' && component.entityId === entityId)
        if (!physical) throw new Error('No physical component found for entityId: ' + entityId)
        return toPhysical(physical)
    }

    retrieveController (event:GameEvent, entityId:string):Controller {
        return this.retreiveComponent(event, entityId, 'Controller', toController)
    }

    private retreiveComponent <T> (event:GameEvent, entityId:string, componentType:ComponentType, validator: (component:Component)=> T):T {
        const component = event.components.find(component => component.componentType === componentType && component.entityId === entityId)
        if (!component) throw new Error(`No ${componentType} component found for entityId ${entityId}`)
        return validator(component)
    }

    retrieveDimensional (event:GameEvent, entityId:string):Dimensional {
        const physical = event.components.find(component => component.componentType === 'Dimensional' && component.entityId === entityId)
        if (!physical) throw new Error('No Dimensional component found for entityId: ' + entityId)
        return toDimensional(physical)
    }

    retrieveLifeCycle (event: GameEvent, entityId: string): LifeCycle {
        const lifeCycle = event.components.find(component => component.componentType === 'LifeCycle' && component.entityId === entityId)
        if (!lifeCycle) throw new Error('No physical component found for entityId: ' + entityId)
        return toLifeCycle(lifeCycle)
    }

    entitiesByEntityType (event:GameEvent, entityType:EntityType) {
        const entities = event.entityRefences.get(entityType)
        if (!entities) throw new Error(noEntitiesReferenced(entityType, event.action, event.entityRefences))
        return entities
    }

    action (entityType: EntityType, action: any, entityRefences: any): string | undefined {
        throw new Error('Method not implemented.')
    }

    entityByEntityType (event:GameEvent, entityType:EntityType) {
        const entities = this.entitiesByEntityType(event, entityType)
        if (entities.length > 1) throw new Error(multipleEntityReferenced(entityType))
        if (entities.length === 0) throw new Error(noEntityReferenced(entityType))
        return Array.from(entities)[0]
    }

    hasEntitiesByEntityType (event:GameEvent, entityType:EntityType):boolean {
        const entities = event.entityRefences.get(entityType)
        return !(!entities)
    }

    allEntityTypes (event:GameEvent):EntityType[] {
        return Array.from(event.entityRefences.keys())
    }

    allEntities (event:GameEvent) {
        const union = (...sets:string[][]) => sets.reduce((combined, list) => [...combined, ...list], [])
        return union(...event.entityRefences.values())
    }
}

/*
const componentMissingOnGameEvent = <Class extends Component> (id: any, components: Component[]): string =>
    `The component '${({} as Class).componentType}' of the entity '${id}' is missing on Game Event components:
    ${components}`
*/
