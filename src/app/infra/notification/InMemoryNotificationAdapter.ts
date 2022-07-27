import { NotificationPort } from '../../core/port/Notification'

export class InMemoryNotificationAdapter implements NotificationPort {
    notify (notificationMessage: string): Promise<void> {
        this.notifications.push(notificationMessage)
        return Promise.resolve()
    }

    notifications: string[] = [];
}
