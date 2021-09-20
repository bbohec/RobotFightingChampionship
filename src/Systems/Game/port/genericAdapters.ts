import { EntityInteractor } from '../../../Entities/ports/EntityInteractor'
import { EventInteractor } from '../../GameEventDispatcher/port/EventInteractor'
export interface GenericAdapter {
    entityInteractor: EntityInteractor;
    eventInteractor: EventInteractor;
}
