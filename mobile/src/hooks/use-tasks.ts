import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Task, TaskStatus, TaskPriority } from '../types/api';

export interface TaskFilters {
    status?: TaskStatus | 'all';
    priority?: TaskPriority | 'all';
    assigneeId?: string;
}

/**
 * Hook to fetch tasks for a team
 * @param teamId - Team ID to fetch tasks for
 * @param filters - Optional filters for status, priority, assignee
 * @returns TanStack Query result with tasks array
 */
export function useTasks(teamId: string | null, filters?: TaskFilters) {
    return useQuery<Task[], Error>({
        queryKey: ['tasks', teamId, filters],
        queryFn: async () => {
            if (!teamId) return [];
            const tasks = await api.tasks.listByTeam(teamId);

            // Client-side filtering (backend can be enhanced later)
            let filtered = tasks;

            if (filters?.status && filters.status !== 'all') {
                filtered = filtered.filter(t => t.status === filters.status);
            }

            if (filters?.priority && filters.priority !== 'all') {
                filtered = filtered.filter(t => t.priority === filters.priority);
            }

            if (filters?.assigneeId) {
                filtered = filtered.filter(t => t.assigneeId === filters.assigneeId);
            }

            return filtered;
        },
        enabled: !!teamId,
        staleTime: 1000 * 60 * 2, // 2 minutes
        retry: 2,
    });
}

/**
 * Hook to get task counts by status for a team
 * @param teamId - Team ID
 * @returns Object with counts per status
 */
export function useTaskStats(teamId: string | null) {
    const { data: tasks, isLoading } = useTasks(teamId);

    const stats = {
        total: tasks?.length ?? 0,
        todo: tasks?.filter(t => t.status === 'todo').length ?? 0,
        in_progress: tasks?.filter(t => t.status === 'in_progress').length ?? 0,
        done: tasks?.filter(t => t.status === 'done').length ?? 0,
        blocked: tasks?.filter(t => t.status === 'blocked').length ?? 0,
    };

    return { stats, isLoading };
}
