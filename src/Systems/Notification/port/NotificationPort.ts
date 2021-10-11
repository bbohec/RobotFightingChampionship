export interface NotificationPort {
    notify(notificationMessage: string): Promise<void>;
}
