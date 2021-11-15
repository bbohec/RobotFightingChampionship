import { ControllerPort } from '../../Controller/port/ControllerPort'
import { DrawingPort } from '../../Drawing/port/DrawingPort'
import { NotificationPort } from '../../Notification/port/NotificationPort'
import { GenericAdapter } from './genericAdapters'
export interface clientAdapters extends GenericAdapter {
    controllerAdapter:ControllerPort
    notificationInteractor: NotificationPort
    drawingInteractor: DrawingPort
}
