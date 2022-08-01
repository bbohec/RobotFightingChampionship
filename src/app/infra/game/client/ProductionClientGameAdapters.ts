import { ControllerPort } from '../../../core/port/ControllerPort'
import { Drawing } from '../../../core/port/Drawing'
import { EventInteractor } from '../../../core/port/EventInteractor'
import { ClientGameAdapters } from '../../../core/port/Game'
import { Identifier } from '../../../core/port/Identifier'
import { InMemoryComponentRepository } from '../../component/InMemoryComponentRepository'
import { FakeIdentifierAdapter } from '../../identifier/FakeIdentifierAdapter'
import { WebClientNotificationAdapter } from '../../notification/WebClientNotificationAdapter'
import { InMemorySystemRepository } from '../../system/InMemorySystemInteractor'

export class ProductionClientGameAdapters implements ClientGameAdapters {
    constructor (drawingAdapter: Drawing, eventInteractor: EventInteractor, playerId: string, constrollerAdapter: ControllerPort) {
        this.eventInteractor = eventInteractor
        this.drawingInteractor = drawingAdapter
        this.identifierInteractor = new FakeIdentifierAdapter([playerId])
        this.controllerAdapter = constrollerAdapter
    }

    controllerAdapter: ControllerPort;
    identifierInteractor: Identifier;
    eventInteractor: EventInteractor;
    drawingInteractor: Drawing;
    notificationInteractor = new WebClientNotificationAdapter();
    systemInteractor = new InMemorySystemRepository();
    componentRepository = new InMemoryComponentRepository()
}
