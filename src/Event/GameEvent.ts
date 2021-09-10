import { Action } from './Action'
import { EntityType } from './EntityType'
import { stringifyWithDetailledSetAndMap } from './test'
export type EntityReferences = Map<EntityType, Array<string>>
interface GameEventContract {
    action:Action
    entityRefences:EntityReferences
}
export class GameEvent implements GameEventContract {
    constructor (gameEvent:GameEventContract) {
        this.action = gameEvent.action
        this.entityRefences = gameEvent.entityRefences
    }

    entitiesByEntityType (entityType:EntityType) {
        const entities = this.entityRefences.get(entityType)
        if (!entities) throw new Error(`No entity referenced with type '${entityType}' on event with action '${this.action}'.\n Actual references: ${stringifyWithDetailledSetAndMap(this.entityRefences)}`)
        return entities
    }

    entityByEntityType (entityType:EntityType) {
        const entities = this.entitiesByEntityType(entityType)
        if (entities.length > 1) throw new Error(`Multiple '${entityType}' entities referenced.`)
        if (entities.length === 0) throw new Error(`No '${entityType}' entities is not supported.`)
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

    readonly action: Action
    readonly entityRefences: EntityReferences
}
export const MissingOriginEntityId = 'originEntityId is missing on game event.'
export const MissingTargetEntityId = 'targetEntityId is missing on game event.'
export const errorMessageOnUnknownEventAction = (systemName:string, gameEvent: GameEventContract) => `The system '${systemName}' don't know what to do with game Event message '${gameEvent.action}' and entity references '${stringifyWithDetailledSetAndMap(gameEvent.entityRefences)}'.`
export const newEvent = (action:Action, entityRefences:EntityReferences):GameEvent => new GameEvent({ action, entityRefences })
