import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SegmentedButtons, Chip, Text, useTheme } from 'react-native-paper';
import { TaskStatus, TaskPriority } from '../types/api';
import { StatusColors, PriorityColors } from '../constants/theme';

// Helper to create color with alpha
const withAlpha = (hexColor: string, alpha: number): string => {
    // If already has alpha or is rgba, just return hex with alpha
    if (hexColor.startsWith('#')) {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return hexColor;
};

export interface FilterState {
    status: TaskStatus | 'all';
    priority: TaskPriority | 'all';
}

interface TaskFiltersProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    showPriorityFilter?: boolean;
}

export function TaskFilters({
    filters,
    onFiltersChange,
    showPriorityFilter = true
}: TaskFiltersProps) {
    const theme = useTheme();

    const statusOptions = [
        { value: 'all', label: 'All' },
        { value: 'todo', label: 'To Do' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'blocked', label: 'Blocked' },
        { value: 'done', label: 'Done' },
    ];

    const priorityOptions: Array<{ value: TaskPriority | 'all'; label: string }> = [
        { value: 'all', label: 'All' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
    ];

    const handleStatusChange = (value: string) => {
        onFiltersChange({
            ...filters,
            status: value as TaskStatus | 'all',
        });
    };

    const handlePriorityChange = (priority: TaskPriority | 'all') => {
        onFiltersChange({
            ...filters,
            priority,
        });
    };

    return (
        <View style={styles.container}>
            {/* Status Filter - Segmented Buttons */}
            <SegmentedButtons
                value={filters.status}
                onValueChange={handleStatusChange}
                buttons={statusOptions}
                style={styles.segmentedButtons}
                density="small"
            />

            {/* Priority Filter - Chip Row */}
            {showPriorityFilter && (
                <View style={styles.priorityRow}>
                    <Text variant="labelSmall" style={styles.priorityLabel}>
                        Priority:
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.chipContainer}
                    >
                        {priorityOptions.map((option) => {
                            const isSelected = filters.priority === option.value;
                            const color = option.value !== 'all'
                                ? PriorityColors[option.value]
                                : theme.colors.outline;

                            return (
                                <Chip
                                    key={option.value}
                                    selected={isSelected}
                                    onPress={() => handlePriorityChange(option.value)}
                                    mode={isSelected ? 'flat' : 'outlined'}
                                    compact
                                    style={[
                                        styles.priorityChip,
                                        isSelected && { backgroundColor: withAlpha(color, 0.12) }
                                    ]}
                                    textStyle={isSelected ? { color } : undefined}
                                >
                                    {option.label}
                                </Chip>
                            );
                        })}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        backgroundColor: 'transparent',
    },
    segmentedButtons: {
        alignSelf: 'stretch',
    },
    priorityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    priorityLabel: {
        opacity: 0.7,
    },
    chipContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    priorityChip: {
        height: 32,
    },
});
