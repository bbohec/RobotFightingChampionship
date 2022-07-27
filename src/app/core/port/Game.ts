import { EventInteractor } from './EventInteractor'
import { SystemInteractor } from './SystemInteractor'
import { Identifier } from './Identifier'
import { NotificationPort } from './Notification'
import { ControllerPort } from './ControllerPort'
import { Drawing } from './Drawing'
import { ComponentRepository } from './ComponentRepository'
import { InMemoryComponentRepository } from '../../infra/component/InMemoryComponentRepository'

export interface GenericGameAdapter {
    componentRepository: ComponentRepository;
    eventInteractor: EventInteractor;
    systemInteractor: SystemInteractor;
    identifierInteractor: Identifier
}

export interface TestGenericGameAdapter {
    entityInteractor: InMemoryComponentRepository;
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
