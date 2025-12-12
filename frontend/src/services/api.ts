import axios from "@/lib/axios.customize";

export const createTeamAPI = (name: string, description?: string) => {
    const url = '/api/teams';
    return axios.post<IBackendRes<ITeam>>(url, { name, description }, { withCredentials: true });
}

export const fetchTeamsAPI = () => {
    const url = '/api/teams';
    return axios.get<IBackendRes<ITeam[]>>(url, { withCredentials: true });
}

export const fetchTeamDetailsAPI = (teamId: string) => {
    const url = `/api/teams/${teamId}`;
    return axios.get<IBackendRes<ITeam>>(url, { withCredentials: true });
}