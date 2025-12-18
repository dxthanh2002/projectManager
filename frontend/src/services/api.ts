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

// Team Member Management APIs
export const fetchTeamMembersAPI = (teamId: string) => {
    const url = `/api/teams/${teamId}/members`;
    return axios.get<ITeamMember[]>(url, { withCredentials: true });
}

export const addTeamMemberAPI = (teamId: string, email: string) => {
    const url = `/api/teams/${teamId}/members`;
    return axios.post<IBackendRes<{ message: string; member: ITeamMember }>>(url, { email }, { withCredentials: true });
}

export const removeTeamMemberAPI = (teamId: string, userId: string) => {
    const url = `/api/teams/${teamId}/members/${userId}`;
    return axios.delete<IBackendRes<{ message: string }>>(url, { withCredentials: true });
}

// Task Management APIs
export const fetchTeamTasksAPI = (teamId: string, filters?: { status?: string; priority?: string; assigneeId?: string }) => {
    const url = `/api/teams/${teamId}/tasks`;
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.assigneeId) params.append('assigneeId', filters.assigneeId);
    const queryString = params.toString();
    return axios.get<ITask[]>(url + (queryString ? `?${queryString}` : ''), { withCredentials: true });
}

export const createTaskAPI = (teamId: string, data: ICreateTask) => {
    const url = `/api/teams/${teamId}/tasks`;
    return axios.post<ITask>(url, data, { withCredentials: true });
}

export const updateTaskAPI = (taskId: string, data: Partial<ICreateTask>) => {
    const url = `/api/tasks/${taskId}`;
    return axios.patch<{ message: string }>(url, data, { withCredentials: true });
}

export const deleteTaskAPI = (taskId: string) => {
    const url = `/api/tasks/${taskId}`;
    return axios.delete<{ message: string }>(url, { withCredentials: true });
}

export const updateTaskStatusAPI = (taskId: string, status: string, comment?: string) => {
    const url = `/api/tasks/${taskId}/status`;
    return axios.patch<{ message: string }>(url, { status, comment }, { withCredentials: true });
}

// Comment Management APIs
export const fetchTaskCommentsAPI = (taskId: string) => {
    const url = `/api/tasks/${taskId}/comments`;
    return axios.get<IComment[]>(url, { withCredentials: true });
}

export const createCommentAPI = (taskId: string, content: string) => {
    const url = `/api/tasks/${taskId}/comments`;
    return axios.post<IComment>(url, { content }, { withCredentials: true });
}

export const updateCommentAPI = (commentId: string, content: string) => {
    const url = `/api/comments/${commentId}`;
    return axios.patch<{ message: string }>(url, { content }, { withCredentials: true });
}

export const deleteCommentAPI = (commentId: string) => {
    const url = `/api/comments/${commentId}`;
    return axios.delete<{ message: string }>(url, { withCredentials: true });
}