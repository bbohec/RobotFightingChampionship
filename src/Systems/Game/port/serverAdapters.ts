import { EntityInteractor } from '../../../Entities/GenericEntity/ports/EntityInteractor'
import { EventInteractor } from '../../GameEventDispatcher/port/EventInteractor'
import { SystemInteractor } from '../../Generic/port/SystemInteractor'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'

export interface serverAdapters {
    identifierInteractor: IdentifierAdapter
    eventInteractor: EventInteractor;
    systemInteractor: SystemInteractor;
    entityInteractor: EntityInteractor;
}
