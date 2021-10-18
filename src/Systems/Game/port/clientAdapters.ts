import { DrawingPort } from '../../Drawing/port/DrawingPort'
import { NotificationPort } from '../../Notification/port/NotificationPort'
import { GenericAdapter } from './genericAdapters'
export interface clientAdapters extends GenericAdapter {
    notificationInteractor: NotificationPort
    drawingInteractor: DrawingPort
}
