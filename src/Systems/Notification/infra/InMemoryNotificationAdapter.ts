import { NotificationPort } from '../port/NotificationPort'

export class InMemoryNotificationAdapter implements NotificationPort {
    notify (notificationMessage: string): Promise<void> {
        this.notifications.push(notificationMessage)
        return Promise.resolve()
    }

    notifications: string[] = [];
}
