import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { Task } from '../types/api';
import { StatusColors, StatusLabels, PriorityColors } from '../constants/theme';

interface TaskCardProps {
    task: Task;
    onPress?: (task: Task) => void;
}

export function TaskCard({ task, onPress }: TaskCardProps) {
    const theme = useTheme();
    const statusColor = StatusColors[task.status];
    const priorityColor = PriorityColors[task.priority];
    const statusLabel = StatusLabels[task.status];

    // Format due date
    const formatDueDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days < 0) return 'Overdue';
        if (days === 0) return 'Due today';
        if (days === 1) return 'Due tomorrow';
        if (days <= 7) return `Due in ${days} days`;
        return date.toLocaleDateString();
    };

    const dueDateText = formatDueDate(task.dueDate);
    const isOverdue = dueDateText === 'Overdue';

    return (
        <Card
            style={styles.card}
            onPress={() => onPress?.(task)}
            mode="elevated"
        >
            <Card.Content style={styles.content}>
                {/* Header Row: Title + Priority */}
                <View style={styles.headerRow}>
                    <Text
                        variant="titleMedium"
                        style={styles.title}
                        numberOfLines={2}
                    >
                        {task.title}
                    </Text>
                    <Chip
                        compact
                        mode="flat"
                        style={[styles.priorityChip, { backgroundColor: `${priorityColor}20` }]}
                        textStyle={{ color: priorityColor, fontSize: 10 }}
                    >
                        {task.priority.toUpperCase()}
                    </Chip>
                </View>

                {/* Description (if exists) */}
                {task.description && (
                    <Text
                        variant="bodySmall"
                        style={styles.description}
                        numberOfLines={2}
                    >
                        {task.description}
                    </Text>
                )}

                {/* Footer Row: Status + Due Date */}
                <View style={styles.footerRow}>
                    <Chip
                        compact
                        mode="flat"
                        style={[styles.statusChip, { backgroundColor: statusColor }]}
                        textStyle={styles.statusText}
                    >
                        {statusLabel}
                    </Chip>

                    {dueDateText && (
                        <Text
                            variant="labelSmall"
                            style={[
                                styles.dueDate,
                                isOverdue && { color: theme.colors.error }
                            ]}
                        >
                            {dueDateText}
                        </Text>
                    )}
                </View>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
    },
    content: {
        gap: 8,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    title: {
        flex: 1,
        fontWeight: '600',
    },
    priorityChip: {
        height: 24,
    },
    description: {
        opacity: 0.7,
        marginTop: 4,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    statusChip: {
        height: 26,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },
    dueDate: {
        opacity: 0.7,
    },
});
