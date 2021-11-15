import { InMemoryEntityRepository } from '../../../Entities/infra/InMemoryEntityRepository'
import { InMemoryDrawingAdapter } from '../../Drawing/infra/InMemoryDrawingAdapter'
import { InMemorySystemRepository } from '../../Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../LifeCycle/infra/FakeIdentifierAdapter'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { clientAdapters } from '../port/clientAdapters'
import { InMemoryNotificationAdapter } from '../../Notification/infra/InMemoryNotificationAdapter'
import { InMemoryClientEventInteractor } from '../../../EventInteractor/infra/InMemoryClientEventInteractor'
import { InMemoryEventBus } from '../../../Event/infra/InMemoryEventBus'
import { InMemoryControllerAdapter } from '../../Controller/infra/InMemoryControllerAdapter'

export class FakeClientAdapters implements clientAdapters {
    constructor (clientId:string, nextIdentifiers?:string[]) {
        const inMemoryEventBus = new InMemoryEventBus()
        this.identifierInteractor = new FakeIdentifierAdapter(nextIdentifiers)
        this.eventInteractor = new InMemoryClientEventInteractor(clientId, inMemoryEventBus)
        this.drawingInteractor = new InMemoryDrawingAdapter()
    }

    controllerAdapter = new InMemoryControllerAdapter()
    drawingInteractor: InMemoryDrawingAdapter
    eventInteractor: InMemoryClientEventInteractor
    identifierInteractor: IdentifierAdapter
    notificationInteractor = new InMemoryNotificationAdapter()
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
