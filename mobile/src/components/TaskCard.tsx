import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, useTheme } from 'react-native-paper';
import { Task } from '../types/api';
import { StatusColors, StatusLabels, PriorityColors } from '../constants/theme';

interface TaskCardProps {
    task: Task;
    onPress?: (task: Task) => void;
}

// Helper to create color with alpha
const withAlpha = (hexColor: string, alpha: number): string => {
    if (hexColor.startsWith('#')) {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return hexColor;
};

// Priority labels in English
const PriorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
} as const;

export function TaskCard({ task, onPress }: TaskCardProps) {
    const theme = useTheme();
    const statusColor = StatusColors[task.status];
    const priorityColor = PriorityColors[task.priority];
    const statusLabel = StatusLabels[task.status];
    const priorityLabel = PriorityLabels[task.priority];

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
                    <View style={[
                        styles.priorityBadge,
                        { backgroundColor: withAlpha(priorityColor, 0.15) }
                    ]}>
                        <Text style={[styles.priorityText, { color: priorityColor }]}>
                            {priorityLabel}
                        </Text>
                    </View>
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
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                        <Text style={styles.statusText}>{statusLabel}</Text>
                    </View>

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
        gap: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    title: {
        flex: 1,
        fontWeight: '600',
    },
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    priorityText: {
        fontSize: 11,
        fontWeight: '600',
    },
    description: {
        opacity: 0.7,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    dueDate: {
        opacity: 0.7,
    },
});
