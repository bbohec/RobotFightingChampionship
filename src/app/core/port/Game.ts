import type { InMemoryComponentRepository } from '../../infra/component/InMemoryComponentRepository'
import type { ComponentRepository } from './ComponentRepository'
import type { ControllerPort } from './ControllerPort'
import type { Drawing } from './Drawing'
import type { EventInteractor } from './EventInteractor'
import type { Identifier } from './Identifier'
import type { NotificationPort } from './Notification'
import type { SystemInteractor } from './SystemInteractor'

export interface GenericGameAdapter {
  componentRepository: ComponentRepository
  eventInteractor: EventInteractor
  systemInteractor: SystemInteractor
  identifierInteractor: Identifier
}

export interface TestGenericGameAdapter {
  entityInteractor: InMemoryComponentRepository
  eventInteractor: EventInteractor
  systemInteractor: SystemInteractor
  identifierInteractor: Identifier
}

export interface ClientGameAdapters extends GenericGameAdapter {
  controllerAdapter: ControllerPort
  notificationInteractor: NotificationPort
  drawingInteractor: Drawing
}

export interface ServerGameAdapters extends GenericGameAdapter {}
