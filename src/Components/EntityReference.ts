import { EntityType } from '../Event/EntityType'
import { EntityReferences } from '../Event/GameEvent'
import { GenericComponent } from './GenericComponent'

export class EntityReference extends GenericComponent {
    constructor (entityId: string, entityType:EntityType[] | EntityType, entityReferences:EntityReferences = new Map()) {
        super(entityId)
        this.entityType = (Array.isArray(entityType)) ? entityType : [entityType]
        this.entityReferences = entityReferences
    }

    retreiveReference (entityType:EntityType) {
        const references = this.retrieveReferences(entityType)
        if (references.length === 1) return references[0]
        throw new Error(multipleEntitiesReferencedByEntityType(entityType, this.entityId))
    }

    retrieveReferences (entityType:EntityType) {
        const entityReferences = this.entityReferences.get(entityType)
        if (entityReferences && entityReferences.length > 0) return entityReferences
        throw new Error(missingEntityReferenceByEntityType(entityType, this.entityId))
    }

    hasReferences (entityType:EntityType) {
        const entityReferences = this.entityReferences.get(entityType)
        if (!entityReferences || entityReferences.length === 0) return false
        return true
    }

    entityReferences:EntityReferences = new Map()
    entityType :EntityType[]
}
const missingEntityReferenceByEntityType = (entityType: EntityType, entityId: string): string => `There is not entity type '${entityType}' on entity references component of entity '${entityId}'.`
const multipleEntitiesReferencedByEntityType = (entityType: EntityType, entityId: string): string => `There is multiples references for entity type '${entityType}' on entity references component of entity '${entityId}'.`
