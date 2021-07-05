import { SystemInteractor } from '../../Generic/port/SystemInteractor'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { GenericAdapter } from './genericAdapters'

export interface serverAdapters extends GenericAdapter {
    identifierInteractor: IdentifierAdapter
    systemInteractor: SystemInteractor;
}
