import { ServerEventInteractor, EventInteractor } from '../../../core/port/EventInteractor'
import { ServerGameAdapters } from '../../../core/port/Game'
import { InMemoryComponentRepository } from '../../component/InMemoryComponentRepository'
import { FakeIdentifierAdapter } from '../../identifier/FakeIdentifierAdapter'
import { InMemorySystemRepository } from '../../system/InMemorySystemInteractor'

export class ProductionServerAdapters implements ServerGameAdapters {
    constructor (eventInteractor:ServerEventInteractor) {
        this.eventInteractor = eventInteractor
    }

    identifierInteractor=new FakeIdentifierAdapter()
    eventInteractor:EventInteractor
    systemInteractor = new InMemorySystemRepository();
    componentRepository = new InMemoryComponentRepository();
}
