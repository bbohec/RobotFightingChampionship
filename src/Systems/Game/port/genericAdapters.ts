import { EntityInteractor } from '../../../Entities/ports/EntityInteractor'
import { EventInteractor } from '../../../EventInteractor/port/EventInteractor'
export interface GenericAdapter {
    entityInteractor: EntityInteractor;
    eventInteractor: EventInteractor;
}
