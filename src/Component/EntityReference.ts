import { EntityType } from '../Events/port/EntityType'
import { GenericComponent } from './GenericComponent'

export class EntityReference extends GenericComponent {
    entityReferences:Map<string, EntityType> = new Map()
}
