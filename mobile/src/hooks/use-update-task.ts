import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { api } from '../lib/api';
import { Task, TaskStatus } from '../types/api';

interface UpdateTaskStatusParams {
    taskId: string;
    status: TaskStatus;
    teamId: string;
}

/**
 * Hook for updating task status with optimistic UI
 */
export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ taskId, status }: UpdateTaskStatusParams) => {
            return api.tasks.updateStatus(taskId, status);
        },
        onMutate: async ({ taskId, status, teamId }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['tasks', teamId] });

            // Snapshot previous value
            const previousTasks = queryClient.getQueryData<Task[]>(['tasks', teamId]);

            // Optimistically update
            if (previousTasks) {
                const updatedTasks = previousTasks.map(task =>
                    task.id === taskId ? { ...task, status } : task
                );
                queryClient.setQueryData(['tasks', teamId], updatedTasks);
            }

            return { previousTasks, teamId };
        },
        onSuccess: (_, { status }) => {
            // Show success feedback
            if (status === 'done') {
                Toast.show({
                    type: 'success',
                    text1: 'Nice work! 🎉',
                    text2: 'Task marked as complete',
                    visibilityTime: 2000,
                });
            } else if (status === 'blocked') {
                Toast.show({
                    type: 'info',
                    text1: 'Help request sent',
                    text2: 'Your manager will be notified',
                    visibilityTime: 2000,
                });
            }
        },
        onError: (error, _, context) => {
            // Rollback on error
            if (context?.previousTasks && context?.teamId) {
                queryClient.setQueryData(['tasks', context.teamId], context.previousTasks);
            }

            Toast.show({
                type: 'error',
                text1: 'Update failed',
                text2: error instanceof Error ? error.message : 'Please try again',
                visibilityTime: 3000,
            });
        },
        onSettled: (_, __, { teamId }) => {
            // Refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: ['tasks', teamId] });
        },
    });
}
