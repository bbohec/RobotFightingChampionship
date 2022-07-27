import { ServerEventInteractor, EventInteractor } from '../../../app/core/port/EventInteractor'
import { ServerGameAdapters } from '../../../app/core/port/Game'
import { InMemoryEntityRepository } from '../../entity/InMemoryEntityRepository'
import { FakeIdentifierAdapter } from '../../identifier/FakeIdentifierAdapter'
import { InMemorySystemRepository } from '../../system/InMemorySystemInteractor'

export class ProductionServerAdapters implements ServerGameAdapters {
    constructor (eventInteractor:ServerEventInteractor) {
        this.eventInteractor = eventInteractor
    }

    identifierInteractor=new FakeIdentifierAdapter()
    eventInteractor:EventInteractor
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
