import { EntityReferences } from '../Components/EntityReference'
import { Component, isComponent, toComponent } from '../Components/port/Component'
import { Action } from './Action'
import { stringifyWithDetailledSetAndMap } from './detailledStringify'
import { EntityType } from './EntityType'
import { GameEvent } from './GameEvent'

export class GameEventHandler {
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

    retrieveComponent <T extends Component> (event:GameEvent, entityId:string):T {
        for (const component of event.components.values())
            if (isComponent<T>(component) && component.entityId === entityId) return toComponent<T>(component)
        throw new Error(componentMissingOnGameEvent<T>(entityId, event.components))
    }
}

const noEntitiesReferenced = (entityType: EntityType, action: Action, entityReferences: EntityReferences): string => `No entities referenced with type '${entityType}' on event with action '${action}'.\n Actual references: ${stringifyWithDetailledSetAndMap(entityReferences)}`
const noEntityReferenced = (entityType: EntityType): string => `No '${entityType}' entities is not supported.`
const multipleEntityReferenced = (entityType: EntityType): string => `Multiple '${entityType}' entities referenced.`
const componentMissingOnGameEvent = <Class extends Component> (id: any, components: Component[]): string =>
    `The component '${({} as Class).componentType}' of the entity '${id}' is missing on Game Event components:
    ${components}`
