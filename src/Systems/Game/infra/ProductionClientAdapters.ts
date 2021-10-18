import { InMemoryEntityRepository } from '../../../Entities/infra/InMemoryEntityRepository'
import { InMemoryEventBus } from '../../../Event/infra/InMemoryEventBus'
import { WebClientEventInteractor } from '../../../EventInteractor/infra/WebClientEventInteractor'
import { EventInteractor } from '../../../EventInteractor/port/EventInteractor'
import { PixijsDrawingAdapter } from '../../Drawing/infra/PixijsDrawingAdapter'
import { InMemorySystemRepository } from '../../Generic/infra/InMemorySystemInteractor'
import { FakeIdentifierAdapter } from '../../LifeCycle/infra/FakeIdentifierAdapter'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { InMemoryNotificationAdapter } from '../../Notification/infra/InMemoryNotificationAdapter'
import { clientAdapters } from '../port/clientAdapters'

export class ProductionClientAdapters implements clientAdapters {
    constructor (serverFullyQualifiedDomainName:string, serverPort:number, clientId:string) {
        this.identifierInteractor = new FakeIdentifierAdapter()
        this.eventInteractor = new WebClientEventInteractor(serverFullyQualifiedDomainName, serverPort, clientId, new InMemoryEventBus())
    }

    eventInteractor: EventInteractor
    identifierInteractor: IdentifierAdapter
    drawingInteractor= new PixijsDrawingAdapter()
    notificationInteractor= new InMemoryNotificationAdapter()
    systemInteractor = new InMemorySystemRepository();
    entityInteractor = new InMemoryEntityRepository();
}
