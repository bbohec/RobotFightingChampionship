import { InMemoryEntityRepository } from '../../../Entities/infra/InMemoryEntityRepository'
import { InMemoryDrawingAdapter } from '../../Drawing/infra/InMemoryDrawingAdapter'
import { InMemorySystemRepository } from '../../Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../LifeCycle/infra/FakeIdentifierAdapter'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { clientAdapters } from '../port/clientAdapters'
import { InMemoryNotificationAdapter } from '../../Notification/infra/InMemoryNotificationAdapter'
import { InMemoryClientEventInteractor } from '../../../EventInteractor/infra/client/InMemoryClientEventInteractor'
import { InMemoryEventBus } from '../../../Event/infra/InMemoryEventBus'
import { InMemoryControllerAdapter } from '../../Controller/infra/InMemoryControllerAdapter'
import { InMemoryServerEventInteractor } from '../../../EventInteractor/infra/server/InMemoryServerEventInteractor'

export class FakeClientAdapters implements clientAdapters {
    constructor (clientId:string, nextIdentifiers?:string[]) {
        this.identifierInteractor = new FakeIdentifierAdapter(nextIdentifiers)
        this.eventInteractor = new InMemoryClientEventInteractor(clientId, new InMemoryEventBus())
        this.drawingInteractor = new InMemoryDrawingAdapter()
        this.eventInteractor.setServerEventInteractor(new InMemoryServerEventInteractor(new InMemoryEventBus(), [this.eventInteractor]))
    }

    controllerAdapter = new InMemoryControllerAdapter()
    drawingInteractor: InMemoryDrawingAdapter
    eventInteractor: InMemoryClientEventInteractor
    identifierInteractor: IdentifierAdapter
    notificationInteractor = new InMemoryNotificationAdapter()
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
