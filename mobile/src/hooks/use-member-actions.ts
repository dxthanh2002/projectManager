import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { apiFetch } from '../lib/api';

interface InviteMemberParams {
    teamId: string;
    email: string;
}

interface RemoveMemberParams {
    teamId: string;
    memberId: string;
}

/**
 * Hook for inviting a member to a team
 */
export function useInviteMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ teamId, email }: InviteMemberParams) => {
            return apiFetch(`/api/teams/${teamId}/members`, {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
        },
        onSuccess: (_, { teamId }) => {
            Toast.show({
                type: 'success',
                text1: 'Đã gửi lời mời! ✉️',
                visibilityTime: 2000,
            });
            queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Không thể gửi lời mời',
                text2: error instanceof Error ? error.message : 'Vui lòng thử lại',
                visibilityTime: 3000,
            });
        },
    });
}

/**
 * Hook for removing a member from a team
 */
export function useRemoveMember() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ teamId, memberId }: RemoveMemberParams) => {
            return apiFetch(`/api/teams/${teamId}/members/${memberId}`, {
                method: 'DELETE',
            });
        },
        onMutate: async ({ teamId, memberId }) => {
            await queryClient.cancelQueries({ queryKey: ['team-members', teamId] });

            const previousMembers = queryClient.getQueryData(['team-members', teamId]);

            // Optimistically remove
            if (previousMembers && Array.isArray(previousMembers)) {
                const updated = previousMembers.filter((m: any) => m.id !== memberId);
                queryClient.setQueryData(['team-members', teamId], updated);
            }

            return { previousMembers, teamId };
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Đã xóa thành viên',
                visibilityTime: 2000,
            });
        },
        onError: (error, _, context) => {
            if (context?.previousMembers && context?.teamId) {
                queryClient.setQueryData(['team-members', context.teamId], context.previousMembers);
            }
            Toast.show({
                type: 'error',
                text1: 'Không thể xóa thành viên',
                text2: error instanceof Error ? error.message : 'Vui lòng thử lại',
                visibilityTime: 3000,
            });
        },
        onSettled: (_, __, { teamId }) => {
            queryClient.invalidateQueries({ queryKey: ['team-members', teamId] });
        },
    });
}

/**
 * Hook for leaving a team
 */
export function useLeaveTeam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (teamId: string) => {
            return apiFetch(`/api/teams/${teamId}/leave`, {
                method: 'POST',
            });
        },
        onSuccess: (_, teamId) => {
            Toast.show({
                type: 'success',
                text1: 'Left workspace successfully 👋',
                visibilityTime: 2000,
            });
            // We need to invalidate teams list so the UI updates
            queryClient.invalidateQueries({ queryKey: ['teams'] });
            queryClient.invalidateQueries({ queryKey: ['user-teams'] });
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to leave workspace',
                text2: error instanceof Error ? error.message : 'Please try again',
                visibilityTime: 3000,
            });
        },
    });
}
