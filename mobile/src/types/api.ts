export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Team {
    id: string;
    name: string;
    description: string | null;
    createdById: string;
    role: 'manager' | 'member';
    memberCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
    teamId: string;
    assigneeId: string | null;
    createdById: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTeamDto {
    name: string;
    description?: string;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    assigneeId?: string;
}
