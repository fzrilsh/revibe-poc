// Notification/History Management for Directory Actions

export type NotificationType = "added" | "edited" | "deleted" | "expired";

export interface DirectoryNotification {
    id: string;
    type: NotificationType;
    productId: string;
    productName: string;
    productBrand: string;
    productImage?: string;
    timestamp: string;
    read: boolean;
}

const NOTIFICATIONS_KEY = "directory_notifications";
const MAX_NOTIFICATIONS = 50; // Keep last 50 notifications

// Get all notifications from localStorage
export function getNotifications(): DirectoryNotification[] {
    if (typeof window === "undefined") return [];
    
    try {
        const stored = localStorage.getItem(NOTIFICATIONS_KEY);
        if (!stored) return [];
        const notifications = JSON.parse(stored) as DirectoryNotification[];
        return Array.isArray(notifications) ? notifications : [];
    } catch (error) {
        console.error("Error reading notifications:", error);
        return [];
    }
}

// Add a new notification
export function addNotification(
    type: NotificationType,
    productId: string,
    productName: string,
    productBrand: string,
    productImage?: string
): void {
    if (typeof window === "undefined") return;

    try {
        const notifications = getNotifications();
        const newNotification: DirectoryNotification = {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            productId,
            productName,
            productBrand,
            productImage,
            timestamp: new Date().toISOString(),
            read: false,
        };

        // Add to beginning and limit to MAX_NOTIFICATIONS
        const updated = [newNotification, ...notifications].slice(0, MAX_NOTIFICATIONS);
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error("Error adding notification:", error);
    }
}

// Mark notification as read
export function markAsRead(notificationId: string): void {
    if (typeof window === "undefined") return;

    try {
        const notifications = getNotifications();
        const updated = notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
        );
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
}

// Mark all notifications as read
export function markAllAsRead(): void {
    if (typeof window === "undefined") return;

    try {
        const notifications = getNotifications();
        const updated = notifications.map((n) => ({ ...n, read: true }));
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error("Error marking all as read:", error);
    }
}

// Get unread count
export function getUnreadCount(): number {
    const notifications = getNotifications();
    return notifications.filter((n) => !n.read).length;
}

// Clear all notifications
export function clearAllNotifications(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(NOTIFICATIONS_KEY);
}

// Delete a specific notification
export function deleteNotification(notificationId: string): void {
    if (typeof window === "undefined") return;

    try {
        const notifications = getNotifications();
        const updated = notifications.filter((n) => n.id !== notificationId);
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
        console.error("Error deleting notification:", error);
    }
}

// Get notification message
export function getNotificationMessage(notification: DirectoryNotification): string {
    const productInfo = `${notification.productBrand} ${notification.productName}`;
    
    switch (notification.type) {
        case "added":
            return `Added ${productInfo} to directory`;
        case "edited":
            return `Updated ${productInfo} information`;
        case "deleted":
            return `Removed ${productInfo} from directory`;
        case "expired":
            return `${productInfo} has expired`;
        default:
            return `Action on ${productInfo}`;
    }
}
