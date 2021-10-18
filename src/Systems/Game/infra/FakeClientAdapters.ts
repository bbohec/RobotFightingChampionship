import { InMemoryEntityRepository } from '../../../Entities/infra/InMemoryEntityRepository'
import { InMemoryDrawingAdapter } from '../../Drawing/infra/InMemoryDrawingAdapter'

import { InMemorySystemRepository } from '../../Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../LifeCycle/infra/FakeIdentifierAdapter'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { clientAdapters } from '../port/clientAdapters'
import { InMemoryNotificationAdapter } from '../../Notification/infra/InMemoryNotificationAdapter'
import { NewInMemoryClientEventInteractor } from '../../../EventInteractor/infra/NewInMemoryClientEventInteractor'
import { InMemoryEventBus } from '../../../Event/infra/InMemoryEventBus'

export class FakeClientAdapters implements clientAdapters {
    constructor (clientId:string, nextIdentifiers?:string[]) {
        this.identifierInteractor = new FakeIdentifierAdapter(nextIdentifiers)
        this.eventInteractor = new NewInMemoryClientEventInteractor(clientId, new InMemoryEventBus())
    }

    eventInteractor: NewInMemoryClientEventInteractor
    identifierInteractor: IdentifierAdapter
    notificationInteractor = new InMemoryNotificationAdapter()
    drawingInteractor= new InMemoryDrawingAdapter();
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
