import { ControllerPort } from '../../../app/core/port/ControllerPort'
import { Drawing } from '../../../app/core/port/Drawing'
import { EventInteractor } from '../../../app/core/port/EventInteractor'
import { ClientGameAdapters } from '../../../app/core/port/Game'
import { Identifier } from '../../../app/core/port/Identifier'
import { InMemoryEntityRepository } from '../../entity/InMemoryEntityRepository'
import { FakeIdentifierAdapter } from '../../identifier/FakeIdentifierAdapter'
import { InMemoryNotificationAdapter } from '../../notification/InMemoryNotificationAdapter'
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
    notificationInteractor = new InMemoryNotificationAdapter();
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
