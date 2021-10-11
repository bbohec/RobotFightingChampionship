import { DrawingPort } from '../../Drawing/port/DrawingPort'
import { SystemInteractor } from '../../Generic/port/SystemInteractor'
import { IdentifierAdapter } from '../../LifeCycle/port/IdentifierAdapter'
import { NotificationPort } from '../../Notification/port/NotificationPort'
import { GenericAdapter } from './genericAdapters'
export interface clientAdapters extends GenericAdapter {
    notificationInteractor: NotificationPort
    drawingInteractor: DrawingPort
    identifierInteractor: IdentifierAdapter
    systemInteractor: SystemInteractor;
}
