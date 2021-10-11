import { Action } from './Action'
import { EntityReferences } from './GameEvent'
import { SerializedComponent } from '../Components/port/SerializedComponent'

export interface SerializedGameEvent {
    entityRefences: EntityReferences;
    components: SerializedComponent[];
    action: Action;
}
