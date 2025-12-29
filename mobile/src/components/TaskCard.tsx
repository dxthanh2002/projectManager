import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Task } from '../types/api';
import { StatusColors, StatusLabels, PriorityColors } from '../constants/theme';

interface TaskCardProps {
    task: Task;
    onPress?: (task: Task) => void;
}

// Priority icons
const PriorityIcons = {
    low: 'arrow-down',
    medium: 'minus',
    high: 'arrow-up',
} as const;

const PriorityLabels = {
    low: 'Thấp',
    medium: 'TB',
    high: 'Cao',
} as const;

export function TaskCard({ task, onPress }: TaskCardProps) {
    const theme = useTheme();
    const statusColor = StatusColors[task.status];
    const priorityColor = PriorityColors[task.priority];
    const statusLabel = StatusLabels[task.status];
    const priorityLabel = PriorityLabels[task.priority];
    const priorityIcon = PriorityIcons[task.priority];

    // Format due date
    const formatDueDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days < 0) return { text: 'Quá hạn', isOverdue: true };
        if (days === 0) return { text: 'Hôm nay', isOverdue: false };
        if (days === 1) return { text: 'Ngày mai', isOverdue: false };
        if (days <= 7) return { text: `${days} ngày`, isOverdue: false };
        return { text: date.toLocaleDateString('vi-VN'), isOverdue: false };
    };

    const dueDateInfo = formatDueDate(task.dueDate);

    return (
        <Pressable
            onPress={() => onPress?.(task)}
            style={({ pressed }) => [
                styles.card,
                { backgroundColor: theme.colors.surface },
                pressed && styles.cardPressed,
            ]}
        >
            {/* Status color indicator bar */}
            <View style={[styles.statusBar, { backgroundColor: statusColor }]} />

            <View style={styles.content}>
                {/* Top Row: Priority Icon + Title */}
                <View style={styles.topRow}>
                    <View style={[styles.priorityIcon, { backgroundColor: priorityColor + '20' }]}>
                        <MaterialCommunityIcons
                            name={priorityIcon as any}
                            size={14}
                            color={priorityColor}
                        />
                    </View>
                    <Text
                        variant="titleSmall"
                        style={styles.title}
                        numberOfLines={2}
                    >
                        {task.title}
                    </Text>
                </View>

                {/* Description (if exists) */}
                {task.description && (
                    <Text
                        variant="bodySmall"
                        style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
                        numberOfLines={2}
                    >
                        {task.description}
                    </Text>
                )}

                {/* Bottom Row: Status Badge + Due Date */}
                <View style={styles.bottomRow}>
                    {/* Status Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                        <Text style={styles.statusText}>{statusLabel}</Text>
                    </View>

                    {/* Spacer */}
                    <View style={{ flex: 1 }} />

                    {/* Due Date */}
                    {dueDateInfo && (
                        <View style={[
                            styles.dueDateContainer,
                            dueDateInfo.isOverdue && { backgroundColor: theme.colors.errorContainer }
                        ]}>
                            <MaterialCommunityIcons
                                name="calendar-clock"
                                size={12}
                                color={dueDateInfo.isOverdue ? theme.colors.error : theme.colors.onSurfaceVariant}
                            />
                            <Text
                                style={[
                                    styles.dueDate,
                                    { color: dueDateInfo.isOverdue ? theme.colors.error : theme.colors.onSurfaceVariant }
                                ]}
                            >
                                {dueDateInfo.text}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        marginBottom: 10,
        marginHorizontal: 2,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },
    statusBar: {
        width: 4,
    },
    content: {
        flex: 1,
        padding: 14,
        gap: 10,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    priorityIcon: {
        width: 24,
        height: 24,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
    },
    title: {
        flex: 1,
        fontWeight: '600',
        lineHeight: 20,
    },
    description: {
        lineHeight: 18,
        marginLeft: 34,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    dueDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    dueDate: {
        fontSize: 11,
        fontWeight: '500',
    },
});
