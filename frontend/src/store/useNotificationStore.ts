import { defineStore } from 'pinia';

export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: number;
}

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [] as Notification[],
        maxNotifications: 5,
    }),

    getters: {
        activeNotifications: (state) => state.notifications,
    },

    actions: {
        /**
         * Show a notification toast
         */
        showNotification(type: Notification['type'], title: string, message: string) {
            const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            const notification: Notification = {
                id,
                type,
                title,
                message,
                timestamp: Date.now(),
            };

            // Add to front of list
            this.notifications.unshift(notification);

            // Limit max notifications displayed
            if (this.notifications.length > this.maxNotifications) {
                this.notifications.pop();
            }

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                this.dismissNotification(id);
            }, 5000);

            return id;
        },

        /**
         * Dismiss a notification
         */
        dismissNotification(id: string) {
            const index = this.notifications.findIndex(n => n.id === id);
            if (index !== -1) {
                this.notifications.splice(index, 1);
            }
        },

        /**
         * Clear all notifications
         */
        clearAll() {
            this.notifications = [];
        },

        // Convenience methods
        info(title: string, message: string) {
            return this.showNotification('info', title, message);
        },

        success(title: string, message: string) {
            return this.showNotification('success', title, message);
        },

        warning(title: string, message: string) {
            return this.showNotification('warning', title, message);
        },

        error(title: string, message: string) {
            return this.showNotification('error', title, message);
        },
    },
});
