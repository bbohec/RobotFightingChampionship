import { EntityInteractor } from '../../../Entities/GenericEntity/ports/EntityInteractor'
import { DrawingPort } from '../../Drawing/port/DrawingPort'
import { EventInteractor } from '../../GameEventDispatcher/port/EventInteractor'
import { SystemInteractor } from '../../Generic/port/SystemInteractor'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'

export interface clientAdapters {
    drawingInteractor: DrawingPort
    identifierInteractor: IdentifierAdapter
    eventInteractor: EventInteractor;
    systemInteractor: SystemInteractor;
    entityInteractor: EntityInteractor;
}
