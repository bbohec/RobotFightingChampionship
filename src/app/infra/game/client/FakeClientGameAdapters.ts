import type { ClientGameAdapters } from '../../../core/port/Game'
import type { Identifier } from '../../../core/port/Identifier'
import { InMemoryComponentRepository } from '../../component/InMemoryComponentRepository'
import { InMemoryControllerAdapter } from '../../controller/InMemoryControllerAdapter'
import { InMemoryDrawingAdapter } from '../../drawing/InMemoryDrawingAdapter'
import { InMemoryEventBus } from '../../eventBus/InMemoryEventBus'
import { InMemoryClientEventInteractor } from '../../eventInteractor/client/InMemoryClientEventInteractor'
import { InMemoryServerEventInteractor } from '../../eventInteractor/server/InMemoryServerEventInteractor'
import { FakeIdentifierAdapter } from '../../identifier/FakeIdentifierAdapter'
import { InMemoryNotificationAdapter } from '../../notification/InMemoryNotificationAdapter'
import { InMemorySystemRepository } from '../../system/InMemorySystemInteractor'

export class FakeClientGameAdapters implements ClientGameAdapters {
  constructor(clientId: string, nextIdentifiers?: string[]) {
    this.identifierInteractor = new FakeIdentifierAdapter(nextIdentifiers)
    this.eventInteractor = new InMemoryClientEventInteractor(clientId, new InMemoryEventBus())
    this.drawingInteractor = new InMemoryDrawingAdapter()
    this.eventInteractor.setServerEventInteractor(
      new InMemoryServerEventInteractor(new InMemoryEventBus(), [this.eventInteractor]),
    )
  }

  controllerAdapter = new InMemoryControllerAdapter()
  drawingInteractor: InMemoryDrawingAdapter
  eventInteractor: InMemoryClientEventInteractor
  identifierInteractor: Identifier
  notificationInteractor = new InMemoryNotificationAdapter()
  systemInteractor = new InMemorySystemRepository()
  componentRepository = new InMemoryComponentRepository()
}
