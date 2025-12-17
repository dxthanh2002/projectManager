// data types


export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string | string[];
        statusCode: number | string;
        data?: T;
    }
    interface ITeam {
        id: string;
        name: string;
        description: string | null;
        role: 'manager' | 'member';
        createdAt: string;
        memberCount?: number;
        createdById?: string;
    }

    interface ITeamMember {
        id: string;
        name: string;
        email: string;
        role: 'manager' | 'member';
        joinedAt: string;
    }

    interface ITask {
        id: string;
        title: string;
        description: string | null;
        status: 'todo' | 'in_progress' | 'done' | 'blocked';
        priority: 'low' | 'medium' | 'high';
        dueDate: string | null;
        teamId: string;
        assigneeId: string | null;
        createdById: string;
        createdAt: string;
        updatedAt?: string;
        assignee?: { id: string; name: string; email: string } | null;
    }

    interface ICreateTask {
        title: string;
        description?: string | null;
        priority?: 'low' | 'medium' | 'high';
        dueDate?: string | null;
        assigneeId?: string | null;
    }
}
