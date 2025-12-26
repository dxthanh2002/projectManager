import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export interface Comment {
    id: string;
    content: string;
    taskId: string;
    authorId: string;
    author?: {
        id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

/**
 * Hook to fetch comments for a task
 */
export function useComments(taskId: string | null) {
    return useQuery<Comment[], Error>({
        queryKey: ['comments', taskId],
        queryFn: async () => {
            if (!taskId) return [];
            return apiFetch<Comment[]>(`/api/tasks/${taskId}/comments`);
        },
        enabled: !!taskId,
        staleTime: 1000 * 30, // 30 seconds (comments update frequently)
        retry: 2,
    });
}
