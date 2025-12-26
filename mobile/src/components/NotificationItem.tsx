import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme, Badge } from 'react-native-paper';
import { Notification } from '../hooks/use-notifications';

interface NotificationItemProps {
    notification: Notification;
    onPress?: (notification: Notification) => void;
}

const NOTIFICATION_ICONS: Record<Notification['type'], string> = {
    task_assigned: '📋',
    task_updated: '🔄',
    comment_added: '💬',
    blocker_resolved: '✅',
    general: '📢',
};

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
    const theme = useTheme();
    const icon = NOTIFICATION_ICONS[notification.type] || '📢';

    // Format relative time
    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <Pressable
            onPress={() => onPress?.(notification)}
            style={({ pressed }) => [
                styles.container,
                !notification.isRead && { backgroundColor: `${theme.colors.primaryContainer}40` },
                pressed && { opacity: 0.7 },
            ]}
        >
            {/* Unread Indicator */}
            {!notification.isRead && (
                <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
            )}

            {/* Icon */}
            <Text style={styles.icon}>{icon}</Text>

            {/* Content */}
            <View style={styles.content}>
                <Text
                    variant="titleSmall"
                    style={[styles.title, !notification.isRead && { fontWeight: '700' }]}
                    numberOfLines={1}
                >
                    {notification.title}
                </Text>
                <Text
                    variant="bodySmall"
                    style={styles.message}
                    numberOfLines={2}
                >
                    {notification.message}
                </Text>
                <Text variant="labelSmall" style={styles.timestamp}>
                    {formatTimeAgo(notification.createdAt)}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.08)',
    },
    unreadDot: {
        position: 'absolute',
        left: 6,
        top: '50%',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    icon: {
        fontSize: 24,
        marginTop: 2,
    },
    content: {
        flex: 1,
        gap: 4,
    },
    title: {
        fontWeight: '600',
    },
    message: {
        opacity: 0.7,
    },
    timestamp: {
        opacity: 0.5,
        marginTop: 4,
    },
});
