import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import { useNotifications, useMarkAsRead, Notification } from '@/hooks/use-notifications';
import { NotificationItem } from '@/components/NotificationItem';
import { useAppStore } from '@/stores/use-app-store';

export default function NotificationsScreen() {
    const theme = useTheme();
    const { currentTeamId } = useAppStore();
    const { data: notifications, isLoading, refetch, isRefetching, error } = useNotifications();
    const markAsReadMutation = useMarkAsRead();

    // Refetch data when screen gains focus
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const handleNotificationPress = useCallback((notification: Notification) => {
        // Mark as read
        if (!notification.isRead) {
            markAsReadMutation.mutate(notification.id);
        }

        // Navigate to task if applicable
        if (notification.taskId) {
            // TODO: Open TaskDetailSheet with taskId
            console.log('Navigate to task:', notification.taskId);
        }
    }, [markAsReadMutation]);

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator animating size="large" />
                <Text variant="bodyMedium" style={styles.loadingText}>
                    Đang tải thông báo...
                </Text>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text variant="titleMedium" style={{ color: theme.colors.error }}>
                    Không thể tải thông báo
                </Text>
                <Button mode="outlined" onPress={() => refetch()}>
                    Thử lại
                </Button>
            </View>
        );
    }

    // Empty state
    if (!notifications || notifications.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text variant="displaySmall">🎉</Text>
                <Text variant="titleMedium" style={styles.emptyTitle}>
                    Tất cả đã đọc!
                </Text>
                <Text variant="bodyMedium" style={styles.emptyText}>
                    Bạn không có thông báo mới.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <NotificationItem
                        notification={item}
                        onPress={handleNotificationPress}
                    />
                )}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={() => refetch()}
                        colors={[theme.colors.primary]}
                    />
                }
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        gap: 12,
    },
    loadingText: {
        opacity: 0.7,
    },
    emptyTitle: {
        textAlign: 'center',
    },
    emptyText: {
        opacity: 0.7,
        textAlign: 'center',
    },
    listContent: {
        flexGrow: 1,
    },
});
