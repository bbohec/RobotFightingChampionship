
import { InMemoryDrawingAdapter } from '../../drawing/InMemoryDrawingAdapter'
import { InMemorySystemRepository } from '../../system/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../identifier/FakeIdentifierAdapter'
import { InMemoryNotificationAdapter } from '../../notification/InMemoryNotificationAdapter'
import { InMemoryClientEventInteractor } from '../../eventInteractor/client/InMemoryClientEventInteractor'
import { InMemoryEventBus } from '../../eventBus/InMemoryEventBus'
import { InMemoryControllerAdapter } from '../../controller/InMemoryControllerAdapter'
import { InMemoryServerEventInteractor } from '../../eventInteractor/server/InMemoryServerEventInteractor'
import { InMemoryEntityRepository } from '../../entity/InMemoryEntityRepository'
import { ClientGameAdapters } from '../../../core/port/Game'
import { Identifier } from '../../../core/port/Identifier'

export class FakeClientGameAdapters implements ClientGameAdapters {
    constructor (clientId: string, nextIdentifiers?: string[]) {
        this.identifierInteractor = new FakeIdentifierAdapter(nextIdentifiers)
        this.eventInteractor = new InMemoryClientEventInteractor(clientId, new InMemoryEventBus())
        this.drawingInteractor = new InMemoryDrawingAdapter()
        this.eventInteractor.setServerEventInteractor(new InMemoryServerEventInteractor(new InMemoryEventBus(), [this.eventInteractor]))
    }

    controllerAdapter = new InMemoryControllerAdapter();
    drawingInteractor: InMemoryDrawingAdapter;
    eventInteractor: InMemoryClientEventInteractor;
    identifierInteractor: Identifier;
    notificationInteractor = new InMemoryNotificationAdapter();
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
