import { EntityInteractor } from '../../../Entities/ports/EntityInteractor'
import { NewEventInteractor } from '../../../EventInteractor/port/NewEventInteractor'
export interface GenericAdapter {
    entityInteractor: EntityInteractor;
    eventInteractor: NewEventInteractor;
}
