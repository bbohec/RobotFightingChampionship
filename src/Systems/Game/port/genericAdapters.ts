import { InMemoryEntityRepository } from '../../../Entities/infra/InMemoryEntityRepository'
import { EntityInteractor } from '../../../Entities/ports/EntityInteractor'
import { EventInteractor } from '../../../EventInteractor/port/EventInteractor'
import { SystemInteractor } from '../../Generic/port/SystemInteractor'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
export interface GenericAdapter {
    entityInteractor: EntityInteractor;
    eventInteractor: EventInteractor;
    systemInteractor: SystemInteractor;
    identifierInteractor: IdentifierAdapter
}

export interface TestGenericAdapter {
    entityInteractor: InMemoryEntityRepository;
    eventInteractor: EventInteractor;
    systemInteractor: SystemInteractor;
    identifierInteractor: IdentifierAdapter
}
