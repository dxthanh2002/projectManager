import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Button, ActivityIndicator, useTheme, FAB } from 'react-native-paper';
import { useRouter, useFocusEffect } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';

import { useAppStore } from '@/stores/use-app-store';
import { useTasks } from '@/hooks/use-tasks';
import { useSession } from '@/lib/auth-client';
import { TaskCard } from '@/components/TaskCard';
import { TaskFilters, FilterState } from '@/components/TaskFilters';
import { TaskDetailSheet } from '@/components/TaskDetailSheet';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { Task } from '@/types/api';

export default function TasksScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { data: session } = useSession();
    const { currentTeamId, viewMode } = useAppStore();

    // Bottom sheet ref
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Create task modal state
    const [createModalVisible, setCreateModalVisible] = useState(false);

    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        status: 'all',
        priority: 'all',
    });

    // Determine if user is viewing as member (assigned only) or manager (all)
    const assigneeFilter = viewMode === 'assigned' ? session?.user?.id : undefined;

    // Fetch tasks with filters
    const {
        data: tasks,
        isLoading,
        error,
        refetch,
        isRefetching
    } = useTasks(currentTeamId, {
        status: filters.status !== 'all' ? filters.status : undefined,
        priority: filters.priority !== 'all' ? filters.priority : undefined,
        assigneeId: assigneeFilter,
    });

    // Refetch data when screen gains focus
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    const handleTaskPress = useCallback((task: Task) => {
        setSelectedTask(task);
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    const handleSheetClose = useCallback(() => {
        setSelectedTask(null);
    }, []);

    const handleCreateTask = () => {
        setCreateModalVisible(true);
    };

    // No team selected
    if (!currentTeamId) {
        return (
            <View style={styles.emptyState}>
                <Text variant="titleMedium">Select a workspace first</Text>
                <Text variant="bodyMedium" style={styles.emptyText}>
                    Open the menu to choose a workspace
                </Text>
            </View>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating size="large" />
                <Text variant="bodyMedium" style={styles.loadingText}>
                    Loading tasks...
                </Text>
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View style={styles.emptyState}>
                <Text variant="titleMedium" style={{ color: theme.colors.error }}>
                    Failed to load tasks
                </Text>
                <Button mode="outlined" onPress={() => refetch()}>
                    Try Again
                </Button>
            </View>
        );
    }

    // Empty state
    if (!tasks || tasks.length === 0) {
        return (
            <View style={styles.container}>
                <TaskFilters filters={filters} onFiltersChange={setFilters} />
                <View style={styles.emptyState}>
                    <Text variant="displaySmall">📋</Text>
                    <Text variant="titleMedium" style={styles.emptyTitle}>
                        No tasks yet
                    </Text>
                    <Text variant="bodyMedium" style={styles.emptyText}>
                        Ready to get productive?
                    </Text>
                    <Button
                        mode="contained"
                        onPress={handleCreateTask}
                        style={styles.createButton}
                        icon="plus"
                    >
                        Create Task
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Filters */}
            <TaskFilters filters={filters} onFiltersChange={setFilters} />

            {/* Task List */}
            <FlatList
                data={tasks}
                renderItem={({ item }) => (
                    <TaskCard task={item} onPress={handleTaskPress} />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={() => refetch()}
                        colors={[theme.colors.primary]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.noResults}>
                        <Text variant="bodyMedium" style={styles.emptyText}>
                            No tasks match your filters
                        </Text>
                        <Button
                            mode="text"
                            onPress={() => setFilters({ status: 'all', priority: 'all' })}
                        >
                            Clear Filters
                        </Button>
                    </View>
                }
            />

            {/* FAB for creating task */}
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={handleCreateTask}
            />

            {/* Task Detail Bottom Sheet */}
            <TaskDetailSheet
                ref={bottomSheetRef}
                task={selectedTask}
                onClose={handleSheetClose}
            />

            {/* Create Task Modal */}
            {currentTeamId && (
                <CreateTaskModal
                    visible={createModalVisible}
                    teamId={currentTeamId}
                    onClose={() => setCreateModalVisible(false)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        opacity: 0.7,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
        gap: 12,
    },
    emptyTitle: {
        textAlign: 'center',
    },
    emptyText: {
        opacity: 0.7,
        textAlign: 'center',
    },
    createButton: {
        marginTop: 8,
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
        paddingBottom: 80, // Space for FAB
    },
    noResults: {
        padding: 32,
        alignItems: 'center',
        gap: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});
