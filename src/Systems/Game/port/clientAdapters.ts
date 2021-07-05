import { DrawingPort } from '../../Drawing/port/DrawingPort'
import { SystemInteractor } from '../../Generic/port/SystemInteractor'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { GenericAdapter } from './genericAdapters'
export interface clientAdapters extends GenericAdapter {
    drawingInteractor: DrawingPort
    identifierInteractor: IdentifierAdapter
    systemInteractor: SystemInteractor;
}
