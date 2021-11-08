import { GenericComponent } from '../Components/GenericComponent'
import { Component } from '../Components/port/Component'
import { PotentialClass } from '../Entities/ports/PotentialClass'
import { Action } from './Action'
import { EntityType } from './EntityType'
import { stringifyWithDetailledSetAndMap } from './detailledStringify'
export type EntityReferences = Map<EntityType, Array<string>>
interface GameEventContract {
    action:Action
    entityRefences:EntityReferences
    components:GenericComponent[]
}
export class GameEvent implements GameEventContract {
    constructor (gameEvent:GameEventContract) {
        this.action = gameEvent.action
        this.entityRefences = gameEvent.entityRefences
        this.components = gameEvent.components
    }

    entitiesByEntityType (entityType:EntityType) {
        const entities = this.entityRefences.get(entityType)
        if (!entities) throw new Error(noEntitiesReferenced(entityType, this.action, this.entityRefences))
        return entities
    }

    entityByEntityType (entityType:EntityType) {
        const entities = this.entitiesByEntityType(entityType)
        if (entities.length > 1) throw new Error(multipleEntityReferenced(entityType))
        if (entities.length === 0) throw new Error(noEntityReferenced(entityType))
        return Array.from(entities)[0]
    }

    hasEntitiesByEntityType (entityType:EntityType):boolean {
        const entities = this.entityRefences.get(entityType)
        return !(!entities)
    }

    allEntityTypes ():EntityType[] {
        return Array.from(this.entityRefences.keys())
    }

    allEntities () {
        const union = (...sets:string[][]) => sets.reduce((combined, list) => [...combined, ...list], [])
        return union(...this.entityRefences.values())
    }

    retrieveComponent <Class extends Component> (entityId:string, potentialComponent: PotentialClass<Class>):Class {
        for (const component of this.components.values()) if (component instanceof potentialComponent && component.entityId === entityId) return component as Class
        throw new Error(componentMissingOnGameEvent<Class>(potentialComponent, entityId, this.components))
    }

    readonly components: GenericComponent[]
    readonly action: Action
    readonly entityRefences: EntityReferences
}
export const MissingOriginEntityId = 'originEntityId is missing on game event.'
export const MissingTargetEntityId = 'targetEntityId is missing on game event.'
export const errorMessageOnUnknownEventAction = (systemName:string, gameEvent: GameEventContract) => `The system '${systemName}' don't know what to do with :
- game Event message : '${gameEvent.action}'
- entity references : '${stringifyWithDetailledSetAndMap(gameEvent.entityRefences)}'
- component : '${stringifyWithDetailledSetAndMap(gameEvent.components)}'`

export const newGameEvent = (action:Action, entityRefences:EntityReferences, components:GenericComponent[] = []):GameEvent => new GameEvent({ action, entityRefences, components: components })
const noEntitiesReferenced = (entityType: EntityType, action: Action, entityReferences: EntityReferences): string => `No entities referenced with type '${entityType}' on event with action '${action}'.\n Actual references: ${stringifyWithDetailledSetAndMap(entityReferences)}`
const noEntityReferenced = (entityType: EntityType): string => `No '${entityType}' entities is not supported.`
const multipleEntityReferenced = (entityType: EntityType): string => `Multiple '${entityType}' entities referenced.`
const componentMissingOnGameEvent = <Class extends Component> (potentialComponent: PotentialClass<Class>, id: any, components: GenericComponent[]): string =>
    `The component '${potentialComponent.name}' of the entity '${id}' is missing on Game Event components:
    ${components}`
