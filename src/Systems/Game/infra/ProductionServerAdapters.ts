import { InMemoryEntityRepository } from '../../../Entities/infra/InMemoryEntityRepository'
import { EventInteractor, ServerEventInteractor } from '../../../core/port/EventInteractor'
import { InMemorySystemRepository } from '../../Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../LifeCycle/infra/FakeIdentifierAdapter'
import { serverAdapters } from '../port/serverAdapters'

export class ProductionServerAdapters implements serverAdapters {
    constructor (eventInteractor:ServerEventInteractor) {
        this.eventInteractor = eventInteractor
    }

    identifierInteractor=new FakeIdentifierAdapter()
    eventInteractor:EventInteractor
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
