import { EntityType } from '../Events/port/EntityType'
import { GenericComponent } from './GenericComponent'

export class EntityReference extends GenericComponent {
    constructor (entityId: string, entityReferences:Map<string, EntityType>) {
        super(entityId)
        this.entityReferences = entityReferences
    }

    entityReferences:Map<string, EntityType> = new Map()
}
