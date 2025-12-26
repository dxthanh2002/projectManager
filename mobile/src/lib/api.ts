import { authClient, signOut } from './auth-client';
import { Team, Task, CreateTaskDto } from '../types/api';

/**
 * Centered API fetch wrapper for authenticated requests
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5001';

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const cookies = authClient.getCookie();

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(cookies ? { Cookie: cookies } : {}),
            ...options?.headers,
        },
        // Using 'include' or 'same-origin' is safer when header cookies are present
        // but better-auth/expo plugin handles the token injection via its own logic
        // if configured to use headers.
        credentials: cookies ? 'include' : 'same-origin',
    });

    if (res.status === 401) {
        // Global Auth Guard: Redirect or SignOut on 401
        console.warn('API 401 Unauthorized - Clearing session');
        await signOut();
        throw new Error('Unauthorized');
    }

    if (!res.ok) {
        let errorData;
        try {
            errorData = await res.json();
        } catch {
            errorData = { message: `HTTP Error ${res.status}` };
        }
        throw new Error(errorData.message || `API Error: ${res.status}`);
    }

    if (res.status === 204) return {} as T;
    return res.json();
}

/**
 * Typed API helper for common operations
 */
export const api = {
    teams: {
        list: () => apiFetch<Team[]>('/api/teams'),
        get: (id: string) => apiFetch<Team>(`/api/teams/${id}`),
        create: (data: { name: string }) => apiFetch<Team>('/api/teams', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },
    tasks: {
        listByTeam: (teamId: string) => apiFetch<Task[]>(`/api/teams/${teamId}/tasks`),
        updateStatus: (taskId: string, status: string) => apiFetch<Task>(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),
        addComment: (taskId: string, content: string) => apiFetch<any>(`/api/tasks/${taskId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        }),
    }
};
