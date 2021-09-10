import { EntityType } from '../Event/EntityType'
import { EntityReferences } from '../Event/GameEvent'
import { GenericComponent } from './GenericComponent'

export class EntityReference extends GenericComponent {
    constructor (entityId: string, entityReferences:EntityReferences) {
        super(entityId)
        this.entityReferences = entityReferences
    }

    retreiveReference (entityType:EntityType) {
        const references = this.retrieveReferences(entityType)
        if (references.length > 1) throw new Error(`There is multiples references for entity type '${entityType}' on entity references component of entity '${this.entityId}'.`)
        return references[0]
    }

    retrieveReferences (entityType:EntityType) {
        const entityReferences = this.entityReferences.get(entityType)
        if (!entityReferences || entityReferences.length === 0) throw new Error(`There is not entity type '${entityType}' on entity references component of entity '${this.entityId}'.`)
        return entityReferences
    }

    entityReferences:EntityReferences = new Map()
}
