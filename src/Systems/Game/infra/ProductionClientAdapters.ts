import { InMemoryEntityRepository } from '../../../Entities/infra/InMemoryEntityRepository'
import { EventInteractor } from '../../../EventInteractor/port/EventInteractor'
import { DrawingPort } from '../../Drawing/port/DrawingPort'
import { InMemorySystemRepository } from '../../Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../LifeCycle/infra/FakeIdentifierAdapter'
import { InMemoryNotificationAdapter } from '../../Notification/infra/InMemoryNotificationAdapter'
import { clientAdapters } from '../port/clientAdapters'

export class ProductionClientAdapters implements clientAdapters {
    constructor (drawingAdapter:DrawingPort, eventInteractor:EventInteractor) {
        this.eventInteractor = eventInteractor
        this.drawingInteractor = drawingAdapter
    }

    eventInteractor: EventInteractor
    drawingInteractor:DrawingPort
    identifierInteractor = new FakeIdentifierAdapter()
    notificationInteractor= new InMemoryNotificationAdapter()
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
