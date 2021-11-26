import { EntityType } from '../Event/EntityType'
import { EntityReferences } from '../Event/GameEvent'
import { GenericComponent } from './GenericComponent'

export class EntityReference extends GenericComponent {
    constructor (entityId: string, entityType:EntityType[] | EntityType, entityReferences:EntityReferences = new Map()) {
        super(entityId)
        this.entityType = (Array.isArray(entityType)) ? entityType : [entityType]
        this.entityReferences = entityReferences
    }

    retrieveEntityType (): EntityType {
        if (this.entityType.length === 1) return this.entityType[0]
        if (this.entityType.length === 0) throw new Error(noEntityTypeOnEntityReference(this.entityId))
        throw new Error(multipleEntityTypeOnEntityReference(this.entityId, this.entityType))
    }

    retreiveReference (entityType:EntityType) {
        const references = this.retrieveReferences(entityType)
        if (references.length === 1) return references[0]
        throw new Error(multipleEntitiesReferencedByEntityType(entityType, this.entityId))
    }

    retrieveReferences (entityType:EntityType) {
        const entityReferences = this.entityReferences.get(entityType)
        if (entityReferences && entityReferences.length > 0) return entityReferences
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
const multipleEntitiesReferencedByEntityType = (entityType: EntityType, entityId: string): string => `There is multiples references for entity type '${entityType}' on entity references component of entity '${entityId}'.`
const noEntityTypeOnEntityReference = (entityId: string): string => `There is no entity type for entity '${entityId}'.`
const multipleEntityTypeOnEntityReference = (entityId: string, entityTypes:EntityType[]): string => `There is multiple entity types for entity '${entityId}' : ${entityTypes}`
