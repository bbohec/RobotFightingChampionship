import { EntityType } from '../Event/EntityType'
import { EntityReferences } from '../Event/GameEvent'
import { GenericComponent } from './GenericComponent'

export class EntityReference extends GenericComponent {
    constructor (entityId: string, entityType:EntityType[] | EntityType, entityReferences:EntityReferences = new Map()) {
        super(entityId)
        this.entityType = (Array.isArray(entityType)) ? entityType : [entityType]
        this.entityReferences = entityReferences
    }

    retrieveReference (referenceEntityType:EntityType) {
        const references = this.retrieveReferences(referenceEntityType)
        if (references.length === 1) return references[0]
        if (references.length > 1) throw new Error(multipleEntitiesReferencedByEntityType(referenceEntityType, this.entityId, this.entityType, this.retrieveReferences(referenceEntityType)))
        throw new Error(missingEntityReferenceByEntityType(referenceEntityType, this.entityType, this.entityId))
    }

    retrieveReferences (entityType:EntityType) {
        const entityReferences = this.entityReferences.get(entityType)
        if (entityReferences) return entityReferences
        throw new Error(missingEntityReferenceByEntityType(entityType, this.entityType, this.entityId))
    }

    hasReferences (entityType:EntityType) {
        const entityReferences = this.entityReferences.get(entityType)
        if (!entityReferences || entityReferences.length === 0) return false
        return true
    }

    entityReferences:EntityReferences = new Map()
    entityType :EntityType[]
}
const missingEntityReferenceByEntityType = (entityRefType: EntityType, entityType:EntityType[], entityId: string): string => `There is not entity type '${entityRefType}' on entity references component of entity '${entityType}' with id '${entityId}'.`
const multipleEntitiesReferencedByEntityType = (referenceEntityType: EntityType, entityId: string, entityType:EntityType[], references:string []): string => `There is multiples '${referenceEntityType}' references for entity type on entity references component of the '${entityType}' entity '${entityId}' : ${references}`
