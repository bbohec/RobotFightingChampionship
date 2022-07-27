import { InMemoryEntityRepository } from '../../../Entities/infra/InMemoryEntityRepository'
import { EventInteractor } from '../../../core/port/EventInteractor'
import { ControllerPort } from '../../Controller/port/ControllerPort'
import { DrawingPort } from '../../Drawing/port/DrawingPort'
import { InMemorySystemRepository } from '../../Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../LifeCycle/infra/FakeIdentifierAdapter'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { InMemoryNotificationAdapter } from '../../Notification/infra/InMemoryNotificationAdapter'
import { clientAdapters } from '../port/clientAdapters'

export class ProductionClientAdapters implements clientAdapters {
    constructor (drawingAdapter:DrawingPort, eventInteractor:EventInteractor, playerId:string, constrollerAdapter:ControllerPort) {
        this.eventInteractor = eventInteractor
        this.drawingInteractor = drawingAdapter
        this.identifierInteractor = new FakeIdentifierAdapter([playerId])
        this.controllerAdapter = constrollerAdapter
    }

    controllerAdapter: ControllerPort
    identifierInteractor: IdentifierAdapter
    eventInteractor: EventInteractor
    drawingInteractor:DrawingPort
    notificationInteractor= new InMemoryNotificationAdapter()
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
