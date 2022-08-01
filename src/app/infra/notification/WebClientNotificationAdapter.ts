import { NotificationPort } from '../../core/port/Notification'

export class WebClientNotificationAdapter implements NotificationPort {
    notify (notificationMessage: string): Promise<void> {
        this.notifications.push(notificationMessage)
        const notificationElement = document.getElementById('notifications')
        if (notificationElement)
            notificationElement.innerHTML = this.notifications.map(notification => `<li>${notification}</li>`).join('')
        return Promise.resolve()
    }

    notifications: string[] = [];
}
