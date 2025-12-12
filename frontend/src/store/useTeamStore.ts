import { defineStore } from 'pinia';
import { useToast } from 'vue-toast-notification';
import { createTeamAPI, fetchTeamsAPI, fetchTeamDetailsAPI } from '@/services/api';

export const useTeamStore = defineStore('team', {
    state: () => ({
        teams: [] as ITeam[],
        currentTeam: null as ITeam | null,
        isLoading: false,
    }),
    actions: {
        async fetchTeams() {
            this.isLoading = true;
            try {
                const response = await fetchTeamsAPI();
                // response is already the data body due to interceptor?
                // Wait, if api.ts says axios.get<T>, axios returns Promise<AxiosResponse<T>>
                // BUT axios.customize returns config.data which IS T.
                // So response IS IBackendRes<ITeam[]>
                if (response.data) {
                    this.teams = response.data;
                }
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
                const response = await fetchTeamDetailsAPI(teamId);
                if (response.data) {
                    this.currentTeam = response.data;
                }
            } catch (error: any) {
                console.error("Error fetching team details:", error);
                const toast = useToast();
                toast.error("Failed to load team details");
            } finally {
                this.isLoading = false;
            }
        }
    }
});
