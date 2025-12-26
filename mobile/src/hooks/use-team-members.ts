import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export interface TeamMember {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: 'manager' | 'member';
    joinedAt: string;
}

/**
 * Hook to fetch team members
 */
export function useTeamMembers(teamId: string | null) {
    return useQuery<TeamMember[], Error>({
        queryKey: ['team-members', teamId],
        queryFn: async () => {
            if (!teamId) return [];
            return apiFetch<TeamMember[]>(`/api/teams/${teamId}/members`);
        },
        enabled: !!teamId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });
}
