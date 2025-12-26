import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export interface Notification {
    id: string;
    type: 'task_assigned' | 'task_updated' | 'comment_added' | 'blocker_resolved' | 'general';
    title: string;
    message: string;
    taskId?: string;
    teamId?: string;
    isRead: boolean;
    createdAt: string;
}

/**
 * Hook to fetch user's notifications
 */
export function useNotifications() {
    return useQuery<Notification[], Error>({
        queryKey: ['notifications'],
        queryFn: async () => {
            return apiFetch<Notification[]>('/api/notifications');
        },
        staleTime: 1000 * 60, // 1 minute
        retry: 2,
    });
}

/**
 * Hook to mark a notification as read
 */
export function useMarkAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (notificationId: string) => {
            return apiFetch(`/api/notifications/${notificationId}/read`, { method: 'PATCH' });
        },
        onMutate: async (notificationId) => {
            await queryClient.cancelQueries({ queryKey: ['notifications'] });

            const previousNotifications = queryClient.getQueryData<Notification[]>(['notifications']);

            if (previousNotifications) {
                const updated = previousNotifications.map(n =>
                    n.id === notificationId ? { ...n, isRead: true } : n
                );
                queryClient.setQueryData(['notifications'], updated);
            }

            return { previousNotifications };
        },
        onError: (_, __, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(['notifications'], context.previousNotifications);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
}

/**
 * Hook to get unread notification count
 */
export function useUnreadCount() {
    const { data: notifications } = useNotifications();
    return notifications?.filter(n => !n.isRead).length ?? 0;
}
