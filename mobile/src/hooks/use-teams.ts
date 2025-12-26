import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Team } from '../types/api';

/**
 * Hook to fetch user's teams
 * @returns TanStack Query result with teams array
 */
export function useTeams() {
    return useQuery<Team[], Error>({
        queryKey: ['teams'],
        queryFn: () => api.teams.list(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });
}

/**
 * Hook to fetch a single team by ID
 * @param teamId - Team ID to fetch
 * @returns TanStack Query result with team details
 */
export function useTeam(teamId: string | null) {
    return useQuery<Team, Error>({
        queryKey: ['team', teamId],
        queryFn: () => api.teams.get(teamId!),
        enabled: !!teamId, // Only fetch when teamId is provided
        staleTime: 1000 * 60 * 5,
    });
}
