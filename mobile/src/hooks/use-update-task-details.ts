import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { api } from '../lib/api';
import { Task, CreateTaskDto } from '../types/api';

interface UpdateTaskParams {
    taskId: string;
    teamId: string;
    data: Partial<CreateTaskDto>;
}

/**
 * Hook for updating task details (general update)
 */
export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ taskId, data }: UpdateTaskParams) => {
            return api.tasks.update(taskId, data);
        },
        onSuccess: (updatedTask, { teamId }) => {
            // Update cache
            const previousTasks = queryClient.getQueryData<Task[]>(['tasks', teamId]);
            if (previousTasks) {
                const newTasks = previousTasks.map(t =>
                    t.id === updatedTask.id ? updatedTask : t
                );
                queryClient.setQueryData(['tasks', teamId], newTasks);
            }

            Toast.show({
                type: 'success',
                text1: 'Cập nhật thành công! ✅',
                text2: 'Thông tin task đã được lưu changes',
                visibilityTime: 2000,
            });
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Cập nhật thất bại',
                text2: error instanceof Error ? error.message : 'Vui lòng thử lại',
                visibilityTime: 3000,
            });
        },
        onSettled: (_, __, { teamId }) => {
            queryClient.invalidateQueries({ queryKey: ['tasks', teamId] });
        },
    });
}
