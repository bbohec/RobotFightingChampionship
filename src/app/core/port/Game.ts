import { EventInteractor } from './EventInteractor'
import { SystemInteractor } from './SystemInteractor'
import { Identifier } from './Identifier'
import { NotificationPort } from './Notification'
import { ControllerPort } from './ControllerPort'
import { Drawing } from './Drawing'
import { EntityInteractor } from './EntityInteractor'
import { InMemoryEntityRepository } from '../../infra/entity/InMemoryEntityRepository'

export interface GenericGameAdapter {
    entityInteractor: EntityInteractor;
    eventInteractor: EventInteractor;
    systemInteractor: SystemInteractor;
    identifierInteractor: Identifier
}

export interface TestGenericGameAdapter {
    entityInteractor: InMemoryEntityRepository;
    eventInteractor: EventInteractor;
    systemInteractor: SystemInteractor;
    identifierInteractor: Identifier
}

export interface ClientGameAdapters extends GenericGameAdapter {
    controllerAdapter: ControllerPort;
    notificationInteractor: NotificationPort;
    drawingInteractor: Drawing;
}

export interface ServerGameAdapters extends GenericGameAdapter {
}
