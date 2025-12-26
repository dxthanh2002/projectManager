import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { apiFetch } from '../lib/api';
import { Task, TaskPriority } from '../types/api';

export interface CreateTaskInput {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate?: string;
    assigneeId?: string;
}

interface CreateTaskParams {
    teamId: string;
    data: CreateTaskInput;
}

/**
 * Hook for creating a new task with optimistic UI
 */
export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ teamId, data }: CreateTaskParams) => {
            return apiFetch<Task>(`/api/teams/${teamId}/tasks`, {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: (newTask, { teamId }) => {
            // Optimistically add to list
            const previousTasks = queryClient.getQueryData<Task[]>(['tasks', teamId]);
            if (previousTasks) {
                queryClient.setQueryData(['tasks', teamId], [newTask, ...previousTasks]);
            }

            Toast.show({
                type: 'success',
                text1: 'Tạo task thành công! ✅',
                text2: newTask.title,
                visibilityTime: 2000,
            });
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Không thể tạo task',
                text2: error instanceof Error ? error.message : 'Vui lòng thử lại',
                visibilityTime: 3000,
            });
        },
        onSettled: (_, __, { teamId }) => {
            queryClient.invalidateQueries({ queryKey: ['tasks', teamId] });
        },
    });
}
