import { defineStore } from 'pinia';
import { useToast } from 'vue-toast-notification';
import {
    createTeamAPI,
    fetchTeamsAPI,
    fetchTeamDetailsAPI,
    fetchTeamMembersAPI,
    addTeamMemberAPI,
    removeTeamMemberAPI
} from '@/services/api';

export const useTeamStore = defineStore('team', {
    state: () => ({
        teams: [] as ITeam[],
        currentTeam: null as ITeam | null,
        members: {} as Record<string, ITeamMember[]>,
        isLoading: false,
    }),
    getters: {
        currentTeamMembers: (state) => {
            if (!state.currentTeam) return [];
            return state.members[state.currentTeam.id] || [];
        }
    },
    actions: {
        async fetchTeams() {
            this.isLoading = true;
            try {
                const response = await fetchTeamsAPI();
                // axios interceptor returns response.data directly
                // so response is already the teams array
                this.teams = Array.isArray(response) ? response : [];
            } catch (error: any) {
                console.error("Error fetching teams:", error);
                const toast = useToast();
                toast.error("Failed to load teams");
            } finally {
                this.isLoading = false;
            }
        },

        async createTeam(data: { name: string; description?: string }) {
            this.isLoading = true;
            try {
                const response = await createTeamAPI(data.name, data.description);
                if (response.data) {
                    const newTeam = response.data;
                    this.teams.push(newTeam);
                    this.currentTeam = newTeam;

                    const toast = useToast();
                    toast.success('Team created successfully');
                    return newTeam;
                }
            } catch (error: any) {
                console.error("Error creating team:", error);
                const toast = useToast();
                const msg = error.response?.data?.message || "Failed to create team";
                toast.error(msg);
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchTeamDetails(teamId: string) {
            this.isLoading = true;
            try {
                // axios interceptor returns response.data directly
                const response = await fetchTeamDetailsAPI(teamId);
                // response is already the team object (axios interceptor unwraps it)
                if (response) {
                    this.currentTeam = response as unknown as ITeam;
                }
            } catch (error: any) {
                console.error("Error fetching team details:", error);
                const toast = useToast();
                toast.error("Failed to load team details");
            } finally {
                this.isLoading = false;
            }
        },

        async fetchTeamMembers(teamId: string) {
            this.isLoading = true;
            try {
                const response = await fetchTeamMembersAPI(teamId);
                this.members[teamId] = Array.isArray(response) ? response : [];
            } catch (error: any) {
                console.error("Error fetching team members:", error);
                const toast = useToast();
                toast.error("Failed to load team members");
            } finally {
                this.isLoading = false;
            }
        },

        async addTeamMember(teamId: string, email: string) {
            this.isLoading = true;
            try {
                const response = await addTeamMemberAPI(teamId, email);
                const toast = useToast();
                toast.success('Member added successfully');
                // Refresh member list
                await this.fetchTeamMembers(teamId);
                return response;
            } catch (error: any) {
                console.error("Error adding team member:", error);
                const toast = useToast();
                const status = error.response?.status;
                if (status === 404) {
                    toast.error("User not found");
                } else if (status === 409) {
                    toast.error("User is already a member of this team");
                } else if (status === 403) {
                    toast.error("Only managers can add members");
                } else {
                    toast.error(error.response?.data?.message || "Failed to add member");
                }
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async removeTeamMember(teamId: string, userId: string) {
            this.isLoading = true;
            try {
                await removeTeamMemberAPI(teamId, userId);
                const toast = useToast();
                toast.success('Member removed successfully');
                // Refresh member list
                await this.fetchTeamMembers(teamId);
            } catch (error: any) {
                console.error("Error removing team member:", error);
                const toast = useToast();
                const status = error.response?.status;
                if (status === 403) {
                    toast.error("Only managers can remove members");
                } else if (status === 400) {
                    toast.error(error.response?.data?.message || "Cannot remove this member");
                } else {
                    toast.error("Failed to remove member");
                }
                throw error;
            } finally {
                this.isLoading = false;
            }
        }
    }
});
