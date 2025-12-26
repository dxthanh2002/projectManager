import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { api } from '../lib/api';

interface AddCommentParams {
    taskId: string;
    content: string;
    teamId: string;
}

/**
 * Hook for adding comments to a task with optimistic UI
 */
export function useAddComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ taskId, content }: AddCommentParams) => {
            return api.tasks.addComment(taskId, content);
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Comment added',
                visibilityTime: 1500,
            });
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to add comment',
                text2: error instanceof Error ? error.message : 'Please try again',
                visibilityTime: 3000,
            });
        },
        onSettled: (_, __, { taskId }) => {
            // Refetch comments for this task
            queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
        },
    });
}
